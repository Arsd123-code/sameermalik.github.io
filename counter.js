(() => {
  const box = document.getElementById("visits");
  if (!box || typeof GC_CODE === "undefined" || !GC_CODE) return;
  const s = document.createElement("script");
  s.async = true; s.src = "https://gc.zgo.at/count.js";
  s.dataset.goatcounter = `https://${GC_CODE}.goatcounter.com/count`;
  document.body.appendChild(s);
  // Wait a moment so this visit is recorded, then show the running total.
  setTimeout(() => fetch(`https://${GC_CODE}.goatcounter.com/counter/TOTAL.json`)
    .then(r => r.json()).then(j => { box.textContent = `Visits: ${j.count}`; })
    .catch(() => { box.textContent = ""; }), 1500);
})();
