import copy
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import server

class WorkspaceTests(unittest.TestCase):
    def record(self):
        return {'id':'test-1','kind':'note','source_language':'ko','en':'','ko':'안녕하세요, "함께"\n작업해요.','sw':'','translation_status':'pending','meta':{}}

    def test_csv_roundtrip_unicode_commas_quotes_newlines(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(server,'DATA_DIR',Path(directory)), patch.object(server,'RECORDS',Path(directory)/'records.csv'):
            r=server.validate(self.record());server.write_records([r]);self.assertEqual(server.read_records(),[r]);self.assertTrue((Path(directory)/'records.csv').exists())

    def test_unconfigured_translation_keeps_original_and_pending(self):
        with patch.dict(server.os.environ,{},clear=True):
            r=server.validate(self.record());self.assertEqual(server.translate_record(r),r)

    def test_failed_translation_keeps_original(self):
        with patch.dict(server.os.environ,{'OPENAI_API_KEY':'test'}),patch.object(server,'urlopen',side_effect=OSError('network down')):
            r=server.validate(self.record());out=server.translate_record(r);self.assertEqual(out['ko'],r['ko']);self.assertEqual(out['en'],'');self.assertEqual(out['translation_status'],'pending')

    def test_successful_provider_response_preserves_source(self):
        text=json.dumps({'en':'Hello','ko':'Changed by provider','sw':'Habari'})
        class Response:
            def __enter__(self):return self
            def __exit__(self,*args):pass
            def read(self):return json.dumps({'output':[{'type':'message','content':[{'type':'output_text','text':text}]}]}).encode()
        with patch.dict(server.os.environ,{'OPENAI_API_KEY':'test'}),patch.object(server,'urlopen',return_value=Response()):
            r=server.validate(self.record());out=server.translate_record(r);self.assertEqual(out['ko'],r['ko']);self.assertEqual(out['en'],'Hello');self.assertEqual(out['sw'],'Habari');self.assertEqual(out['translation_status'],'machine')

    def test_schema_and_share_validation(self):
        r=self.record();r['id']='../../.env'
        with self.assertRaises(ValueError):server.validate(r)
        r=self.record();r['kind']='project';r['meta']={'title':'T','artist_a':'A','artist_b':'B','stage':'draft','revenue_a':120}
        with self.assertRaises(ValueError):server.validate(r)
        r=self.record();r['translation_status']='reviewed';self.assertEqual(server.validate(r)['translation_status'],'pending')

if __name__=='__main__':unittest.main()

class HttpTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import threading
        from http.server import ThreadingHTTPServer
        cls.tmp=tempfile.TemporaryDirectory()
        cls.patches=[patch.object(server,'DATA_DIR',Path(cls.tmp.name)),patch.object(server,'RECORDS',Path(cls.tmp.name)/'records.csv')]
        for p in cls.patches:p.start()
        cls.http=ThreadingHTTPServer(('127.0.0.1',0),server.Handler)
        cls.thread=threading.Thread(target=cls.http.serve_forever,daemon=True);cls.thread.start()
        cls.origin=f'http://127.0.0.1:{cls.http.server_port}'
    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown();cls.http.server_close()
        for p in cls.patches:p.stop()
        cls.tmp.cleanup()
    def request(self,path,data=None,headers=None):
        from urllib.request import Request,urlopen
        req=Request(self.origin+path,data=json.dumps(data).encode() if data is not None else None,headers={'Content-Type':'application/json',**(headers or {})})
        return urlopen(req)
    def test_http_save_read_import_and_private_paths(self):
        from urllib.error import HTTPError
        r=WorkspaceTests().record()
        with self.request('/api/records',{'record':r}) as response:self.assertEqual(json.load(response)['ko'],r['ko'])
        with self.request('/api/records') as response:self.assertEqual(len(json.load(response)['records']),1)
        replacement={**r,'ko':'MUST NOT REPLACE'}
        with self.request('/api/import',{'records':[replacement]}) as response:self.assertEqual(json.load(response)['added'],0)
        with self.request('/api/records') as response:self.assertEqual(json.load(response)['records'][0]['ko'],r['ko'])
        bad={**r,'id':'import-good'}
        with self.assertRaises(HTTPError):self.request('/api/import',{'records':[bad,{'id':'invalid'}]})
        with self.request('/api/records') as response:self.assertEqual(len(json.load(response)['records']),1)
        for path in ['/runtime-data/records.csv','/.git/config','/server.py','/assets/','/assets/%2e%2e/server.py']:
            with self.assertRaises(HTTPError):self.request(path)
        with self.assertRaises(HTTPError):self.request('/api/records',{'record':r},{'Origin':'https://elsewhere.example'})
        with self.request('/index.html') as response:self.assertEqual(response.status,200)
    def test_source_edit_invalidates_unchanged_translations(self):
        r={**WorkspaceTests().record(),'id':'source-edit','en':'Hello','sw':'Habari','translation_status':'reviewed'}
        with self.request('/api/records',{'record':r}) as response:json.load(response)
        r['ko']='바뀐 원문'
        with self.request('/api/records',{'record':r}) as response:
            result=json.load(response);self.assertEqual(result['en'],'');self.assertEqual(result['sw'],'');self.assertEqual(result['translation_status'],'pending')
