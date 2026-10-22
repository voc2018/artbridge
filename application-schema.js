/* Shared by the browser form (apply.js) and the local CSV server (server.js).
   Matching fields use the SAME option lists for Tanzanian and LA artists,
   so answers from both sides can be compared by matching.js. */
(function (root) {
  const OPTIONS = {
    skills: ['drawing', 'painting', 'tingatinga', 'mixed-media', 'digital', 'printmaking', 'photography', 'textile'],
    themes: ['wildlife', 'nature', 'family-love', 'hope', 'identity', 'culture', 'community', 'memory', 'city'],
    formats: ['joint-artwork', 'exhibition', 'merchandise', 'exchange', 'workshop', 'video'],
    transformation: ['side-by-side', 'combined', 'redraw'],
    hours: ['1-2', '3-5', '6+'],
    language: ['en', 'sw', 'ko', 'other'],
    region: ['LA', 'OTHER'],
    contact_method: ['email', 'instagram', 'whatsapp', 'phone'],
    age_group: ['adult', 'minor'],
    consent_listing: ['yes', 'no']
  };
  OPTIONS.seeking = OPTIONS.skills;

  // CSV column order. Multi-select values are joined with "|" (same as data/sample-artists.csv).
  const COLUMNS = [
    'id', 'submitted_at', 'form_version', 'interface_language',
    // Profile
    'full_name', 'artist_name', 'city', 'region', 'email', 'contact_method', 'contact_handle', 'instagram',
    'years_making_art', 'medium', 'journey', 'portfolio_url', 'work_links', 'favorite_work',
    // Shared matching questions (identical for Tanzania)
    'skills', 'seeking', 'themes', 'formats', 'transformation',
    'hours_per_week', 'language', 'consent_listing', 'partner_regions',
    // Open question
    'collab_idea',
    // Age & guardian
    'age_group', 'guardian_name', 'guardian_email', 'guardian_consent',
    // Optional
    'inspiration', 'creative_process', 'exhibitions', 'achievements', 'previous_collaborations', 'additional_info',
    'data_consent'
  ];

  const MULTI = ['skills', 'seeking', 'themes', 'formats'];
  const REQUIRED = ['full_name', 'city', 'region', 'email', 'contact_method', 'medium', 'journey', 'work_links',
    'transformation', 'hours_per_week', 'language', 'consent_listing',
    'collab_idea', 'age_group', 'data_consent'];
  const LONG = ['journey', 'favorite_work', 'collab_idea', 'inspiration', 'creative_process', 'exhibitions',
    'achievements', 'previous_collaborations', 'additional_info', 'work_links'];

  function validate(r) {
    const errors = [];
    if (!r || typeof r !== 'object') return ['record'];
    for (const k of COLUMNS) if (r[k] != null && typeof r[k] !== 'string') errors.push(k);
    for (const k of REQUIRED) if (!String(r[k] || '').trim()) errors.push(k);
    for (const k of COLUMNS) if (String(r[k] || '').length > (LONG.includes(k) ? 6000 : 300)) errors.push(k);
    for (const k of MULTI) {
      const v = String(r[k] || '').split('|').filter(Boolean);
      if (!v.length || v.some(x => !OPTIONS[k].includes(x))) errors.push(k);
    }
    for (const k of ['transformation', 'language', 'region', 'contact_method', 'age_group', 'consent_listing'])
      if (r[k] && !OPTIONS[k === 'consent_listing' ? 'consent_listing' : k].includes(r[k])) errors.push(k);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email || '')) errors.push('email');
    if (r.hours_per_week && !OPTIONS.hours.includes(r.hours_per_week)) errors.push('hours_per_week');
    if (r.age_group === 'minor' && (!String(r.guardian_name || '').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.guardian_email || '') || r.guardian_consent !== 'yes')) errors.push('guardian');
    if (r.data_consent !== 'yes') errors.push('data_consent');
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(r.id || '')) errors.push('id');
    return [...new Set(errors)];
  }

  // Excel-safe CSV cell: quote everything, neutralise formula-looking text.
  function cell(v) {
    let s = String(v ?? '');
    if (/^[\s]*[=+@\-\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }
  const headerLine = () => COLUMNS.map(cell).join(',');
  const rowLine = r => COLUMNS.map(k => cell(r[k])).join(',');
  const toCSV = rows => '﻿' + headerLine() + '\r\n' + rows.map(rowLine).join('\r\n') + (rows.length ? '\r\n' : '');

  const api = { OPTIONS, COLUMNS, MULTI, REQUIRED, validate, cell, headerLine, rowLine, toCSV, FORM_VERSION: 'la-v1' };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ArtBridgeApplication = api;
})(typeof window !== 'undefined' ? window : globalThis);
