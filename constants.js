// Every numeric value here carries a citation and a source_id.
// source_id MUST resolve to an id in data/SOURCES.json whose license_status
// is "verified" AND whose value with matching name has verified: true,
// or js/provenance.js will refuse to render it.
// See tests/sources.test.mjs for the enforcement.

export const SPEED_OF_LIGHT_KM_S = {
  value: 299792.458,
  sigma: 0,
  unit: "km/s",
  kind: "constant",
  source: "SI definition (exact)",
  source_id: "si_definition",
  name: "c_km_s",
};

// Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 (2020),
// arXiv:1807.06209, Table 2, TT,TE,EE+lowE+lensing, 68% limits.
export const PLANCK2018 = {
  source_id: "planck2018_params",
  citation: "Planck Collaboration 2020, A&A 641, A6, arXiv:1807.06209, Table 2, TT,TE,EE+lowE+lensing",
  H0:       { value: 67.36,   sigma: 0.54,    unit: "km/s/Mpc", kind: "measurement", name: "H0" },
  omegaM:   { value: 0.3153,  sigma: 0.0073,                    kind: "measurement", name: "omegaM" },
  sigma8:   { value: 0.8111,  sigma: 0.0060,                    kind: "measurement", name: "sigma8" },
  ns:       { value: 0.9649,  sigma: 0.0042,                    kind: "measurement", name: "ns" },
  omegaBh2: { value: 0.02237, sigma: 0.00015,                   kind: "measurement", name: "omegaBh2" },
  omegaCh2: { value: 0.1200,  sigma: 0.0012,                    kind: "measurement", name: "omegaCh2" },
  tau:      { value: 0.0544,  sigma: 0.0073,                    kind: "measurement", name: "tau" },
  ln10As:   { value: 3.044,   sigma: 0.014, note: "ln(10^10 A_s)", kind: "measurement", name: "ln10As" },
};

// DESI DR2 Results II, arXiv:2503.14738. BAO-only, flat ΛCDM.
export const DESI_DR2 = {
  source_id: "desi_dr2_bao",
  citation: "DESI Collaboration, DESI DR2 Results II, arXiv:2503.14738",
  omegaM_flatLCDM_BAOonly: {
    value: 0.2975, sigma: 0.0086, kind: "measurement",
    name: "omegaM_flatLCDM_BAOonly",
  },
  // Per-tracer D_M/r_d, D_H/r_d, D_V/r_d tables: NOT hard-coded.
  // Fill data/desi_dr2_bao.json by copying from the paper's Table 1.
};

// UI default only — NOT a measurement. Must never be cited as a result.
export const w0wa_DEFAULT = {
  w0: -1, wa: 0, kind: "ui_default",
  note: "ΛCDM; user-adjustable in the UI",
};
