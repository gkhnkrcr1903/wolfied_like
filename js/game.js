(() => {
  const FREE = 0, CLAIM = 1, TRAIL = 2;
  const $ = s => document.querySelector(s);

  const BUGS = [
    { body: ['#ff6b5e', '#b5160c'], head: '#1b1b1b', spots: '#141414', leg: '#1b1b1b' },
    { body: ['#8dffa0', '#0d7a3c'], head: '#0a3d20', stripe: '#e8ff9a', leg: '#0a3d20' },
    { body: ['#ffe14d', '#d99a00'], head: '#222', bands: '#222', leg: '#222' },
    { body: ['#8fd8ff', '#1747a6'], head: '#0b1f4d', spots: '#e8f6ff', leg: '#0b1f4d' },
    { body: ['#e0a3ff', '#6a1fa6'], head: '#2e0a4d', stripe: '#ffd6ff', leg: '#2e0a4d' },
    { body: ['#ffb36b', '#c2410c'], head: '#3a0f00', spots: '#3a0f00', leg: '#3a0f00' },
    { body: ['#c8fff4', '#14b8a6'], head: '#064e47', spots: '#ffffff', leg: '#064e47' },
    { body: ['#fff0a0', '#b8860b'], head: '#4a2c00', stripe: '#ff4d4d', leg: '#4a2c00' },
    { body: ['#f2f7ff', '#7b93b8'], head: '#1c2638', spots: '#2b3a55', leg: '#1c2638' },
    { body: ['#ff8fd0', '#b0127a'], head: '#3d0029', bands: '#3d0029', leg: '#3d0029' },
  ];
  // Kolaydan zora: böcek sayısı, hız, kenar kıvılcımı (sparx) ve hedef yüzde artıyor.
  const LEVELS = [
    { name: 'Gün Batımı Vadisi', bugs: 1, speed: 13, sparx: 0, target: 72, styles: [0] },
    { name: 'Mercan Resifi', bugs: 2, speed: 15, sparx: 0, target: 74, styles: [3, 6] },
    { name: 'Sakura Bahçesi', bugs: 2, speed: 17, sparx: 1, target: 75, styles: [0, 4] },
    { name: 'Kuzey Işıkları', bugs: 3, speed: 18, sparx: 1, target: 76, styles: [1, 3] },
    { name: 'Çöl Piramitleri', bugs: 3, speed: 20, sparx: 1, target: 77, styles: [2, 5] },
    { name: 'Neon Şehir', bugs: 3, speed: 22, sparx: 2, target: 78, styles: [4, 6] },
    { name: 'Büyülü Orman', bugs: 4, speed: 23, sparx: 2, target: 79, styles: [1, 2] },
    { name: 'Uzay Nebulası', bugs: 4, speed: 25, sparx: 2, target: 80, styles: [3, 4, 6] },
    { name: 'Volkan Adası', bugs: 5, speed: 26, sparx: 3, target: 81, styles: [5, 0, 2] },
    { name: 'Kristal Mağara', bugs: 3, speed: 27, sparx: 3, target: 82, styles: [6, 4], boss: true },
    { name: 'Karlı Köy', bugs: 4, speed: 27, sparx: 3, target: 82, styles: [8, 3] },
    { name: 'Lavanta Tarlası', bugs: 5, speed: 28, sparx: 3, target: 83, styles: [4, 9] },
    { name: 'Gökkuşağı Şelalesi', bugs: 5, speed: 29, sparx: 3, target: 83, styles: [2, 6, 8] },
    { name: 'Ay Işığında Göl', bugs: 5, speed: 30, sparx: 4, target: 84, styles: [3, 1] },
    { name: 'Bulut Kalesi', bugs: 4, speed: 30, sparx: 4, target: 84, styles: [9, 4], boss: true },
    { name: 'Sonbahar Ormanı', bugs: 6, speed: 31, sparx: 4, target: 85, styles: [5, 0, 2] },
    { name: 'Buzul Denizi', bugs: 6, speed: 32, sparx: 4, target: 85, styles: [8, 6] },
    { name: 'Tropik Ada', bugs: 6, speed: 33, sparx: 5, target: 86, styles: [1, 2, 9] },
    { name: 'Galaksi Girdabı', bugs: 7, speed: 34, sparx: 5, target: 87, styles: [4, 3, 6] },
    { name: 'Altın Tapınak', bugs: 5, speed: 35, sparx: 5, target: 88, styles: [5, 2, 0], boss: true },
  ];

  const cv = $('#cv'), ctx = cv.getContext('2d');
  const coverCv = document.createElement('canvas'), cctx = coverCv.getContext('2d');
  const maskCv = document.createElement('canvas'), mctx = maskCv.getContext('2d');
  const coverPattern = (() => {
    const p = document.createElement('canvas'); p.width = p.height = 24; const g = p.getContext('2d');
    g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, 24); g.lineTo(24, 0); g.stroke();
    g.fillStyle = 'rgba(140,170,255,0.08)'; g.beginPath(); g.arc(12, 12, 2, 0, 7); g.fill();
    return ctx.createPattern(p, 'repeat');
  })();

  let GW, GH, grid, lvIdx = 0, level, bg, enemies, sparx, player, particles = [], score = 0, lives = 3;
  let state = 'menu', levelTime = 0, coverAlpha = 1, pct = 0, interior = 1, invuln = 0, time = 0, cell = 4;
  let customImg = null, unlocked = 1;
  try { unlocked = Math.max(1, parseInt(localStorage.getItem('drawandsee_unlocked')) || 1); } catch (e) {}

  // ---------- Ses ----------
  let ac = null;
  function sfx(type) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { fill: [523, 784], kill: [880, 1320], die: [300, 120], win: [523, 659, 784, 1047], step: [0] }[type];
      notes.forEach((f, i) => {
        if (!f) return;
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * 0.09;
        o.type = type === 'die' ? 'sawtooth' : 'triangle'; o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.2);
      });
    } catch (e) {}
  }

  // ---------- Izgara yardımcıları ----------
  const I = (x, y) => y * GW + x;
  const inb = (x, y) => x >= 0 && y >= 0 && x < GW && y < GH;
  function isEdge(x, y) {
    if (!inb(x, y) || grid[I(x, y)] !== CLAIM) return false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if (inb(nx, ny) && grid[I(nx, ny)] !== CLAIM) return true;
    }
    return false;
  }

  function makeBg() {
    const W = GW * 8, H = GH * 8;
    if (!customImg) return Scenes.draw(lvIdx, W, H);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'), s = Math.max(W / customImg.width, H / customImg.height);
    g.drawImage(customImg, (W - customImg.width * s) / 2, (H - customImg.height * s) / 2, customImg.width * s, customImg.height * s);
    return c;
  }

  // ---------- Bölüm başlatma ----------
  function startLevel(i) {
    lvIdx = i; level = LEVELS[i];
    const portrait = window.innerHeight > window.innerWidth * 1.1;
    GW = portrait ? 100 : 160; GH = portrait ? 150 : 100;
    grid = new Uint8Array(GW * GH);
    for (let x = 0; x < GW; x++) { grid[I(x, 0)] = CLAIM; grid[I(x, GH - 1)] = CLAIM; }
    for (let y = 0; y < GH; y++) { grid[I(0, y)] = CLAIM; grid[I(GW - 1, y)] = CLAIM; }
    interior = (GW - 2) * (GH - 2);
    maskCv.width = GW; maskCv.height = GH;
    bg = makeBg();
    player = { x: GW >> 1, y: GH - 1, drawing: false, trail: [], sx: 0, sy: 0, acc: 0 };
    enemies = []; sparx = []; particles = [];
    const n = level.bugs;
    for (let k = 0; k < n; k++) {
      const boss = level.boss && k === 0;
      const r = boss ? 6 : 3.2;
      const a = Math.random() * Math.PI * 2, sp = level.speed * (boss ? 0.75 : 0.85 + Math.random() * 0.3);
      enemies.push({
        x: r + 2 + Math.random() * (GW - 2 * r - 4), y: r + 2 + Math.random() * (GH * 0.6 - 2 * r),
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r, boss, style: BUGS[boss ? 7 : level.styles[k % level.styles.length]], ph: Math.random() * 9
      });
    }
    for (let k = 0; k < level.sparx; k++) {
      const x = Math.floor(GW * (k + 1) / (level.sparx + 1));
      sparx.push({ x, y: 0, px: x - 1, py: 0, acc: 0 });
    }
    lives = 3; invuln = 1.5; levelTime = 0; coverAlpha = 1; state = 'play';
    hideOverlay(); showScreen('game'); layout(); updateHud();
  }

  // ---------- Kapak (açılmamış alan) ----------
  function rebuildCover() {
    if (!grid) return;
    const id = mctx.createImageData(GW, GH), d = id.data;
    let claimed = 0;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] !== CLAIM) d[i * 4 + 3] = 255; else claimed++;
    }
    mctx.putImageData(id, 0, 0);
    pct = Math.min(100, Math.max(0, (claimed - (GW * GH - interior)) / interior * 100));
    const W = coverCv.width = cv.width, H = coverCv.height = cv.height;
    const gr = cctx.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#1d2350'); gr.addColorStop(1, '#0a0c1f');
    cctx.fillStyle = gr; cctx.fillRect(0, 0, W, H);
    cctx.fillStyle = coverPattern; cctx.fillRect(0, 0, W, H);
    cctx.globalCompositeOperation = 'destination-in';
    cctx.imageSmoothingEnabled = false; cctx.drawImage(maskCv, 0, 0, W, H);
    cctx.globalCompositeOperation = 'source-over';
    cctx.fillStyle = 'rgba(120,230,255,0.9)';
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) if (isEdge(x, y)) cctx.fillRect(x * cell, y * cell, cell + 0.5, cell + 0.5);
  }

  // ---------- Hareket ----------
  function tryMove(dx, dy) {
    const p = player, nx = p.x + dx, ny = p.y + dy;
    if (!inb(nx, ny)) return;
    const i = I(nx, ny), c = grid[i];
    if (!p.drawing) {
      if (c === CLAIM) { if (isEdge(nx, ny) || !isEdge(p.x, p.y)) { p.x = nx; p.y = ny; } }
      else if (c === FREE) { p.drawing = true; p.sx = p.x; p.sy = p.y; p.trail = []; mark(i, nx, ny); }
    } else {
      const t = p.trail;
      if (c === TRAIL) {
        if (t.length >= 2 && i === t[t.length - 2]) { grid[t.pop()] = FREE; p.x = nx; p.y = ny; }
      } else if (c === FREE) mark(i, nx, ny);
      else if (c === CLAIM) {
        if (t.length === 1 && nx === p.sx && ny === p.sy) { grid[t.pop()] = FREE; p.drawing = false; p.x = nx; p.y = ny; return; }
        p.x = nx; p.y = ny; closeTrail();
      }
    }
  }
  function mark(i, x, y) { grid[i] = TRAIL; player.trail.push(i); player.x = x; player.y = y; }

  function closeTrail() {
    const p = player;
    for (const i of p.trail) grid[i] = CLAIM;
    p.drawing = false; p.trail = [];
    const reg = new Int32Array(GW * GH).fill(-1), sizes = [], stack = [];
    for (let s = 0; s < grid.length; s++) {
      if (grid[s] !== FREE || reg[s] >= 0) continue;
      const id = sizes.length; let n = 0; reg[s] = id; stack.push(s);
      while (stack.length) {
        const q = stack.pop(); n++;
        const x = q % GW, y = (q / GW) | 0;
        const nb = [x > 0 ? q - 1 : -1, x < GW - 1 ? q + 1 : -1, y > 0 ? q - GW : -1, y < GH - 1 ? q + GW : -1];
        for (const v of nb) if (v >= 0 && grid[v] === FREE && reg[v] < 0) { reg[v] = id; stack.push(v); }
      }
      sizes.push(n);
    }
    const eReg = enemies.map(e => reg[I(Math.floor(e.x), Math.floor(e.y))]);
    // Böceği olan en büyük bölge açık kalır; böceksiz ve küçük bölgeler açılır, içlerindeki böcekler yok olur.
    let keep = -1;
    eReg.forEach(r => { if (r >= 0 && (keep < 0 || sizes[r] > sizes[keep])) keep = r; });
    if (keep < 0) sizes.forEach((s, r) => { if (keep < 0 || s > sizes[keep]) keep = r; });
    let gained = 0;
    for (let i = 0; i < grid.length; i++) if (grid[i] === FREE && reg[i] !== keep) { grid[i] = CLAIM; gained++; }
    score += Math.round(gained * (1 + lvIdx * 0.2));
    const alive = [];
    enemies.forEach((e, k) => {
      if (eReg[k] === keep && eReg[k] >= 0) alive.push(e);
      else { burst(e.x * cell, e.y * cell, e.style.body[0], 40); score += e.boss ? 2000 : 500; sfx('kill'); }
    });
    enemies = alive;
    sfx('fill');
    rebuildCover();
    updateHud();
    if (pct >= level.target || enemies.length === 0) win();
  }

  function die() {
    if (invuln > 0 || state !== 'play') return;
    const p = player;
    burst(p.x * cell, p.y * cell, '#ffffff', 50); sfx('die');
    for (const i of p.trail) grid[i] = FREE;
    if (p.drawing) { p.x = p.sx; p.y = p.sy; }
    p.drawing = false; p.trail = [];
    lives--; invuln = 2; updateHud();
    if (lives <= 0) { state = 'over'; setTimeout(() => showOverlay('over'), 700); }
  }

  function win() {
    state = 'win';
    for (let i = 0; i < grid.length; i++) grid[i] = CLAIM;
    pct = 100;
    enemies.forEach(e => burst(e.x * cell, e.y * cell, e.style.body[0], 30));
    enemies = []; sparx = [];
    score += lives * 1000;
    if (lvIdx + 2 > unlocked) { unlocked = Math.min(LEVELS.length, lvIdx + 2); try { localStorage.setItem('drawandsee_unlocked', unlocked); } catch (e) {} }
    sfx('win'); confetti(); updateHud();
    setTimeout(() => showOverlay('win'), 1300);
  }

  // ---------- Güncelleme ----------
  function blocked(x, y) { const ix = Math.floor(x), iy = Math.floor(y); return !inb(ix, iy) || grid[I(ix, iy)] === CLAIM; }

  function update(dt) {
    time += dt; levelTime += dt;
    if (invuln > 0) invuln -= dt;
    const d = currentDir();
    const p = player;
    if (d) {
      p.acc += dt;
      const step = 1 / 24;
      while (p.acc >= step) { p.acc -= step; tryMove(d[0], d[1]); if (state !== 'play') return; }
    } else p.acc = 0;

    for (const e of enemies) {
      if (Math.random() < dt * 0.6) {
        const a = Math.atan2(e.vy, e.vx) + (Math.random() - 0.5) * 1.2, sp = Math.hypot(e.vx, e.vy);
        e.vx = Math.cos(a) * sp; e.vy = Math.sin(a) * sp;
      }
      const ramp = 1 + Math.min(0.5, levelTime * 0.008);
      const R = e.r * 0.8, nx = e.x + e.vx * dt * ramp, ny = e.y + e.vy * dt * ramp;
      if (blocked(nx + Math.sign(e.vx) * R, e.y)) e.vx *= -1; else e.x = nx;
      if (blocked(e.x, ny + Math.sign(e.vy) * R)) e.vy *= -1; else e.y = ny;
      if (p.drawing && invuln <= 0) {
        const rr = e.r * e.r;
        if ((p.x + 0.5 - e.x) ** 2 + (p.y + 0.5 - e.y) ** 2 < rr) { die(); return; }
        for (const i of p.trail) {
          const tx = i % GW + 0.5, ty = ((i / GW) | 0) + 0.5;
          if ((tx - e.x) ** 2 + (ty - e.y) ** 2 < rr) { die(); return; }
        }
      }
    }

    for (const s of sparx) {
      s.acc += dt;
      const step = 1 / (10 + lvIdx * 0.9);
      while (s.acc >= step) { s.acc -= step; sparxStep(s); }
      if (!p.drawing && invuln <= 0 && Math.abs(s.x - p.x) <= 1 && Math.abs(s.y - p.y) <= 1) { die(); return; }
    }
  }

  function sparxStep(s) {
    if (!isEdge(s.x, s.y)) relocate(s);
    const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => {
      const x = s.x + dx, y = s.y + dy; return isEdge(x, y) && !(x === s.px && y === s.py);
    });
    let nx = s.px, ny = s.py;
    if (opts.length) {
      const fdx = s.x - s.px, fdy = s.y - s.py;
      const straight = opts.find(o => o[0] === fdx && o[1] === fdy);
      const o = straight && Math.random() < 0.75 ? straight : opts[Math.random() * opts.length | 0];
      nx = s.x + o[0]; ny = s.y + o[1];
    }
    s.px = s.x; s.py = s.y; s.x = nx; s.y = ny;
  }
  function relocate(s) {
    const seen = new Uint8Array(GW * GH), q = [I(s.x, s.y)]; seen[q[0]] = 1;
    for (let h = 0; h < q.length; h++) {
      const v = q[h], x = v % GW, y = (v / GW) | 0;
      if (isEdge(x, y)) { s.x = s.px = x; s.y = s.py = y; return; }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (inb(nx, ny) && !seen[I(nx, ny)]) { seen[I(nx, ny)] = 1; q.push(I(nx, ny)); }
      }
    }
  }

  // ---------- Parçacıklar ----------
  function burst(x, y, col, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = (40 + Math.random() * 220) * cell / 5;
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.6 + Math.random() * 0.6, max: 1.2, col, size: cell * (0.4 + Math.random() * 0.8), g: 0 });
    }
  }
  function confetti() {
    const cols = ['#ff5e7e', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ffffff'];
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * cv.width, y: -Math.random() * cv.height * 0.5, vx: (Math.random() - 0.5) * 80, vy: 80 + Math.random() * 160,
        life: 3 + Math.random() * 2, max: 5, col: cols[i % cols.length], size: cell * (1 + Math.random()), g: 1, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 10
      });
    }
  }

  // ---------- Çizim ----------
  function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f))));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }
  function drawBug(x, y, R, ang, t, st, boss) {
    const winged = !!(st.bands || boss);
    ctx.save(); ctx.translate(x, y);
    // yere düşen gölge
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(R * 0.15, R * 0.3, R * 1.25, R * 0.95, ang, 0, 7); ctx.fill();
    ctx.rotate(ang);
    if (boss) {
      const pulse = 1 + Math.sin(t * 5) * 0.15;
      const g0 = ctx.createRadialGradient(0, 0, R * 0.5, 0, 0, R * 2.2 * pulse);
      g0.addColorStop(0, 'rgba(255,220,90,0.45)'); g0.addColorStop(1, 'rgba(255,220,90,0)');
      ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(0, 0, R * 2.2 * pulse, 0, 7); ctx.fill();
    }
    const dark = st.leg, lw = Math.max(1, R * 0.09);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // eklemli bacaklar (uyluk + kaval), tripod yürüyüşü
    for (let i = 0; i < 3; i++) for (const side of [-1, 1]) {
      const phase = Math.sin(t * 18 + (i % 2 ? Math.PI : 0) + (side > 0 ? Math.PI : 0));
      const bx = R * (0.35 - i * 0.38), by = side * R * 0.35;
      const kx = bx + R * (0.15 - i * 0.12) + phase * R * 0.12, ky = side * R * 0.95;
      const fx = kx + R * (0.3 - i * 0.35) + phase * R * 0.15, fy = side * R * 1.3;
      ctx.strokeStyle = dark; ctx.lineWidth = lw * 1.5;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(kx, ky); ctx.stroke();
      ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(kx, ky, lw * 0.9, 0, 7); ctx.fill();
    }
    // segmentli antenler, uçları topuzlu
    ctx.strokeStyle = dark; ctx.lineWidth = lw * 0.8;
    for (const side of [-1, 1]) {
      const sw = Math.sin(t * 7 + side) * R * 0.12;
      const p1x = R * 1.25, p1y = side * R * 0.3, p2x = R * 1.6, p2y = side * R * 0.65 + sw;
      ctx.beginPath(); ctx.moveTo(R * 1.0, side * R * 0.12); ctx.quadraticCurveTo(p1x, p1y, p2x, p2y); ctx.stroke();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(p2x, p2y, R * 0.11, R * 0.07, side * 0.6, 0, 7); ctx.fill();
    }
    // baş
    const hg = ctx.createRadialGradient(R * 0.9, -R * 0.12, R * 0.05, R * 0.85, 0, R * 0.4);
    hg.addColorStop(0, shade(st.head, 0.35)); hg.addColorStop(1, st.head);
    ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(R * 0.88, 0, R * 0.3, R * 0.33, 0, 0, 7); ctx.fill();
    // çeneler
    ctx.strokeStyle = dark; ctx.lineWidth = lw;
    for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(R * 1.1, side * R * 0.1); ctx.quadraticCurveTo(R * 1.28, side * R * 0.14, R * 1.25, side * R * 0.02); ctx.stroke(); }
    // bileşik gözler
    for (const side of [-1, 1]) {
      const eg = ctx.createRadialGradient(R * 0.98, side * R * 0.2 - R * 0.03, 0, R * 0.98, side * R * 0.2, R * 0.13);
      eg.addColorStop(0, '#ffffff'); eg.addColorStop(0.35, boss ? '#ff3b3b' : '#3a3a3a'); eg.addColorStop(1, '#000');
      ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(R * 0.98, side * R * 0.2, R * 0.13, 0, 7); ctx.fill();
    }
    // göğüs (pronotum)
    const pg = ctx.createLinearGradient(R * 0.4, -R * 0.5, R * 0.4, R * 0.5);
    pg.addColorStop(0, shade(st.head, 0.3)); pg.addColorStop(0.5, st.head); pg.addColorStop(1, shade(st.head, -0.4));
    ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(R * 0.5, 0, R * 0.32, R * 0.55, 0, 0, 7); ctx.fill();
    // kanat kabukları (elytra)
    const ex = -R * 0.18, eRx = R * 0.9, eRy = R * 0.8;
    const bodyPath = () => { ctx.beginPath(); ctx.ellipse(ex, 0, eRx, eRy, 0, 0, 7); };
    ctx.save(); bodyPath(); ctx.clip();
    const bg = ctx.createRadialGradient(ex + R * 0.1, -R * 0.35, R * 0.05, ex, 0, R * 1.1);
    bg.addColorStop(0, shade(st.body[0], 0.45)); bg.addColorStop(0.45, st.body[0]); bg.addColorStop(1, st.body[1]);
    ctx.fillStyle = bg; ctx.fillRect(-R * 2, -R * 2, R * 4, R * 4);
    if (st.bands) {
      ctx.fillStyle = st.bands;
      for (let i = 0; i < 3; i++) { const bx = ex + R * (0.35 - i * 0.42); ctx.beginPath(); ctx.ellipse(bx, 0, R * 0.12, R, 0, 0, 7); ctx.fill(); }
    }
    if (st.spots) {
      [[0.15, 0.42, 0.17], [-0.35, 0.3, 0.15], [0.15, -0.42, 0.17], [-0.35, -0.3, 0.15], [-0.75, 0.2, 0.12], [-0.75, -0.2, 0.12], [0.45, 0, 0.12]].forEach(([a, b, s]) => {
        const sg = ctx.createRadialGradient(ex + a * R - s * R * 0.3, b * R - s * R * 0.3, 0, ex + a * R, b * R, s * R);
        sg.addColorStop(0, shade(st.spots, 0.25)); sg.addColorStop(1, st.spots);
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(ex + a * R, b * R, s * R, 0, 7); ctx.fill();
      });
    }
    if (st.stripe) {
      ctx.strokeStyle = st.stripe; ctx.lineWidth = R * 0.09;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(ex + R * 0.7, s * R * 0.42); ctx.quadraticCurveTo(ex, s * R * 0.62, ex - R * 0.75, s * R * 0.15); ctx.stroke(); }
    }
    // kenar karartma + parlama
    const vg = ctx.createRadialGradient(ex, 0, R * 0.55, ex, 0, R);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.35)');
    ctx.fillStyle = vg; ctx.fillRect(-R * 2, -R * 2, R * 4, R * 4);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.ellipse(ex + R * 0.15, -R * 0.42, R * 0.38, R * 0.11, -0.15, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.ellipse(ex + R * 0.3, -R * 0.45, R * 0.1, R * 0.04, -0.15, 0, 7); ctx.fill();
    ctx.restore();
    // orta dikiş ve dış hat
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = Math.max(1, R * 0.05);
    ctx.beginPath(); ctx.moveTo(ex + eRx * 0.92, 0); ctx.lineTo(ex - eRx, 0); ctx.stroke();
    bodyPath(); ctx.stroke();
    // şeffaf, çırpan kanatlar
    if (winged) {
      const flap = 0.35 + Math.abs(Math.sin(t * 40)) * 0.5;
      for (const side of [-1, 1]) {
        ctx.save(); ctx.translate(R * 0.3, side * R * 0.2); ctx.rotate(side * (Math.PI - flap));
        const wg = ctx.createLinearGradient(0, 0, R * 1.3, 0);
        wg.addColorStop(0, 'rgba(220,240,255,0.55)'); wg.addColorStop(1, 'rgba(200,230,255,0.15)');
        ctx.fillStyle = wg; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = Math.max(1, R * 0.03);
        ctx.beginPath(); ctx.ellipse(R * 0.65, 0, R * 0.7, R * 0.24, 0, 0, 7); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(R * 0.05, 0); ctx.lineTo(R * 1.2, -R * 0.05); ctx.moveTo(R * 0.4, 0); ctx.lineTo(R * 0.9, R * 0.15); ctx.stroke();
        ctx.restore();
      }
    }
    if (boss) { // taç
      ctx.save(); ctx.translate(R * 0.75, 0); ctx.rotate(Math.PI / 2);
      ctx.fillStyle = '#ffd700'; ctx.strokeStyle = '#8a6d00'; ctx.lineWidth = Math.max(1, R * 0.04);
      const w = R * 0.5, h = R * 0.35;
      ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.lineTo(-w / 2, -h); ctx.lineTo(-w / 4, -h * 0.55); ctx.lineTo(0, -h * 1.2); ctx.lineTo(w / 4, -h * 0.55); ctx.lineTo(w / 2, -h); ctx.lineTo(w / 2, 0); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ff3b6b'; ctx.beginPath(); ctx.arc(0, -h * 0.35, R * 0.06, 0, 7); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function render(dt) {
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    if (!grid) return;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(bg, 0, 0, W, H);
    if (state === 'win') coverAlpha = Math.max(0, coverAlpha - dt * 0.9);
    if (coverAlpha > 0) { ctx.globalAlpha = coverAlpha; ctx.drawImage(coverCv, 0, 0); ctx.globalAlpha = 1; }

    const p = player;
    if (p.drawing && p.trail.length) {
      ctx.save(); ctx.strokeStyle = '#ffe066'; ctx.shadowColor = '#ffb703'; ctx.shadowBlur = cell * 2;
      ctx.lineWidth = cell * 0.7; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo((p.sx + 0.5) * cell, (p.sy + 0.5) * cell);
      for (const i of p.trail) ctx.lineTo((i % GW + 0.5) * cell, (((i / GW) | 0) + 0.5) * cell);
      ctx.stroke(); ctx.restore();
    }

    for (const e of enemies) drawBug(e.x * cell, e.y * cell, e.r * cell, Math.atan2(e.vy, e.vx), time + e.ph, e.style, e.boss);

    for (const s of sparx) {
      const x = (s.x + 0.5) * cell, y = (s.y + 0.5) * cell, r = cell * (1.6 + Math.sin(time * 20) * 0.4);
      ctx.save(); ctx.shadowColor = '#ff3b6b'; ctx.shadowBlur = cell * 3; ctx.fillStyle = '#ff5c8a';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + time * 8, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
      ctx.fill(); ctx.restore();
    }

    if (state === 'play' || state === 'over') {
      if (!(invuln > 0 && Math.floor(time * 10) % 2)) {
        const x = (p.x + 0.5) * cell, y = (p.y + 0.5) * cell, r = cell * 1.4;
        ctx.save(); ctx.shadowColor = '#7df9ff'; ctx.shadowBlur = cell * 3;
        ctx.strokeStyle = 'rgba(125,249,255,0.7)'; ctx.lineWidth = cell * 0.35;
        ctx.beginPath(); ctx.arc(x, y, r * (1.5 + Math.sin(time * 6) * 0.25), 0, 7); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.fill();
        ctx.restore();
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const q = particles[i];
      q.life -= dt; if (q.life <= 0) { particles.splice(i, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.g) { q.rot += q.vr * dt; q.vx += Math.sin(time * 3 + i) * 20 * dt; } else { q.vx *= 0.94; q.vy *= 0.94; }
      ctx.globalAlpha = Math.min(1, q.life / 0.5); ctx.fillStyle = q.col;
      if (q.g) { ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillRect(-q.size / 2, -q.size / 4, q.size, q.size / 2); ctx.restore(); }
      else { ctx.beginPath(); ctx.arc(q.x, q.y, q.size, 0, 7); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (state === 'play') update(dt); else time += dt;
    render(dt);
    requestAnimationFrame(loop);
  }

  // ---------- Yerleşim ----------
  function layout() {
    if (!grid) return;
    const st = $('#stage'), aw = st.clientWidth, ah = st.clientHeight;
    const cs = Math.max(1, Math.min(aw / GW, ah / GH));
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.style.width = GW * cs + 'px'; cv.style.height = GH * cs + 'px';
    cv.width = Math.round(GW * cs * dpr); cv.height = Math.round(GH * cs * dpr);
    cell = cv.width / GW;
    rebuildCover();
  }
  window.addEventListener('resize', layout);

  // ---------- Kontroller ----------
  const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
  let held = [], touchDir = null, padDir = null;
  function currentDir() { return padDir || (held.length ? DIRS[held[held.length - 1]] : null) || touchDir; }
  window.addEventListener('keydown', e => {
    if (DIRS[e.key]) { e.preventDefault(); if (!held.includes(e.key)) held.push(e.key); touchDir = null; }
    if (e.key === 'Escape' && state === 'play') goMenu();
  });
  window.addEventListener('keyup', e => { held = held.filter(k => k !== e.key); });
  window.addEventListener('blur', () => { held = []; padDir = null; });

  const stage = $('#stage');
  let sw = null;
  stage.addEventListener('pointerdown', e => { sw = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false }; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', e => {
    if (!sw) return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
    if (Math.hypot(dx, dy) > 18) {
      touchDir = Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)];
      sw.x = e.clientX; sw.y = e.clientY; sw.moved = true;
    }
  });
  stage.addEventListener('pointerup', () => { if (sw && !sw.moved) touchDir = null; sw = null; });
  stage.addEventListener('pointercancel', () => { sw = null; });

  document.querySelectorAll('#dpad button').forEach(b => {
    const d = b.dataset.d.split(',').map(Number);
    b.addEventListener('pointerdown', e => { e.preventDefault(); padDir = d; touchDir = null; b.setPointerCapture(e.pointerId); });
    const up = () => { if (padDir === d) padDir = null; };
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
  });

  // ---------- Arayüz ----------
  function showScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id)); }
  function updateHud() {
    if (!level) return;
    $('#hudLevel').textContent = `${lvIdx + 1}. ${level.name}`;
    $('#hudPct').textContent = `%${pct.toFixed(0)} / %${level.target}`;
    $('#bar').style.width = Math.min(100, pct / level.target * 100) + '%';
    $('#hudLives').textContent = '❤'.repeat(Math.max(0, lives)) + '♡'.repeat(Math.max(0, 3 - lives));
    $('#hudBugs').textContent = '🐞 ' + enemies.length;
    $('#hudScore').textContent = score.toLocaleString('tr-TR');
  }
  function showOverlay(kind) {
    const o = $('#overlay');
    const last = lvIdx === LEVELS.length - 1;
    if (kind === 'win') {
      $('#ovTitle').textContent = last ? '🏆 Tüm bölümler tamamlandı!' : '🎉 Bölüm tamamlandı!';
      $('#ovStars').textContent = '★'.repeat(lives) + '☆'.repeat(3 - lives);
      $('#ovText').textContent = `${level.name} açıldı. Puan: ${score.toLocaleString('tr-TR')}`;
      $('#ovNext').hidden = last; $('#ovRetry').hidden = true;
    } else {
      $('#ovTitle').textContent = '💥 Oyun bitti';
      $('#ovStars').textContent = '';
      $('#ovText').textContent = 'Böcekler bu sefer kazandı. Tekrar dene!';
      $('#ovNext').hidden = true; $('#ovRetry').hidden = false;
    }
    o.hidden = false;
  }
  function hideOverlay() { $('#overlay').hidden = true; }
  function goMenu() { state = 'menu'; hideOverlay(); buildMenu(); showScreen('menu'); }

  $('#ovNext').onclick = () => startLevel(lvIdx + 1);
  $('#ovRetry').onclick = () => { score = 0; startLevel(lvIdx); };
  $('#ovMenu').onclick = goMenu;
  $('#menuBtn').onclick = goMenu;
  $('#playBtn').onclick = () => { score = 0; startLevel(Math.min(unlocked, LEVELS.length) - 1); };

  function buildMenu() {
    const g = $('#levelGrid'); g.innerHTML = '';
    LEVELS.forEach((L, i) => {
      const b = document.createElement('button'); b.className = 'lv' + (i >= unlocked ? ' locked' : '');
      const th = customImg ? null : Scenes.draw(i, 240, 150);
      if (th) b.appendChild(th);
      else { const im = new Image(); im.src = customImg.src; b.appendChild(im); }
      const s = document.createElement('span'); s.textContent = i >= unlocked ? '🔒 ' + (i + 1) : `${i + 1}. ${L.name}`; b.appendChild(s);
      b.onclick = () => { if (i < unlocked) { score = 0; startLevel(i); } };
      g.appendChild(b);
    });
  }

  $('#bgInput').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const url = URL.createObjectURL(f), im = new Image();
    im.onload = () => { customImg = im; $('#bgPreview').src = url; $('#customBox').classList.add('has'); buildMenu(); };
    im.src = url;
    e.target.value = '';
  });
  $('#bgClear').onclick = () => { customImg = null; $('#customBox').classList.remove('has'); buildMenu(); };

  if (location.search.includes('debug')) window.dsDebug = { win: () => state === 'play' && win() };

  buildMenu();
  requestAnimationFrame(loop);
})();
