(() => {
  const list = document.getElementById("nt-list"); if (!list) return;
  const q = document.getElementById("nt-q"), tagsEl = document.getElementById("nt-tags");
  let tag = "all";
  const tags = ["all", ...new Set(NOTES.flatMap(n => n.tags))];
  tagsEl.innerHTML = tags.map(t => `<button class="chip${t === "all" ? " on" : ""}" data-t="${t}">${t}</button>`).join("");
  const esc = s => String(s).replace(/[&<>]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c]));
  const aid = n => (n.arxiv.match(/(\d{4}\.\d{4,5})/) || [])[1];
  const key = n => ((n.authors.split(/[ ,]/)[0] || "anon") + n.year + (n.title.split(" ").find(w => w.length > 3) || "")).replace(/\W/g, "");
  const bib = n => `@article{${key(n)},\n  title = {${n.title}},\n  author = {${n.authors.includes(" and ") ? n.authors : "{" + n.authors + "}"}},\n  year = {${n.year}}${aid(n) ? `,\n  eprint = {${aid(n)}},\n  archivePrefix = {arXiv},\n  url = {${n.arxiv}}` : ""}\n}`;
  const md = n => `## ${n.title}\n*${n.authors}, ${n.year}* [${n.status}] ${n.arxiv}\n- Question: ${n.q}\n- Method and data: ${n.m}\n- Result: ${n.r}\n- Relevance to my work: ${n.me}\n`;
  const save = (name, text) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], {type: "text/plain"})); a.download = name; a.click(); URL.revokeObjectURL(a.href); };
  const tools = document.createElement("div"); tools.className = "tools";
  tools.innerHTML = `<button class="mini" data-a="bib">Export all as .bib</button><button class="mini" data-a="md">Export notes as Markdown</button>`;
  list.before(tools);
  tools.onclick = e => { const a = e.target.dataset.a; if (a === "bib") save("reading-list.bib", NOTES.map(bib).join("\n\n")); if (a === "md") save("reading-notes.md", NOTES.map(md).join("\n")); };
  function draw() {
    const k = q.value.toLowerCase();
    const rows = NOTES.map((n, i) => [n, i]).filter(([n]) => (tag === "all" || n.tags.includes(tag)) && JSON.stringify(n).toLowerCase().includes(k));
    list.innerHTML = rows.map(([n, i]) => `<details class="note"><summary><span class="st ${n.status}">${n.status}</span><strong>${esc(n.title)}</strong><small>${esc(n.authors)} · ${n.year}</small></summary>
      <dl><dt>Question</dt><dd>${esc(n.q)}</dd><dt>Method and data</dt><dd>${esc(n.m)}</dd><dt>Result</dt><dd>${esc(n.r)}</dd><dt>Relevance to my work</dt><dd>${esc(n.me)}</dd></dl>
      <p>${n.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")} ${n.arxiv ? `<a href="${n.arxiv}">arXiv ↗</a>` : ""} <button class="mini" data-c="${i}">Copy BibTeX</button></p></details>`).join("") || "<p>No notes match.</p>";
  }
  list.onclick = e => { const i = e.target.dataset.c; if (i == null) return; navigator.clipboard.writeText(bib(NOTES[i])).then(() => { e.target.textContent = "Copied"; setTimeout(() => e.target.textContent = "Copy BibTeX", 1500); }); };
  q.oninput = draw;
  tagsEl.onclick = e => { if (!e.target.dataset.t) return; tag = e.target.dataset.t; tagsEl.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.t === tag)); draw(); };
  draw();
})();
