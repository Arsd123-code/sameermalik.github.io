// Enforces README rule #2: a dataset ships only when its license is verified.
// Enforces README rule #3: nothing is published without a citation.
// No dependencies. Run: node tests/sources.test.mjs

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const data = JSON.parse(await readFile("./data/SOURCES.json", "utf8"));

assert.ok(typeof data._policy === "string", "missing _policy");
assert.ok(Array.isArray(data.datasets), "datasets must be an array");

const seen = new Set();
for (const d of data.datasets) {
  // id
  assert.ok(d.id && /^[a-z0-9_]+$/.test(d.id), `bad id: ${JSON.stringify(d.id)}`);
  assert.ok(!seen.has(d.id), `duplicate id: ${d.id}`);
  seen.add(d.id);

  // used_in
  assert.ok(Array.isArray(d.used_in) && d.used_in.length > 0,
    `${d.id}: used_in must be a non-empty array`);

  // enumerations
  assert.ok(["to_verify", "verified", "rejected"].includes(d.license_status),
    `${d.id}: bad license_status: ${d.license_status}`);
  assert.ok(["data", "link_only", "derived"].includes(d.ship),
    `${d.id}: bad ship: ${d.ship}`);

  // verified ⇒ must name who/when/where
  if (d.license_status === "verified") {
    assert.ok(d.verified_by, `${d.id}: verified but missing verified_by`);
    assert.ok(d.verified_on, `${d.id}: verified but missing verified_on`);
    assert.ok(d.license_url, `${d.id}: verified but missing license_url`);
    assert.equal(typeof d.values_verified, "boolean",
      `${d.id}: verified but values_verified is not boolean`);
  }

  // shipped as data ⇒ license must be verified AND citation present
  if (d.ship === "data") {
    assert.equal(d.license_status, "verified",
      `${d.id}: ship=data but license_status=${d.license_status}`);
    assert.ok(d.citation && d.citation.length > 0,
      `${d.id}: ship=data but no citation`);
    assert.ok(d.arxiv || d.doi,
      `${d.id}: ship=data but no arxiv/doi`);
  }

  // per-value verification entries must have a name
  if (Array.isArray(d.values)) {
    for (const v of d.values) {
      assert.ok(v.name, `${d.id}: value entry missing name`);
      assert.equal(typeof v.verified, "boolean",
        `${d.id}/${v.name}: verified must be boolean`);
      if (v.verified) {
        assert.ok(v.table || v.verified_on,
          `${d.id}/${v.name}: verified but no table and no verified_on`);
      }
    }
  }
}

console.log(`SOURCES.json OK: ${data.datasets.length} datasets`);
console.log(`Verified: ${data.datasets.filter(d => d.license_status === "verified").length}`);
console.log(`Data-shipping: ${data.datasets.filter(d => d.ship === "data").length}`);