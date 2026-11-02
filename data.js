// ===== EDIT ME: survey table and reading notes =====
// Numbers are approximate (from survey papers/websites); verify before citing.
const SURVEYS = [
 {n:"2dFGRS",z:[0,.3],s:"done",area:"~1,500 deg²",N:"~220k redshifts",t:"Anglo-Australian Telescope",d:"First large redshift survey to measure the power spectrum and RSD at low redshift."},
 {n:"6dFGS",z:[0,.15],s:"done",area:"~17,000 deg² (south)",N:"~125k redshifts",t:"UK Schmidt Telescope",d:"Near-infrared selected; a key low-z anchor for BAO and peculiar-velocity work."},
 {n:"SDSS Main Galaxy Sample",z:[0,.25],s:"done",area:"~10,000 deg²",N:"~0.9M galaxies",t:"SDSS 2.5 m",d:"Foundation for low-redshift galaxy clustering and the first detection of the BAO peak in LRGs."},
 {n:"WiggleZ",z:[.2,1],s:"done",area:"~1,000 deg²",N:"~240k redshifts",t:"Anglo-Australian Telescope",d:"Blue emission-line galaxies, early BAO and growth measurements at z~0.6."},
 {n:"VIPERS",z:[.5,1.2],s:"done",area:"~24 deg²",N:"~90k galaxies",t:"VLT / VIMOS",d:"Deep, dense sample; strong test of redshift-space distortions at z~0.8."},
 {n:"BOSS (galaxies)",z:[.15,.7],s:"done",area:"~10,000 deg²",N:"~1.5M galaxies",t:"SDSS 2.5 m",d:"LOWZ and CMASS samples; landmark BAO and full-shape measurements."},
 {n:"eBOSS (LRG/ELG/QSO)",z:[.6,2.2],s:"done",area:"~4,500 deg²",N:"~0.7M redshifts",t:"SDSS 2.5 m",d:"Extended BAO to z~2.2 using LRGs, ELGs and quasars."},
 {n:"DESI · BGS",z:[.05,.4],s:"run",area:"~14,000 deg²",N:"~13M bright galaxies (goal)",t:"Mayall 4 m, 5,000 fibers",d:"Bright Galaxy Survey; the densest DESI sample, strongly affected by fiber assignment at small scales."},
 {n:"DESI · LRG",z:[.4,1.1],s:"run",area:"~14,000 deg²",N:"~4M (goal)",t:"Mayall 4 m",d:"Luminous red galaxies; precise BAO and RSD with high bias."},
 {n:"DESI · ELG",z:[.6,1.6],s:"run",area:"~14,000 deg²",N:"~17M (goal)",t:"Mayall 4 m",d:"Emission-line galaxies, redshifts from [O II]; largest volume at z>1."},
 {n:"DESI · QSO",z:[.9,2.1],s:"run",area:"~14,000 deg²",N:"~2.4M (goal)",t:"Mayall 4 m",d:"Quasars as direct tracers of clustering up to z~2.1."},
 {n:"DESI · Lyα forest",z:[2.1,3.5],s:"run",area:"~14,000 deg²",N:"~0.7M QSOs (goal)",t:"Mayall 4 m",d:"BAO from absorption along quasar sightlines at z>2.1."},
 {n:"Euclid (NISP spectroscopy)",z:[.9,1.8],s:"run",area:"~14,000 deg²",N:"tens of millions (goal)",t:"ESA space telescope",d:"Slitless Hα spectroscopy; no fibers, so different systematics from DESI."},
 {n:"Subaru PFS",z:[.6,2.4],s:"run",area:"~1,200 deg²",N:"millions of ELGs (goal)",t:"Subaru 8.2 m, ~2,400 fibers",d:"Deep ELG survey filling the high-z gap with a large mirror."},
 {n:"Roman HLSS",z:[1,3],s:"future",area:"~2,000 deg²",N:"~10M (goal)",t:"NASA space telescope",d:"Planned slitless spectroscopy of Hα and [O III] galaxies at cosmic noon."}
];
// DESI fact box
const DESI = {fibers:"5,000",tel:"Mayall 4 m, Kitt Peak",area:"~14,000 deg² (extension to ~17,000 planned)",goal:"~40M galaxy and quasar redshifts in 5 years",dr1:"18.7M unique objects (public)",dr2:"~two-thirds of the 5-year data; BAO results released 2025"};

// Reading notes. status: reading | done | idea
const NOTES = [
 {title:"DESI 2024 VI: Cosmological constraints from BAO measurements",authors:"DESI Collaboration",year:2024,arxiv:"https://arxiv.org/abs/2404.03002",tags:["DESI","BAO"],status:"done",
  q:"What do the first-year DESI BAO measurements say about the expansion history?",m:"BAO distance measurements from BGS, LRG, ELG, QSO and Lyα, combined with CMB and supernovae.",r:"Write your key result here.",me:"Why it matters for my fiber-collision / bispectrum work."},
 {title:"Add the paper you are reading now",authors:"Authors",year:2026,arxiv:"",tags:["bispectrum"],status:"reading",
  q:"Question the paper asks.",m:"Method and data.",r:"Main result.",me:"How it connects to my work."}
];

// Visitor counter: sign up free at goatcounter.com, pick a code (e.g. "sameermalik"), paste it here.
// Then in GoatCounter: Settings -> enable "Allow adding visitor counts on your website".
const GC_CODE = "";
