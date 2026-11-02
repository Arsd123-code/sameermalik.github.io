(() => {
  const sky = document.getElementById("sky"); if (!sky) return;
  sky.style.display = "none";
  const hero = sky.parentElement, c = document.createElement("canvas"); c.className = "web"; hero.insertBefore(c, sky);
  const x = c.getContext("2d"), still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const R = () => Math.random() * 2 - 1, g = () => (Math.random() + Math.random() + Math.random() - 1.5) * .09;
  const nodes = Array.from({length: 13}, () => [R(), R(), R()]);
  const P = Array.from({length: 440}, () => { const a = nodes[Math.random() * 13 | 0], b = nodes[Math.random() * 13 | 0], t = Math.random(); return [0, 1, 2].map(i => a[i] + (b[i] - a[i]) * t + g()); });
  let W, H, base = 0, mx = .5, my = .5, rx = 0, ry = 0, on = false;
  const fit = () => { W = c.width = hero.offsetWidth; H = c.height = hero.offsetHeight; }; fit(); addEventListener("resize", fit);
  hero.addEventListener("pointermove", e => { const r = hero.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; });
  const btn = document.createElement("button"); btn.className = "btn ghost"; btn.textContent = "Apply fiber collisions: off";
  const info = document.createElement("p"); info.className = "hint";
  hero.querySelector(".hero-text").append(btn, info);
  btn.onclick = () => { on = !on; btn.textContent = "Apply fiber collisions: " + (on ? "on" : "off"); };
  (function loop() {
    x.clearRect(0, 0, W, H);
    base += still ? 0 : .0016; ry += (base + (mx - .5) * 1.4 - ry) * .05; rx += ((my - .5) * .9 - rx) * .05;
    const S = Math.min(W, H) * .4, cx = W > 760 ? W * .68 : W / 2, cy = H / 2, cr = Math.cos(ry), sr = Math.sin(ry), cp = Math.cos(rx), sp = Math.sin(rx);
    const Q = P.map(p => { const X = p[0] * cr - p[2] * sr, Z0 = p[0] * sr + p[2] * cr, Y = p[1] * cp - Z0 * sp, Z = p[1] * sp + Z0 * cp, f = 3 / (3 + Z); return {x: cx + X * S * f, y: cy + Y * S * f, f, lost: false}; });
    const lim = 9, links = [];
    for (let i = 0; i < Q.length; i++) for (let j = i + 1; j < Q.length; j++) { const d = Math.hypot(Q[i].x - Q[j].x, Q[i].y - Q[j].y); if (d < lim) { links.push([Q[i], Q[j], d]); if (on && !Q[i].lost && !Q[j].lost) Q[j].lost = true; } }
    for (const [a, b, d] of links) { if (on && (a.lost || b.lost) === false) continue; x.strokeStyle = `rgba(240,170,90,${.8 - d / lim * .6})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
    let lost = 0;
    for (const q of Q) { if (q.lost) { lost++; x.strokeStyle = "rgba(255,110,110,.9)"; x.beginPath(); x.arc(q.x, q.y, 3.2 * q.f, 0, 6.3); x.stroke(); } else { x.fillStyle = `rgba(207,224,255,${.35 + q.f * .4})`; x.beginPath(); x.arc(q.x, q.y, 1.5 * q.f + .4, 0, 6.3); x.fill(); } }
    info.textContent = on ? `${lost} of ${Q.length} galaxies (${(lost / Q.length * 100).toFixed(0)}%) lost to fiber collisions (red rings). Their pairs vanish from the small scales.` : "Drag the cursor to rotate this toy cosmic web, then switch collisions on.";
    requestAnimationFrame(loop);
  })();
})();
