from html.parser import HTMLParser
from pathlib import Path
import json,re,csv
ROOT=Path(__file__).resolve().parents[1]
class Check(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.keys=[];self.assets=[];self.images=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs:self.ids.append(attrs['id'])
        for key in ['data-i18n','data-i18n-html','data-placeholder']:
            if key in attrs:self.keys.append(attrs[key])
        if tag in ('img','script','link'):
            path=attrs.get('src',attrs.get('href','')).split('?')[0]
            if path and not path.startswith(('http','#')):self.assets.append(path)
        if tag=='img':assert attrs.get('alt');self.images+=1
page=Check();page.feed((ROOT/'index.html').read_text())
assert len(page.ids)==len(set(page.ids)),'duplicate IDs'
for path in page.assets:assert (ROOT/path).is_file(),path
text=(ROOT/'i18n.js').read_text();data=json.loads(text[text.index('{'):].rstrip(';\n'))
for lang in ['en','ko','sw']:
    assert all(k in data[lang] for k in page.keys)
    assert set(data[lang])==set(data['en'])
for row in csv.DictReader((ROOT/'data/sample-artists.csv').open()):
    assert row['sample']=='true' and (ROOT/row['image']).is_file()
print(f'Static checks passed: {len(page.ids)} unique IDs, {len(page.keys)} translated nodes, {len(data["en"])} keys × 3 languages, {page.images} labeled images.')
