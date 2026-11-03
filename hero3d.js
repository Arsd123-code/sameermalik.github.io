(() => {
  const sky = document.getElementById("sky"); if (!sky) return;
  sky.style.display = "none";
  const hero = sky.parentElement;

  const c = document.createElement("canvas");
  c.className = "web";
  c.setAttribute("role", "img");
  c.setAttribute("aria-label",
    "Rotating toy cosmic web. Toggle fiber collisions to see how close galaxy pairs become unobservable.");
  hero.insertBefore(c, sky);
  const x = c.getContext("2d");

  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let still = reduce.matches;
  if (reduce.addEventListener) reduce.addEventListener("change", e => still = e.matches);

  // Deterministic seed: the demo is the same on every reload, so a talk can
  // point at a specific feature.
  let s = 1234567;
  const rand = () => (s = (s * 16807) % 2147483647, s / 2147483647);
  const R = () => rand() * 2 - 1;
  const g = () => (rand() + rand() + rand() - 1.5) * .09;

  const nodes = Array.from({ length: 13 }, () => [R(), R(), R()]);
  const P = Array.from({ length: 440 }, () => {
    const a = nodes[rand() * 13 | 0], b = nodes[rand() * 13 | 0], t = rand();
    return [0, 1, 2].map(i => a[i] + (b[i] - a[i]) * t + g());
  });

  let W, H, base = 0, mx = .5, my = .5, rx = 0, ry = 0, on = false;
  let running = true;

  const fit = () => { W = c.width = hero.offsetWidth; H = c.height = hero.offsetHeight; };
  fit(); addEventListener("resize", fit);

  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width;
    my = (e.clientY - r.top) / r.height;
    if (still) draw();
  });
  hero.addEventListener("keydown", e => {
    const step = .05, k = e.key;
    if (k === "ArrowLeft")  { mx = Math.max(0, mx - step); e.preventDefault(); }
    else if (k === "ArrowRight") { mx = Math.min(1, mx + step); e.preventDefault(); }
    else if (k === "ArrowUp")    { my = Math.max(0, my - step); e.preventDefault(); }
    else if (k === "ArrowDown")  { my = Math.min(1, my + step); e.preventDefault(); }
    else return;
    if (still) draw();
  });

  const btn = document.createElement("button");
  btn.className = "btn ghost"; btn.type = "button";
  btn.setAttribute("aria-pressed", "false");
  btn.textContent = "Apply fiber collisions: off";
  const info = document.createElement("p");
  info.className = "hint";
  info.setAttribute("aria-live", "polite");
  hero.querySelector(".hero-text").append(btn, info);

  btn.onclick = () => {
    on = !on;
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = "Apply fiber collisions: " + (on ? "on" : "off");
    if (still) draw();
  };

  // Pause when the hero is out of view; saves battery on phones.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!running) { running = true; requestAnimationFrame(tick); }
      } else {
        running = false;
      }
    }, { threshold: 0.02 }).observe(hero);
  }

  function tick() {
    if (!running) return;
    if (still) { draw(); return; }
    base += .0016;
    draw();
    requestAnimationFrame(tick);
  }

  function draw() {
    x.clearRect(0, 0, W, H);
    ry += (base + (mx - .5) * 1.4 - ry) * .05;
    rx += ((my - .5) * .9 - rx) * .05;

    const S = Math.min(W, H) * .4;
    const cx = W > 760 ? W * .68 : W / 2, cy = H / 2;
    const cr = Math.cos(ry), sr = Math.sin(ry), cp = Math.cos(rx), sp = Math.sin(rx);

    const Q = P.map(p => {
      const X = p[0] * cr - p[2] * sr;
      const Z0 = p[0] * sr + p[2] * cr;
      const Y = p[1] * cp - Z0 * sp;
      const Z = p[1] * sp + Z0 * cp;
      const f = 3 / (3 + Z);
      return { x: cx + X * S * f, y: cy + Y * S * f, f, lost: false };
    });

    const lim = 9, links = [];
    for (let i = 0; i < Q.length; i++) for (let j = i + 1; j < Q.length; j++) {
      const d = Math.hypot(Q[i].x - Q[j].x, Q[i].y - Q[j].y);
      if (d < lim) {
        links.push([Q[i], Q[j], d]);
        if (on && !Q[i].lost && !Q[j].lost) Q[j].lost = true;
      }
    }

    // FIXED: drop the link if either endpoint is lost (fiber cannot observe both).
    for (const [a, b, d] of links) {
      if (on && (a.lost || b.lost)) continue;
      x.strokeStyle = `rgba(240,170,90,${.8 - d / lim * .6})`;
      x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
    }

    let lost = 0;
    for (const q of Q) {
      if (q.lost) {
        lost++;
        x.strokeStyle = "rgba(255,110,110,.9)";
        x.beginPath(); x.arc(q.x, q.y, 3.2 * q.f, 0, 6.3); x.stroke();
      } else {
        x.fillStyle = `rgba(207,224,255,${.35 + q.f * .4})`;
        x.beginPath(); x.arc(q.x, q.y, 1.5 * q.f + .4, 0, 6.3); x.fill();
      }
    }

    info.textContent = on
      ? `${lost} of ${Q.length} galaxies (${(lost / Q.length * 100).toFixed(0)}%) lost to fiber collisions (red rings). Their close pairs vanish from the map.`
      : "Move the cursor (or use the arrow keys) to rotate this toy cosmic web, then switch collisions on.";
  }

  requestAnimationFrame(tick);
})();
