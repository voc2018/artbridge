/* Explainable prototype. No behavioral history, trained model, or success probability. */
(function(root) {
  const list = value => Array.isArray(value) ? value : [];
  const overlap = (a,b) => list(a).filter(x => list(b).includes(x));
  const coverage = (wanted, offered) => wanted.length ? overlap(wanted,offered).length / wanted.length : 0;
  const jaccard = (a,b) => { const union=new Set([...list(a),...list(b)]); return union.size ? overlap(a,b).length/union.size : 0; };
  function match(a,b) {
    if (!a || !b || a.id===b.id || !a.consent || !b.consent) return null;
    if (!list(a.partner_regions).includes(b.region) || !list(b.partner_regions).includes(a.region)) return null;
    if (![a,b].every(p=>['skills','seeking','themes','formats'].every(k=>list(p[k]).length))) return null;
    if (!a.available_from || !a.available_to || !b.available_from || !b.available_to) return null;
    if(a.available_from>b.available_to || b.available_from>a.available_to) return null;
    const shared=overlap(a.themes,b.themes), formats=overlap(a.formats,b.formats);
    if(!formats.length) return null;
    const base=.35*jaccard(a.themes,b.themes)+.25*jaccard(a.formats,b.formats);
    const ab=base+.40*coverage(a.seeking,b.skills), ba=base+.40*coverage(b.seeking,a.skills);
    return {score:Math.round((ab+ba?2*ab*ba/(ab+ba):0)*100),ab,ba,shared,formats,
      offeredToYou:overlap(a.seeking,b.skills),offeredToThem:overlap(b.seeking,a.skills),
      from:a.available_from>b.available_from?a.available_from:b.available_from,
      to:a.available_to<b.available_to?a.available_to:b.available_to};
  }
  function rank(a,profiles) { return profiles.map(p=>({profile:p,match:match(a,p)})).filter(x=>x.match).sort((a,b)=>b.match.score-a.match.score||a.profile.id.localeCompare(b.profile.id)); }
  const api={match,rank,overlap};
  if(typeof module!=='undefined')module.exports=api;else root.ArtBridgeMatching=api;
})(typeof window!=='undefined'?window:globalThis);
