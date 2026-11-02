(() => {
  const list = document.getElementById("nt-list"); if (!list) return;
  const q = document.getElementById("nt-q"), tagsEl = document.getElementById("nt-tags");
  let tag = "all";
  const tags = ["all", ...new Set(NOTES.flatMap(n => n.tags))];
  tagsEl.innerHTML = tags.map(t => `<button class="chip${t === "all" ? " on" : ""}" data-t="${t}">${t}</button>`).join("");
  const esc = s => String(s).replace(/[&<>]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c]));
  function draw() {
    const k = q.value.toLowerCase();
    const rows = NOTES.filter(n => (tag === "all" || n.tags.includes(tag)) && JSON.stringify(n).toLowerCase().includes(k));
    list.innerHTML = rows.map(n => `<details class="note"><summary><span class="st ${n.status}">${n.status}</span><strong>${esc(n.title)}</strong><small>${esc(n.authors)} · ${n.year}</small></summary>
      <dl><dt>Question</dt><dd>${esc(n.q)}</dd><dt>Method and data</dt><dd>${esc(n.m)}</dd><dt>Result</dt><dd>${esc(n.r)}</dd><dt>Relevance to my work</dt><dd>${esc(n.me)}</dd></dl>
      <p>${n.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")} ${n.arxiv ? `<a href="${n.arxiv}">arXiv ↗</a>` : ""}</p></details>`).join("") || "<p>No notes match.</p>";
  }
  q.oninput = draw;
  tagsEl.onclick = e => { if (!e.target.dataset.t) return; tag = e.target.dataset.t; tagsEl.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.t === tag)); draw(); };
  draw();
})();
