const test=require('node:test'),assert=require('node:assert/strict');
const {match,rank}=require('../matching.js');
const a={id:'a',region:'LA',partner_regions:['TZ'],skills:['digital'],seeking:['drawing'],themes:['identity'],formats:['joint-artwork'],available_from:'2026-10-01',available_to:'2026-12-01',consent:true};
const b={...a,id:'b',region:'TZ',partner_regions:['LA'],skills:['drawing'],seeking:['digital']};
test('both artists get a perfect mutual fit; symmetry and actual dates',()=>{const m=match(a,b);assert.equal(m.score,100);assert.equal(match(b,a).score,m.score);assert.equal(m.from,'2026-10-01');assert.equal(m.to,'2026-12-01');});
test('one-sided location interest, opt-out, self and disjoint dates excluded',()=>{assert.equal(match(a,{...b,partner_regions:['TZ']}),null);assert.equal(match(a,{...b,consent:false}),null);assert.equal(match(a,a),null);assert.equal(match(a,{...b,available_from:'2027-01-01',available_to:'2027-02-01'}),null);});
test('missing dates or desired techniques cannot look like a high-confidence fit',()=>{assert.equal(match(a,{...b,available_from:''}),null);assert.equal(match(a,{...b,seeking:[]}),null);});
test('complementary preferences are bidirectional, not similarity alone',()=>{const oneSided={...b,id:'c',seeking:['painting']};assert.ok(match(a,oneSided).score<100);assert.equal(rank(a,[oneSided,b])[0].profile.id,'b');assert.equal(match(a,{...b,formats:['video']}),null);});
