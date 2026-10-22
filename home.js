/* Homepage copy (philosophy first) + Tanzanian artists on the bridge.
   Loaded before script.js so its keys are part of the site translations. */
(function () {
  'use strict';

  // Artist pages: https://<slug>.voiceofpiece.org — image = one work from each artist's own page.
  const ARTISTS = [
    { slug: 'aggrey', name: 'Aggrey Paul Mwasha', city: 'Dar es Salaam', img: 'gallery/01.jpg', tags: ['painting', 'wildlife'] },
    { slug: 'alto', name: 'Alto Augustino Haule', city: 'Tanzania', img: 'gallery/07.jpg', tags: ['drawing', 'family-love'] },
    { slug: 'elichilia', name: 'Elichilia Ezekiel Mcharo', city: 'Tanzania', img: 'gallery/02.jpg', tags: ['painting', 'wildlife'] },
    { slug: 'evarist', name: 'Evarist Fabian Chikawe', city: 'Dar es Salaam', img: 'gallery/01.jpg', tags: ['painting', 'culture'] },
    { slug: 'evodius', name: 'Evodius Tumsime Nicholaus', city: 'Arusha', img: 'gallery/01.jpg', tags: ['painting', 'culture'] },
    { slug: 'ezekiel', name: 'Ezekiel Charles Loishooki', city: 'Arusha', img: 'works/recent/01.jpg', tags: ['drawing', 'wildlife'] },
    { slug: 'godwin', name: 'Godwin Josephat Makombe', city: 'Tanzania', img: 'gallery/01.jpg', tags: ['drawing', 'community'] },
    { slug: 'hedwiga', name: 'Hedwiga Medard Tairo', city: 'Dar es Salaam', img: 'gallery/01.jpg', tags: ['painting', 'identity'] },
    { slug: 'james', name: 'James Romanus Haule', city: 'Dar es Salaam', img: 'gallery/01.jpg', tags: ['painting', 'community'] },
    { slug: 'john', name: 'John Mussa Ngwesa', city: 'Tanzania', img: 'gallery/01.jpg', tags: ['drawing', 'family-love'] },
    { slug: 'kipara', name: 'Kipara David Mzuguno', city: 'Dar es Salaam', img: 'hero-parrots.jpg', tags: ['painting', 'wildlife'] },
    { slug: 'ladislaus', name: 'Ladislaus Tumwesige Nicholaus', city: 'Tanzania', img: 'gallery/01.jpg', tags: ['painting', 'wildlife'] },
    { slug: 'lutengano', name: 'Lutengano Anganile Mwakisopile', city: 'Tanzania', img: 'gallery/01.jpg', tags: ['mixed-media', 'city'] },
    { slug: 'mitole', name: 'Omary Said Mitole', city: 'Dar es Salaam', img: 'gallery/01.jpg', tags: ['tingatinga', 'community'] },
    { slug: 'paul', name: 'Paul John Mwakoro', city: 'Tanzania', img: 'gallery/01.jpg', tags: ['painting', 'nature'] },
    { slug: 'price', name: 'Price Deodatus Tarimo', city: 'Tanzania', img: 'gallery/01.jpg', tags: ['painting', 'culture'] },
    { slug: 'simon', name: 'Simon Venance Mussa', city: 'Tanzania', img: 'gallery/03.jpg', tags: ['drawing', 'wildlife'] }
  ];

  const COPY = {
    en: {
      heroQ: 'What could be born if artists<br>who would never meet, <em>met?</em>',
      heroQSub: 'Nini kingezaliwa, ikiwa wasanii wasioweza kukutana wangekutana?',
      heroLead: 'ArtBridge is a place where artists across oceans and languages discover each other, understand each other, and write the promises that protect each other.',
      heroJoin: 'I’m an artist — join the bridge ↗', heroHow: 'How the bridge works ↓',
      heroFootQ: 'A PLACE FOR MEETINGS THAT NEVER HAPPENED',
      whyLabel: 'WHY ARTBRIDGE EXISTS',
      whyTitle: 'We showed their work to the world.<br><em>Now we show them to each other.</em>',
      oldQLabel: 'THE OLD QUESTION', oldQ: 'How can we show this painting to more people?',
      newQLabel: 'THE QUESTION NOW', newQ: 'If artists who could never have met were to meet, what could be born?',
      whyText: 'Our eyes moved from the artwork to the artist, from the painting to the person. Fusion cannot be forced — we can only make a place where different worlds truly meet.',
      caseLabel: 'THE FIRST MEETING',
      caseTitle: 'Lines drawn under different skies,<br><em>meeting as one.</em>',
      caseText1: 'Ezekiel, a young painter in Tanzania, drew a lion inside the outline of Africa. Grace, a high school student in Los Angeles, painted inside the outline of America. They had never met, and they did not share a language.',
      caseText2: 'Grace did not see a work to promote. She saw a person she wanted to paint with. Between them, a third painting was born — one that belongs to neither of them alone. ArtBridge began with this meeting.',
      caseRead: 'Read the full story →', caseTag: 'First case · 2026',
      artistsLabel: 'ARTISTS ON THE BRIDGE',
      artistsTitle: '{n} artists in Tanzania.<br><em>Your name could be next to theirs.</em>',
      artistsText: 'Every artist has their own page. Open one to see their work in their own words.',
      yourName: 'Your name here', yourNameSub: 'Los Angeles · and beyond', openPage: 'Open page ↗',
      doesLabel: 'WHAT THE BRIDGE DOES',
      doesTitle: 'ArtBridge does not paint for anyone.<br><em>It does not automate the artist.</em>',
      discoverT: 'Discover', discoverX: 'A painter in LA and a painter in Tanzania learn that the other exists — and why their ways of seeing might belong together.',
      understandT: 'Understand', understandX: 'Artists write in Kiswahili; it arrives in English and Korean instantly, with the original always kept beside it.',
      protectT: 'Protect', protectX: 'Before a shared work travels, both artists write the promises together — so both names, both voices and both futures are kept.',
      namesLabel: 'NAMES SIDE BY SIDE', namesTitle: 'Not paperwork.<br><em>Respect.</em>',
      namesText: 'Even the most beautiful collaboration can become another unfair story. Every meeting on ArtBridge answers these questions before the work goes out into the world.',
      q1: 'Whose name goes next to the painting — and how are the names written side by side?',
      q2: 'Who holds the copyright?', q3: 'If the painting sells, how are the proceeds shared?',
      q4: 'How far can the original work be transformed?', q5: 'Who bears the cost of promotion, and how?',
      measureLabel: 'HOW WE MEASURE', measureTitle: 'We don’t count followers.<br><em>We count meetings.</em>',
      m1: 'Meeting', m1x: 'Two people who would never have met', m2: 'New work', m2x: 'A painting that would never have existed',
      m3: 'Artists on the bridge', m3x: 'Waiting for the next question',
      becomingLabel: 'STILL BECOMING',
      becomingTitle: 'Built by students who did not yet know the words <em>“that’s not my field.”</em>',
      becomingText: 'One painted. One wrote code. One went to listen to the painters of LA. One wrestled with copyright and contracts. ArtBridge is not finished — like an atom with empty spaces, it is still open to bond.',
      closingVop: 'Already have a Voice of Piece page? You are already on the bridge.'
    },
    ko: {
      heroQ: '무엇이 태어날까,<br>만날 수 없던 예술가들이 <em>만났다면?</em>',
      heroQSub: 'Nini kingezaliwa, ikiwa wasanii wasioweza kukutana wangekutana?',
      heroLead: 'ArtBridge는 바다와 언어를 사이에 둔 화가들이 서로를 발견하고, 서로를 이해하고, 서로를 지키는 약속을 함께 쓰는 곳입니다.',
      heroJoin: '화가로 참여하기 ↗', heroHow: 'ArtBridge는 이렇게 작동해요 ↓',
      heroFootQ: '일어난 적 없던 만남을 위한 자리',
      whyLabel: 'ARTBRIDGE가 존재하는 이유',
      whyTitle: '우리는 그들의 작품을 세상에 보여주었습니다.<br><em>이제는 서로를 서로에게 보여줍니다.</em>',
      oldQLabel: '예전의 질문', oldQ: '어떻게 이 그림을 더 많은 사람에게 보여줄까?',
      newQLabel: '지금의 질문', newQ: '만날 수 없던 화가들이 만난다면, 무엇이 태어날 수 있을까?',
      whyText: '우리의 시선은 작품에서 작가로, 그림에서 사람으로 옮겨갔습니다. 융합은 강요할 수 없습니다. 우리가 할 수 있는 일은 서로 다른 세계가 진짜로 만날 수 있는 자리를 만드는 것입니다.',
      caseLabel: '첫 번째 만남',
      caseTitle: '서로 다른 하늘 아래 그린 선이<br><em>하나로 이어질 때.</em>',
      caseText1: '탄자니아의 젊은 화가 Ezekiel은 아프리카 대륙의 윤곽 안에 사자를 그렸습니다. 로스앤젤레스의 고등학생 Grace는 아메리카 대륙의 윤곽 안에 그림을 그렸습니다. 두 사람은 만난 적도 없고, 같은 언어를 쓰지도 않았습니다.',
      caseText2: 'Grace는 그 그림에서 홍보할 작품이 아니라 함께 그리고 싶은 사람을 보았습니다. 두 사람 사이에서 어느 한 사람의 것도 아닌 세 번째 그림이 태어났습니다. ArtBridge는 이 만남에서 시작되었습니다.',
      caseRead: '전체 이야기 읽기 →', caseTag: '첫 번째 사례 · 2026',
      artistsLabel: '다리 위의 화가들',
      artistsTitle: '탄자니아의 화가 {n}명.<br><em>당신의 이름이 그 곁에 놓일 수 있습니다.</em>',
      artistsText: '모든 화가가 자신의 페이지를 가지고 있습니다. 하나를 열어 그들의 작품과 이야기를 만나보세요.',
      yourName: '당신의 자리', yourNameSub: '로스앤젤레스 · 그리고 그 너머', openPage: '페이지 열기 ↗',
      doesLabel: 'ARTBRIDGE가 하는 일',
      doesTitle: 'ArtBridge는 누구를 대신해 그리지 않습니다.<br><em>화가를 자동화하지도 않습니다.</em>',
      discoverT: '발견', discoverX: 'LA의 화가와 탄자니아의 화가가 서로의 존재를 알게 되고, 왜 두 시선이 함께할 수 있는지 알게 됩니다.',
      understandT: '이해', understandX: '화가가 스와힐리어로 쓰면 영어와 한국어로 바로 전해집니다. 원문은 언제나 곁에 남습니다.',
      protectT: '보호', protectX: '함께 만든 작품이 세상에 나가기 전에, 두 화가가 약속을 함께 씁니다. 두 이름과 두 목소리, 두 사람의 미래를 지키기 위해서입니다.',
      namesLabel: '이름을 나란히', namesTitle: '서류가 아니라<br><em>존중입니다.</em>',
      namesText: '아무리 아름다운 협업도 또 하나의 불공정한 이야기가 될 수 있습니다. ArtBridge의 모든 만남은 작품이 세상에 나가기 전에 이 질문들에 답합니다.',
      q1: '이 그림 옆에 누구의 이름을, 어떻게 나란히 쓸까요?',
      q2: '저작권은 누구에게 있나요?', q3: '그림이 팔리면 수익은 어떻게 나누나요?',
      q4: '원작은 어디까지 바꿀 수 있나요?', q5: '홍보 비용은 누가, 어떻게 부담하나요?',
      measureLabel: '우리가 재는 방법', measureTitle: '팔로워를 세지 않습니다.<br><em>만남을 셉니다.</em>',
      m1: '만남', m1x: '만나지 못했을 두 사람', m2: '새 작품', m2x: '존재하지 않았을 그림 한 점',
      m3: '다리 위의 화가', m3x: '다음 질문을 기다리는 사람들',
      becomingLabel: '아직 만들어지는 중',
      becomingTitle: '“그건 내 분야가 아니야”라는 말을 <em>아직 몰랐던 학생들이 만들었습니다.</em>',
      becomingText: '한 학생은 그림을 그렸고, 한 학생은 코드를 썼고, 한 학생은 LA의 화가들을 만나러 갔고, 한 학생은 저작권과 계약을 붙들고 씨름했습니다. ArtBridge는 아직 완성되지 않았습니다. 빈자리가 있는 원자처럼, 여전히 결합할 수 있습니다.',
      closingVop: 'Voice of Piece 페이지가 이미 있나요? 당신은 이미 다리 위에 있습니다.'
    },
    sw: {
      heroQ: 'Nini kingezaliwa,<br>ikiwa wasanii wasioweza kukutana <em>wangekutana?</em>',
      heroQSub: 'What could be born if artists who would never meet, met?',
      heroLead: 'ArtBridge ni mahali ambapo wasanii waliotenganishwa na bahari na lugha hugunduana, huelewana, na huandika pamoja ahadi zinazowalinda.',
      heroJoin: 'Mimi ni msanii — jiunge na daraja ↗', heroHow: 'Daraja linavyofanya kazi ↓',
      heroFootQ: 'MAHALI PA MIKUTANO AMBAYO HAIKUWAHI KUTOKEA',
      whyLabel: 'KWA NINI ARTBRIDGE IPO',
      whyTitle: 'Tulionyesha kazi zao kwa ulimwengu.<br><em>Sasa tunawaonyesha wao kwa wao.</em>',
      oldQLabel: 'SWALI LA ZAMANI', oldQ: 'Tunawezaje kuonyesha mchoro huu kwa watu wengi zaidi?',
      newQLabel: 'SWALI LA SASA', newQ: 'Ikiwa wasanii ambao wasingeweza kukutana wangekutana, nini kingezaliwa?',
      whyText: 'Macho yetu yalihama kutoka kwenye kazi ya sanaa hadi kwa msanii, kutoka kwenye mchoro hadi kwa mtu. Muungano hauwezi kulazimishwa — tunaweza tu kuandaa mahali ambapo dunia tofauti zinakutana kweli.',
      caseLabel: 'MKUTANO WA KWANZA',
      caseTitle: 'Mistari iliyochorwa chini ya anga tofauti,<br><em>inapoungana kuwa moja.</em>',
      caseText1: 'Ezekiel, mchoraji kijana wa Tanzania, alichora simba ndani ya umbo la bara la Afrika. Grace, mwanafunzi wa sekondari wa Los Angeles, alichora ndani ya umbo la bara la Amerika. Hawakuwahi kukutana, na hawakuzungumza lugha moja.',
      caseText2: 'Grace hakuona kazi ya kutangaza. Aliona mtu aliyetaka kuchora naye. Kati yao, mchoro wa tatu ulizaliwa — usio wa mmoja wao peke yake. ArtBridge ilianzia kwenye mkutano huu.',
      caseRead: 'Soma hadithi kamili →', caseTag: 'Mfano wa kwanza · 2026',
      artistsLabel: 'WASANII KWENYE DARAJA',
      artistsTitle: 'Wasanii {n} wa Tanzania.<br><em>Jina lako linaweza kuwa kando yao.</em>',
      artistsText: 'Kila msanii ana ukurasa wake. Fungua mmoja uone kazi zake kwa maneno yake mwenyewe.',
      yourName: 'Jina lako hapa', yourNameSub: 'Los Angeles · na kwingineko', openPage: 'Fungua ukurasa ↗',
      doesLabel: 'DARAJA LINAFANYA NINI',
      doesTitle: 'ArtBridge haichori kwa niaba ya mtu yeyote.<br><em>Haimfanyi msanii kuwa mashine.</em>',
      discoverT: 'Gundua', discoverX: 'Mchoraji wa LA na mchoraji wa Tanzania wanajua kwamba mwingine yupo — na kwa nini mitazamo yao inaweza kwenda pamoja.',
      understandT: 'Elewa', understandX: 'Wasanii huandika kwa Kiswahili; maandishi hufika kwa Kiingereza na Kikorea papo hapo, na asili hubaki kando yake daima.',
      protectT: 'Linda', protectX: 'Kabla kazi ya pamoja haijasafiri, wasanii wote wawili huandika ahadi pamoja — ili majina yote mawili, sauti zote mbili na mustakabali wao vilindwe.',
      namesLabel: 'MAJINA KANDO KWA KANDO', namesTitle: 'Si makaratasi.<br><em>Ni heshima.</em>',
      namesText: 'Hata ushirikiano mzuri kabisa unaweza kuwa hadithi nyingine isiyo ya haki. Kila mkutano kwenye ArtBridge hujibu maswali haya kabla kazi haijatoka duniani.',
      q1: 'Jina la nani litakaa kando ya mchoro — na majina yataandikwa vipi kando kwa kando?',
      q2: 'Nani anamiliki hakimiliki?', q3: 'Mchoro ukiuzwa, mapato yatagawanywa vipi?',
      q4: 'Kazi asili inaweza kubadilishwa kwa kiasi gani?', q5: 'Nani atabeba gharama za matangazo, na kwa namna gani?',
      measureLabel: 'TUNAVYOPIMA', measureTitle: 'Hatuhesabu wafuasi.<br><em>Tunahesabu mikutano.</em>',
      m1: 'Mkutano', m1x: 'Watu wawili ambao wasingekutana kamwe', m2: 'Kazi mpya', m2x: 'Mchoro ambao usingekuwepo kamwe',
      m3: 'Wasanii kwenye daraja', m3x: 'Wanasubiri swali lijalo',
      becomingLabel: 'BADO INAKUA',
      becomingTitle: 'Imejengwa na wanafunzi ambao bado hawakujua maneno <em>“hilo si fani yangu.”</em>',
      becomingText: 'Mmoja alichora. Mmoja aliandika msimbo. Mmoja alienda kuwasikiliza wachoraji wa LA. Mmoja alipambana na hakimiliki na mikataba. ArtBridge bado haijakamilika — kama atomu yenye nafasi tupu, bado iko wazi kuungana.',
      closingVop: 'Tayari una ukurasa wa Voice of Piece? Tayari uko kwenye daraja.'
    }
  };

  for (const l of Object.keys(COPY)) {
    for (const [k, v] of Object.entries(COPY[l])) COPY[l][k] = v.replace('{n}', ARTISTS.length);
    Object.assign(window.ArtBridgeI18n[l], COPY[l]);
  }

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function renderArtists(lang) {
    const grid = document.getElementById('bridge-artists'); if (!grid) return;
    const d = window.ArtBridgeI18n[lang] || window.ArtBridgeI18n.en, t = k => d[k] || window.ArtBridgeI18n.en[k] || k;
    grid.innerHTML = ARTISTS.map(a => {
      const url = `https://${a.slug}.voiceofpiece.org/`;
      return `<a class="bridge-artist" href="${url}" target="_blank" rel="noopener">
  <span class="bridge-artist-img" data-initial="${esc(a.name.charAt(0))}"><img src="${url}${a.img}" alt="${esc('Artwork by ' + a.name)}" loading="lazy" onerror="this.remove()"></span>
  <span class="bridge-artist-name">${esc(a.name)}</span>
  <span class="bridge-artist-place">${esc(a.city.toUpperCase())}</span>
  <span class="bridge-artist-tags">${a.tags.map(x => `<span class="tag">${esc(t(x))}</span>`).join('')}</span>
  <span class="bridge-artist-host">${esc(a.slug)}.voiceofpiece.org ↗</span>
</a>`;
    }).join('') + `<a class="bridge-artist bridge-artist-you" href="#apply"><span class="bridge-you-mark" aria-hidden="true">+</span><span class="bridge-artist-name">${esc(t('yourName'))}</span><span class="bridge-artist-place">${esc(t('yourNameSub'))}</span></a>`;
    const count = document.getElementById('artist-count'); if (count) count.textContent = ARTISTS.length;
  }

  window.ArtBridgeHome = { renderArtists, ARTISTS };
})();

/* "Our story" page: why and who built ArtBridge */
(function () {
  const ABOUT = {
    en: { navAbout: 'Our story', aboutKicker: 'Why we built ArtBridge', aboutEssayNote: 'Original in English.',
      teamTitle: 'Who made it', teamIntro: 'ArtBridge was built by three members of Voice of Piece Cohort 3.',
      roleArtist: 'Artist', roleEngineer: 'Engineer', roleMarketing: 'Marketing' },
    ko: { navAbout: '우리 이야기', aboutKicker: 'ArtBridge를 만든 이유', aboutEssayNote: '이 글은 영어 원문입니다.',
      teamTitle: '누가 만들었나', teamIntro: 'ArtBridge는 Voice of Piece 3기(Cohort 3) 팀 중 세 사람이 만들었습니다.',
      roleArtist: '예술가', roleEngineer: '엔지니어', roleMarketing: '마케팅' },
    sw: { navAbout: 'Hadithi yetu', aboutKicker: 'Kwa nini tulijenga ArtBridge', aboutEssayNote: 'Insha hii iko kwa Kiingereza.',
      teamTitle: 'Nani aliijenga', teamIntro: 'ArtBridge ilijengwa na wanachama watatu wa Kundi la 3 (Cohort 3) la Voice of Piece.',
      roleArtist: 'Msanii', roleEngineer: 'Mhandisi', roleMarketing: 'Masoko' }
  };
  for (const l of Object.keys(ABOUT)) Object.assign(window.ArtBridgeI18n[l], ABOUT[l]);
})();

/* Chapter list on "Our story": scroll without changing the page route */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-essay-jump]'); if (!b) return;
  const target = document.getElementById(b.dataset.essayJump); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* Matching explanation for artists (short); details live on #research */
(function () {
  const M = {
    en: { methodTitle: 'A connection, explained.',
      methodLook: 'What we look at', methodLookX: 'Only your answers to the matching questions: what you can bring, what you hope to find, what your work is about, how you would like to work together, and when you are free.',
      methodNever: 'What we never look at', methodNeverX: 'How “good” your art is, your followers, sales, or where you are from. Language never lowers a connection — we translate instead.',
      methodNumber: 'What the number means', methodNumberX: 'It shows how well your answers fit in both directions — for you and for them. If a pair only works for one of you, the number stays low.',
      methodNext: 'What happens next', methodNextX: 'A suggestion is not a match. Nothing is sent until you choose. You meet only when you both say yes, and you can say no at any time.',
      methodResearch: 'How the score is calculated, and the research behind it →', agreedTransformation: 'Agreed transformation' },
    ko: { methodTitle: '연결 점수, 이렇게 정해져요.',
      methodLook: '보는 것', methodLookX: '매칭 질문에 대한 내 답만 봐요. 내가 가져올 수 있는 것, 상대에게서 찾는 것, 작품의 주제, 원하는 협업 방식, 가능한 기간이에요.',
      methodNever: '절대 보지 않는 것', methodNeverX: '그림 실력, 팔로워, 판매 실적, 출신은 보지 않아요. 언어 때문에 점수가 낮아지는 일도 없어요. 대신 번역해 드려요.',
      methodNumber: '숫자의 의미', methodNumberX: '나에게도, 상대에게도 얼마나 잘 맞는지 양방향으로 본 값이에요. 한쪽에만 좋은 조합이면 숫자가 낮게 나와요.',
      methodNext: '그다음', methodNextX: '추천은 매칭이 아니에요. 내가 고르기 전에는 아무것도 보내지지 않아요. 두 사람이 모두 원할 때만 만나고, 언제든 거절할 수 있어요.',
      methodResearch: '점수 계산 방법과 연구 근거 보기 →', agreedTransformation: '합의된 변형 범위' },
    sw: { methodTitle: 'Muunganiko, umeelezwa.',
      methodLook: 'Tunachoangalia', methodLookX: 'Majibu yako tu kwa maswali ya kuunganisha: unachoweza kuleta, unachotarajia kupata, kazi yako inahusu nini, jinsi ungependa kushirikiana, na lini uko huru.',
      methodNever: 'Tusichoangalia kamwe', methodNeverX: 'Ubora wa sanaa yako, wafuasi, mauzo, au unakotoka. Lugha haipunguzi muunganiko kamwe — tunatafsiri badala yake.',
      methodNumber: 'Maana ya namba', methodNumberX: 'Inaonyesha jinsi majibu yenu yanavyoendana pande zote mbili — kwako na kwao. Ikiwa inafaa upande mmoja tu, namba inabaki chini.',
      methodNext: 'Kinachofuata', methodNextX: 'Pendekezo si muunganiko. Hakuna kinachotumwa hadi uchague. Mnakutana tu mkikubali wote wawili, na unaweza kukataa wakati wowote.',
      methodResearch: 'Jinsi alama inavyohesabiwa, na utafiti nyuma yake →', agreedTransformation: 'Kiwango cha mabadiliko kilichokubaliwa' }
  };
  for (const l of Object.keys(M)) Object.assign(window.ArtBridgeI18n[l], M[l]);
})();
Object.assign(window.ArtBridgeI18n.en, { navResearch: 'Research' });
Object.assign(window.ArtBridgeI18n.ko, { navResearch: '리서치' });
Object.assign(window.ArtBridgeI18n.sw, { navResearch: 'Utafiti' });
Object.assign(window.ArtBridgeI18n.en, { footAbout: 'About', footMeeting: 'The first meeting', footApply: 'Artist application' });
Object.assign(window.ArtBridgeI18n.ko, { footAbout: '소개', footMeeting: '첫 번째 만남', footApply: '화가 신청서' });
Object.assign(window.ArtBridgeI18n.sw, { footAbout: 'Kuhusu', footMeeting: 'Mkutano wa kwanza', footApply: 'Ombi la msanii' });
