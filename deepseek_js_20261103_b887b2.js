// Enforces the README promise: a value is only rendered if its dataset
// is license_status: "verified" AND that specific value is verified.

import { PLANCK2018, DESI_DR2, SPEED_OF_LIGHT_KM_S } from "./constants.js";

const BLOCKS = {
  planck2018: PLANCK2018,
  desi_dr2:   DESI_DR2,
  si:         { source_id: "si_definition", c_km_s: SPEED_OF_LIGHT_KM_S },
};

let registryPromise = null;

async function load() {
  if (registryPromise) return registryPromise;
  registryPromise = (async () => {
    try {
      const res = await fetch("./data/SOURCES.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return Object.fromEntries(json.datasets.map(d => [d.id, d]));
    } catch (e) {
      console.error("[provenance] could not load SOURCES.json:", e);
      return {};
    }
  })();
  return registryPromise;
}

export async function isVerified(blockName, key) {
  const byId = await load();
  const block = BLOCKS[blockName];
  if (!block) return false;
  const ds = byId[block.source_id];
  if (!ds || ds.license_status !== "verified") return false;
  const entry = block[key];
  if (!entry || entry.kind !== "measurement") return false;
  const v = (ds.values || []).find(x => x.name === entry.name || x.name === key);
  return !!(v && v.verified);
}

// Render a value into an element. If not verified, render a lock instead.
// Usage: <span class="val" data-block="planck2018" data-key="H0"></span>
export async function showValue(el, blockName, key) {
  const block = BLOCKS[blockName];
  const entry = block && block[key];
  const ok = await isVerified(blockName, key);

  if (!ok || !entry) {
    el.classList.add("value--locked");
    el.innerHTML = `<span aria-label="value not shown">—</span>
      <small>not shown: <code>${blockName}.${key}</code> awaiting license verification</small>`;
    return;
  }

  const sigma = entry.sigma ? ` ± ${entry.sigma}` : "";
  const unit = entry.unit ? ` <small>${entry.unit}</small>` : "";
  const link = `<a href="#source-${block.source_id}" aria-label="see source">source</a>`;
  el.innerHTML = `${entry.value}${sigma}${unit} ${link}`;
}

// Scan the DOM for elements with data-block + data-key and fill them.
export function hydrate(root = document) {
  root.querySelectorAll("[data-block][data-key]").forEach(el => {
    showValue(el, el.dataset.block, el.dataset.key);
  });
}