// Edit these lists to add papers. Each: {title, authors, venue, year, arxiv, doi}
const first = [
  {title:"Paper title", authors:"<b>S. Malik</b>, et al.", venue:"Journal / arXiv", year:2026, arxiv:"https://arxiv.org/", doi:""}
];
const co = [];
const render = (id, list) => {
  const ul = document.getElementById(id);
  ul.innerHTML = list.length ? list.map(p => `<li><a href="${p.arxiv||p.doi}">${p.title}</a><small>${p.authors}</small><small>${p.venue} · ${p.year}${p.arxiv?` · <a href="${p.arxiv}">arXiv</a>`:""}${p.doi?` · <a href="${p.doi}">Journal</a>`:""}</small></li>`).join("") : "<li>Coming soon.</li>";
};
render("pubs-first", first); render("pubs-co", co);
document.getElementById("yr").textContent = new Date().getFullYear();
const btn = document.querySelector(".menu"), links = document.getElementById("links");
btn.addEventListener("click", () => btn.setAttribute("aria-expanded", links.classList.toggle("open")));
links.addEventListener("click", () => links.classList.remove("open"));

// Hero: galaxies as points; pairs inside the collision radius get linked.
const c = document.getElementById("sky"), x = c.getContext("2d");
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
let W, H, pts = [];
function size(){ W = c.width = c.offsetWidth; H = c.height = c.offsetHeight;
  pts = Array.from({length: Math.min(160, W/6)}, () => ({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.15, vy:(Math.random()-.5)*.15})); }
function draw(){
  x.clearRect(0,0,W,H); const R = 46;
  for (const p of pts){ if(!still){p.x=(p.x+p.vx+W)%W; p.y=(p.y+p.vy+H)%H;}
    x.fillStyle="#cfe0ff"; x.beginPath(); x.arc(p.x,p.y,1.6,0,6.3); x.fill(); }
  for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++){
    const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
    if (d<R){ x.strokeStyle=`rgba(240,170,90,${1-d/R})`; x.beginPath(); x.moveTo(pts[i].x,pts[i].y); x.lineTo(pts[j].x,pts[j].y); x.stroke(); } }
  if(!still) requestAnimationFrame(draw);
}
addEventListener("resize", () => { size(); if(still) draw(); });
size(); draw();
