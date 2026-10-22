// Prosedürel olarak çizilen 10 arkaplan sahnesi. Her sahne (ctx, W, H, rng, k) alır; k = ölçek.
window.Scenes = (function () {
  function rng(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function lg(c, x0, y0, x1, y1, s) { const g = c.createLinearGradient(x0, y0, x1, y1); s.forEach(v => g.addColorStop(v[0], v[1])); return g; }
  function rgr(c, x, y, r0, r1, s) { const g = c.createRadialGradient(x, y, r0, x, y, r1); s.forEach(v => g.addColorStop(v[0], v[1])); return g; }
  function ridge(c, W, H, base, amp, fill, r, rough) {
    rough = rough || 0.55;
    const N = 256, a = new Float32Array(N + 1);
    a[0] = r() * amp; a[N] = r() * amp;
    let step = N, sc = amp;
    while (step > 1) {
      const h = step / 2;
      for (let i = h; i < N; i += step) a[i] = (a[i - h] + a[i + h]) / 2 + (r() - 0.5) * sc;
      sc *= rough; step = h;
    }
    c.fillStyle = fill; c.beginPath(); c.moveTo(0, H);
    for (let i = 0; i <= N; i++) c.lineTo(i / N * W, base - a[i]);
    c.lineTo(W, H); c.closePath(); c.fill();
  }
  function stars(c, W, H, n, r, k, maxY) {
    maxY = maxY || H; c.save();
    for (let i = 0; i < n; i++) {
      const x = r() * W, y = r() * maxY, s = (r() * r() * 2.2 + 0.4) * k;
      c.globalAlpha = 0.3 + r() * 0.7; c.fillStyle = r() < 0.15 ? '#cfe3ff' : '#fff';
      c.beginPath(); c.arc(x, y, s, 0, 7); c.fill();
    }
    c.restore();
  }
  function glow(c, x, y, rad, col) {
    c.fillStyle = rgr(c, x, y, 0, rad, [[0, col], [1, 'rgba(0,0,0,0)']]);
    c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  function blob(c, x, y, s, col, r) {
    c.fillStyle = col;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(x + (r() - 0.5) * s * 2.4, y + (r() - 0.5) * s * 0.6, s * (0.5 + r() * 0.6), 0, 7); c.fill(); }
  }

  const list = [
    // 1 Gün batımı vadisi
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H * 0.8, [[0, '#1b1a4a'], [0.35, '#6b2d73'], [0.68, '#f0745a'], [1, '#ffd36e']]); c.fillRect(0, 0, W, H);
      stars(c, W, H, 90, r, k, H * 0.3);
      const sx = W * 0.5, sy = H * 0.62;
      glow(c, sx, sy, 300 * k, 'rgba(255,220,140,0.75)');
      c.fillStyle = '#fff3c4'; c.beginPath(); c.arc(sx, sy, 70 * k, 0, 7); c.fill();
      for (let i = 0; i < 9; i++) blob(c, r() * W, H * (0.12 + r() * 0.35), (25 + r() * 35) * k, `rgba(255,${150 + r() * 70 | 0},${160 + r() * 50 | 0},0.28)`, r);
      ['#b0577e', '#7d3a6e', '#4e2357', '#2a1238'].forEach((col, i) => ridge(c, W, H, H * (0.62 + i * 0.06), H * (0.24 - i * 0.04), col, r, 0.5));
      c.fillStyle = lg(c, 0, H * 0.84, 0, H, [[0, '#4a2360'], [1, '#120822']]); c.fillRect(0, H * 0.84, W, H * 0.16);
      for (let i = 0; i < 40; i++) {
        const y = H * 0.845 + r() * H * 0.15, w = (50 + r() * 180) * k * (1.2 - (y - H * 0.84) / (H * 0.2));
        c.fillStyle = `rgba(255,210,150,${0.12 + r() * 0.35})`; c.fillRect(sx - w / 2, y, w, 2 * k);
      }
    },
    // 2 Mercan resifi
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#3ad1e6'], [0.4, '#0d7bb5'], [1, '#062048']]); c.fillRect(0, 0, W, H);
      c.save(); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 8; i++) {
        const x = r() * W, w = (40 + r() * 90) * k;
        c.fillStyle = lg(c, 0, 0, 0, H, [[0, 'rgba(255,255,255,0.16)'], [1, 'rgba(255,255,255,0)']]);
        c.beginPath(); c.moveTo(x, 0); c.lineTo(x + w, 0); c.lineTo(x + w + W * 0.15, H); c.lineTo(x + W * 0.15, H); c.fill();
      }
      c.restore();
      ridge(c, W, H, H * 0.9, H * 0.08, '#e3c88f', r, 0.5); ridge(c, W, H, H * 0.96, H * 0.05, '#c9a96b', r, 0.5);
      c.lineCap = 'round';
      for (let i = 0; i < 16; i++) {
        const x = r() * W, h = (120 + r() * 220) * k, ph = r() * 6;
        c.strokeStyle = r() < 0.5 ? '#2f9e5b' : '#1f7a48'; c.lineWidth = 7 * k; c.beginPath(); c.moveTo(x, H);
        for (let j = 0; j <= 20; j++) c.lineTo(x + Math.sin(j * 0.6 + ph) * 12 * k, H - h * j / 20);
        c.stroke();
      }
      const cols = ['#ff6f91', '#ff9671', '#ffc75f', '#f9f871', '#d65db1'];
      function coral(x, y, len, ang, d, col) {
        const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
        c.strokeStyle = col; c.lineWidth = (d * 2.4 + 1) * k; c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
        if (d === 0) { c.fillStyle = col; c.beginPath(); c.arc(ex, ey, 3 * k, 0, 7); c.fill(); return; }
        coral(ex, ey, len * 0.76, ang - 0.35 - r() * 0.3, d - 1, col);
        coral(ex, ey, len * 0.76, ang + 0.35 + r() * 0.3, d - 1, col);
      }
      for (let i = 0; i < 10; i++) coral(r() * W, H * 0.93, (28 + r() * 30) * k, -Math.PI / 2 + (r() - 0.5) * 0.4, 5, cols[i % cols.length]);
      for (let i = 0; i < 6; i++) {
        const x = r() * W, y = H * (0.93 + r() * 0.04), s = (25 + r() * 25) * k;
        c.fillStyle = rgr(c, x - s * 0.3, y - s * 0.4, 0, s * 1.3, [[0, '#ffd1a8'], [1, '#c2603a']]);
        c.beginPath(); c.ellipse(x, y, s * 1.3, s * 0.8, 0, Math.PI, 0); c.fill();
      }
      for (let i = 0; i < 18; i++) {
        const fx = r() * W, fy = H * (0.1 + r() * 0.65), s = (9 + r() * 16) * k, d = r() < 0.5 ? 1 : -1, hue = r() * 360 | 0;
        c.save(); c.translate(fx, fy); c.scale(d, 1);
        c.fillStyle = `hsl(${hue},90%,60%)`;
        c.beginPath(); c.moveTo(-s * 1.2, 0); c.lineTo(-s * 2.1, -s * 0.8); c.lineTo(-s * 2.1, s * 0.8); c.fill();
        c.beginPath(); c.ellipse(0, 0, s * 1.6, s, 0, 0, 7); c.fill();
        c.fillStyle = 'rgba(255,255,255,0.85)'; c.fillRect(-s * 0.3, -s * 0.95, s * 0.35, s * 1.9);
        c.fillStyle = '#fff'; c.beginPath(); c.arc(s * 0.9, -s * 0.2, s * 0.25, 0, 7); c.fill();
        c.fillStyle = '#111'; c.beginPath(); c.arc(s * 0.95, -s * 0.2, s * 0.12, 0, 7); c.fill();
        c.restore();
      }
      c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 1.5 * k;
      for (let i = 0; i < 40; i++) { c.beginPath(); c.arc(r() * W, r() * H * 0.9, (2 + r() * 7) * k, 0, 7); c.stroke(); }
    },
    // 3 Sakura bahçesi
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#a9d6ff'], [0.55, '#ffd9e6'], [1, '#ffc0d6']]); c.fillRect(0, 0, W, H);
      glow(c, W * 0.8, H * 0.18, 200 * k, 'rgba(255,255,230,0.8)');
      const fx = W * 0.62, top = H * 0.3;
      c.fillStyle = lg(c, 0, top, 0, H * 0.75, [[0, '#5c6f9e'], [1, '#b4c1e0']]);
      c.beginPath(); c.moveTo(fx - W * 0.5, H * 0.78); c.quadraticCurveTo(fx - W * 0.12, top + H * 0.14, fx - W * 0.05, top);
      c.lineTo(fx + W * 0.05, top); c.quadraticCurveTo(fx + W * 0.12, top + H * 0.14, fx + W * 0.5, H * 0.78); c.fill();
      c.fillStyle = '#fbfdff'; c.beginPath(); c.moveTo(fx - W * 0.05, top); c.lineTo(fx + W * 0.05, top);
      c.lineTo(fx + W * 0.095, top + H * 0.09);
      for (let i = 0; i <= 8; i++) c.lineTo(fx + W * 0.095 - i * W * 0.19 / 8, top + H * (i % 2 ? 0.06 : 0.1));
      c.fill();
      ridge(c, W, H, H * 0.8, H * 0.07, '#9fd0a4', r, 0.5); ridge(c, W, H, H * 0.9, H * 0.06, '#6fae7c', r, 0.5);
      const m = Math.min(W, H);
      function br(x, y, len, ang, d) {
        const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
        c.strokeStyle = '#4a2c2a'; c.lineCap = 'round'; c.lineWidth = Math.max(1, d * d * 0.45 * k);
        c.beginPath(); c.moveTo(x, y); c.lineTo(ex, ey); c.stroke();
        if (d <= 3) for (let i = 0; i < 5; i++) {
          c.fillStyle = `rgba(255,${150 + r() * 70 | 0},${190 + r() * 40 | 0},0.75)`;
          c.beginPath(); c.arc(ex + (r() - 0.5) * 22 * k, ey + (r() - 0.5) * 22 * k, (4 + r() * 7) * k, 0, 7); c.fill();
        }
        if (d > 0) {
          br(ex, ey, len * 0.78, ang - 0.3 - r() * 0.35, d - 1);
          br(ex, ey, len * 0.78, ang + 0.25 + r() * 0.35, d - 1);
        }
      }
      br(W * 0.14, H, m * 0.26, -Math.PI / 2 + 0.25, 9);
      for (let i = 0; i < 70; i++) {
        c.fillStyle = 'rgba(255,170,200,0.85)'; c.beginPath();
        c.ellipse(r() * W, r() * H, 4 * k, 2.2 * k, r() * 3, 0, 7); c.fill();
      }
    },
    // 4 Kuzey ışıkları
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#020617'], [0.6, '#0b1f3f'], [1, '#164d6b']]); c.fillRect(0, 0, W, H);
      stars(c, W, H, 350, r, k, H * 0.8);
      c.save(); c.globalCompositeOperation = 'lighter';
      [[80, 255, 170, 0.25, 0.09], [150, 90, 255, 0.17, 0.07], [60, 220, 255, 0.33, 0.06]].forEach(b => {
        const ph = r() * 6, base = H * b[3], amp = H * b[4], col = b[0] + ',' + b[1] + ',' + b[2];
        for (let x = 0; x < W; x += 2 * k + 1) {
          const y = base + Math.sin(x / W * 6 + ph) * amp + Math.sin(x / W * 17 + ph * 2) * amp * 0.3;
          const len = (90 + 70 * Math.sin(x / W * 9 + ph)) * k * 1.6;
          c.fillStyle = lg(c, 0, y, 0, y + len, [[0, `rgba(${col},0)`], [0.25, `rgba(${col},0.22)`], [1, `rgba(${col},0)`]]);
          c.fillRect(x, y, 2 * k + 1, len);
        }
      });
      c.restore();
      ridge(c, W, H, H * 0.72, H * 0.25, '#c9d8ec', r, 0.55); ridge(c, W, H, H * 0.78, H * 0.16, '#5a7394', r, 0.55); ridge(c, W, H, H * 0.86, H * 0.08, '#e8f1fb', r, 0.5);
      for (let i = 0; i < 26; i++) {
        const x = r() * W, y = H * (0.88 + r() * 0.12), h = (50 + r() * 70) * k;
        c.fillStyle = '#0c1a2b';
        for (let j = 0; j < 4; j++) { const yy = y - h * j / 4, w = h * 0.32 * (1 - j / 5); c.beginPath(); c.moveTo(x - w, yy); c.lineTo(x, yy - h * 0.4); c.lineTo(x + w, yy); c.fill(); }
      }
    },
    // 5 Çöl piramitleri
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H * 0.8, [[0, '#3d1a5b'], [0.35, '#c2477a'], [0.7, '#ff9a52'], [1, '#ffd28a']]); c.fillRect(0, 0, W, H);
      glow(c, W * 0.72, H * 0.42, 260 * k, 'rgba(255,230,170,0.7)');
      c.fillStyle = '#fff0c0'; c.beginPath(); c.arc(W * 0.72, H * 0.42, 60 * k, 0, 7); c.fill();
      for (let i = 0; i < 6; i++) blob(c, r() * W, H * (0.1 + r() * 0.2), (20 + r() * 30) * k, 'rgba(255,200,220,0.25)', r);
      function pyr(x, base, w, h) {
        c.fillStyle = '#e8ad5f'; c.beginPath(); c.moveTo(x - w / 2, base); c.lineTo(x, base - h); c.lineTo(x + w * 0.08, base); c.fill();
        c.fillStyle = '#8f5128'; c.beginPath(); c.moveTo(x, base - h); c.lineTo(x + w / 2, base); c.lineTo(x + w * 0.08, base); c.fill();
        c.strokeStyle = 'rgba(80,40,10,0.25)'; c.lineWidth = 1;
        for (let i = 1; i < 12; i++) { const t = i / 12; c.beginPath(); c.moveTo(x - w / 2 * t, base - h + h * t); c.lineTo(x + w / 2 * t, base - h + h * t); c.stroke(); }
      }
      pyr(W * 0.34, H * 0.74, W * 0.36, H * 0.32); pyr(W * 0.62, H * 0.74, W * 0.23, H * 0.2); pyr(W * 0.82, H * 0.74, W * 0.14, H * 0.12);
      ridge(c, W, H, H * 0.78, H * 0.08, '#e9b872', r, 0.35); ridge(c, W, H, H * 0.87, H * 0.08, '#d4934a', r, 0.35); ridge(c, W, H, H * 0.96, H * 0.06, '#b8733a', r, 0.35);
      [[W * 0.08, H * 0.92], [W * 0.92, H * 0.95]].forEach(([x, y]) => {
        const h = Math.min(W, H) * 0.3, tx = x + h * 0.15, ty = y - h;
        c.strokeStyle = '#5a3a1e'; c.lineWidth = 9 * k; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - h * 0.05, y - h * 0.5, tx, ty); c.stroke();
        c.strokeStyle = '#2f6b2a'; c.lineWidth = 6 * k;
        for (let i = 0; i < 8; i++) {
          const a = i / 8 * Math.PI * 2, L = h * 0.35;
          c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.3 - L * 0.3, tx + Math.cos(a) * L, ty + Math.abs(Math.sin(a)) * L * 0.4 + L * 0.1); c.stroke();
        }
      });
    },
    // 6 Neon şehir
    function (c, W, H, r, k) {
      const hz = H * 0.62;
      c.fillStyle = lg(c, 0, 0, 0, hz, [[0, '#0b0221'], [0.6, '#3b0a5e'], [1, '#ff2a6d']]); c.fillRect(0, 0, W, hz);
      stars(c, W, H, 140, r, k, hz * 0.6);
      const cx = W / 2, R = Math.min(W, H) * 0.24, cy = hz - R * 0.25;
      glow(c, cx, cy, R * 2, 'rgba(255,80,160,0.5)');
      c.fillStyle = lg(c, 0, cy - R, 0, cy + R, [[0, '#ffe66d'], [0.6, '#ff6b9d'], [1, '#c2185b']]);
      for (let y = -R; y < R; y += 1) {
        const t = (y + R) / (2 * R);
        if (t > 0.5 && ((y + R) % (R * 0.16)) < R * 0.16 * (t - 0.45) * 1.3) continue;
        const hw = Math.sqrt(R * R - y * y); c.fillRect(cx - hw, cy + y, hw * 2, 1.2);
      }
      [['#1a0b33', 0.32, 0.3], ['#0d0620', 0.2, 0.18]].forEach(([col, hmax, hmin]) => {
        let x = 0;
        while (x < W) {
          const w = (30 + r() * 60) * k, h = H * (hmin * 0.5 + r() * hmax);
          c.fillStyle = col; c.fillRect(x, hz - h, w, h);
          for (let yy = hz - h + 6 * k; yy < hz - 6 * k; yy += 9 * k) for (let xx = x + 4 * k; xx < x + w - 6 * k; xx += 8 * k) {
            if (r() < 0.3) { c.fillStyle = ['#ffd36e', '#6cf6ff', '#ff6ec7'][r() * 3 | 0]; c.globalAlpha = 0.5 + r() * 0.5; c.fillRect(xx, yy, 3.5 * k, 4.5 * k); c.globalAlpha = 1; }
          }
          x += w + r() * 6 * k;
        }
      });
      c.fillStyle = lg(c, 0, hz, 0, H, [[0, '#2a0050'], [1, '#05000d']]); c.fillRect(0, hz, W, H - hz);
      c.save(); c.strokeStyle = 'rgba(255,60,220,0.85)'; c.shadowColor = '#ff3cdc'; c.shadowBlur = 10 * k; c.lineWidth = 2 * k;
      for (let i = 1; i <= 14; i++) { const y = hz + (H - hz) * Math.pow(i / 14, 2.2); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
      c.strokeStyle = 'rgba(80,220,255,0.8)'; c.shadowColor = '#50dcff';
      for (let i = -24; i <= 24; i++) { c.beginPath(); c.moveTo(cx + i * W * 0.02, hz); c.lineTo(cx + i * W * 0.22, H); c.stroke(); }
      c.restore();
    },
    // 7 Büyülü orman
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#155c48'], [0.5, '#0a2e26'], [1, '#04140f']]); c.fillRect(0, 0, W, H);
      c.save(); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 6; i++) {
        const x = r() * W, w = (30 + r() * 70) * k;
        c.fillStyle = lg(c, 0, 0, 0, H, [[0, 'rgba(200,255,200,0.14)'], [1, 'rgba(200,255,200,0)']]);
        c.beginPath(); c.moveTo(x, 0); c.lineTo(x + w, 0); c.lineTo(x + w - W * 0.12, H); c.lineTo(x - W * 0.12, H); c.fill();
      }
      c.restore();
      for (let i = 0; i < 22; i++) { const w = (10 + r() * 25) * k; c.fillStyle = '#0d2e25'; c.fillRect(r() * W, 0, w, H); }
      ridge(c, W, H, H * 0.88, H * 0.05, '#08221a', r, 0.5);
      for (let i = 0; i < 8; i++) {
        const x = r() * W, w = (25 + r() * 45) * k; c.fillStyle = '#05140e'; c.fillRect(x, 0, w, H);
        c.beginPath(); c.moveTo(x - w * 0.6, H); c.quadraticCurveTo(x, H * 0.9, x, H * 0.8); c.lineTo(x + w, H * 0.8); c.quadraticCurveTo(x + w, H * 0.9, x + w * 1.6, H); c.fill();
      }
      const pal = [[90, 240, 255], [255, 90, 220], [255, 170, 60], [170, 255, 90]];
      for (let i = 0; i < 14; i++) {
        const x = r() * W, y = H * (0.86 + r() * 0.12), s = (10 + r() * 24) * k, p = pal[r() * pal.length | 0], col = p.join(',');
        c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y - s, s * 4, `rgba(${col},0.35)`); c.restore();
        c.fillStyle = '#e8f5e9'; c.fillRect(x - s * 0.15, y - s, s * 0.3, s);
        c.fillStyle = rgr(c, x, y - s * 1.3, 0, s * 1.2, [[0, '#fff'], [0.35, `rgb(${col})`], [1, `rgba(${col},0.7)`]]);
        c.beginPath(); c.ellipse(x, y - s, s, s * 0.7, 0, Math.PI, 0); c.fill();
        c.fillStyle = 'rgba(255,255,255,0.85)';
        for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(x + (j - 1) * s * 0.45, y - s * 1.3 + Math.abs(j - 1) * s * 0.2, s * 0.1, 0, 7); c.fill(); }
      }
      c.save(); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 70; i++) { const x = r() * W, y = r() * H; glow(c, x, y, (5 + r() * 9) * k, 'rgba(230,255,120,0.9)'); }
      c.restore();
    },
    // 8 Uzay nebulası
    function (c, W, H, r, k) {
      c.fillStyle = '#03010a'; c.fillRect(0, 0, W, H);
      c.save(); c.globalCompositeOperation = 'lighter';
      const pal = ['140,60,255', '255,60,160', '40,160,255', '255,140,60'];
      for (let i = 0; i < 70; i++) {
        const x = W * (0.1 + r() * 0.8), y = H * 0.5 + (r() - 0.5) * H * 0.7 + Math.sin(x / W * 5) * H * 0.15;
        glow(c, x, y, (80 + r() * 240) * k, `rgba(${pal[r() * 4 | 0]},${0.05 + r() * 0.09})`);
      }
      c.restore();
      stars(c, W, H, 600, r, k);
      c.save(); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 10; i++) {
        const x = r() * W, y = r() * H, s = (8 + r() * 14) * k;
        glow(c, x, y, s * 2, 'rgba(200,220,255,0.8)');
        c.fillStyle = 'rgba(220,235,255,0.7)'; c.fillRect(x - s * 2, y - 0.5 * k, s * 4, k); c.fillRect(x - 0.5 * k, y - s * 2, k, s * 4);
      }
      c.restore();
      const m = Math.min(W, H), px = W * 0.72, py = H * 0.64, pr = m * 0.16;
      c.lineWidth = pr * 0.12; c.strokeStyle = 'rgba(255,210,170,0.55)';
      c.beginPath(); c.ellipse(px, py, pr * 2, pr * 0.45, -0.3, Math.PI, Math.PI * 2); c.stroke();
      c.fillStyle = rgr(c, px - pr * 0.4, py - pr * 0.4, pr * 0.1, pr * 1.2, [[0, '#ffd8a8'], [0.5, '#c0603a'], [1, '#2a0a14']]);
      c.beginPath(); c.arc(px, py, pr, 0, 7); c.fill();
      c.beginPath(); c.ellipse(px, py, pr * 2, pr * 0.45, -0.3, 0, Math.PI); c.stroke();
      c.fillStyle = rgr(c, W * 0.22, H * 0.25, 2, m * 0.06, [[0, '#e6e6f0'], [1, '#4a4a60']]);
      c.beginPath(); c.arc(W * 0.24, H * 0.27, m * 0.05, 0, 7); c.fill();
    },
    // 9 Volkan adası
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H * 0.8, [[0, '#120404'], [0.45, '#5a120a'], [0.8, '#d9481c'], [1, '#ff9a3c']]); c.fillRect(0, 0, W, H);
      for (let i = 0; i < 14; i++) blob(c, r() * W, H * (0.05 + r() * 0.25), (30 + r() * 40) * k, 'rgba(30,8,8,0.45)', r);
      const vx = W * 0.5, top = H * 0.36;
      c.save(); c.globalCompositeOperation = 'lighter'; glow(c, vx, top, 280 * k, 'rgba(255,120,40,0.6)');
      for (let i = 0; i < 120; i++) {
        const t = r(), x = vx + (r() - 0.5) * W * 0.25 * t, y = top - t * H * 0.33;
        glow(c, x, y, (4 + r() * 10) * k * (1 - t * 0.5), `rgba(255,${120 + r() * 120 | 0},40,0.9)`);
      }
      c.restore();
      for (let i = 0; i < 10; i++) blob(c, vx + (r() - 0.5) * W * 0.12, top - H * 0.05 - r() * H * 0.2, (20 + r() * 30) * k, 'rgba(70,50,50,0.35)', r);
      c.fillStyle = lg(c, 0, top, 0, H * 0.82, [[0, '#3a1610'], [1, '#110604']]);
      c.beginPath(); c.moveTo(-W * 0.05, H * 0.82); c.lineTo(vx - W * 0.2, H * 0.55); c.lineTo(vx - W * 0.07, top); c.lineTo(vx + W * 0.07, top); c.lineTo(vx + W * 0.22, H * 0.58); c.lineTo(W * 1.05, H * 0.82); c.fill();
      c.save(); c.strokeStyle = '#ff6a1a'; c.shadowColor = '#ff8c2a'; c.shadowBlur = 16 * k; c.lineCap = 'round'; c.lineJoin = 'round';
      for (let i = 0; i < 6; i++) {
        let x = vx + (r() - 0.5) * W * 0.12, y = top + 2 * k, dir = x < vx ? -1 : 1;
        c.lineWidth = (3 + r() * 5) * k; c.beginPath(); c.moveTo(x, y);
        while (y < H * 0.8) { y += 12 * k; x += dir * (6 + r() * 12) * k * (y / H) + (r() - 0.5) * 8 * k; c.lineTo(x, y); }
        c.stroke();
      }
      c.restore();
      c.fillStyle = lg(c, 0, H * 0.82, 0, H, [[0, '#3a0d08'], [1, '#080202']]); c.fillRect(0, H * 0.82, W, H * 0.18);
      for (let i = 0; i < 40; i++) {
        const y = H * 0.83 + r() * H * 0.16, w = (30 + r() * 140) * k;
        c.fillStyle = `rgba(255,120,40,${0.1 + r() * 0.3})`; c.fillRect(vx - w / 2 + (r() - 0.5) * W * 0.2, y, w, 2 * k);
      }
    },
    // 10 Kristal mağara
    function (c, W, H, r, k) {
      c.fillStyle = rgr(c, W / 2, H / 2, 0, Math.max(W, H) * 0.7, [[0, '#2a0a5e'], [1, '#05010f']]); c.fillRect(0, 0, W, H);
      const pal = [['#7df9ff', '#1b6fa8'], ['#d1a3ff', '#5b21b6'], ['#ff9ec7', '#9d174d'], ['#a7ffcf', '#047857']];
      function crystal(x, y, w, h, ang, p) {
        c.save(); c.translate(x, y); c.rotate(ang); c.shadowColor = p[0]; c.shadowBlur = 20 * k;
        c.fillStyle = lg(c, -w / 2, 0, w / 2, 0, [[0, p[1]], [0.5, p[0]], [1, p[1]]]);
        c.beginPath(); c.moveTo(-w / 2, 0); c.lineTo(-w / 2, -h * 0.8); c.lineTo(0, -h); c.lineTo(w / 2, -h * 0.8); c.lineTo(w / 2, 0); c.fill();
        c.shadowBlur = 0; c.fillStyle = 'rgba(0,0,0,0.22)';
        c.beginPath(); c.moveTo(-w / 2, 0); c.lineTo(-w / 2, -h * 0.8); c.lineTo(0, -h); c.lineTo(0, 0); c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 1.5 * k; c.beginPath(); c.moveTo(w * 0.15, -h * 0.05); c.lineTo(w * 0.15, -h * 0.82); c.stroke();
        c.restore();
      }
      c.save(); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 12; i++) glow(c, r() * W, r() * H, (80 + r() * 160) * k, `rgba(${['120,80,255', '60,200,255', '255,80,180'][i % 3]},0.12)`);
      c.restore();
      const m = Math.min(W, H);
      for (let i = 0; i < 18; i++) crystal(r() * W, -5 * k, (14 + r() * 26) * k, (60 + r() * m * 0.25), Math.PI + (r() - 0.5) * 0.7, pal[r() * 4 | 0]);
      for (let i = 0; i < 9; i++) crystal(W * 0.5 + (r() - 0.5) * W * 0.25, H * 0.75, (30 + r() * 40) * k, m * (0.25 + r() * 0.3), (r() - 0.5) * 0.9, pal[r() * 4 | 0]);
      for (let i = 0; i < 30; i++) crystal(r() * W, H * (0.95 + r() * 0.08), (14 + r() * 30) * k, (40 + r() * m * 0.22), (r() - 0.5) * 0.9, pal[r() * 4 | 0]);
      c.save(); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 60; i++) { const x = r() * W, y = r() * H, s = (2 + r() * 5) * k; glow(c, x, y, s * 3, 'rgba(255,255,255,0.8)'); }
      c.restore();
    },
    // 11 Karlı köy
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#0b1433'], [0.6, '#2b3f7a'], [1, '#6d86c2']]); c.fillRect(0, 0, W, H);
      stars(c, W, H, 200, r, k, H * 0.5);
      glow(c, W * 0.8, H * 0.18, 120 * k, 'rgba(230,240,255,0.7)'); c.fillStyle = '#f4f7ff'; c.beginPath(); c.arc(W * 0.8, H * 0.18, 34 * k, 0, 7); c.fill();
      ridge(c, W, H, H * 0.62, H * 0.2, '#8fa6d6', r, 0.55); ridge(c, W, H, H * 0.75, H * 0.08, '#dfe8fb', r, 0.45);
      for (let i = 0; i < 9; i++) {
        const x = W * (0.05 + i * 0.11 + r() * 0.03), y = H * (0.8 + r() * 0.08), w = (50 + r() * 40) * k, h = w * 0.7;
        c.fillStyle = '#5a3a2a'; c.fillRect(x, y - h, w, h);
        c.fillStyle = '#fff'; c.beginPath(); c.moveTo(x - w * 0.15, y - h); c.lineTo(x + w / 2, y - h - w * 0.5); c.lineTo(x + w * 1.15, y - h); c.fill();
        c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x + w * 0.3, y - h * 0.5, w * 0.6, 'rgba(255,190,80,0.5)'); c.restore();
        c.fillStyle = '#ffd27a'; c.fillRect(x + w * 0.18, y - h * 0.65, w * 0.22, w * 0.2); c.fillRect(x + w * 0.6, y - h * 0.65, w * 0.22, w * 0.2);
      }
      c.fillStyle = '#f2f6ff'; c.fillRect(0, H * 0.88, W, H * 0.12);
      for (let i = 0; i < 250; i++) { c.globalAlpha = 0.4 + r() * 0.6; c.fillStyle = '#fff'; c.beginPath(); c.arc(r() * W, r() * H, (1 + r() * 2.5) * k, 0, 7); c.fill(); }
      c.globalAlpha = 1;
    },
    // 12 Lavanta tarlası
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H * 0.5, [[0, '#5b3c88'], [0.5, '#e07a9a'], [1, '#ffcf8f']]); c.fillRect(0, 0, W, H);
      glow(c, W * 0.5, H * 0.46, 220 * k, 'rgba(255,230,160,0.8)');
      ridge(c, W, H, H * 0.48, H * 0.06, '#7a5aa0', r, 0.5);
      const hz = H * 0.48; c.fillStyle = '#3d2a5c'; c.fillRect(0, hz, W, H - hz);
      for (let i = -30; i <= 30; i++) {
        const x0 = W / 2 + i * W * 0.004, x1 = W / 2 + i * W * 0.09;
        c.strokeStyle = i % 2 ? '#9b6fd6' : '#7c4fc0'; c.lineWidth = Math.abs(x1 - (W / 2 + (i + 1) * W * 0.09)) * 0.7;
        c.beginPath(); c.moveTo(x0, hz); c.lineTo(x1, H); c.stroke();
      }
      for (let i = 0; i < 500; i++) {
        const y = hz + Math.pow(r(), 0.6) * (H - hz), s = (y - hz) / (H - hz);
        c.fillStyle = `rgba(${190 + r() * 60 | 0},${140 + r() * 60 | 0},255,0.8)`; c.beginPath(); c.arc(r() * W, y, (1 + s * 5) * k, 0, 7); c.fill();
      }
      const tx = W * 0.8, ty = H * 0.5, tr = 40 * k;
      c.fillStyle = '#2a1a3a'; c.fillRect(tx - 4 * k, ty - tr, 8 * k, tr); blob(c, tx, ty - tr * 1.2, tr * 0.6, '#2a1a3a', r);
    },
    // 13 Gökkuşağı şelalesi
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#7fd3ff'], [1, '#d8f3ff']]); c.fillRect(0, 0, W, H);
      for (let i = 0; i < 6; i++) blob(c, r() * W, H * r() * 0.3, (30 + r() * 30) * k, 'rgba(255,255,255,0.8)', r);
      c.save(); c.globalAlpha = 0.35; c.lineWidth = 14 * k;
      ['#ff4d4d', '#ff9f43', '#ffe14d', '#4cd964', '#3db9ff', '#7a5cff'].forEach((col, i) => { c.strokeStyle = col; c.beginPath(); c.arc(W * 0.5, H * 0.75, Math.min(W, H) * 0.6 - i * 14 * k, Math.PI, 0); c.stroke(); });
      c.restore();
      c.fillStyle = '#5b6b4a'; c.fillRect(0, H * 0.25, W * 0.35, H); c.fillRect(W * 0.65, H * 0.25, W * 0.35, H);
      c.fillStyle = '#3f8f3a'; c.fillRect(0, H * 0.22, W * 0.35, H * 0.05); c.fillRect(W * 0.65, H * 0.22, W * 0.35, H * 0.05);
      c.fillStyle = lg(c, W * 0.35, 0, W * 0.65, 0, [[0, '#9fe6ff'], [0.5, '#ffffff'], [1, '#9fe6ff']]); c.fillRect(W * 0.35, H * 0.25, W * 0.3, H * 0.6);
      c.strokeStyle = 'rgba(70,160,220,0.4)'; c.lineWidth = 2 * k;
      for (let i = 0; i < 40; i++) { const x = W * (0.36 + r() * 0.28); c.beginPath(); c.moveTo(x, H * 0.25); c.lineTo(x, H * 0.85); c.stroke(); }
      c.fillStyle = '#2f8fc9'; c.fillRect(0, H * 0.85, W, H * 0.15);
      for (let i = 0; i < 20; i++) blob(c, W * (0.35 + r() * 0.3), H * 0.85, (12 + r() * 16) * k, 'rgba(255,255,255,0.75)', r);
      for (let i = 0; i < 20; i++) { const x = r() < 0.5 ? r() * W * 0.33 : W * 0.67 + r() * W * 0.33; blob(c, x, H * (0.2 + r() * 0.05), 14 * k, '#2f7a2f', r); }
    },
    // 14 Ay ışığında göl
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H * 0.6, [[0, '#050a1f'], [1, '#1d3a5f']]); c.fillRect(0, 0, W, H);
      stars(c, W, H, 300, r, k, H * 0.55);
      const mx = W * 0.35, my = H * 0.25, mr = 55 * k;
      glow(c, mx, my, mr * 5, 'rgba(200,220,255,0.35)');
      c.fillStyle = rgr(c, mx - mr * 0.3, my - mr * 0.3, 0, mr, [[0, '#ffffff'], [1, '#c9d6f0']]); c.beginPath(); c.arc(mx, my, mr, 0, 7); c.fill();
      c.fillStyle = 'rgba(150,165,200,0.5)'; [[0.3, 0.2, 0.2], [-0.3, -0.1, 0.15], [0.1, -0.4, 0.1]].forEach(([a, b, s]) => { c.beginPath(); c.arc(mx + a * mr, my + b * mr, s * mr, 0, 7); c.fill(); });
      ridge(c, W, H, H * 0.6, H * 0.15, '#0d1a33', r, 0.55);
      c.fillStyle = lg(c, 0, H * 0.6, 0, H, [[0, '#122a4a'], [1, '#040a18']]); c.fillRect(0, H * 0.6, W, H * 0.4);
      for (let i = 0; i < 50; i++) { const y = H * 0.61 + r() * H * 0.35, w = (20 + r() * 90) * k; c.fillStyle = `rgba(220,230,255,${0.1 + r() * 0.4})`; c.fillRect(mx - w / 2 + (r() - 0.5) * 30 * k, y, w, 2 * k); }
      c.strokeStyle = '#030814'; c.lineWidth = 3 * k;
      for (let i = 0; i < 60; i++) { const x = r() < 0.5 ? r() * W * 0.2 : W * 0.75 + r() * W * 0.25, h = (40 + r() * 90) * k; c.beginPath(); c.moveTo(x, H); c.quadraticCurveTo(x + 6 * k, H - h * 0.6, x + (r() - 0.5) * 20 * k, H - h); c.stroke(); }
      c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 25; i++) glow(c, r() * W, H * (0.5 + r() * 0.45), 6 * k, 'rgba(200,255,150,0.9)'); c.restore();
    },
    // 15 Bulut kalesi
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#ff9ecf'], [0.5, '#ffd1a1'], [1, '#fff0d6']]); c.fillRect(0, 0, W, H);
      glow(c, W * 0.2, H * 0.2, 200 * k, 'rgba(255,255,220,0.8)');
      const cx = W * 0.55, base = H * 0.6, s = Math.min(W, H) / 600;
      const tower = (x, w, h, col) => { c.fillStyle = col; c.fillRect(x - w / 2, base - h, w, h); c.fillStyle = '#7a5cff'; c.beginPath(); c.moveTo(x - w * 0.65, base - h); c.lineTo(x, base - h - w * 1.3); c.lineTo(x + w * 0.65, base - h); c.fill();
        c.fillStyle = '#ffe14d'; c.fillRect(x - w * 0.12, base - h * 0.7, w * 0.24, w * 0.35); };
      c.fillStyle = '#f3e6ff'; c.fillRect(cx - 120 * s, base - 120 * s, 240 * s, 120 * s);
      tower(cx - 130 * s, 50 * s, 180 * s, '#efe0ff'); tower(cx + 130 * s, 50 * s, 180 * s, '#efe0ff'); tower(cx, 70 * s, 260 * s, '#fff');
      tower(cx - 60 * s, 40 * s, 150 * s, '#f7efff'); tower(cx + 60 * s, 40 * s, 150 * s, '#f7efff');
      c.fillStyle = '#c9a0ff'; c.beginPath(); c.arc(cx, base, 28 * s, Math.PI, 0); c.fill();
      for (let i = 0; i < 40; i++) blob(c, r() * W, H * (0.55 + r() * 0.45), (30 + r() * 40) * k, `rgba(255,${235 + r() * 20 | 0},${240 + r() * 15 | 0},0.92)`, r);
      for (let i = 0; i < 6; i++) blob(c, r() * W, H * r() * 0.4, (20 + r() * 25) * k, 'rgba(255,255,255,0.7)', r);
      c.strokeStyle = '#333'; c.lineWidth = 2 * k; for (let i = 0; i < 6; i++) { const x = r() * W, y = H * (0.1 + r() * 0.3), w = (6 + r() * 6) * k; c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x - w / 2, y - w / 2, x, y); c.quadraticCurveTo(x + w / 2, y - w / 2, x + w, y); c.stroke(); }
    },
    // 16 Sonbahar ormanı
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#ffb26b'], [0.6, '#ffe0b0'], [1, '#d9a066']]); c.fillRect(0, 0, W, H);
      ridge(c, W, H, H * 0.55, H * 0.1, '#e08a4a', r, 0.5);
      const cols = ['#e2531f', '#f08a24', '#f5b82e', '#b83a1b', '#d96b2b'];
      for (let layer = 0; layer < 3; layer++) for (let i = 0; i < 9; i++) {
        const x = r() * W, base = H * (0.62 + layer * 0.12), h = (90 + r() * 120) * k * (1 + layer * 0.3);
        c.fillStyle = '#4a2a18'; c.fillRect(x - 5 * k * (1 + layer), base - h * 0.6, 10 * k * (1 + layer), h * 0.6);
        for (let j = 0; j < 7; j++) blob(c, x + (r() - 0.5) * h * 0.5, base - h * (0.6 + r() * 0.4), h * 0.18, cols[r() * cols.length | 0], r);
      }
      c.fillStyle = '#a5562a'; c.fillRect(0, H * 0.92, W, H * 0.08);
      for (let i = 0; i < 150; i++) { c.fillStyle = cols[r() * cols.length | 0]; c.beginPath(); c.ellipse(r() * W, r() * H, 5 * k, 2.5 * k, r() * 3, 0, 7); c.fill(); }
    },
    // 17 Buzul denizi
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H * 0.55, [[0, '#4a8ac9'], [1, '#d5ecff']]); c.fillRect(0, 0, W, H);
      ridge(c, W, H, H * 0.55, H * 0.12, '#eaf6ff', r, 0.6);
      c.fillStyle = lg(c, 0, H * 0.55, 0, H, [[0, '#2a7bb8'], [1, '#0a2f5a']]); c.fillRect(0, H * 0.55, W, H * 0.45);
      for (let i = 0; i < 7; i++) {
        const x = r() * W, y = H * (0.6 + r() * 0.3), w = (60 + r() * 120) * k, h = w * (0.5 + r() * 0.6);
        c.fillStyle = lg(c, x - w, 0, x + w, 0, [[0, '#ffffff'], [0.6, '#cdeeff'], [1, '#7fc4ef']]);
        c.beginPath(); c.moveTo(x - w, y); c.lineTo(x - w * 0.6, y - h * 0.7); c.lineTo(x - w * 0.1, y - h); c.lineTo(x + w * 0.4, y - h * 0.6); c.lineTo(x + w, y); c.fill();
        c.fillStyle = 'rgba(120,200,255,0.35)'; c.beginPath(); c.moveTo(x - w, y); c.lineTo(x + w, y); c.lineTo(x + w * 0.7, y + h * 0.5); c.lineTo(x - w * 0.7, y + h * 0.5); c.fill();
      }
      for (let i = 0; i < 5; i++) { // penguenler
        const x = W * (0.2 + r() * 0.6), y = H * 0.95, s = (14 + r() * 6) * k;
        c.fillStyle = '#111'; c.beginPath(); c.ellipse(x, y - s, s * 0.6, s, 0, 0, 7); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x, y - s * 0.85, s * 0.38, s * 0.75, 0, 0, 7); c.fill();
        c.fillStyle = '#ff9f1c'; c.beginPath(); c.moveTo(x - s * 0.1, y - s * 1.55); c.lineTo(x + s * 0.1, y - s * 1.55); c.lineTo(x, y - s * 1.4); c.fill();
      }
    },
    // 18 Tropik ada
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H * 0.5, [[0, '#2ec5ff'], [1, '#c9f3ff']]); c.fillRect(0, 0, W, H);
      for (let i = 0; i < 6; i++) blob(c, r() * W, H * r() * 0.3, (25 + r() * 30) * k, 'rgba(255,255,255,0.9)', r);
      glow(c, W * 0.8, H * 0.15, 150 * k, 'rgba(255,255,200,0.9)');
      c.fillStyle = lg(c, 0, H * 0.5, 0, H * 0.8, [[0, '#0aa5c9'], [1, '#3fe0d0']]); c.fillRect(0, H * 0.5, W, H * 0.3);
      c.fillStyle = '#f5deb3'; c.beginPath(); c.moveTo(0, H * 0.78); c.quadraticCurveTo(W * 0.5, H * 0.68, W, H * 0.8); c.lineTo(W, H); c.lineTo(0, H); c.fill();
      c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 3 * k; c.beginPath(); c.moveTo(0, H * 0.77); c.quadraticCurveTo(W * 0.5, H * 0.67, W, H * 0.79); c.stroke();
      [[W * 0.15, H * 0.9, 1], [W * 0.3, H * 0.85, 0.8], [W * 0.85, H * 0.92, 1.1]].forEach(([x, y, sc]) => {
        const h = Math.min(W, H) * 0.4 * sc, tx = x + h * 0.25, ty = y - h;
        c.strokeStyle = '#7a5230'; c.lineWidth = 10 * k * sc; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + h * 0.05, y - h * 0.5, tx, ty); c.stroke();
        c.strokeStyle = '#1f9e4a'; c.lineWidth = 7 * k * sc;
        for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, L = h * 0.4; c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty - L * 0.3, tx + Math.cos(a) * L, ty + Math.abs(Math.sin(a)) * L * 0.4 + L * 0.15); c.stroke(); }
        c.fillStyle = '#5a3a1a'; for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(tx + (j - 1) * 8 * k, ty + 8 * k, 6 * k, 0, 7); c.fill(); }
      });
    },
    // 19 Galaksi girdabı
    function (c, W, H, r, k) {
      c.fillStyle = '#020108'; c.fillRect(0, 0, W, H);
      stars(c, W, H, 400, r, k);
      const cx = W / 2, cy = H / 2, m = Math.min(W, H);
      c.save(); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 2500; i++) {
        const arm = i % 3, d = Math.pow(r(), 0.7) * m * 0.48, a = arm * 2.094 + d / m * 9 + (r() - 0.5) * 0.6;
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.6;
        const t = d / (m * 0.48);
        c.fillStyle = t < 0.3 ? 'rgba(255,230,180,0.5)' : (r() < 0.5 ? 'rgba(120,160,255,0.45)' : 'rgba(255,120,200,0.4)');
        c.beginPath(); c.arc(x, y, (0.6 + r() * 1.8) * k, 0, 7); c.fill();
      }
      glow(c, cx, cy, m * 0.18, 'rgba(255,220,160,0.9)'); glow(c, cx, cy, m * 0.45, 'rgba(140,100,255,0.2)');
      c.restore();
    },
    // 20 Altın tapınak
    function (c, W, H, r, k) {
      c.fillStyle = lg(c, 0, 0, 0, H, [[0, '#2a0f3a'], [0.45, '#b33a3a'], [0.8, '#ffb347'], [1, '#ffe29a']]); c.fillRect(0, 0, W, H);
      glow(c, W / 2, H * 0.5, 300 * k, 'rgba(255,220,120,0.8)');
      ridge(c, W, H, H * 0.75, H * 0.15, '#4a1f2a', r, 0.55);
      const cx = W / 2, base = H * 0.82, s = Math.min(W, H) / 600;
      for (let i = 0; i < 5; i++) {
        const w = (300 - i * 50) * s, h = 35 * s, y = base - i * h;
        c.fillStyle = lg(c, cx - w / 2, 0, cx + w / 2, 0, [[0, '#8a5a00'], [0.4, '#ffd700'], [0.6, '#fff1a8'], [1, '#8a5a00']]);
        c.fillRect(cx - w / 2, y - h, w, h);
        c.fillStyle = 'rgba(80,40,0,0.4)'; c.fillRect(cx - w / 2, y - 4 * s, w, 4 * s);
      }
      c.fillStyle = '#3a1a00'; c.fillRect(cx - 18 * s, base - 70 * s, 36 * s, 70 * s);
      c.save(); c.globalCompositeOperation = 'lighter'; glow(c, cx, base - 5 * 35 * s - 30 * s, 90 * s, 'rgba(255,240,160,0.9)'); c.restore();
      c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(cx, base - 5 * 35 * s - 25 * s, 18 * s, 0, 7); c.fill();
      c.fillStyle = '#1a0a10'; c.fillRect(0, base, W, H - base);
      for (let i = 0; i < 2; i++) { const x = i ? W * 0.9 : W * 0.1; c.fillRect(x - 12 * s, base - 160 * s, 24 * s, 160 * s); c.fillStyle = '#ff9f1c'; glow(c, x, base - 170 * s, 25 * s, 'rgba(255,160,40,0.9)'); c.fillStyle = '#1a0a10'; }
    }
  ];

  function draw(i, W, H) {
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d');
    list[i % list.length](c, W, H, rng(1000 + i * 77), Math.min(W, H) / 800);
    return cv;
  }
  return { draw, count: list.length };
})();
