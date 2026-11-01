(() => {
  const fine = matchMedia("(pointer:fine)").matches;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $$ = s => [...document.querySelectorAll(s)];

  // Scroll progress bar
  const bar = Object.assign(document.createElement("div"), {className: "progress"});
  document.body.appendChild(bar);
  addEventListener("scroll", () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + "%";
  }, {passive: true});

  // Highlight the nav link of the section in view
  const links = $$("#links a");
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), {rootMargin: "-45% 0px -50% 0px"});
  $$("section[id]").forEach(s => spy.observe(s));

  // Fade-up reveal on scroll
  if (!still) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      setTimeout(() => e.target.classList.remove("reveal", "in"), 800);
      io.unobserve(e.target);
    }), {threshold: .12});
    $$("section h2, .timeline li, .cards li, .topic, .pubs li, .split > *").forEach(el => { el.classList.add("reveal"); io.observe(el); });
  }

  if (!fine || still) return;

  // Soft glow that follows the cursor
  const glow = Object.assign(document.createElement("div"), {className: "glow"});
  document.body.appendChild(glow);
  addEventListener("pointermove", e => { glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; glow.style.opacity = 1; }, {passive: true});
  document.addEventListener("pointerleave", () => glow.style.opacity = 0);

  // Card spotlight that tracks the cursor; tilt on research and collaborator cards
  $$(".timeline li, .cards li, .topic, .pubs li").forEach(el => {
    const tilt = el.matches(".cards li, .topic");
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px");
      if (tilt && !el.classList.contains("reveal")) el.style.transform = `perspective(700px) rotateX(${(.5 - y / r.height) * 7}deg) rotateY(${(x / r.width - .5) * 9}deg) translateY(-3px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.removeProperty("--mx"); el.style.removeProperty("--my"); if (tilt) el.style.transform = ""; });
  });

  // Magnetic buttons
  $$(".btn, .social a").forEach(b => {
    b.addEventListener("pointermove", e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    b.addEventListener("pointerleave", () => b.style.transform = "");
  });

  // Hero: move the cursor to leave a trail of galaxies; close pairs link up, click for a burst
  const hero = document.querySelector(".hero");
  const hint = hero.querySelector(".hint");
  if (hint) hint.textContent += " Move your cursor to scatter your own galaxies, and click for a burst.";
  const c = Object.assign(document.createElement("canvas"), {className: "trail"});
  hero.appendChild(c);
  const x = c.getContext("2d"); let pts = [], last = null;
  const fit = () => { c.width = hero.offsetWidth; c.height = hero.offsetHeight; }; fit(); addEventListener("resize", fit);
  const add = (px, py, v = .4) => { if (pts.length < 110) pts.push({x: px, y: py, vx: (Math.random() - .5) * v, vy: (Math.random() - .5) * v, life: 1}); };
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
    if (!last || Math.hypot(px - last.x, py - last.y) > 22) { add(px, py); last = {x: px, y: py}; }
  });
  hero.addEventListener("click", e => {
    if (e.target.closest("a")) return;
    const r = hero.getBoundingClientRect();
    for (let i = 0; i < 8; i++) add(e.clientX - r.left, e.clientY - r.top, 3);
  });
  (function loop() {
    x.clearRect(0, 0, c.width, c.height);
    pts = pts.filter(p => (p.life -= .004) > 0);
    for (const p of pts) { p.x += p.vx; p.y += p.vy; p.vx *= .985; p.vy *= .985;
      x.fillStyle = `rgba(255,255,255,${p.life})`; x.beginPath(); x.arc(p.x, p.y, 2.2, 0, 6.3); x.fill(); }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 60) { x.strokeStyle = `rgba(240,170,90,${(1 - d / 60) * Math.min(pts[i].life, pts[j].life)})`; x.beginPath(); x.moveTo(pts[i].x, pts[i].y); x.lineTo(pts[j].x, pts[j].y); x.stroke(); } }
    requestAnimationFrame(loop);
  })();
})();
