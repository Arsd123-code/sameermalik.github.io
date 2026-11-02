(() => {
  const $ = s => document.querySelector(s), MAXZ = 3.6;
  const chart = $("#sv-chart"), det = $("#sv-detail"), chips = $("#sv-chips");
  if (!chart) return;
  const lab = {done: "Completed", run: "Running", future: "Planned"};
  let filter = "all";
  const show = s => det.innerHTML = `<h3>${s.n}</h3><p><b>Redshift</b> ${s.z[0]} – ${s.z[1]} · <b>Area</b> ${s.area} · <b>Size</b> ${s.N}</p><p><b>Instrument</b> ${s.t} · <b>Status</b> ${lab[s.s]}</p><p>${s.d}</p>`;
  function draw() {
    const ticks = [0, .5, 1, 1.5, 2, 3].map(z => `<i style="left:${z / MAXZ * 100}%">z=${z}</i>`).join("");
    chart.innerHTML = `<div class="zaxis"><span></span><div>${ticks}</div></div>` + SURVEYS.filter(s => filter === "all" || s.s === filter).map((s, i) =>
      `<button class="zrow" data-i="${SURVEYS.indexOf(s)}"><span>${s.n}</span><div class="ztrack"><b class="${s.s}" style="left:${s.z[0] / MAXZ * 100}%;width:${(s.z[1] - s.z[0]) / MAXZ * 100}%"></b></div></button>`).join("");
    chart.querySelectorAll(".zrow").forEach(b => { const f = () => show(SURVEYS[b.dataset.i]); b.onclick = b.onmouseenter = b.onfocus = f; });
  }
  chips.innerHTML = ["all", "done", "run", "future"].map(k => `<button class="chip${k === "all" ? " on" : ""}" data-k="${k}">${k === "all" ? "All" : lab[k]}</button>`).join("");
  chips.onclick = e => { const k = e.target.dataset.k; if (!k) return; filter = k; chips.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c.dataset.k === k)); draw(); };
  draw(); show(SURVEYS.find(s => s.n === "DESI · LRG"));
  $("#desi-box").innerHTML = Object.entries({Fibers: DESI.fibers, Telescope: DESI.tel, Footprint: DESI.area, "5-year goal": DESI.goal, "Data Release 1": DESI.dr1, "Data Release 2": DESI.dr2}).map(([k, v]) => `<li><h3>${k}</h3><p>${v}</p></li>`).join("");
})();
