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
    const shared=overlap(a.themes,b.themes), formats=overlap(a.formats,b.formats);
    if(!formats.length) return null;
    const base=.35*jaccard(a.themes,b.themes)+.25*jaccard(a.formats,b.formats);
    const ab=base+.40*coverage(a.seeking,b.skills), ba=base+.40*coverage(b.seeking,a.skills);
    // Transformation is never scored: the pair inherits the MORE protective of the two answers.
    const LEVELS=['side-by-side','combined','redraw'];
    const ta=LEVELS.indexOf(a.transformation), tb=LEVELS.indexOf(b.transformation);
    const transformation=(ta<0||tb<0)?null:LEVELS[Math.min(ta,tb)];
    return {score:Math.round((ab+ba?2*ab*ba/(ab+ba):0)*100),ab,ba,shared,formats,transformation,
      offeredToYou:overlap(a.seeking,b.skills),offeredToThem:overlap(b.seeking,a.skills)};
  }
  function rank(a,profiles) { return profiles.map(p=>({profile:p,match:match(a,p)})).filter(x=>x.match).sort((a,b)=>b.match.score-a.match.score||a.profile.id.localeCompare(b.profile.id)); }
  const api={match,rank,overlap,jaccard,coverage};
  if(typeof module!=='undefined')module.exports=api;else root.ArtBridgeMatching=api;
})(typeof window!=='undefined'?window:globalThis);
