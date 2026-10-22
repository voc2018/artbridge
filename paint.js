/* Homepage: paint that drips out of the hero painting as you scroll.
   Tanzania's earth colours flow down from the left, Los Angeles' blues from the right,
   and the two pools of paint mix at the bottom of the page. */
(function () {
  'use strict';
  const home = document.getElementById('home');
  if (!home) return;
  const cv = document.createElement('canvas');
  cv.id = 'paint'; cv.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(cv, document.body.firstChild);
  const c = cv.getContext('2d');
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TZ = [[182, 90, 52], [211, 138, 76], [201, 138, 75], [226, 189, 85], [160, 72, 44]];
  const LA = [[52, 93, 153], [91, 127, 196], [70, 80, 150], [139, 125, 200], [242, 154, 107]];
  let W = 0, H = 0, DPR = 1, docTop = 0, docH = 0, mobile = false;
  let streams = [], drips = [], pool = [], meetY = 0, sy = 0, gy = 0, t = 0, last = 0, built = false;

  function rng(s) { return function () { s = Math.imul(s ^ s >>> 15, 1 | s) + 0x6D2B79F5 | 0; return ((s ^ s >>> 7) >>> 0) / 4294967296; }; }
  const sm = u => u * u * u * (u * (u * 6 - 15) + 10);

  // watercolour blob sprites: irregular edge, pigment pooling at the rim
  const sprites = new Map();
  function sprite(rgb, seed) {
    const key = rgb.join(',') + ':' + seed;
    if (sprites.has(key)) return sprites.get(key);
    const S = 96, cv2 = document.createElement('canvas'); cv2.width = cv2.height = S;
    const g = cv2.getContext('2d'), R = rng(seed * 977 + rgb[0]);
    g.beginPath();
    const n = 28;
    for (let i = 0; i <= n; i++) {
      const a = i / n * Math.PI * 2, r = S * (.36 + R() * .1);
      const x = S / 2 + Math.cos(a) * r, y = S / 2 + Math.sin(a) * r;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
    const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * .46);
    gr.addColorStop(0, 'rgba(' + rgb + ',.30)');
    gr.addColorStop(.7, 'rgba(' + rgb + ',.38)');
    gr.addColorStop(.9, 'rgba(' + rgb + ',.62)');
    gr.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = gr; g.filter = 'blur(1.5px)'; g.fill();
    sprites.set(key, cv2);
    return cv2;
  }

  function sectionStops() {
    // where each stream should be (as a fraction of the width) beside each homepage section
    const plan = mobile
      ? [['.why-bridge', .04, .96], ['.first-case', .06, .9], ['.bridge-artists-section', .03, .7], ['.platform-journey', .3, .97], ['.bridge-does', .05, .95], ['.names-band', .4, .96], ['.measure', .2, .8]]
      : [['.why-bridge', .05, .95], ['.first-case', .3, .97], ['.bridge-artists-section', .03, .68], ['.platform-journey', .14, .9], ['.bridge-does', .42, .96], ['.names-band', .05, .6], ['.measure', .26, .74]];
    const out = [];
    for (const [sel, a, b] of plan) {
      const el = home.querySelector(sel); if (!el) continue;
      const r = el.getBoundingClientRect();
      out.push({ y: r.top + scrollY + r.height * .5, a, b });
    }
    return out;
  }

  function path(ctrl, ph, amp) {
    const xs = [], ys = [];
    const y0 = ctrl[0].y, y1 = ctrl[ctrl.length - 1].y;
    for (let y = y0; y <= y1; y += 9) {
      let i = 0; while (i < ctrl.length - 2 && y > ctrl[i + 1].y) i++;
      const a = ctrl[i], b = ctrl[i + 1], u = sm(Math.min(1, (y - a.y) / Math.max(1, b.y - a.y)));
      const calm = Math.min(1, (y1 - y) / 420);
      xs.push(a.x + (b.x - a.x) * u + amp * calm * (Math.sin(y * .005 + ph) + .45 * Math.sin(y * .013 + ph * 2)));
      ys.push(y);
    }
    return { xs, ys };
  }

  function build() {
    if (home.hidden) return;
    W = innerWidth; H = innerHeight; mobile = W < 760;
    DPR = mobile ? 1 : Math.min(devicePixelRatio || 1, 1.5);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    const hero = home.querySelector('.manifesto-hero'), closing = home.querySelector('.closing-manifesto');
    if (!hero || !closing) return;
    const hr = hero.getBoundingClientRect(), cr = closing.getBoundingClientRect();
    docTop = hr.top + scrollY + hr.height - 10;
    meetY = cr.top + scrollY - (mobile ? 50 : 90);   // the gap just above the closing card
    docH = cr.top + scrollY + cr.height;
    const stops = sectionStops();
    const R = rng(20261019);
    const base = mobile ? 34 : 64;
    const mk = (key, startX, cols, ph) => {
      const ctrl = [{ y: docTop, x: W * startX }].concat(stops.map(s => ({ y: s.y, x: W * s[key] }))).concat([{ y: meetY, x: W * .5 + (key === 'a' ? -1 : 1) * W * .03 }]);
      const p = path(ctrl, ph, mobile ? 16 : 30);
      const stamps = [];
      for (let i = 0; i < p.xs.length; i++) {
        const y = p.ys[i], wv = base * (.72 + .28 * Math.sin(y * .0042 + ph) + .14 * Math.sin(y * .019 + ph * 3));
        const head = Math.min(1, (y - docTop) / 260);          // thin where it leaves the painting, fuller below
        const w = wv * (.45 + .55 * head);
        stamps.push({ x: p.xs[i] + (R() - .5) * w * .35, y, r: w * (1.5 + R() * .5), s: sprite(cols[(R() * cols.length) | 0], (R() * 6) | 0), a: .32, wash: true });
        stamps.push({ x: p.xs[i] + (R() - .5) * w * .25, y, r: w * (.75 + R() * .35), s: sprite(cols[(R() * 3) | 0], (R() * 6) | 0), a: .55 });
        if (i % 3 === 0) stamps.push({ x: p.xs[i] + (R() - .5) * w * .4, y: y + R() * 6, r: w * (.32 + R() * .2), s: sprite(cols[(R() * cols.length) | 0], (R() * 6) | 0), a: .6 });
        // drips running down from the edge of the stream
        if (i > 20 && R() < (mobile ? .03 : .045)) {
          const side = R() < .5 ? -1 : 1, x0 = p.xs[i] + side * w * (.35 + R() * .3), len = 40 + R() * (mobile ? 90 : 170);
          drips.push({ x: x0, y0: y, len, w: 3 + R() * (mobile ? 4 : 7), col: cols[(R() * 3) | 0], wob: (R() - .5) * 10 });
        }
      }
      return { p, stamps, cols };
    };
    drips = [];
    streams = [mk('a', mobile ? .22 : .24, TZ, 0), mk('b', mobile ? .8 : .78, LA, 2.2)];
    // the meeting: both colours spread into one pool and mix
    pool = [];
    const n = mobile ? 70 : 140;
    for (let i = 0; i < n; i++) {
      const u = i / n, spread = (mobile ? .42 : .34) * W * Math.sqrt(u), ang = R() * Math.PI;
      const x = W * .5 + Math.cos(ang) * spread * (R() < .5 ? -1 : 1), y = meetY + Math.sin(ang) * spread * .5 * (R() < .35 ? -.5 : 1) + u * 60;
      const fromTZ = x < W * .5 ? R() < .7 : R() < .3;
      pool.push({ x, y, r: (mobile ? 40 : 72) * (.6 + R() * .9), s: sprite((fromTZ ? TZ : LA)[(R() * 4) | 0], (R() * 6) | 0), a: .62, t: u });
    }
    built = true;
  }

  function front() { return reduce ? 1e9 : gy + H * .82; }

  function draw(dt) {
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    c.clearRect(0, 0, W, H);
    if (home.hidden || !built) return;
    const G = front(), top = sy - 160, bot = sy + H + 160;
    for (const st of streams) {
      for (const k of st.stamps) {
        if (k.y > G || k.y < top || k.y > bot) continue;
        // paint near the growing front is still wet: a little smaller and stronger
        const wet = Math.max(0, 1 - (G - k.y) / 220);
        const r = k.r * (1 - wet * .25);
        c.globalAlpha = k.a * (k.wash ? .55 : 1) * (1 - wet * .2);
        c.drawImage(k.s, k.x - r, k.y - sy - r, r * 2, r * 2);
      }
    }
    // drips
    for (const d of drips) {
      if (d.y0 > G || d.y0 > bot || d.y0 + d.len < top) continue;
      const grow = reduce ? 1 : Math.min(1, (G - d.y0) / (d.len * 2.2));
      const L = d.len * sm(grow), x = d.x, y = d.y0 - sy;
      c.globalAlpha = .5;
      c.strokeStyle = 'rgba(' + d.col + ',.75)'; c.lineWidth = d.w; c.lineCap = 'round';
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + d.wob, y + L * .5, x + d.wob * .4, y + L); c.stroke();
      c.globalAlpha = .8; c.fillStyle = 'rgba(' + d.col + ',.85)';
      c.beginPath(); c.ellipse(x + d.wob * .4, y + L + d.w * .3, d.w * .85, d.w * 1.05, 0, 0, 6.283); c.fill();
    }
    // mixing pool where the two streams meet
    if (G > meetY) {
      const k = Math.min(1, (G - meetY) / 520);
      for (const p of pool) {
        if (p.t > k) continue;
        const r = p.r * (.6 + .4 * Math.min(1, (k - p.t) * 4));
        c.globalAlpha = p.a;
        c.drawImage(p.s, p.x - r, p.y - sy - r, r * 2, r * 2);
      }
    }
    // the wet bead at the front of each stream
    if (!reduce) for (const st of streams) {
      const p = st.p; let i = 0; while (i < p.ys.length - 1 && p.ys[i + 1] <= G) i++;
      if (p.ys[i] > G || i >= p.ys.length - 1) continue;
      const x = p.xs[i], y = p.ys[i] - sy; if (y < -40 || y > H + 40) continue;
      const r = (mobile ? 16 : 26) * (1 + .06 * Math.sin(t * 2.4));
      c.globalAlpha = .75; c.drawImage(sprite(st.cols[0], 2), x - r, y - r * .8, r * 2, r * 2.3);
      c.globalAlpha = .35; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x - r * .25, y - r * .1, r * .18, r * .28, -.4, 0, 6.283); c.fill();
    }
    c.globalAlpha = 1;
  }

  function frame(ts) {
    const dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts; t += dt;
    const target = scrollY;
    if (reduce) { sy = gy = target; }
    else {
      sy += (target - sy) * (1 - Math.exp(-dt * 10));
      const d = sy - gy;
      // paint flows at its own pace: it eases after the scroll, never jumping ahead of it
      if (d > 0) gy += Math.min(d, Math.max(380 * dt, d * (1 - Math.exp(-dt * 1.6)))); else gy = sy;
    }
    draw(dt);
    requestAnimationFrame(frame);
  }

  let tm = 0;
  const rebuild = () => { clearTimeout(tm); tm = setTimeout(() => { build(); }, 120); };
  addEventListener('resize', rebuild);
  addEventListener('hashchange', () => { setTimeout(() => { build(); sy = gy = scrollY; }, 60); });
  if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(home);
  const start = () => { build(); sy = gy = scrollY; requestAnimationFrame(frame); };
  if (document.readyState === 'complete') start(); else addEventListener('load', start);
})();
