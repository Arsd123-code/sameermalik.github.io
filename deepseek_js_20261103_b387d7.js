// One reactive state for the whole site. Tabs subscribe; nothing owns its
// own copy. Formulas only, no hard-coded results. Constants are injected
// from js/constants.js so no numeric literal here is uncited.
//
// If js/cosmology.js exists and already exports E(z)/D_C(z)/..., you may
// delete the duplicate implementations below and re-export from there.
// Keeping them here so state.js works standalone.

import { SPEED_OF_LIGHT_KM_S, PLANCK2018, w0wa_DEFAULT } from "./constants.js";

export const state = {
  H0:     PLANCK2018.H0.value,
  omegaM: PLANCK2018.omegaM.value,
  omegaK: 0.0,
  w0:     w0wa_DEFAULT.w0,
  wa:     w0wa_DEFAULT.wa,
  omegaDE: null,            // derived
  redshiftRange: [0, 2.5],
};
state.omegaDE = 1 - state.omegaM - state.omegaK;

const listeners = new Set();

export function subscribe(fn) {
  listeners.add(fn);
  fn(state);
  return () => listeners.delete(fn);
}

export function update(patch) {
  Object.assign(state, patch);
  state.omegaDE = 1 - state.omegaM - state.omegaK;
  for (const f of listeners) f(state);
}

// ---- Cosmology, formulas only ----

export function E(z, s = state) {
  const om = s.omegaM;
  const ok = s.omegaK;
  const ode = s.omegaDE ?? (1 - om - ok);
  const onePlusZ = 1 + z;
  const de = ode
    * Math.pow(onePlusZ, 3 * (1 + s.w0 + s.wa))
    * Math.exp(-3 * s.wa * z / onePlusZ);
  return Math.sqrt(om * onePlusZ ** 3 + ok * onePlusZ ** 2 + de);
}

export function H(z, s = state) {
  return s.H0 * E(z, s);
}

// Comoving distance in Mpc.
// c in km/s and H in km/s/Mpc → Mpc.
export function D_C(z, s = state, n = 400) {
  const c = SPEED_OF_LIGHT_KM_S.value;
  let acc = 0, zPrev = 0, ePrev = E(0, s);
  for (let i = 1; i <= n; i++) {
    const zi = z * i / n, ei = E(zi, s);
    acc += 0.5 * (1 / ePrev + 1 / ei) * (zi - zPrev);
    zPrev = zi; ePrev = ei;
  }
  return (c / s.H0) * acc;
}

export const D_M = (z, s = state) => D_C(z, s);                 // flat
export const D_H = (z, s = state) => SPEED_OF_LIGHT_KM_S.value / H(z, s);
export const D_V = (z, s = state) => Math.cbrt(z * D_M(z, s) ** 2 * D_H(z, s));