/* LA artist application (#apply).
   Saves to data/la-applications.csv when server.js is running,
   otherwise keeps submissions in this browser and lets you download them as CSV. */
(function () {
  'use strict';
  const S = window.ArtBridgeApplication;
  const STORE = 'artbridge.applications.v1';
  const DRAFT = 'artbridge.draft.apply-form';

  /* ---------- Option labels (shared with the rest of the site) ---------- */
  const optionLabels = {
    en: {
      tingatinga: 'Tingatinga', 'mixed-media': 'Mixed media', textile: 'Textile & fabric',
      wildlife: 'Wildlife', 'family-love': 'Family & love', hope: 'Hope', city: 'City life',
      exchange: 'Letter & sketch exchange', workshop: 'Workshop'
    },
    ko: {
      tingatinga: '팅가팅가', 'mixed-media': '혼합 매체', textile: '섬유·패브릭',
      wildlife: '야생동물', 'family-love': '가족·사랑', hope: '희망', city: '도시의 삶',
      exchange: '편지·스케치 교환', workshop: '워크숍'
    },
    sw: {
      tingatinga: 'Tingatinga', 'mixed-media': 'Mbinu mchanganyiko', textile: 'Nguo na vitambaa',
      wildlife: 'Wanyamapori', 'family-love': 'Familia na upendo', hope: 'Matumaini', city: 'Maisha ya mjini',
      exchange: 'Kubadilishana barua na michoro', workshop: 'Warsha'
    }
  };
  for (const l of Object.keys(optionLabels)) Object.assign(window.ArtBridgeI18n[l], optionLabels[l]);

  /* ---------- Form copy ---------- */
  const T = {
    en: {
      eyebrow: 'JOIN ARTBRIDGE · NEW ARTIST APPLICATION',
      title: 'Your name could be <em>next to theirs.</em>',
      intro: 'For artists in Los Angeles and beyond. Tanzanian artists on Voice of Piece answer the same matching questions, so your answers can be compared side by side.',
      time: 'About 10 minutes. Your draft is saved as you type.',
      s1: '1 · About you', s1Hint: 'This becomes your artist profile.',
      full_name: 'Full name', artist_name: 'Artist name (if different)', city: 'City', region: 'Where are you based?',
      regionLA: 'Los Angeles area', regionOTHER: 'Somewhere else',
      email: 'Email', contact_method: 'Best way to reach you', contact_handle: 'Handle or number (if not email)',
      cm_email: 'Email', cm_instagram: 'Instagram', cm_whatsapp: 'WhatsApp', cm_phone: 'Phone / text',
      instagram: 'Instagram (optional)', years_making_art: 'Years making art',
      medium: 'Your main medium and style, in one line', mediumPh: 'e.g. Ink and graphite portraits',
      journey: 'Your journey as an artist', journeyPh: 'How you started, what keeps you making art — a few sentences.',
      portfolio_url: 'Portfolio or website (optional)',
      work1: 'Link to a work you want partners to see', work2: 'Second work (optional)', work3: 'Third work (optional)',
      workHint: 'Instagram post, Google Drive or website links are fine.',
      favorite_work: 'Your favourite piece, and why (optional)',
      s2: '2 · Matching questions', s2Hint: 'These are the same questions Tanzanian artists answer. Choose all that apply.',
      skills: 'What I can bring', seeking: 'What I hope to find in a partner', themes: 'What my work is about',
      formats: 'How I would like to collaborate',
      transformation: 'How far may my work be changed in a collaboration?',
      transformationHint: 'This becomes part of the promise you write together later.',
      'side-by-side': 'Side by side only — each work stays whole',
      combined: 'Combined into one composition — without redrawing my work',
      redraw: 'My partner may redraw or reinterpret parts',
      available_from: 'Available from', available_to: 'Available until', hours_per_week: 'Hours per week I can give',
      h1: '1–2 hours', h3: '3–5 hours', h6: '6 hours or more',
      language: 'The language I write in', langOther: 'Other',
      languageHint: 'Used for translation only. It never lowers a match.',
      consent_listing: 'May we show your profile to Tanzanian artists and suggest you as a partner?',
      yes: 'Yes', no: 'Not yet',
      s3: '3 · The question', collab_idea: 'What would you like to make with an artist on the other side of the world?',
      s4: '4 · Age', age_group: 'How old are you?', adult: '18 or older', minor: 'Under 18',
      guardianHint: 'Because you are under 18, a parent or guardian needs to agree before you are matched.',
      guardian_name: 'Parent / guardian name', guardian_email: 'Parent / guardian email',
      guardian_consent: 'My parent or guardian has read this application and agrees that I can take part.',
      s5: 'More about you (optional)',
      inspiration: 'What inspires you?', creative_process: 'Your creative process', exhibitions: 'Exhibitions or showings',
      achievements: 'Awards or achievements', previous_collaborations: 'Previous collaborations', additional_info: 'Anything else?',
      data_consent: 'I understand Voice of Piece will keep these answers to suggest collaborations, and I can ask for them to be changed or removed at any time.',
      submit: 'Send my application', sending: 'Saving…',
      missing: 'Please complete the highlighted questions.', pickOne: 'Choose at least one.', badDates: 'The end date must be after the start date.',
      doneTitle: 'Thank you. Your application is in.',
      doneServer: 'Saved to data/la-applications.csv on this computer.',
      doneLocal: 'Saved in this browser. The organiser downloads it as CSV from Studio › My data.',
      doneNext: 'We will read it and write to you when there is an artist you might meet.',
      another: 'Start a new application', downloadMine: 'Download my answers (CSV)',
      adminTitle: 'LA artist applications', adminServer: 'Local server is running: new applications are added to data/la-applications.csv.',
      adminLocal: 'Applications saved in this browser', adminDownload: 'Download applications CSV', adminServerDownload: 'Download CSV from server',
      adminClear: 'Clear browser copies', adminClearConfirm: 'Remove all applications saved in this browser? Download the CSV first.',
      adminNote: 'Contains personal information. Store the file privately.',
      draftRestored: 'Your unfinished application was restored.', required: 'required'
    },
    ko: {
      eyebrow: 'ARTBRIDGE 참여 · 신규 작가 신청서',
      title: '당신의 이름이 <em>그들 곁에 놓일 수 있어요.</em>',
      intro: '로스앤젤레스와 그 밖의 지역 작가를 위한 신청서예요. Voice of Piece의 탄자니아 작가들도 같은 매칭 질문에 답하기 때문에, 서로의 답을 나란히 비교할 수 있어요.',
      time: '약 10분 걸려요. 입력하는 동안 자동으로 임시 저장돼요.',
      s1: '1 · 나에 대해', s1Hint: '작가 프로필이 되는 내용이에요.',
      full_name: '이름', artist_name: '작가명 (다르다면)', city: '도시', region: '활동 지역',
      regionLA: '로스앤젤레스 지역', regionOTHER: '그 밖의 지역',
      email: '이메일', contact_method: '가장 편한 연락 방법', contact_handle: '아이디 또는 번호 (이메일이 아니라면)',
      cm_email: '이메일', cm_instagram: '인스타그램', cm_whatsapp: 'WhatsApp', cm_phone: '전화 / 문자',
      instagram: '인스타그램 (선택)', years_making_art: '작업해 온 기간 (년)',
      medium: '주 매체와 스타일을 한 줄로', mediumPh: '예: 잉크와 흑연으로 그린 인물화',
      journey: '작가로서의 여정', journeyPh: '어떻게 시작했고, 무엇이 계속 그리게 하는지 몇 문장으로 적어 주세요.',
      portfolio_url: '포트폴리오 또는 웹사이트 (선택)',
      work1: '상대에게 보여주고 싶은 작품 링크', work2: '두 번째 작품 (선택)', work3: '세 번째 작품 (선택)',
      workHint: '인스타그램 게시물, 구글 드라이브, 웹사이트 링크 모두 괜찮아요.',
      favorite_work: '가장 좋아하는 작품과 그 이유 (선택)',
      s2: '2 · 매칭 질문', s2Hint: '탄자니아 작가들이 답하는 질문과 똑같아요. 해당하는 것을 모두 고르세요.',
      skills: '내가 가져올 수 있는 기법', seeking: '상대에게서 만나고 싶은 기법', themes: '내 작품의 주제',
      formats: '원하는 협업 형태',
      transformation: '협업에서 내 작품을 어디까지 바꿔도 되나요?',
      transformationHint: '나중에 함께 쓰는 약속의 일부가 돼요.',
      'side-by-side': '나란히만 — 각 작품은 그대로',
      combined: '한 화면에 합치기 — 내 작품은 다시 그리지 않음',
      redraw: '상대가 일부를 다시 그리거나 재해석해도 됨',
      available_from: '참여 가능 시작일', available_to: '참여 가능 종료일', hours_per_week: '일주일에 낼 수 있는 시간',
      h1: '1–2시간', h3: '3–5시간', h6: '6시간 이상',
      language: '내가 글을 쓰는 언어', langOther: '기타',
      languageHint: '번역에만 쓰이고 매칭 점수에는 영향을 주지 않아요.',
      consent_listing: '탄자니아 작가들에게 프로필을 보여주고 협업 상대로 추천해도 될까요?',
      yes: '네', no: '아직은 아니요',
      s3: '3 · 질문', collab_idea: '지구 반대편의 화가와 무엇을 만들어 보고 싶나요?',
      s4: '4 · 나이', age_group: '나이가 어떻게 되나요?', adult: '18세 이상', minor: '18세 미만',
      guardianHint: '18세 미만이라 매칭 전에 부모님 또는 보호자의 동의가 필요해요.',
      guardian_name: '부모님/보호자 이름', guardian_email: '부모님/보호자 이메일',
      guardian_consent: '부모님 또는 보호자가 이 신청서를 읽었고 참여에 동의했어요.',
      s5: '나에 대해 더 (선택)',
      inspiration: '영감을 주는 것', creative_process: '작업 과정', exhibitions: '전시 경험',
      achievements: '수상 또는 성과', previous_collaborations: '이전 협업 경험', additional_info: '더 하고 싶은 말',
      data_consent: 'Voice of Piece가 협업을 제안하기 위해 이 답변을 보관한다는 것을 이해하며, 언제든 수정이나 삭제를 요청할 수 있어요.',
      submit: '신청서 보내기', sending: '저장 중…',
      missing: '표시된 질문을 채워 주세요.', pickOne: '하나 이상 골라 주세요.', badDates: '종료일은 시작일보다 뒤여야 해요.',
      doneTitle: '고마워요. 신청서가 접수됐어요.',
      doneServer: '이 컴퓨터의 data/la-applications.csv에 저장됐어요.',
      doneLocal: '이 브라우저에 저장됐어요. 담당자가 Studio › My data에서 CSV로 내려받아요.',
      doneNext: '읽어보고, 만날 만한 작가가 생기면 연락드릴게요.',
      another: '새 신청서 작성', downloadMine: '내 답변 내려받기 (CSV)',
      adminTitle: 'LA 작가 신청서', adminServer: '로컬 서버 실행 중: 새 신청서는 data/la-applications.csv에 쌓여요.',
      adminLocal: '이 브라우저에 저장된 신청서', adminDownload: '신청서 CSV 내려받기', adminServerDownload: '서버에서 CSV 내려받기',
      adminClear: '브라우저 사본 지우기', adminClearConfirm: '이 브라우저에 저장된 신청서를 모두 지울까요? 먼저 CSV를 내려받으세요.',
      adminNote: '개인정보가 들어 있어요. 파일은 비공개로 보관하세요.',
      draftRestored: '작성 중이던 신청서를 불러왔어요.', required: '필수'
    },
    sw: {
      eyebrow: 'JIUNGE NA ARTBRIDGE · OMBI LA MSANII MPYA',
      title: 'Jina lako linaweza kuwa <em>kando ya majina yao.</em>',
      intro: 'Kwa wasanii wa Los Angeles na kwingineko. Wasanii wa Tanzania walio Voice of Piece hujibu maswali yale yale ya kuunganisha, ili majibu yenu yalinganishwe kando kwa kando.',
      time: 'Takriban dakika 10. Rasimu yako huhifadhiwa unapoandika.',
      s1: '1 · Kuhusu wewe', s1Hint: 'Hii itakuwa wasifu wako wa msanii.',
      full_name: 'Jina kamili', artist_name: 'Jina la kisanii (kama ni tofauti)', city: 'Mji', region: 'Unaishi wapi?',
      regionLA: 'Eneo la Los Angeles', regionOTHER: 'Mahali pengine',
      email: 'Barua pepe', contact_method: 'Njia bora ya kukufikia', contact_handle: 'Jina la akaunti au namba (kama si barua pepe)',
      cm_email: 'Barua pepe', cm_instagram: 'Instagram', cm_whatsapp: 'WhatsApp', cm_phone: 'Simu / ujumbe',
      instagram: 'Instagram (si lazima)', years_making_art: 'Miaka ya kufanya sanaa',
      medium: 'Malighafi na mtindo wako mkuu, kwa mstari mmoja', mediumPh: 'mf. Picha za watu kwa wino na grafiti',
      journey: 'Safari yako kama msanii', journeyPh: 'Ulianzaje, na nini kinakufanya uendelee — sentensi chache.',
      portfolio_url: 'Kazi zako au tovuti (si lazima)',
      work1: 'Kiungo cha kazi unayotaka washirika waone', work2: 'Kazi ya pili (si lazima)', work3: 'Kazi ya tatu (si lazima)',
      workHint: 'Viungo vya Instagram, Google Drive au tovuti vinakubalika.',
      favorite_work: 'Kazi unayoipenda zaidi, na kwa nini (si lazima)',
      s2: '2 · Maswali ya kuunganisha', s2Hint: 'Haya ni maswali yale yale wanayojibu wasanii wa Tanzania. Chagua yote yanayohusika.',
      skills: 'Ninachoweza kuleta', seeking: 'Ninachotarajia kupata kwa mshirika', themes: 'Kazi yangu inahusu nini',
      formats: 'Jinsi ningependa kushirikiana',
      transformation: 'Kazi yangu inaweza kubadilishwa kwa kiasi gani katika ushirikiano?',
      transformationHint: 'Hii itakuwa sehemu ya ahadi mtakayoandika pamoja baadaye.',
      'side-by-side': 'Kando kwa kando tu — kila kazi inabaki kamili',
      combined: 'Kuunganishwa katika picha moja — bila kuchora upya kazi yangu',
      redraw: 'Mshirika wangu anaweza kuchora upya au kutafsiri upya sehemu fulani',
      available_from: 'Ninapatikana kuanzia', available_to: 'Ninapatikana hadi', hours_per_week: 'Saa kwa wiki ninazoweza kutoa',
      h1: 'Saa 1–2', h3: 'Saa 3–5', h6: 'Saa 6 au zaidi',
      language: 'Lugha ninayoandikia', langOther: 'Nyingine',
      languageHint: 'Inatumika kwa tafsiri tu. Haipunguzi nafasi ya kuunganishwa.',
      consent_listing: 'Je, tunaweza kuwaonyesha wasanii wa Tanzania wasifu wako na kukupendekeza kama mshirika?',
      yes: 'Ndiyo', no: 'Bado',
      s3: '3 · Swali', collab_idea: 'Ungependa kutengeneza nini pamoja na msanii aliye upande mwingine wa dunia?',
      s4: '4 · Umri', age_group: 'Una umri gani?', adult: 'Miaka 18 au zaidi', minor: 'Chini ya miaka 18',
      guardianHint: 'Kwa kuwa uko chini ya miaka 18, mzazi au mlezi anahitaji kukubali kabla ya kuunganishwa.',
      guardian_name: 'Jina la mzazi / mlezi', guardian_email: 'Barua pepe ya mzazi / mlezi',
      guardian_consent: 'Mzazi au mlezi wangu amesoma ombi hili na amekubali nishiriki.',
      s5: 'Zaidi kuhusu wewe (si lazima)',
      inspiration: 'Nini kinakupa msukumo?', creative_process: 'Mchakato wako wa ubunifu', exhibitions: 'Maonyesho',
      achievements: 'Tuzo au mafanikio', previous_collaborations: 'Ushirikiano wa awali', additional_info: 'Jambo lingine?',
      data_consent: 'Ninaelewa kwamba Voice of Piece itahifadhi majibu haya ili kupendekeza ushirikiano, na ninaweza kuomba yabadilishwe au yafutwe wakati wowote.',
      submit: 'Tuma ombi langu', sending: 'Inahifadhi…',
      missing: 'Tafadhali jaza maswali yaliyowekewa alama.', pickOne: 'Chagua angalau kimoja.', badDates: 'Tarehe ya mwisho lazima iwe baada ya tarehe ya kuanza.',
      doneTitle: 'Asante. Ombi lako limepokelewa.',
      doneServer: 'Limehifadhiwa kwenye data/la-applications.csv katika kompyuta hii.',
      doneLocal: 'Limehifadhiwa kwenye kivinjari hiki. Mratibu atalipakua kama CSV kutoka Studio › My data.',
      doneNext: 'Tutalisoma na kukuandikia tukipata msanii mnayeweza kukutana.',
      another: 'Anza ombi jipya', downloadMine: 'Pakua majibu yangu (CSV)',
      adminTitle: 'Maombi ya wasanii wa LA', adminServer: 'Seva ya ndani inafanya kazi: maombi mapya yanaongezwa kwenye data/la-applications.csv.',
      adminLocal: 'Maombi yaliyohifadhiwa kwenye kivinjari hiki', adminDownload: 'Pakua CSV ya maombi', adminServerDownload: 'Pakua CSV kutoka seva',
      adminClear: 'Futa nakala za kivinjari', adminClearConfirm: 'Ufute maombi yote yaliyohifadhiwa kwenye kivinjari hiki? Pakua CSV kwanza.',
      adminNote: 'Ina taarifa binafsi. Hifadhi faili kwa siri.',
      draftRestored: 'Ombi lako ambalo halijakamilika limerejeshwa.', required: 'lazima'
    }
  };

  let lang = 'en', serverOK = false, lastSubmitted = null, rendered = false;
  const tr = k => (T[lang] && T[lang][k]) || T.en[k] || k;
  const opt = k => (window.ArtBridgeI18n[lang] && window.ArtBridgeI18n[lang][k]) || window.ArtBridgeI18n.en[k] || k;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const uid = () => 'la-' + (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
  const req = `<abbr class="req" title="${'required'}" aria-hidden="true">*</abbr>`;

  function readStore() { try { const v = JSON.parse(localStorage.getItem(STORE) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
  function writeStore(v) { try { localStorage.setItem(STORE, JSON.stringify(v)); return true; } catch { return false; } }
  function download(name, body) {
    const blob = new Blob([body], { type: 'text/csv;charset=utf-8' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const stamp = () => new Date().toISOString().slice(0, 10);

  /* ---------- Field builders ---------- */
  const text = (name, { type = 'text', required = false, ph = '', extra = '', full = false, label } = {}) =>
    `<label class="field${full ? ' full' : ''}"><span>${esc(label || tr(name))}${required ? req : ''}</span><input type="${type}" name="${name}" ${required ? 'required' : ''} ${ph ? `placeholder="${esc(ph)}"` : ''} ${extra}></label>`;
  const area = (name, { required = false, ph = '', label } = {}) =>
    `<label class="field full"><span>${esc(label || tr(name))}${required ? req : ''}</span><textarea name="${name}" rows="4" maxlength="6000" ${required ? 'required' : ''} ${ph ? `placeholder="${esc(ph)}"` : ''}></textarea></label>`;
  const select = (name, values, labelFor, { required = true } = {}) =>
    `<label class="field"><span>${esc(tr(name))}${required ? req : ''}</span><select name="${name}" ${required ? 'required' : ''}><option value="">—</option>${values.map(v => `<option value="${v}">${esc(labelFor(v))}</option>`).join('')}</select></label>`;
  const checks = name =>
    `<fieldset class="field full apply-group" data-group="${name}"><legend>${esc(tr(name))}${req}</legend><div class="tag-options">${S.OPTIONS[name].map(v => `<label><input type="checkbox" name="${name}" value="${v}">${esc(opt(v))}</label>`).join('')}</div><p class="apply-error" hidden>${esc(tr('pickOne'))}</p></fieldset>`;
  const radios = (name, values, labelFor, hint = '') =>
    `<fieldset class="field full apply-group" data-group="${name}"><legend>${esc(tr(name))}${req}</legend>${hint ? `<p class="helper">${esc(hint)}</p>` : ''}<div class="choice-list">${values.map(v => `<label class="checkbox-label"><input type="radio" name="${name}" value="${v}" required>${esc(labelFor(v))}</label>`).join('')}</div></fieldset>`;

  function formHTML() {
    const today = new Date(), later = new Date(); later.setMonth(later.getMonth() + 6);
    const iso = d => d.toISOString().slice(0, 10);
    return `
<div class="section-top"><p class="eyebrow">${esc(tr('eyebrow'))}</p><span class="pill" id="apply-mode">${esc(serverOK ? 'CSV · data/la-applications.csv' : 'Browser → CSV')}</span></div>
<div class="workspace-heading"><h1>${tr('title')}</h1><p>${esc(tr('intro'))}</p></div>
<p class="notice">${esc(tr('time'))}</p>
<form id="apply-form" novalidate>
  <section class="form-section"><h2 class="apply-h">${esc(tr('s1'))}</h2><p class="helper">${esc(tr('s1Hint'))}</p>
    <div class="field-grid">
      ${text('full_name', { required: true, extra: 'maxlength="120" autocomplete="name"' })}
      ${text('artist_name', { extra: 'maxlength="120"' })}
      ${text('city', { required: true, extra: 'maxlength="120" autocomplete="address-level2"' })}
      ${select('region', S.OPTIONS.region, v => tr('region' + v))}
      ${text('email', { type: 'email', required: true, extra: 'maxlength="200" autocomplete="email"' })}
      ${select('contact_method', S.OPTIONS.contact_method, v => tr('cm_' + v))}
      ${text('contact_handle', { extra: 'maxlength="120"' })}
      ${text('instagram', { extra: 'maxlength="200"', ph: '@' })}
      ${text('years_making_art', { type: 'number', extra: 'min="0" max="90" step="1" inputmode="numeric"' })}
      ${text('medium', { required: true, ph: tr('mediumPh'), extra: 'maxlength="200"' })}
      ${area('journey', { required: true, ph: tr('journeyPh') })}
      ${text('portfolio_url', { type: 'url', ph: 'https://', extra: 'maxlength="300"', full: true })}
      ${text('work_link_1', { type: 'url', required: true, ph: 'https://', extra: 'maxlength="300"', full: true, label: tr('work1') })}
      ${text('work_link_2', { type: 'url', ph: 'https://', extra: 'maxlength="300"', label: tr('work2') })}
      ${text('work_link_3', { type: 'url', ph: 'https://', extra: 'maxlength="300"', label: tr('work3') })}
      <p class="helper full-row">${esc(tr('workHint'))}</p>
      ${area('favorite_work')}
    </div>
  </section>

  <section class="form-section"><h2 class="apply-h">${esc(tr('s2'))}</h2><p class="helper">${esc(tr('s2Hint'))}</p>
    ${checks('skills')}${checks('seeking')}${checks('themes')}${checks('formats')}
    ${radios('transformation', S.OPTIONS.transformation, v => tr(v), tr('transformationHint'))}
    <div class="field-grid">
      ${select('hours_per_week', S.OPTIONS.hours, v => tr({ '1-2': 'h1', '3-5': 'h3', '6+': 'h6' }[v]))}
      ${select('language', S.OPTIONS.language, v => ({ en: 'English', sw: 'Kiswahili', ko: '한국어', other: tr('langOther') }[v]))}
    </div>
    <p class="helper">${esc(tr('languageHint'))}</p>
    ${radios('consent_listing', S.OPTIONS.consent_listing, v => tr(v))}
  </section>

  <section class="form-section"><h2 class="apply-h">${esc(tr('s3'))}</h2>
    ${area('collab_idea', { required: true })}
  </section>

  <section class="form-section"><h2 class="apply-h">${esc(tr('s4'))}</h2>
    ${radios('age_group', S.OPTIONS.age_group, v => tr(v))}
    <div id="guardian-block" class="notice" hidden>
      <p>${esc(tr('guardianHint'))}</p>
      <div class="field-grid">
        ${text('guardian_name', { extra: 'maxlength="120" data-guardian' })}
        ${text('guardian_email', { type: 'email', extra: 'maxlength="200" data-guardian' })}
      </div>
      <label class="checkbox-label"><input type="checkbox" name="guardian_consent" value="yes" data-guardian>${esc(tr('guardian_consent'))}</label>
    </div>
  </section>

  <details class="form-section"><summary>${esc(tr('s5'))}</summary>
    ${area('inspiration')}${area('creative_process')}${area('exhibitions')}${area('achievements')}${area('previous_collaborations')}${area('additional_info')}
  </details>

  <label class="checkbox-label"><input type="checkbox" name="data_consent" value="yes" required>${esc(tr('data_consent'))}</label>
  <div class="form-actions"><p class="helper" id="apply-status" role="status" aria-live="polite"></p><button class="button dark" type="submit">${esc(tr('submit'))}</button></div>
</form>`;
  }

  function doneHTML(where) {
    return `<div class="section-top"><p class="eyebrow">${esc(tr('eyebrow'))}</p></div>
<div class="workspace-heading"><h1>${esc(tr('doneTitle'))}</h1><p>${esc(tr('doneNext'))}</p></div>
<p class="notice">${esc(tr(where === 'server' ? 'doneServer' : 'doneLocal'))}</p>
<div class="button-row"><button class="button dark" data-apply-action="new">${esc(tr('another'))}</button><button class="button" data-apply-action="mine">${esc(tr('downloadMine'))}</button><a class="text-link" href="#home">ArtBridge →</a></div>`;
  }

  /* ---------- Draft ---------- */
  function saveDraft(f) {
    const d = {};
    for (const el of f.elements) {
      if (!el.name) continue;
      if (el.type === 'checkbox') { (d[el.name] = d[el.name] || []); if (el.checked) d[el.name].push(el.value); }
      else if (el.type === 'radio') { if (el.checked) d[el.name] = el.value; }
      else d[el.name] = el.value;
    }
    try { localStorage.setItem(DRAFT, JSON.stringify(d)); } catch { }
  }
  function restoreDraft(f) {
    let d; try { d = JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch { d = null; }
    if (!d) return false;
    for (const el of f.elements) {
      if (!el.name || !(el.name in d)) continue;
      const v = d[el.name];
      if (el.type === 'checkbox') el.checked = Array.isArray(v) && v.includes(el.value);
      else if (el.type === 'radio') el.checked = v === el.value;
      else el.value = v;
    }
    return true;
  }

  function syncGuardian(f) {
    const minor = f.elements.age_group && [...f.querySelectorAll('input[name=age_group]')].some(r => r.checked && r.value === 'minor');
    $('#guardian-block', f).hidden = !minor;
    f.querySelectorAll('[data-guardian]').forEach(el => { el.required = minor; });
  }

  /* ---------- Submit ---------- */
  function collect(f) {
    const fd = new FormData(f), g = k => String(fd.get(k) || '').trim();
    const r = {
      id: uid(), submitted_at: new Date().toISOString(), form_version: S.FORM_VERSION, interface_language: lang,
      full_name: g('full_name'), artist_name: g('artist_name'), city: g('city'), region: g('region'),
      email: g('email'), contact_method: g('contact_method'), contact_handle: g('contact_handle').replace(/^@+/, ''), instagram: g('instagram').replace(/^@+/, ''),
      years_making_art: g('years_making_art'), medium: g('medium'), journey: g('journey'), portfolio_url: g('portfolio_url'),
      work_links: ['work_link_1', 'work_link_2', 'work_link_3'].map(g).filter(Boolean).join('|'),
      favorite_work: g('favorite_work'),
      transformation: g('transformation'),
      hours_per_week: g('hours_per_week'), language: g('language'), consent_listing: g('consent_listing'),
      partner_regions: 'TZ', collab_idea: g('collab_idea'), age_group: g('age_group'),
      guardian_name: '', guardian_email: '', guardian_consent: '',
      inspiration: g('inspiration'), creative_process: g('creative_process'), exhibitions: g('exhibitions'),
      achievements: g('achievements'), previous_collaborations: g('previous_collaborations'), additional_info: g('additional_info'),
      data_consent: fd.get('data_consent') === 'yes' ? 'yes' : ''
    };
    for (const k of S.MULTI) r[k] = fd.getAll(k).join('|');
    if (r.age_group === 'minor') Object.assign(r, { guardian_name: g('guardian_name'), guardian_email: g('guardian_email'), guardian_consent: fd.get('guardian_consent') === 'yes' ? 'yes' : '' });
    return r;
  }

  function showErrors(f) {
    let ok = f.checkValidity(), first = null;
    f.querySelectorAll('.apply-group').forEach(fs => {
      const name = fs.dataset.group, boxes = fs.querySelectorAll('input');
      const missing = ![...boxes].some(b => b.checked);
      fs.classList.toggle('invalid', missing);
      const err = fs.querySelector('.apply-error'); if (err) err.hidden = !missing;
      if (missing) { ok = false; first = first || fs; }
    });
    f.querySelectorAll('input,select,textarea').forEach(el => {
      const bad = el.willValidate && !el.checkValidity() && el.type !== 'radio' && el.type !== 'checkbox';
      el.closest('.field')?.classList.toggle('invalid', bad);
      if (bad) first = first || el;
    });
    if (!ok) $('#apply-status').textContent = tr('missing');
    if (!f.elements.data_consent.checked) { ok = false; first = first || f.elements.data_consent; }
    if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); (first.focus ? first : first.querySelector('input'))?.focus({ preventScroll: true }); }
    return ok;
  }

  async function submit(f) {
    if (!showErrors(f)) return;
    const r = collect(f), problems = S.validate(r);
    if (problems.length) { $('#apply-status').textContent = tr('missing') + ' (' + problems.join(', ') + ')'; return; }
    const button = $('button[type=submit]', f); button.disabled = true; button.textContent = tr('sending');
    let where = 'local';
    try {
      const res = await fetch('api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ record: r }) });
      if (res.ok) where = 'server';
    } catch { }
    if (where === 'local') writeStore(readStore().concat(r));
    lastSubmitted = r;
    try { localStorage.removeItem(DRAFT); } catch { }
    $('#apply-root').innerHTML = doneHTML(where);
    window.scrollTo(0, 0);
  }

  /* ---------- Render ---------- */
  function render(newLang) {
    if (newLang) lang = newLang;
    const root = $('#apply-root'); if (!root) return;
    if (lastSubmitted && $('[data-apply-action="mine"]', root)) { root.innerHTML = doneHTML(serverOK ? 'server' : 'local'); return; }
    root.innerHTML = formHTML();
    const f = $('#apply-form');
    if (restoreDraft(f) && !rendered) $('#apply-status').textContent = tr('draftRestored');
    rendered = true;
    syncGuardian(f);
    f.addEventListener('input', () => saveDraft(f));
    f.addEventListener('change', e => { if (e.target.name === 'age_group') syncGuardian(f); e.target.closest('.invalid')?.classList.remove('invalid'); saveDraft(f); });
    f.addEventListener('submit', e => { e.preventDefault(); submit(f); });
  }

  function adminCard() {
    const n = readStore().length;
    return `<div class="data-card" id="apply-admin"><h3>${esc(tr('adminTitle'))}</h3>
${serverOK ? `<p>${esc(tr('adminServer'))}</p><div class="button-row"><a class="button dark" href="api/applications.csv" download>${esc(tr('adminServerDownload'))}</a></div>` : ''}
<table><tbody><tr><td>${esc(tr('adminLocal'))}</td><td>${n}</td></tr></tbody></table>
<div class="button-row"><button class="button ${serverOK ? '' : 'dark'}" data-apply-action="export" ${n ? '' : 'disabled'}>${esc(tr('adminDownload'))}</button><button class="text-link" data-apply-action="clear" ${n ? '' : 'disabled'}>${esc(tr('adminClear'))}</button></div>
<p class="helper">${esc(tr('adminNote'))}</p></div>`;
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-apply-action]'); if (!b) return;
    const a = b.dataset.applyAction;
    if (a === 'new') { lastSubmitted = null; render(); }
    if (a === 'mine' && lastSubmitted) download(`artbridge-application-${stamp()}.csv`, S.toCSV([lastSubmitted]));
    if (a === 'export') download(`la-applications-${stamp()}.csv`, S.toCSV(readStore()));
    if (a === 'clear' && confirm(tr('adminClearConfirm'))) { writeStore([]); const card = $('#apply-admin'); if (card) card.outerHTML = adminCard(); }
  });

  // Detect the local CSV server (server.js). Static hosting simply fails this check.
  fetch('api/applications/status').then(r => r.ok ? r.json() : null).then(s => {
    serverOK = Boolean(s && s.csv);
    const pill = $('#apply-mode'); if (pill) pill.textContent = serverOK ? 'CSV · data/la-applications.csv' : 'Browser → CSV';
    const card = $('#apply-admin'); if (card) card.outerHTML = adminCard();
  }).catch(() => { });

  window.ArtBridgeApply = { render, adminCard };
})();
