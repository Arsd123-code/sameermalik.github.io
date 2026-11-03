import { makeCosmology } from "../js/cosmology.js";
import { PLANCK2018, SPEED_OF_LIGHT_KM_S } from "../js/constants.js";

let fail = 0;
const ok = (name, cond, info = "") => { console.log((cond ? "PASS " : "FAIL ") + name + " " + info); if (!cond) fail++; };

const P = makeCosmology({ H0: PLANCK2018.H0.value, omegaM: PLANCK2018.omegaM.value });
ok("E(0)=1", Math.abs(P.E(0) - 1) < 1e-12);

// Einstein-de Sitter analytic check: D_M = 2c/H0 (1 - 1/sqrt(1+z))
const EdS = makeCosmology({ H0: 70, omegaM: 1 });
for (const z of [0.5, 1, 2]) {
  const exact = 2 * SPEED_OF_LIGHT_KM_S.value / 70 * (1 - 1 / Math.sqrt(1 + z));
  const num = EdS.DM(z);
  ok(`EdS D_M(z=${z})`, Math.abs(num / exact - 1) < 1e-9, `num=${num.toFixed(4)} exact=${exact.toFixed(4)}`);
}

// Low-z Hubble law
const z = 1e-3;
ok("low-z Hubble law", Math.abs(P.DM(z) / (SPEED_OF_LIGHT_KM_S.value * z / PLANCK2018.H0.value) - 1) < 1e-3);

// Planck parameter consistency: Omega_m exceeds Omega_cb by the massive-neutrino share (small, positive)
const h2 = (PLANCK2018.H0.value / 100) ** 2;
const cb = (PLANCK2018.omegaCh2.value + PLANCK2018.omegaBh2.value) / h2;
const diff = PLANCK2018.omegaM.value - cb;
ok("Omega_m - Omega_cb in (0, 0.003)", diff > 0 && diff < 0.003, `diff=${diff.toFixed(5)}`);

ok("D_M monotonic", P.DM(0.5) < P.DM(1) && P.DM(1) < P.DM(2));
process.exit(fail ? 1 : 0);
