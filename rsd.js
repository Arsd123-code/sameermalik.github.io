(() => {
  const cv = document.getElementById("rsd"); if (!cv) return;
  const x = cv.getContext("2d"), W = cv.width = 900, H = cv.height = 420, R = Math.random;
  const g = () => (R() + R() + R() + R() - 2) * 1.7;
  const cl = Array.from({length: 7}, () => [90 + R() * 720, 60 + R() * 300]);
  const pts = [];
  cl.forEach(c => { for (let i = 0; i < 70; i++) pts.push({x: c[0] + g() * 22, y: c[1] + g() * 22, c, v: g()}); });
  for (let i = 0; i < 160; i++) pts.push({x: R() * W, y: R() * H, c: null, v: g()});
  const fog = document.getElementById("rsd-fog"), kai = document.getElementById("rsd-kai");
  function draw() {
    x.clearRect(0, 0, W, H);
    const sig = +fog.value, beta = +kai.value;
    // Observer sits at the bottom; the line of sight is the vertical axis.
    for (const p of pts) {
      let y = p.y + p.v * sig * 14;
      if (p.c) y = p.c[1] + (y - p.c[1]) * (1 - beta);
      x.fillStyle = p.c ? "rgba(155,61,43,.85)" : "rgba(34,29,23,.45)";
      x.beginPath(); x.arc(p.x, Math.min(H - 2, Math.max(2, y)), 2, 0, 6.3); x.fill();
    }
    x.fillStyle = "rgba(34,29,23,.6)"; x.font = "14px sans-serif"; x.fillText("▼ observer (line of sight is vertical)", 12, H - 8);
  }
  fog.oninput = kai.oninput = draw; draw();
})();
