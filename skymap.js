(() => {
  const cv = document.getElementById("sky-map"); if (!cv) return;
  const W = cv.width = 720, H = cv.height = 360, x = cv.getContext("2d"), D = Math.PI / 180, S2 = Math.SQRT2;
  // Schematic footprints from simple cuts in Dec, Galactic latitude b and ecliptic latitude e (approximate, not survey masks).
  const SV = [
    {id: "desi", n: "DESI", c: [31, 111, 139], f: (d, b) => d > -18 && d < 77 && Math.abs(b) > 30},
    {id: "sdss", n: "SDSS / BOSS", c: [240, 150, 60], f: (d, b) => d > -10 && d < 70 && Math.abs(b) > 30 && (b > 0 || d < 35)},
    {id: "euclid", n: "Euclid", c: [130, 90, 200], f: (d, b, e) => Math.abs(e) > 15 && Math.abs(b) > 30},
    {id: "6df", n: "6dFGS", c: [110, 130, 160], f: (d, b) => d < 0 && Math.abs(b) > 20}
  ];
  const sd = Math.sin(27.128 * D), cd = Math.cos(27.128 * D), se = Math.sin(23.44 * D), ce = Math.cos(23.44 * D);
  const N = W * H, A = new Float32Array(N), Dc = new Float32Array(N), B = new Float32Array(N), E = new Float32Array(N), V = new Uint8Array(N);
  let tot = 0;
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
    const X = ((px + .5) / W - .5) * 4 * S2, Y = (.5 - (py + .5) / H) * 2 * S2, t = Math.asin(Y / S2), ct = Math.cos(t);
    const lon = Math.PI * X / (2 * S2 * ct); if (!(Math.abs(lon) <= Math.PI)) continue;
    const lat = Math.asin((2 * t + Math.sin(2 * t)) / Math.PI), a = 180 - lon / D, d = lat / D, i = py * W + px;
    A[i] = a; Dc[i] = d; V[i] = 1; tot++;
    B[i] = Math.asin(Math.sin(lat) * sd + Math.cos(lat) * cd * Math.cos((a - 192.859) * D)) / D;
    E[i] = Math.asin(Math.sin(lat) * ce - Math.cos(lat) * se * Math.sin(a * D)) / D;
  }
  const on = Object.fromEntries(SV.map(s => [s.id, true])), area = {};
  const cover = i => SV.filter(s => on[s.id] && s.f(Dc[i], B[i], E[i]));
  function render() {
    const img = x.createImageData(W, H), px = img.data; SV.forEach(s => area[s.id] = 0);
    for (let i = 0; i < N; i++) { if (!V[i]) continue; const o = i * 4, all = SV.filter(s => s.f(Dc[i], B[i], E[i]));
      all.forEach(s => area[s.id]++);
      const act = all.filter(s => on[s.id]);
      if (act.length) { px[o] = act.reduce((q, s) => q + s.c[0], 0) / act.length; px[o + 1] = act.reduce((q, s) => q + s.c[1], 0) / act.length; px[o + 2] = act.reduce((q, s) => q + s.c[2], 0) / act.length; px[o + 3] = Math.min(235, 120 + 55 * act.length); }
      const g = Math.abs(B[i]) < .6, ec = Math.abs(E[i]) < .45, pl = Math.abs(Dc[i] - 30 * Math.round(Dc[i] / 30)) < .4;
      if (g) { px[o] = px[o + 1] = px[o + 2] = 120; px[o + 3] = 210; } else if (ec) { px[o] = 90; px[o + 1] = 140; px[o + 2] = 200; px[o + 3] = 170; } else if (pl && !act.length) { px[o] = px[o + 1] = px[o + 2] = 150; px[o + 3] = 90; } }
    x.clearRect(0, 0, W, H); x.putImageData(img, 0, 0);
    x.strokeStyle = "rgba(130,140,160,.8)"; x.lineWidth = 1.5; x.beginPath(); x.ellipse(W / 2, H / 2, W / 2 - 1, H / 2 - 1, 0, 0, 6.3); x.stroke();
    leg.querySelectorAll(".chip").forEach(b => { const s = SV.find(q => q.id === b.dataset.id); b.querySelector("em").textContent = ` ~${Math.round(area[s.id] / tot * 41253).toLocaleString()} deg²`; });
  }
  const leg = document.getElementById("sky-legend"), read = document.getElementById("sky-read");
  leg.innerHTML = SV.map(s => `<button class="chip on" data-id="${s.id}"><i class="sw" style="background:rgb(${s.c})"></i>${s.n}<em></em></button>`).join("") +
    `<span class="mapread">Grey line: Galactic plane · blue line: ecliptic</span>`;
  leg.onclick = e => { const b = e.target.closest(".chip"); if (!b) return; on[b.dataset.id] = !on[b.dataset.id]; b.classList.toggle("on", on[b.dataset.id]); render(); };
  cv.addEventListener("pointermove", e => {
    const r = cv.getBoundingClientRect(), px = Math.floor((e.clientX - r.left) * W / r.width), py = Math.floor((e.clientY - r.top) * H / r.height), i = py * W + px;
    if (!V[i]) { read.textContent = ""; return; }
    const names = SV.filter(s => s.f(Dc[i], B[i], E[i])).map(s => s.n);
    read.textContent = `RA ${A[i].toFixed(0)}°, Dec ${Dc[i].toFixed(0)}° · ${names.length ? "covered by " + names.join(", ") : "no survey here"}`;
  });
  render();
})();
