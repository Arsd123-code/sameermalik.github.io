(() => {
  const cv = document.getElementById("rsd"); if (!cv) return;
  const x = cv.getContext("2d");
  const W = cv.width = 900, H = cv.height = 420;

  // Deterministic demo: same toy sky on every reload.
  let s = 1234567;
  const rand = () => (s = (s * 16807) % 2147483647, s / 2147483647);
  const g = () => (rand() + rand() + rand() + rand() - 2) * 1.7;

  const cl = Array.from({ length: 7 }, () => [90 + rand() * 720, 60 + rand() * 300]);
  const pts = [];
  cl.forEach(c => {
    for (let i = 0; i < 70; i++)
      pts.push({ x: c[0] + g() * 22, y: c[1] + g() * 22, c, v: g() });
  });
  for (let i = 0; i < 160; i++)
    pts.push({ x: rand() * W, y: rand() * H, c: null, v: g() });

  const fog = document.getElementById("rsd-fog");
  const kai = document.getElementById("rsd-kai");
  const fmt = v => (+v).toFixed(2);

  function draw() {
    x.clearRect(0, 0, W, H);
    const sig = +fog.value;    // FOG amplitude (random velocities within clusters)
    const beta = +kai.value;   // Kaiser β (coherent infall toward cluster centre)

    // Reference grid so the eye can see stretching/compression.
    x.strokeStyle = "rgba(34,29,23,.06)"; x.lineWidth = 1;
    for (let gy = 40; gy < H; gy += 60) { x.beginPath(); x.moveTo(0, gy); x.lineTo(W, gy); x.stroke(); }

    for (const p of pts) {
      let y = p.y;
      if (p.c) {
        // Fingers of God: random velocity along LOS → stretch cluster.
        y += p.v * sig * 12;
        // Kaiser: coherent infall → squash cluster toward its centre.
        y = p.c[1] + (y - p.c[1]) * (1 - beta);
      } else {
        // Field galaxies: only a small random velocity; no cluster to squash.
        y += p.v * sig * 2.5;
      }
      x.fillStyle = p.c ? "rgba(155,61,43,.85)" : "rgba(34,29,23,.35)";
      x.beginPath(); x.arc(p.x, Math.min(H - 2, Math.max(2, y)), 2, 0, 6.3); x.fill();
    }

    // Axis + live readout.
    x.fillStyle = "rgba(34,29,23,.7)"; x.font = "13px sans-serif";
    x.fillText("▼ observer", 12, H - 14);
    x.fillText("line of sight ↑", 12, 22);
    x.fillText(`FOG σ = ${fmt(sig)}    Kaiser β = ${fmt(beta)}`, W - 260, 22);
    x.fillStyle = "rgba(155,61,43,.85)"; x.fillText("● cluster galaxy", W - 260, 40);
    x.fillStyle = "rgba(34,29,23,.5)";  x.fillText("● field galaxy",   W - 260, 58);
  }

  fog.oninput = kai.oninput = draw;
  draw();
})();
