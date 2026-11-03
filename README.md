# Cosmos site: foundation (step 0)

Implements the hard constraints before any visual work.

## Rules enforced
1. Static: no backend, no paid APIs, no build step. ES modules only. Run: `python3 -m http.server` in this folder.
2. Open data only. `data/SOURCES.json` is the registry. Nothing ships unless `license_status` is `verified`.
3. No invented numbers. `js/constants.js` holds cited values only; formulas live in `js/cosmology.js` and are exported as LaTeX strings so the UI shows them.
4. Original design. Other sites inform interaction patterns only.
5. Every new feature needs a test in `tests/` against an analytic result or a published number.

## Run the checks
    node tests/cosmology.test.mjs

## Open items (need a human)
- Read each provider's terms and set `license_status` to `verified`.
- Copy the per-tracer DESI DR2 BAO table from arXiv:2503.14738 into `data/desi_dr2_bao.json`.
- Write `tools/` scripts that regenerate each compact data file in `data/`.
