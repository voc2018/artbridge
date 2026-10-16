const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const element={addEventListener(){}};
const context={localStorage:{getItem(){return null;}},window:{addEventListener(){}},document:{querySelector(){return element;},addEventListener(){}},console,crypto:require('node:crypto').webcrypto};
vm.createContext(context);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../script.js'),'utf8').replace(/init\(\);\s*$/,'' )+'\nglobalThis.csvAPI={toCSV,fromCSV,parseCSV};',context);
const api=context.csvAPI;
function record(text){return {id:'roundtrip',kind:'note',source_language:'ko',en:'',ko:text,sw:'',translation_status:'pending',updated_at:'2026-10-16T00:00:00.000Z',meta:{}};}
test('CSV roundtrip preserves multilingual quotes, commas, newlines and formula-leading text',()=>{for(const text of ['안녕, "친구"\nHabari','=2+2',"'=literal",'-hello',"''hello"]){const r=record(text),csv=api.toCSV([r]),out=api.fromCSV(csv);assert.equal(out[0].ko,text);assert.equal(out[0].id,r.id);}});
test('malformed CSV and invalid records fail before import',()=>{assert.throws(()=>api.parseCSV('a,b\n"unterminated'));const r=record('hello');r.kind='unknown';assert.throws(()=>api.fromCSV(api.toCSV([r])));});
