(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toast = $('#toast');
  let toastTimer;
  const showToast = m => { toast.textContent = m; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 1800); };

  /* nav */
  const nav = $('#site-nav'), menuBtn = $('#menu-toggle'), bar = $('.global-nav');
  const setMenu = o => { nav.classList.toggle('open', o); menuBtn.setAttribute('aria-expanded', String(o)); menuBtn.setAttribute('aria-label', o ? 'Close navigation' : 'Open navigation'); };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* small bits */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  const lt = $('#local-time');
  const tick = () => { if (lt) lt.textContent = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit' }).format(new Date()) + ' CT'; };
  tick(); setInterval(tick, 30000);
  $$('.filter-button').forEach(b => b.addEventListener('click', () => {
    $$('.filter-button').forEach(i => i.classList.toggle('active', i === b));
    $$('.publication-item').forEach(i => { i.hidden = b.dataset.filter !== 'all' && i.dataset.category !== b.dataset.filter; });
  }));
  $('#copy-email')?.addEventListener('click', async e => {
    const m = e.currentTarget.dataset.email;
    try { await navigator.clipboard.writeText(m); showToast('Email copied'); } catch { showToast(m); }
  });

  /* remembrance clock */
  const clock = $('#injustice-clock'), t0 = Date.parse('2025-12-12T08:25:00Z'), u = k => $(`[data-time-${k}]`);
  const tickClock = () => {
    let s = Math.max(0, Math.floor((Date.now() - t0) / 1000));
    const d = Math.floor(s / 86400); s %= 86400; const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); s %= 60;
    u('days').textContent = d; u('hours').textContent = String(h).padStart(2, '0'); u('minutes').textContent = String(m).padStart(2, '0'); u('seconds').textContent = String(s).padStart(2, '0');
    clock.setAttribute('aria-label', `${d} days, ${h} hours, ${m} minutes and ${s} seconds of injustice`);
  };
  if (clock) { tickClock(); setInterval(tickClock, 1000); }

  /* reveal on scroll */
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal').forEach(el => rio.observe(el));

  /* ---- the page runs the five-step error-correction cycle as you scroll ---- */
  const T = [
    { order: .55, noise: .04, syn: 0, match: 0, clean: 0 },
    { order: .5, noise: 1, syn: 0, match: 0, clean: 0 },
    { order: .85, noise: .15, syn: 1, match: 0, clean: 0 },
    { order: .92, noise: .06, syn: 1, match: 1, clean: 0 },
    { order: 1, noise: 0, syn: 0, match: 0, clean: 1 }
  ];
  let stage = 1, target = T[0];
  const ST = { ...T[0] };
  const dock = $('#dock'), dockLinks = $$('a', dock), pipeLinks = $$('.pipebar a');
  const setStage = n => {
    stage = n; target = T[n - 1]; document.body.dataset.stage = n;
    [...dockLinks, ...pipeLinks].forEach(a => a.classList.toggle('on', +a.dataset.go === n));
    if (reduce) { Object.assign(ST, target); drawBg(0); }
  };
  const stageEls = $$('[data-stage]').filter(e => e.tagName === 'SECTION');
  const secLinks = $$('.nav-link[data-section]'), secEls = secLinks.map(l => document.getElementById(l.dataset.section));
  const onScroll = () => {
    const y = scrollY, line = innerHeight * .45;
    bar.classList.toggle('solid', y > 40);
    dock.classList.toggle('show', y > innerHeight * .55);
    let cur = 1;
    stageEls.forEach(el => { if (el.getBoundingClientRect().top <= line) cur = +el.dataset.stage; });
    if (cur !== stage) setStage(cur);
    let act = 'profile';
    secEls.forEach(el => { if (el && el.getBoundingClientRect().top <= line) act = el.id; });
    secLinks.forEach(l => l.classList.toggle('active', l.dataset.section === act));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll(); setStage(stage);

  /* hero parallax */
  const hero = $('.hero');
  hero.addEventListener('pointermove', e => { const b = hero.getBoundingClientRect(); hero.style.setProperty('--px', ((e.clientX - b.left) / b.width - .5).toFixed(3)); hero.style.setProperty('--py', ((e.clientY - b.top) / b.height - .5).toFixed(3)); });

  /* background engine: a surface-code lattice that encodes, suffers noise, shows syndromes, matches them, and heals */
  const cv = $('#bg'), ctx = cv.getContext('2d');
  let W = 0, H = 0, nodes = [], cols = 0, rows = 0, stars = [], defects = [];
  const build = () => {
    const r = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight; cv.width = W * r; cv.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0);
    const gap = W < 700 ? 64 : 92;
    cols = Math.ceil(W / gap) + 1; rows = Math.ceil(H / gap) + 1;
    const x0 = (W - (cols - 1) * gap) / 2, y0 = (H - (rows - 1) * gap) / 2;
    nodes = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) nodes.push({ hx: x0 + i * gap, hy: y0 + j * gap, ph: Math.random() * 6.28, wx: (Math.random() - .5) * gap * 1.2, wy: (Math.random() - .5) * gap * 1.2, flash: 0 });
    defects = [];
    for (let k = 0; k < 3; k++) {
      const i = Math.floor(cols * (.5 + Math.random() * .4)), j = 1 + Math.floor(Math.random() * (rows - 3));
      const di = Math.random() < .5 ? 2 : 1, dj = di === 2 ? 0 : 1;
      defects.push(nodes[j * cols + Math.min(i, cols - 1)], nodes[Math.min(j + dj, rows - 1) * cols + Math.min(i + di, cols - 1)]);
    }
    stars = Array.from({ length: Math.round(W / 9) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: .3 + Math.random() * 1.1, p: Math.random() * 6.28, s: .5 + Math.random() * 1.5 }));
  };
  const pos = (n, t) => {
    const w = (1 - ST.order) * .6, sh = ST.noise * 7;
    n.x = n.hx + n.wx * w * Math.sin(t * .0004 + n.ph) + sh * Math.sin(t * .021 + n.ph * 3);
    n.y = n.hy + n.wy * w * Math.cos(t * .00035 + n.ph) + sh * Math.cos(t * .018 + n.ph * 2);
  };
  function drawBg(t) {
    for (const k in ST) ST[k] += (target[k] - ST[k]) * (reduce ? 1 : .04);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#d8f5ee';
    stars.forEach(s => { ctx.globalAlpha = .12 + .4 * (.5 + .5 * Math.sin(t * .0008 * s.s + s.p)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill(); });
    nodes.forEach(n => pos(n, t));
    const side = x => W < 900 ? .55 : .25 + .75 * Math.min(1, Math.max(0, (x / W - .25) / .5));
    ctx.lineWidth = 1;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const n = nodes[j * cols + i];
      [[i + 1, j], [i, j + 1]].forEach(([a, b]) => {
        if (a >= cols || b >= rows) return;
        const m = nodes[b * cols + a];
        ctx.globalAlpha = (.04 + .16 * ST.order * ST.order) * side(n.x);
        ctx.strokeStyle = '#8cebdc'; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
      });
    }
    nodes.forEach(n => {
      if (!reduce && Math.random() < ST.noise * .0035) n.flash = 1;
      n.flash *= .965;
      const wave = ST.clean * (.5 + .5 * Math.sin(Math.hypot(n.hx - W / 2, n.hy - H / 2) * .02 - t * .003));
      const a = side(n.x);
      ctx.globalAlpha = Math.min(1, (.25 + .35 * ST.order + .5 * wave) * a);
      ctx.fillStyle = '#8cebdc'; ctx.beginPath(); ctx.arc(n.x, n.y, 2 + 1.4 * wave, 0, 6.283); ctx.fill();
      if (n.flash > .05) {
        ctx.globalAlpha = n.flash * .9; ctx.fillStyle = '#fb923c'; ctx.beginPath(); ctx.arc(n.x, n.y, 3 + 6 * n.flash, 0, 6.283); ctx.fill();
      }
    });
    if (ST.syn > .02) defects.forEach((n, k) => {
      const pulse = (t * .0015 + k) % 1.6;
      ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.6;
      ctx.globalAlpha = ST.syn * (1 - pulse / 1.6); ctx.beginPath(); ctx.arc(n.x, n.y, 6 + pulse * 16, 0, 6.283); ctx.stroke();
      ctx.globalAlpha = ST.syn * .95; ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, 6.283); ctx.fill();
    });
    if (ST.match > .02) {
      ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 2.4; ctx.setLineDash([7, 6]); ctx.lineDashOffset = -t * .03; ctx.globalAlpha = ST.match * .9;
      for (let k = 0; k < defects.length; k += 2) { ctx.beginPath(); ctx.moveTo(defects[k].x, defects[k].y); ctx.lineTo(defects[k + 1].x, defects[k + 1].y); ctx.stroke(); }
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(drawBg);
  }
  build(); addEventListener('resize', () => { build(); if (reduce) drawBg(0); });
  requestAnimationFrame(drawBg);

  /* smooth jump from hero pipeline bar and dock */
  $$('[data-go]').forEach(a => a.addEventListener('click', e => {
    const el = document.getElementById('stage-' + a.dataset.go); if (!el) return;
    e.preventDefault(); el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }));

  /* ---- Surface-code decoder demo: distance 5, rotated layout, bit-flip errors ---- */
  const svg = $('#lattice');
  if (!svg) return;
  const D = 5, P = 64, O = 48, NS = 'http://www.w3.org/2000/svg';
  const el = (n, a = {}, p = svg) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; };

  // Z-type stabiliser faces (detect X errors): checkerboard bulk + weight-2 faces on top/bottom edges.
  const faces = [], xfaces = [];
  for (let i = -1; i <= D - 1; i++) for (let j = 0; j <= D - 2; j++) {
    const qs = [[i, j], [i, j + 1], [i + 1, j], [i + 1, j + 1]].filter(([r, c]) => r >= 0 && r < D && c >= 0 && c < D).map(([r, c]) => r * D + c);
    const isBulk = i >= 0 && i <= D - 2;
    if ((i + j) % 2 === 0) faces.push({ i, j, qs }); else if (isBulk) xfaces.push({ i, j });
  }
  const mask = Array(D * D).fill(0);
  faces.forEach((f, k) => f.qs.forEach(q => mask[q] |= 1 << k));

  const faceRect = (f, cls) => {
    const x = O + P * f.j, y = O + P * f.i;
    if (f.i === -1) return el('rect', { x, y: y + P / 2, width: P, height: P / 2, rx: 4, class: cls });
    if (f.i === D - 1) return el('rect', { x, y, width: P, height: P / 2, rx: 4, class: cls });
    return el('rect', { x, y, width: P, height: P, class: cls });
  };
  xfaces.forEach(f => faceRect(f, 'xf'));
  const zEls = faces.map(f => faceRect(f, 'zf'));

  const qEls = [];
  for (let r = 0; r < D; r++) for (let c = 0; c < D; c++) {
    const q = r * D + c;
    const g = el('g', { class: 'q', tabindex: 0, role: 'button', 'aria-pressed': 'false', 'aria-label': `Data qubit row ${r + 1}, column ${c + 1}` });
    el('circle', { cx: O + P * c, cy: O + P * r, r: 13, class: 'ring' }, g);
    el('circle', { cx: O + P * c, cy: O + P * r, r: 9, class: 'dot' }, g);
    const flip = () => { err[q] ^= 1; update(); };
    g.addEventListener('click', flip);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
    qEls.push(g);
  }
  const err = Array(D * D).fill(0);

  const syndrome = () => err.reduce((s, e, q) => e ? s ^ mask[q] : s, 0);
  const search = (start, left, acc, target, picked) => {
    if (!left) return acc === target ? picked : null;
    for (let q = start; q <= D * D - left; q++) {
      const r = search(q + 1, left - 1, acc ^ mask[q], target, [...picked, q]);
      if (r) return r;
    }
    return null;
  };
  const decode = s => { if (!s) return []; for (let w = 1; w <= 6; w++) { const r = search(0, w, 0, s, []); if (r) return r; } return null; };

  const status = $('#lattice-status');
  function update() {
    const s = syndrome();
    const corr = decode(s);
    qEls.forEach((g, q) => { g.classList.toggle('err', !!err[q]); g.setAttribute('aria-pressed', String(!!err[q])); g.classList.toggle('fix', !!corr && corr.includes(q)); });
    zEls.forEach((z, k) => z.classList.toggle('hot', !!(s >> k & 1)));
    const n = err.reduce((a, b) => a + b, 0), defects = faces.filter((_, k) => s >> k & 1).length;
    status.className = 'lattice-status';
    if (!n) { status.textContent = 'No errors. Select a qubit to inject a bit-flip.'; return; }
    if (!corr) { status.textContent = `${n} errors, ${defects} defects: too many for this demo to decode.`; status.classList.add('bad'); return; }
    const residual = err.map((e, q) => e ^ (corr.includes(q) ? 1 : 0));
    const logical = [0, 1, 2, 3, 4].reduce((a, r) => a ^ residual[r * D], 0);
    status.classList.add(logical ? 'bad' : 'ok');
    if (!corr.length) { status.textContent = `${n} errors, no defects: the pattern is invisible to the stabilizers, so the decoder does nothing. ` + (logical ? 'It is a logical flip.' : 'It is harmless (a stabilizer).'); return; }
    status.textContent = `${n} error${n > 1 ? 's' : ''}, ${defects} defect${defects === 1 ? '' : 's'}. Decoder flips ${corr.length} qubit${corr.length === 1 ? '' : 's'} (teal rings). ` +
      (logical ? 'Residual error is a logical flip: decoding failed.' : 'Logical qubit preserved.');
  }
  $('#lat-clear')?.addEventListener('click', () => { err.fill(0); update(); });
  $('#lat-random')?.addEventListener('click', () => {
    err.fill(0);
    const k = 2 + Math.floor(Math.random() * 3);
    while (err.reduce((a, b) => a + b, 0) < k) err[Math.floor(Math.random() * D * D)] = 1;
    update();
  });
  // start with a small example so the page opens with the idea visible
  [7, 12].forEach(q => err[q] = 1);
  update();
})();
