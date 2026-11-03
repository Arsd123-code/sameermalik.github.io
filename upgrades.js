(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Toast helper
  const toast = Object.assign(document.createElement("div"), {className: "toast", role: "status"});
  toast.setAttribute("aria-live", "polite"); document.body.appendChild(toast);
  let tt; const say = m => { toast.textContent = m; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2200); };
  const copy = async t => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };

  // Back-to-top button
  const top = Object.assign(document.createElement("button"), {className: "totop", type: "button", textContent: "↑"});
  top.setAttribute("aria-label", "Back to top"); document.body.appendChild(top);
  top.onclick = () => scrollTo({top: 0, behavior: still ? "auto" : "smooth"});
  addEventListener("scroll", () => top.classList.toggle("show", scrollY > 700), {passive: true});

  // Mobile menu: close after choosing a link or pressing Escape (does not touch your existing toggle)
  const menuBtn = $(".menu"), links = $("#links");
  const closeMenu = () => { if (links && links.classList.contains("open")) { links.classList.remove("open"); menuBtn && menuBtn.setAttribute("aria-expanded", "false"); } };
  links && links.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });
  addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  // Safer external links, lazy images
  $$('a[target="_blank"]').forEach(a => a.rel = "noopener noreferrer");
  $$("img").forEach(i => { if (!i.closest(".hero") && i.getAttribute("src") !== "images/profile.jpg") i.loading = "lazy"; i.decoding = "async"; });

  // Copy-email button
  const mail = $('a[href^="mailto:"]');
  if (mail) { const b = Object.assign(document.createElement("button"), {type: "button", className: "mini copy", textContent: "Copy"}); b.setAttribute("aria-label", "Copy email address");
    b.onclick = async () => say(await copy(mail.textContent.trim()) ? "Email copied" : "Copy failed"); mail.after(b); }

  // Click a section's link icon to copy a deep link
  $$("main section[id] > h2").forEach(h => {
    const id = h.parentElement.id, b = Object.assign(document.createElement("button"), {type: "button", className: "anchor", textContent: "#"});
    b.setAttribute("aria-label", "Copy link to this section");
    b.onclick = async () => { history.replaceState(null, "", "#" + id); say(await copy(location.href) ? "Section link copied" : "Link: " + location.href); };
    h.appendChild(b);
  });

  // Keep the URL hash in sync with the section in view
  const sync = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.target.id !== "home") history.replaceState(null, "", "#" + e.target.id); }), {rootMargin: "-45% 0px -50% 0px"});
  $$("main section[id]").forEach(s => sync.observe(s));

  // "/" focuses the nearest search box
  addEventListener("keydown", e => {
    if (e.key !== "/" || /input|textarea|select/i.test(document.activeElement.tagName)) return;
    const q = $("#res-q"), n = $("#nt-q"), vis = el => el && el.getBoundingClientRect().top < innerHeight && el.getBoundingClientRect().bottom > 0;
    const t = vis(n) ? n : q; if (t) { e.preventDefault(); t.scrollIntoView({block: "center"}); t.focus(); }
  });

  // Contact form: send in place with clear status, honeypot and a duplicate-send guard
  const f = $("#contact form");
  if (f) {
    f.insertAdjacentHTML("afterbegin", '<input class="hp" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true">');
    const st = Object.assign(document.createElement("p"), {className: "formstatus"}); st.setAttribute("role", "status"); f.appendChild(st);
    f.addEventListener("submit", async e => {
      e.preventDefault(); const btn = f.querySelector("button[type=submit]"); btn.disabled = true; st.className = "formstatus"; st.textContent = "Sending…";
      try {
        const r = await fetch(f.action, {method: "POST", body: new FormData(f), headers: {Accept: "application/json"}});
        if (!r.ok) throw 0; f.reset(); st.className = "formstatus ok"; st.textContent = "Thanks! Your message was sent. I will reply by email."; say("Message sent");
      } catch { st.className = "formstatus err"; st.textContent = "Could not send. Please try again or email me directly."; }
      btn.disabled = false;
    });
  }

  // Footer year fallback and tab-title hint
  const yr = $("#yr"); if (yr && !yr.textContent) yr.textContent = new Date().getFullYear();
})();
