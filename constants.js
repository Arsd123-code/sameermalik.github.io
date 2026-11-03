// Every value here carries a citation. Add nothing without one.
// Values below were checked against the published tables on 2026-11-03.

export const SPEED_OF_LIGHT_KM_S = {
  value: 299792.458,
  uncertainty: 0, // exact by SI definition of the metre
  source: "SI definition (exact)",
};

// Planck 2018 results. VI. Cosmological parameters, A&A 641, A6 (2020), arXiv:1807.06209
// Base-LCDM, TT,TE,EE+lowE+lensing, 68% limits (also reproduced in Planck 2018 X, arXiv:1807.06211, Table 1)
export const PLANCK2018 = {
  citation: "Planck Collaboration 2020, A&A 641, A6, arXiv:1807.06209, Table 2, TT,TE,EE+lowE+lensing",
  H0:      { value: 67.36,   sigma: 0.54,    unit: "km/s/Mpc" },
  omegaM:  { value: 0.3153,  sigma: 0.0073 },
  sigma8:  { value: 0.8111,  sigma: 0.0060 },
  ns:      { value: 0.9649,  sigma: 0.0042 },
  omegaBh2:{ value: 0.02237, sigma: 0.00015 },
  omegaCh2:{ value: 0.1200,  sigma: 0.0012 },
  tau:     { value: 0.0544,  sigma: 0.0073 },
  ln10As:  { value: 3.044,   sigma: 0.014, note: "ln(10^10 A_s)" },
};

// DESI DR2 Results II, arXiv:2503.14738 (PRD 2025). BAO-only, flat LCDM.
export const DESI_DR2 = {
  citation: "DESI Collaboration, DESI DR2 Results II, arXiv:2503.14738",
  omegaM_flatLCDM_BAOonly: { value: 0.2975, sigma: 0.0086 },
  // Per-tracer D_M/r_d, D_H/r_d, D_V/r_d tables: NOT hard-coded yet.
  // Fill data/desi_dr2_bao.json by copying from the paper's table.
};

export const w0wa_DEFAULT = { w0: -1, wa: 0, note: "LCDM; user-adjustable in the UI" };
