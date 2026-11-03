// Background cosmology. Formulas are exported as strings so the UI can display them (KaTeX).
// Radiation is neglected: valid for z << 3000 (DESI BAO range 0.1<z<2.1). Flat universe assumed.
import { SPEED_OF_LIGHT_KM_S } from "./constants.js";

export const FORMULAS = {
  E:  "E(z)=\\sqrt{\\Omega_m(1+z)^3+(1-\\Omega_m)(1+z)^{3(1+w_0+w_a)}\\exp\\!\\left(-\\frac{3w_a z}{1+z}\\right)}",
  DH: "D_H(z)=\\frac{c}{H_0E(z)}",
  DM: "D_M(z)=c/H_0\\int_0^z \\frac{dz'}{E(z')}\\ \\ (\\Omega_k=0)",
  DV: "D_V(z)=\\left[zD_M^2(z)D_H(z)\\right]^{1/3}",
  tL: "t_L(z)=\\frac{1}{H_0}\\int_0^z \\frac{dz'}{(1+z')E(z')}",
};

export function makeCosmology({ H0, omegaM, w0 = -1, wa = 0 }) {
  const c = SPEED_OF_LIGHT_KM_S.value;
  const E = z => {
    const de = (1 - omegaM) * Math.pow(1 + z, 3 * (1 + w0 + wa)) * Math.exp(-3 * wa * z / (1 + z));
    return Math.sqrt(omegaM * Math.pow(1 + z, 3) + de);
  };
  const simpson = (f, a, b, n = 2000) => {
    if (n % 2) n++;
    const h = (b - a) / n;
    let s = f(a) + f(b);
    for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  };
  const DH = z => c / (H0 * E(z));                            // Mpc
  const DM = z => (c / H0) * simpson(x => 1 / E(x), 0, z);     // Mpc
  const DV = z => Math.cbrt(z * DM(z) ** 2 * DH(z));           // Mpc
  // 977.792 Gyr = 1/(1 km/s/Mpc): unit conversion, not a measurement.
  const lookbackGyr = z => (977.792 / H0) * simpson(x => 1 / ((1 + x) * E(x)), 0, z);
  return { E, DH, DM, DV, lookbackGyr };
}
