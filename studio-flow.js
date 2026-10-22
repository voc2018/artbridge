'use strict';
/* Studio project flow
   Open project      → steps 1–4: project stage, with a status message that changes with it.
   Generate document → steps 5–7: discuss terms → both artists sign → original locked.
   Signing here is a simulation. No real signature or invitation is created. */
(() => {
const FLOW = {
  en: {
    stageTitle: 'Project stage', stageHelp: 'The stage can change at any time. It never changes a signed agreement.',
    stages: ['Planning', 'Creating', 'In review', 'Completed'],
    stageMsg: ['1 · Planning — shaping the idea together.', '2 · Creating — the work is being made.', '3 · In review — both artists are reviewing the work.', '4 · Completed — the work is finished.'],
    stageSaved: 'Stage updated',
    steps: ['5. Discuss terms', '6. Both artists sign', '7. Lock the original'],
    states: ['Draft · editable', 'Awaiting signatures · text fixed', 'Signed · original locked'],
    help: ['Review the draft in all three languages, then request signatures.', 'This version is fixed. Each artist signs separately.', 'Both artists have signed. The original is read-only. Changes need a new amendment.'],
    request: 'Request signatures', sign: 'Sign', signed: 'Signed', waiting: 'Awaiting signature',
    amend: 'Create amendment', version: 'Version', history: 'Agreement history',
    demo: 'Signature demo · these buttons only show the signing flow. No real signature or invitation is sent.',
    ev: { requested: 'Text fixed and signatures requested.', signed: 'signed.', locked: 'Both signed. Original locked.', amended: 'Previous original archived. New amendment started.' },
    archived: 'Archived signed original', editLocked: 'Locked after signature requests. Create an amendment to change terms.'
  },
  ko: {
    stageTitle: '작업 진행 상태', stageHelp: '진행 상태는 언제든 바꿀 수 있습니다. 서명한 계약 원본에는 영향을 주지 않습니다.',
    stages: ['기획 중', '제작 중', '검토 중', '완료'],
    stageMsg: ['1 · 기획 중 — 두 작가가 함께 아이디어를 다듬고 있습니다.', '2 · 제작 중 — 작품을 만들고 있습니다.', '3 · 검토 중 — 두 작가가 결과물을 함께 검토하고 있습니다.', '4 · 완료 — 작품이 완성되었습니다.'],
    stageSaved: '진행 상태를 바꿨습니다',
    steps: ['5. 조건 협의', '6. 두 화가 서명', '7. 계약 원본 잠금'],
    states: ['초안 · 수정 가능', '서명 대기 · 내용 고정', '서명 완료 · 원본 잠금'],
    help: ['세 언어의 내용을 확인하고 서명을 요청해 보세요.', '이 버전은 고정되었습니다. 두 화가가 각각 서명합니다.', '두 사람의 서명이 완료되었습니다. 원본은 읽기만 가능합니다. 변경은 새 합의서에서 진행합니다.'],
    request: '서명 요청', sign: '서명하기', signed: '서명 완료', waiting: '서명 대기',
    amend: '변경합의서 만들기', version: '버전', history: '계약 기록',
    demo: '서명 흐름 데모 · 이 버튼들은 서명 과정을 보여주기 위한 것입니다. 실제 서명이나 상대방 초대는 이루어지지 않습니다.',
    ev: { requested: '세 언어 내용을 고정하고 서명을 요청했습니다.', signed: '서명했습니다.', locked: '두 사람의 서명이 완료되어 원본을 잠갔습니다.', amended: '이전 원본을 보관하고 새 변경합의서를 시작했습니다.' },
    archived: '보관된 서명 원본', editLocked: '서명 요청 후에는 잠깁니다. 조건을 바꾸려면 변경합의서를 만드세요.'
  },
  sw: {
    stageTitle: 'Hatua ya mradi', stageHelp: 'Hatua inaweza kubadilika wakati wowote bila kubadili makubaliano yaliyosainiwa.',
    stages: ['Mipango', 'Uundaji', 'Ukaguzi', 'Imekamilika'],
    stageMsg: ['1 · Mipango — mnaunda wazo pamoja.', '2 · Uundaji — kazi inatengenezwa.', '3 · Ukaguzi — wasanii wote wanakagua kazi.', '4 · Imekamilika — kazi imekamilika.'],
    stageSaved: 'Hatua imebadilishwa',
    steps: ['5. Jadili masharti', '6. Wasanii wote wasaini', '7. Funga asili'],
    states: ['Rasimu · inaweza kuhaririwa', 'Inasubiri sahihi · maandishi yamewekwa', 'Imesainiwa · asili imefungwa'],
    help: ['Kagua lugha zote tatu, kisha omba sahihi.', 'Toleo hili limewekwa. Kila msanii anasaini peke yake.', 'Wasanii wote wamesaini. Asili inasomwa tu. Mabadiliko yanahitaji marekebisho mapya.'],
    request: 'Omba sahihi', sign: 'Saini', signed: 'Imesainiwa', waiting: 'Inasubiri sahihi',
    amend: 'Unda marekebisho', version: 'Toleo', history: 'Historia ya makubaliano',
    demo: 'Onyesho la kusaini · vitufe hivi vinaonyesha mchakato tu. Hakuna sahihi halisi wala mwaliko unaotumwa.',
    ev: { requested: 'Maandishi yamewekwa na sahihi zimeombwa.', signed: 'amesaini.', locked: 'Wote wamesaini. Asili imefungwa.', amended: 'Asili ya awali imehifadhiwa. Marekebisho mapya yameanza.' },
    archived: 'Asili iliyosainiwa', editLocked: 'Imefungwa baada ya kuomba sahihi. Unda marekebisho kubadili masharti.'
  }
};
const F = () => FLOW[lang] || FLOW.en;
const STAGES = ['planning', 'creating', 'review', 'completed'];
const stageIndex = s => Math.max(0, STAGES.indexOf(s === 'archived' ? 'completed' : s));
const sig = r => r.meta.signing || { phase: 0, version: 1, signed: [null, null], log: [], archive: [] };
const now = () => new Date().toLocaleString();

async function persist(r, meta, msg) {
  const copy = { ...r, meta: { ...r.meta, ...meta } };
  try { await saveRecord(copy); if (msg) toast(msg); return true; }
  catch { toast(t('error')); return false; }
}

/* ---- 1–4 · Open project: stage + live status message ---- */
window.openProject = openProject = function (id) {
  const r = records.find(x => x.id === id); if (!r) return;
  const f = F(), i = stageIndex(r.meta.stage);
  openModal(heading(projectDisplayTitle(r)) + `
    <p>${esc(r.meta.artist_a)} × ${esc(r.meta.artist_b)}</p>
    <p>${esc(exactProjectContent(r, lang).brief || t('pending'))}</p>
    <div class="flow-steps flow-stages">${f.stages.map((s, k) => `<span class="${k === i ? 'active' : k < i ? 'done' : ''}">${k + 1}. ${esc(s)}</span>`).join('')}</div>
    <p class="flow-status" id="flow-stage-msg" role="status" aria-live="polite">${esc(f.stageMsg[i])}</p>
    <label class="field"><span>${esc(f.stageTitle)}</span>
      <select data-flow-stage="${esc(r.id)}">${STAGES.map((v, k) => `<option value="${v}" ${k === i ? 'selected' : ''}>${k + 1}. ${esc(f.stages[k])}</option>`).join('')}</select></label>
    <p class="helper">${esc(f.stageHelp)}</p>
    <div class="button-row"><button class="button dark" data-document="${esc(r.id)}">${esc(t('makeDocument'))}</button>
      ${sig(r).phase ? '' : `<button class="text-link" data-edit-project="${esc(r.id)}">${esc(t('editProject'))}</button>`}
      <button class="text-link" data-translate="${esc(r.id)}">${esc(t('editTranslations'))}</button></div>`);
};

document.addEventListener('change', async e => {
  const id = e.target.dataset.flowStage; if (!id) return;
  const r = records.find(x => x.id === id); if (!r) return;
  const v = e.target.value, k = STAGES.indexOf(v), f = F();
  const box = e.target.closest('#modal-content');
  if (await persist(r, { stage: v }, f.stageSaved)) {
    box.querySelector('#flow-stage-msg').textContent = f.stageMsg[k];
    box.querySelectorAll('.flow-stages span').forEach((s, n) => { s.className = n === k ? 'active' : n < k ? 'done' : ''; });
  } else e.target.value = r.meta.stage;
});

/* ---- 5–7 · Generate document: terms → signatures → lock ---- */
const baseOpenDocument = openDocument;
window.openDocument = openDocument = function (id, dl = lang) {
  baseOpenDocument(id, dl);
  const r = records.find(x => x.id === id); if (!r) return;
  const box = document.querySelector('#modal-content'); if (!box) return;
  const f = F(), s = sig(r), names = [r.meta.artist_a, r.meta.artist_b];
  const panel = document.createElement('section'); panel.className = 'flow-sign';
  panel.innerHTML = `
    <p class="flow-demo">${esc(f.demo)}</p>
    <div class="flow-steps">${f.steps.map((x, k) => `<span class="${k === s.phase ? 'active' : k < s.phase ? 'done' : ''}">${esc(x)}</span>`).join('')}</div>
    <div class="flow-head"><strong>${esc(f.version)} ${s.version}</strong><span class="flow-badge flow-badge-${s.phase}">${esc(f.states[s.phase])}</span></div>
    <p class="flow-status" role="status" aria-live="polite">${esc(f.help[s.phase])}</p>
    ${s.phase === 0 ? `<div class="button-row"><button class="button dark" data-flow-request="${esc(id)}">${esc(f.request)}</button></div>` : ''}
    ${s.phase > 0 ? `<div class="flow-signers">${names.map((n, k) => `<div class="flow-signer ${s.signed[k] ? 'is-signed' : ''}"><strong>${esc(n)}</strong>
        <span>${s.signed[k] ? esc(f.signed) + ' · ' + esc(s.signed[k]) : esc(f.waiting)}</span>
        ${s.signed[k] ? '' : `<button class="button" data-flow-sign="${esc(id)}" data-who="${k}">${esc(n)} · ${esc(f.sign)}</button>`}</div>`).join('')}</div>` : ''}
    ${s.phase === 2 ? `<div class="button-row"><button class="text-link" data-flow-amend="${esc(id)}">${esc(f.amend)}</button></div>` : ''}
    ${s.log.length ? `<details class="flow-log"><summary>${esc(f.history)}</summary><ol>${s.log.map(x => `<li>${esc(x.time)} · ${x.who ? esc(x.who) + ' · ' : ''}${esc(f.ev[x.key])}</li>`).join('')}${s.archive.map(a => `<li>${esc(f.archived)} · ${esc(f.version)} ${a.version} · ${esc(a.signed.join(' / '))}</li>`).join('')}</ol></details>` : ''}`;
  const pre = box.querySelector('.document-preview');
  box.insertBefore(panel, pre);
  if (s.phase > 0) pre.classList.add('is-locked');
};

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-flow-request],[data-flow-sign],[data-flow-amend]'); if (!b) return;
  const id = b.dataset.flowRequest || b.dataset.flowSign || b.dataset.flowAmend;
  const r = records.find(x => x.id === id); if (!r) return;
  const s = structuredClone(sig(r)), dl = activeDocument?.lang || lang;
  if (b.dataset.flowRequest) { s.phase = 1; s.log.push({ key: 'requested', time: now() }); }
  if (b.dataset.flowSign) {
    const k = +b.dataset.who, who = [r.meta.artist_a, r.meta.artist_b][k];
    s.signed[k] = now(); s.log.push({ key: 'signed', who, time: now() });
    if (s.signed.every(Boolean)) { s.phase = 2; s.log.push({ key: 'locked', time: now() }); }
  }
  if (b.dataset.flowAmend) {
    s.archive.push({ version: s.version, signed: s.signed });
    s.version++; s.phase = 0; s.signed = [null, null]; s.log.push({ key: 'amended', time: now() });
  }
  if (await persist(r, { signing: s })) openDocument(id, dl);
});

/* block brief/terms editing while an agreement is out for signature or locked */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-edit-project]'); if (!b) return;
  const r = records.find(x => x.id === b.dataset.editProject);
  if (r && sig(r).phase > 0) { e.stopImmediatePropagation(); e.preventDefault(); toast(F().editLocked); }
}, true);
})();
