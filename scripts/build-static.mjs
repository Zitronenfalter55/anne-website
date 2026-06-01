// Builds 20 standalone HTML files (10 pages × EN/DE) in annewolter.com look.
// Output: html-export/ + zipped to /mnt/documents/annewolter-site.zip
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";

const ROOT = resolve(process.cwd());
const OUT = join(ROOT, "html-export");

// ---------- shared CSS (inline in every page) ----------
// ---------- shared CSS (inline in every page) ----------
const CSS = `
*,*::before,*::after{box-sizing:border-box}
:root{
  --midnight:#0A1628;
  --midnight-soft:#0F1E35;
  --cream:#F7F2EA;
  --cream-soft:#FAF6EE;
  --offwhite:#EDE8E0;
  --champagne:#C8965A;       /* Gold — 30% accent */
  --champ-light:#D9AE7B;
  --berry:#A03060;            /* 10% accent — ONLY on cream */
  --sand:#9E9488;
  --earth:#6B5C4A;
  --border:rgba(200,150,90,.20);
  --border-cream:rgba(107,92,74,.18);
}
html{scroll-behavior:smooth}
body{
  margin:0;background:var(--midnight);color:var(--offwhite);
  font-family:'Jost',system-ui,sans-serif;font-weight:300;font-size:17px;
  -webkit-font-smoothing:antialiased;line-height:1.75;
  overflow-x:hidden;
}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
::selection{background:rgba(200,150,90,.28);color:var(--cream)}

.serif{font-family:'Cormorant Garamond',Georgia,serif;font-weight:300}
.italic{font-style:italic;color:var(--champagne)}
.eyebrow{font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--champagne);font-weight:400;display:inline-block}
.muted{color:rgba(237,232,224,.7)}

/* Prep banner */
.prep{background:var(--champagne);color:var(--midnight);text-align:center;
  padding:12px 16px;font-size:10px;letter-spacing:.32em;text-transform:uppercase;font-weight:500}

/* Nav — solid Navy, no transparency */
.nav{position:sticky;top:0;z-index:50;background:var(--midnight);
  border-bottom:1px solid var(--border)}
.nav-inner{max-width:1320px;margin:0 auto;padding:22px 36px;display:flex;
  align-items:center;justify-content:space-between;gap:24px}
.brand{display:flex;align-items:center;gap:14px;line-height:1.1}
.brand-text{display:flex;flex-direction:column}
.brand-name{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--champagne);letter-spacing:.01em}
.brand-tag{font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:rgba(237,232,224,.6);margin-top:5px}
.nav-links{display:flex;gap:38px;font-size:11px;letter-spacing:.18em;text-transform:uppercase}
.nav-links a{color:rgba(237,232,224,.78);transition:color .2s}
.nav-links a:hover,.nav-links a.active{color:var(--champagne)}
.nav-right{display:flex;align-items:center;gap:18px}
.lang{display:flex;gap:0;font-size:10px;letter-spacing:.2em;text-transform:uppercase}
.lang a{padding:7px 11px;border:1px solid var(--border);color:rgba(237,232,224,.55);transition:all .2s}
.lang a.on{background:var(--champagne);color:var(--midnight);border-color:var(--champagne)}
.lang a:hover:not(.on){color:var(--champagne)}

/* Buttons — ALL Gold filled, rounded 4px */
.btn{display:inline-block;padding:14px 28px;font-size:11px;letter-spacing:.22em;
  text-transform:uppercase;border:none;border-radius:4px;transition:opacity .25s, transform .25s;cursor:pointer;
  background:var(--champagne);color:var(--midnight);font-family:'Jost',sans-serif;font-weight:500}
.btn:hover{opacity:.88;transform:translateY(-1px)}
.btn-quiet{background:transparent;color:var(--champagne);border:1px solid var(--champagne);font-weight:400}
.btn-quiet:hover{background:var(--champagne);color:var(--midnight);opacity:1}
.btn-on-cream{background:var(--berry);color:var(--cream)}

@media (max-width:900px){
  .nav-links{display:none}
  .nav-inner{padding:16px 22px}
  .brand-name{font-size:19px}
}

/* Layout */
main{min-height:60vh}
section{padding:120px 36px}
.wrap{max-width:1200px;margin:0 auto}
.wrap-narrow{max-width:780px;margin:0 auto}
h1,h2,h3,h4{font-family:'Cormorant Garamond',serif;font-weight:300;margin:0;letter-spacing:-.01em;line-height:1.12}
h1{font-size:clamp(48px,7vw,96px)}
h2{font-size:clamp(36px,5vw,64px)}
h3{font-size:clamp(24px,3vw,36px)}
h4{font-size:22px}
p{margin:0 0 1.3em}

/* Cream sections (alternating rhythm) */
.cream{background:var(--cream);color:var(--earth)}
.cream h1,.cream h2,.cream h3,.cream h4{color:#1a1a1a}
.cream .eyebrow{color:var(--berry)}
.cream .italic{color:var(--berry)}
.cream p{color:#3d342a}
.cream .muted{color:rgba(61,52,42,.7)}
.cream .checks li{color:#3d342a}
.cream .checks li::before{background:var(--berry)}
.cream .sec-head .lead{color:#3d342a}
.cream .t-quote{color:#1a1a1a}
.cream .t-cat-head,.cream .t-attrib{color:var(--berry)}

/* Hero */
.hero{padding:80px 36px 120px;min-height:84vh;display:flex;align-items:center}
.hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:80px;align-items:center;max-width:1320px;margin:0 auto;width:100%}
.hero-eyebrow{margin-bottom:36px}
.hero h1{margin-bottom:32px}
.hero h1 .italic{display:block;color:var(--champagne)}
.hero-sub{font-family:'Cormorant Garamond',serif;font-size:clamp(20px,2.2vw,26px);font-style:italic;color:var(--cream);margin-bottom:28px;line-height:1.5}
.hero-body{max-width:520px;color:rgba(237,232,224,.82);font-size:16px;margin-bottom:40px}
.hero-tag{font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--champagne);margin-bottom:36px}
.hero-cta{display:flex;gap:14px;flex-wrap:wrap}
.hero-img{aspect-ratio:4/5;background:var(--midnight-soft);overflow:hidden;border:1px solid var(--border)}
.hero-img img{width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.02)}
@media (max-width:900px){
  .hero-grid{grid-template-columns:1fr;gap:48px}
  .hero{min-height:auto;padding:60px 24px 80px}
  section{padding:80px 24px}
}

/* Credentials bar — vertical stacked */
.creds{background:var(--midnight-soft);padding:48px 36px;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.creds-inner{max-width:780px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
.cred-line{display:flex;align-items:center;gap:14px;font-size:14px;letter-spacing:.04em;color:rgba(237,232,224,.85);font-family:'Cormorant Garamond',serif;font-style:italic}
.cred-line svg{flex-shrink:0}

/* Trust strip */
.trust-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:48px;align-items:start}
.trust-big{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:30px;line-height:1.45;margin-bottom:18px}
.trust-small{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:19px;line-height:1.55;margin-bottom:18px}
.attrib{font-size:10px;letter-spacing:.28em;text-transform:uppercase;margin:0}
@media (max-width:900px){.trust-grid{grid-template-columns:1fr;gap:36px}}

/* Generic section heading */
.sec-head{margin-bottom:64px;max-width:780px}
.sec-head .eyebrow{display:block;margin-bottom:24px}
.sec-head h2{margin-bottom:24px}
.sec-head .lead{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:24px;color:rgba(247,242,234,.88);line-height:1.5}

/* Numbered cards */
.num-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:48px;margin-top:48px}
.num-card{border-top:1px solid var(--border);padding-top:28px}
.num-card .n{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--champagne);font-size:14px;letter-spacing:.2em;margin-bottom:16px}
.num-card h4{font-size:22px;margin-bottom:14px}
.num-card p{font-size:15px;line-height:1.7}
.cream .num-card{border-top-color:var(--border-cream)}
.cream .num-card .n{color:var(--berry)}
@media (max-width:900px){.num-grid{grid-template-columns:1fr;gap:32px}}

/* Checklist */
.checks{margin:48px 0 0;padding:0;display:grid;gap:14px;max-width:720px;list-style:none}
.checks li{padding-left:28px;position:relative;font-size:16px;line-height:1.7;color:rgba(237,232,224,.85)}
.checks li::before{content:"";position:absolute;left:0;top:14px;width:14px;height:1px;background:var(--champagne)}

/* Turning point */
.turning{background:var(--midnight-soft)}
.cascade{margin-top:48px;display:grid;gap:18px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:24px;color:var(--cream);max-width:720px}
.cascade div{padding-left:24px;border-left:1px solid var(--champagne)}

/* Method overview pillars */
.pillars{display:grid;grid-template-columns:repeat(2,1fr);gap:56px;margin-top:48px}
.pillar{padding-top:24px;border-top:1px solid var(--border)}
.pillar .n{color:var(--champagne);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;letter-spacing:.2em;margin-bottom:12px}
.pillar h4{margin-bottom:14px;font-size:24px}
.pillar p{font-size:15px;line-height:1.7}
@media (max-width:900px){.pillars{grid-template-columns:1fr;gap:40px}}

/* Testimonials */
.t-cat{margin-top:56px}
.t-cat-head{font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--champagne);margin-bottom:24px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.t-quote{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;line-height:1.5;color:var(--cream);margin-bottom:14px}
.t-block + .t-block{margin-top:32px}
.t-attrib{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--sand);margin:0}

/* Offers */
.offers{background:var(--midnight-soft)}
.offer{padding:52px;border:1px solid var(--border);margin-bottom:32px;background:rgba(15,30,53,.5);border-radius:4px}
.offer.featured{border-color:var(--champagne);background:rgba(200,150,90,.05)}
.offer .tag{font-size:10px;letter-spacing:.32em;text-transform:uppercase;color:var(--champagne);margin-bottom:18px}
.offer h3{margin-bottom:8px}
.offer .sub{font-family:'Cormorant Garamond',serif;font-style:italic;color:var(--champ-light);font-size:22px;margin-bottom:24px}
.offer .meta{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--sand);margin-bottom:24px}
.offer p{margin-bottom:20px}
.offer ul{padding:0;margin:0 0 28px;list-style:none}
.offer ul li{padding:12px 0 12px 22px;position:relative;border-bottom:1px solid var(--border);font-size:15px;line-height:1.6}
.offer ul li::before{content:"—";position:absolute;left:0;color:var(--champagne)}
.offer ul li:last-child{border-bottom:none}
@media (max-width:700px){.offer{padding:36px 28px}}

/* FAQ */
.faq-item{border-top:1px solid var(--border);padding:32px 0}
.faq-item:last-child{border-bottom:1px solid var(--border)}
.faq-item h4{margin-bottom:14px;font-size:22px}
.faq-item p{margin:0;line-height:1.75}

/* Lead magnet on cream */
.lead-mag{text-align:center}
.lead-mag form{display:flex;gap:12px;justify-content:center;margin:32px auto 18px;flex-wrap:wrap;max-width:540px}
.lead-mag input[type=email]{background:transparent;border:1px solid var(--berry);color:#1a1a1a;
  padding:14px 20px;flex:1;min-width:260px;font-family:inherit;font-size:14px;outline:none;border-radius:4px}
.lead-mag input[type=email]:focus{border-color:#1a1a1a}
.lead-mag .fine{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--earth);margin-top:14px}

/* Final CTA */
.final{background:var(--midnight);text-align:center;padding:140px 36px}
.final h2{color:var(--champagne);font-style:italic;margin-bottom:28px}
.final p{max-width:620px;margin:0 auto 32px;color:rgba(237,232,224,.85)}

/* About */
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.about-portrait{aspect-ratio:4/5;overflow:hidden;border:1px solid var(--border);border-radius:2px}
.about-portrait img{width:100%;height:100%;object-fit:cover}
.about-grid .italic{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--champagne);font-style:italic;display:block;margin:24px 0}
@media (max-width:900px){.about-grid{grid-template-columns:1fr;gap:48px}}

.values{display:grid;grid-template-columns:repeat(2,1fr);gap:48px;margin-top:48px}
.value h4{margin-bottom:12px}
.value p{font-size:15px;margin:0;line-height:1.7}
@media (max-width:900px){.values{grid-template-columns:1fr}}

/* Form */
.form-block{max-width:680px}
.form-block label{display:block;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--champagne);margin-bottom:10px;margin-top:28px}
.form-block input,.form-block textarea{width:100%;background:transparent;border:1px solid var(--border);
  color:var(--offwhite);padding:14px 16px;font-family:inherit;font-size:15px;outline:none;border-radius:4px;transition:border-color .2s}
.form-block input:focus,.form-block textarea:focus{border-color:var(--champagne)}
.form-block textarea{min-height:160px;resize:vertical}
.form-block button{margin-top:36px}

/* Footer */
footer{border-top:1px solid var(--border);padding:56px 36px 40px;background:var(--midnight)}
.foot-inner{max-width:1320px;margin:0 auto}
.foot-links{display:flex;flex-wrap:wrap;gap:28px;justify-content:center;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:rgba(237,232,224,.65);margin-bottom:28px}
.foot-links a{transition:color .2s}
.foot-links a:hover{color:var(--champagne)}
.foot-meta{text-align:center;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--sand)}
.foot-meta a:hover{color:var(--champagne)}

/* Page hero */
.page-hero{padding:140px 36px 90px;border-bottom:1px solid var(--border)}
.page-hero .eyebrow{margin-bottom:24px;display:inline-block}
.page-hero h1{font-size:clamp(40px,6vw,76px);margin-bottom:24px}
.page-hero .lead{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:24px;color:var(--champagne);line-height:1.45}
`;

// ---------- Atemringe SVG logo ----------
const LOGO_BIG = `<svg width="38" height="38" viewBox="0 0 44 44" fill="none" aria-hidden="true"><circle cx="22" cy="22" r="20" stroke="#C8965A" stroke-width="1"/><circle cx="22" cy="22" r="14" stroke="#C8965A" stroke-width="1"/><circle cx="22" cy="22" r="8" stroke="#A03060" stroke-width="1.5"/><circle cx="22" cy="22" r="2.5" fill="#A03060"/></svg>`;
const LOGO_MINI = `<svg width="14" height="14" viewBox="0 0 44 44" fill="none" aria-hidden="true"><circle cx="22" cy="22" r="20" stroke="#C8965A" stroke-width="2.5"/><circle cx="22" cy="22" r="14" stroke="#C8965A" stroke-width="2"/><circle cx="22" cy="22" r="8" stroke="#A03060" stroke-width="2.5"/><circle cx="22" cy="22" r="2.5" fill="#A03060"/></svg>`;


// ---------- nav/footer helpers ----------
function nav(lang, current, reduced = false) {
  const t = lang === "de"
    ? { method:"Die Arbeit", offers:"Zusammenarbeit", workshops:"Workshops", about:"Über mich", cta:"Discovery Call" }
    : { method:"The Work", offers:"Work With Me", workshops:"Workshops", about:"About", cta:"Apply" };
  const ext = lang === "de" ? ".de.html" : ".html";
  const sister = (page) => page === "" ? (lang==="de"?"index.de.html":"index.html") : `${page}${ext}`;
  const link = (page, label) => `<a href="${sister(page)}" ${current===page?'class="active"':''}>${label}</a>`;
  const langSwitch = lang === "de"
    ? `<a href="${current==="" ? "index.html" : current+".html"}">EN</a><a href="#" class="on">DE</a>`
    : `<a href="#" class="on">EN</a><a href="${current==="" ? "index.de.html" : current+".de.html"}">DE</a>`;
  const prep = `<div class="prep">${lang==="de"?"In Vorbereitung — bald online":"Currently in preparation — launching soon"}</div>`;
  if (reduced) {
    return `${prep}
<nav class="nav"><div class="nav-inner">
  <a href="${sister("")}" class="brand">
    ${LOGO_BIG}
    <div class="brand-text"><span class="brand-name">Anne Wolter</span><span class="brand-tag">breath. voice. aligned.</span></div>
  </a>
  <div class="lang">${langSwitch}</div>
</div></nav>`;
  }
  return `${prep}
<nav class="nav"><div class="nav-inner">
  <a href="${sister("")}" class="brand">
    ${LOGO_BIG}
    <div class="brand-text"><span class="brand-name">Anne Wolter</span><span class="brand-tag">breath. voice. aligned.</span></div>
  </a>
  <div class="nav-links">
    ${link("method", t.method)}
    ${link("work-with-me", t.offers)}
    ${link("workshops", t.workshops)}
    ${link("about", t.about)}
  </div>
  <div class="nav-right">
    <div class="lang">${langSwitch}</div>
    <a href="${sister("discovery-call")}" class="btn">${t.cta}</a>
  </div>
</div></nav>`;
}

function footer(lang) {
  const de = lang === "de";
  const ext = de ? ".de.html" : ".html";
  const links = de ? [
    ["method"+ext,"Die Arbeit"],["work-with-me"+ext,"Zusammenarbeit"],
    ["workshops"+ext,"Workshops"],["about"+ext,"Über mich"],
    ["breath-reset"+ext,"Atem-Reset"],["impressum"+ext,"Impressum"],["datenschutz"+ext,"Datenschutz"]
  ] : [
    ["method"+ext,"The Work"],["work-with-me"+ext,"Work With Me"],
    ["workshops"+ext,"Workshops"],["about"+ext,"About"],
    ["breath-reset"+ext,"Breath Reset"],["impressum"+ext,"Legal Notice"],["datenschutz"+ext,"Privacy"]
  ];
  return `<footer><div class="foot-inner">
  <div class="foot-links">
    ${links.map(([h,l])=>`<a href="${h}">${l}</a>`).join("")}
  </div>
  <div class="foot-meta">
    <a href="mailto:hello@annewolter.com">hello@annewolter.com</a>
    &nbsp;·&nbsp; © ${new Date().getFullYear()} Anne Wolter
    &nbsp;·&nbsp; breath. voice. aligned.
  </div>
</div></footer>`;
}

function page({ lang, slug, title, desc, body, reduced=false }) {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="author" content="Anne Wolter" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:type" content="website" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
${nav(lang, slug, reduced)}
<main>${body}</main>
${footer(lang)}
</body>
</html>`;
}


// ---------- helper: link to discovery in current lang ----------
const dcLink = (lang) => lang === "de" ? "discovery-call.de.html" : "discovery-call.html";
const brLink = (lang) => lang === "de" ? "breath-reset.de.html" : "breath-reset.html";
const mLink  = (lang) => lang === "de" ? "method.de.html" : "method.html";
const wwLink = (lang) => lang === "de" ? "work-with-me.de.html" : "work-with-me.html";

// ============================================================
// HOMEPAGE
// ============================================================
function home(lang) {
  const de = lang === "de";
  return `
<section class="hero">
  <div class="hero-grid">
    <div>
      <div class="eyebrow hero-eyebrow">breath. voice. aligned. · Anne Wolter</div>
      <h1>${de?"Deine Stimme":"Your voice"}<span class="italic">${de?"ist schon da.":"is already there."}</span></h1>
      <p class="hero-sub">${de
        ? "Du kommst mit einer Stimme, die unter Druck nachlässt.<br>Du gehst mit einer, der du vertrauen kannst."
        : "You arrive with a voice that disappears under pressure.<br>You leave with one that stays."}</p>
      <div class="hero-tag">${de?"Authentische Stimme. Geerdete Präsenz.":"Authentic Voice. Grounded Presence."}</div>
      <p class="hero-body">${de
        ? "Für Frauen in Führung und hochrangige Professionals, die aus echter Geerdetheit führen wollen — nicht aus einer Performance, die sie aufrechterhalten müssen."
        : "For women in leadership and high-level professionals who want to lead from genuine groundedness — not a performance they have to maintain."}</p>
      <div class="hero-cta">
        <a href="${dcLink(lang)}" class="btn">${de?"→ Zum Discovery Call bewerben":"→ Apply for a Discovery Call"}</a>
        <a href="${mLink(lang)}" class="btn">${de?"Die Arbeit entdecken":"Discover the work"}</a>
      </div>
    </div>
    <div class="hero-img"><img src="assets/hero-portrait.jpg" alt="Anne Wolter" loading="eager"></div>
  </div>
</section>

<div class="creds"><div class="creds-inner">
  ${(de ? [
    "Staatlich geprüfte Atem-, Sprech- & Stimmlehrerin",
    "Methode Schlaffhorst-Andersen",
    "Themenzentrierte Interaktion (TZI) · Ruth C. Cohn",
    "Somatische Praxis & Nervensystemregulation",
    "1:1 online · Deutsch & Englisch"
  ] : [
    "State-certified Breath, Speech & Voice Teacher",
    "Schlaffhorst-Andersen Method",
    "Theme-Centred Interaction (TCI) · Ruth C. Cohn",
    "Somatic & nervous system practice",
    "1:1 online · German & English"
  ]).map(c=>`<div class="cred-line">${LOGO_MINI}<span>${c}</span></div>`).join("")}
</div></div>

<section class="cream">
  <div class="wrap">
    <div class="eyebrow" style="margin-bottom:48px">${de?"Was Klientinnen sagen":"What clients say"}</div>
    <div class="trust-grid">
      <div>
        <p class="trust-big">${de
          ? "„Ich fürchte den Moment nicht mehr. Meine Stimme kommt mit mir an."
          : "„I no longer dread the moment. My voice arrives with me."}"</p>
        <p class="attrib">— ${de?"Nach 8 Wochen, Signature Programm":"After 8 weeks, Signature Programme"}</p>
      </div>
      <div>
        <p class="trust-small">${de
          ? "„Mein Atem verlässt mich unter Druck nicht mehr. Er ist zu meinem Anker geworden."
          : "„My breath no longer leaves me under pressure. It has become my anchor."}"</p>
      </div>
      <div>
        <p class="trust-small">${de
          ? "„Ich habe aufgehört zu performen. Menschen haben angefangen, wirklich zuzuhören."
          : "„I stopped performing. People started actually listening."}"</p>
        <p class="attrib">— ${de?"Senior Leader, Tech":"Senior leader, tech"}</p>
      </div>
    </div>
  </div>
</section>


<section>
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">01</span>
      <h2>${de?"Wo diese Arbeit beginnt":"Where this work begins"}</h2>
      <p class="lead">${de
        ? "Die meisten Frauen, mit denen ich arbeite, haben kein Stimmproblem. Sie haben eine Stimme, die jahrelang alles still getragen hat."
        : "Most women I work with don't have a voice problem. They have a voice that has been carrying everything quietly — for years."}</p>
    </div>
    <div class="num-grid">
      ${[
        de?["01","Die Stimme, die unter Druck verschwindet","Du weißt, was du sagen willst. Aber in dem Moment, der zählt — im Meeting, der Verhandlung, dem Raum, der wichtig ist — zieht sich die Stimme zusammen. Wird dünner. Weniger du."]
           :["01","The voice that disappears under pressure","You know what you want to say. But the moment it counts — in the meeting, the negotiation, the room that matters — the voice tightens. Becomes thinner. Less yours."],
        de?["02","Worte landen leiser, als sie gemeint waren","Du sprichst mit Substanz. Menschen nicken. Dann geht der Raum irgendwie ohne dich weiter. Der Inhalt war da. Die Präsenz nicht."]
           :["02","Words land softer than they were meant to","You speak with substance. People nod. Then somehow the room moves on without you. The content was there. The presence was not."],
        de?["03","Eine Lücke zwischen wer du bist und wie du ankommst","Du spürst es, bevor jemand es sagt. Die Stimme passt nicht ganz zur Frau dahinter — und du bist es müde, den Unterschied auszugleichen."]
           :["03","A gap between who you are and how you come across","You sense it before anyone says it. The voice doesn't quite match the woman behind it — and you are tired of compensating for the difference."]
      ].map(([n,h,p])=>`<div class="num-card"><div class="n">${n}</div><h4>${h}</h4><p>${p}</p></div>`).join("")}
    </div>
    <p style="margin-top:64px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:22px;color:var(--champagne)">${de?"Kommt dir das bekannt vor?":"Does any of this feel familiar?"}</p>
    <ul class="checks">
      ${(de?[
        "Deine Stimme zieht sich zusammen, bevor der wichtigste Moment kommt.",
        "Du verlässt Gespräche erschöpft, nicht präsent.",
        "Du weißt, dass dein Körper es hält — aber nicht, was du damit tun sollst.",
        "Techniken haben ein wenig geholfen. Nichts hat es an der Wurzel verändert."
      ]:[
        "Your voice tightens before the moment that matters most.",
        "You leave conversations feeling depleted, not present.",
        "You know your body is holding it — but not what to do with it.",
        "Techniques have helped a little. Nothing has changed it at the root."
      ]).map(x=>`<li>${x}</li>`).join("")}
    </ul>
  </div>
</section>

<section class="turning">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">02</span>
      <h2>${de?"Der Wendepunkt":"The turning point"}</h2>
      <p class="lead">${de
        ? "Irgendwann ist Technik nicht mehr die Antwort. Etwas Tieferes möchte angesprochen werden."
        : "At some point, technique stops being the answer. Something deeper is asking to be addressed."}</p>
    </div>
    <div style="max-width:780px">
      <p>${de
        ? "Stimme ist keine Fähigkeit, die optimiert werden kann. Sie ist der ehrlichste Ausdruck dessen, wer du bist — sie trägt deinen Atem, deinen Körper, dein Nervensystem, deinen inneren Zustand. Wenn eines davon nicht im Einklang ist, trägt die Stimme es. Ehrlich. Unwillkürlich."
        : "Voice is not a skill to be optimised. It is the most honest expression of who you are — carrying your breath, your body, your nervous system, your inner state. When one of these is out of alignment, the voice carries it. Honestly. Involuntarily."}</p>
      <h4 style="margin-top:40px;color:var(--champagne);font-style:italic">${de?"Was die meisten Ansätze tun":"What most approaches do"}</h4>
      <p>${de
        ? "Kommunikationstraining, Rhetorikkurse, Präsentationscoaching — sie arbeiten an der Oberfläche: wie du sprichst, wie du wirkst, was du sagst. Aber die Stimme ist kein Oberflächenphänomen."
        : "Communication training, rhetoric courses, presentation coaching — they work on the surface: how you speak, how you appear, what you say. But the voice is not a surface phenomenon."}</p>
      <h4 style="margin-top:40px;color:var(--champagne);font-style:italic">${de?"Was diese Arbeit anders macht":"What this work does differently"}</h4>
      <p>${de
        ? "Die Arbeit beginnt nicht mit Korrektur — sondern mit Verbindung. Zwischen Atem und Körper, Emotion und Ausdruck, innerem Erleben und äußerer Präsenz. Sie beginnt unterhalb der Oberfläche — mit Atem, Nervensystemregulation und dem Körper als eigentlicher Quelle von Präsenz."
        : "The work begins not with correction — but with connection. Between breath and body, emotion and expression, inner experience and outer presence. It begins beneath the surface — with breath, nervous system regulation, and the body as the actual source of presence."}</p>
    </div>
    <div class="cascade">
      ${(de?[
        "Wenn der Atem frei ist → beruhigt sich das Nervensystem.",
        "Wenn das Nervensystem sich beruhigt → findet die Stimme ihren Boden.",
        "Wenn die Stimme geerdet ist → folgt Präsenz natürlich."
      ]:[
        "When breath is free → the nervous system settles.",
        "When the nervous system settles → the voice finds its ground.",
        "When the voice is grounded → presence follows naturally."
      ]).map(x=>`<div>${x}</div>`).join("")}
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">03 · ${de?"Die Methode":"The Method"}</span>
      <h2>${de?"Die Voice Alignment Method™":"The Voice Alignment Method™"}</h2>
      <p class="lead">${de
        ? "Keine Korrektur. Verbindung. Sechs Worte. Eine integrierte Praxis."
        : "Not correction. Connection. Six words. One integrated practice."}</p>
    </div>
    <p style="max-width:780px">${de
      ? "Stimme wird hier nicht trainiert. Sie wird als Ausdruck eines integrierten Systems verstanden — und dort abgeholt, wo sie wirklich lebt."
      : "Voice is not trained here. It is understood as the expression of an integrated system — and met where it actually lives."}</p>
    <p class="eyebrow" style="margin:32px 0 0">${de?"Atem · Stimme · Körper · Nervensystem · Präsenz · Alignment":"breath · voice · body · nervous system · presence · alignment"}</p>
    <div class="pillars">
      ${[
        de?["01","Regulation · Atem","Wo alles beginnt. Atem ist keine Technik zum Üben — er ist die physiologische Grundlage für ein stabiles Nervensystem, nachhaltige Energie und geerdete Präsenz. Funktionale Atemarbeit reguliert das Nervensystem und bringt den Körper in einen Zustand zurück, in dem die Stimme frei fließen kann."]
           :["01","Regulation · Breath","Where everything begins. Breath is not a technique to practise — it is the physiological foundation for a stable nervous system, sustainable energy and grounded presence. Functional breathwork regulates the nervous system and returns the body to a state where the voice can move freely."],
        de?["02","Alignment · Körper & Nervensystem","Unter Druck zieht sich das Nervensystem zusammen — und Stimme, Atem und Präsenz mit ihm. Diese Arbeit baut die Fähigkeit auf, offen zu bleiben. Nicht trotz des Drucks, sondern darin."]
           :["02","Alignment · Body & Nervous System","Under pressure, the nervous system contracts — and voice, breath and presence contract with it. This work builds the capacity to remain open. Not despite the pressure, but within it."],
        de?["03","Expression · Stimme","Deine Stimme ist kein Leistungswerkzeug. Sie ist der direkteste Ausdruck dessen, wer du bist. Wir nehmen weg, was Resonanz, Tiefe und authentische Tragkraft im Weg steht."]
           :["03","Expression · Voice","Your voice is not a performance tool. It is the most direct expression of who you are. We remove what stands in the way of resonance, depth and authentic carrying power."],
        de?["04","Integration · Mindset & Präsenz","Mindset und Präsenz entstehen nicht als separate Arbeit. Sie sind ein integriertes Ergebnis. Wenn Atem frei, Stimme verbunden und das Nervensystem reguliert ist — öffnet sich etwas."]
           :["04","Integration · Mindset & Presence","Mindset and presence do not exist as separate work. They emerge as an integrated result. When breath is free, voice connected and the nervous system regulated — something opens."]
      ].map(([n,h,p])=>`<div class="pillar"><div class="n">${n}</div><h4>${h}</h4><p>${p}</p></div>`).join("")}
    </div>
    <p style="margin-top:56px"><a href="${mLink(lang)}" class="btn">${de?"→ Die vollständige Methode lesen":"→ Read the full method"}</a></p>
  </div>
</section>

<section style="background:var(--midnight-soft)">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">04 · ${de?"Klientinnen-Erfahrungen":"Client experiences"}</span>
      <h2>${de?"Keine trainierte Stimme. Eine verlässliche.":"Not a trained voice. A reliable one."}</h2>
      <p class="lead">${de
        ? "Klientinnen kommen, um besser zu sprechen. Was sie entdecken, ist etwas anderes: Die Stimme verändert sich — weil das System sich verändert."
        : "Clients come to improve how they speak. What they discover is something different: the voice changes — because the system changes."}</p>
    </div>
    ${[
      [de?"Stimmliche Stabilität":"Vocal stability",[
        [de?"„Ich fürchte den Moment nicht mehr. Meine Stimme kommt mit mir an.":"„I no longer dread the moment. My voice arrives with me.",de?"Nach 8 Wochen, Signature Programm":"After 8 weeks, Signature Programme"],
        [de?"„Mein Atem verlässt mich unter Druck nicht mehr. Er ist zu meinem Anker geworden.":"„My breath no longer leaves me under pressure. It has become my anchor.",""]
      ]],
      [de?"Verkörperte Präsenz":"Embodied presence",[
        [de?"„Ich habe aufgehört zu performen. Menschen haben angefangen, wirklich zuzuhören.":"„I stopped performing. People started actually listening.",de?"Senior Leader, Tech":"Senior leader, tech"],
        [de?"„Selbst in den schwierigsten Gesprächen bleibe ich bei mir. Nichts ist mehr wie vorher.":"„Even in the hardest conversations I stay with myself. Nothing is as it was before.",""]
      ]],
      [de?"Nachhaltige Veränderung":"Sustainable change",[
        [de?"„Es ist nicht verblasst. Monate später fühlt sich meine Stimme noch wie zuhause an.":"„It didn't fade. Months later, my voice still feels like home.",de?"Gründerin, Professional Services":"Founder, professional services"],
        [de?"„Ich hätte nicht erwartet, dass die Stimme eine solche Tiefe hat — und einen so starken Einfluss darauf, wie ich mich fühle, wie ich mich ausdrücke und wie ich in der Welt auftrete. Annes Arbeit hat eine sehr kraftvolle Wirkung.":"„I had not expected the voice to have such depth — and such a strong influence on how I feel, how I express myself, and how I show up in the world. Anne's work has a very powerful effect.",de?"Klientin · Unternehmerin & Professional":"A client · Entrepreneur & Professional"]
      ]],
      [de?"Verlässlichkeit unter Druck":"Reliability under pressure",[
        [de?"„Schwierige Gespräche nehmen mir nichts mehr. Ich verlasse sie lebendig.":"„Difficult conversations no longer take from me. I leave them alive.",de?"Executive, Finance":"Executive, finance"],
        [de?"„Ich gehe in Führungsgespräche mit der stillen Gewissheit, dass meine Stimme da sein wird.":"„I enter leadership conversations with the quiet certainty that my voice will be there.",""]
      ]]
    ].map(([cat,quotes])=>`<div class="t-cat"><div class="t-cat-head">${cat}</div>${quotes.map(([q,a])=>`<div class="t-block"><p class="t-quote">${q}"</p>${a?`<p class="t-attrib">— ${a}</p>`:""}</div>`).join("")}</div>`).join("")}
  </div>
</section>

<section class="offers">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">05 · ${de?"Mit mir arbeiten":"Work with me"}</span>
      <h2>${de?"Mit Anne arbeiten":"Work with Anne"}</h2>
      <p class="lead">${de
        ? "Wähle das Format, das dich dort abholt, wo du bist. Wir wählen es gemeinsam — basierend auf deiner Situation, deinen Zielen und dem, was dir wirklich dient."
        : "Choose the format that meets you where you are. We choose the format together — based on your situation, your goals and what will genuinely serve you."}</p>
    </div>

    <div class="offer featured">
      <div class="tag">${de?"High-End Mentoring · 12 Wochen · Max. 2 pro Quartal":"High-End Mentoring · 12 Weeks · Max. 2 per Quarter"}</div>
      <h3>The Sovereign Leader</h3>
      <div class="sub">${de?"Für Frauen, die auf höchstem Niveau führen.":"For women leading at the highest level."}</div>
      <div class="meta">${de?"12 Wochen · 3 Std/Woche · 1:1 · Online":"12 weeks · 3 hrs/week · 1:1 · Online"}</div>
      <p>${de
        ? "Für die Frau, die mehr als ein Programm braucht. Zwölf Wochen intensive Arbeit an der Schnittstelle von Stimme, Präsenz und Führung — mit vollem Zugang und Priorität."
        : "For the woman who needs more than a programme. Twelve weeks of intensive work at the intersection of voice, presence and leadership — with full access and priority throughout."}</p>
      <ul>${(de?[
        "Alles aus dem Signature Programm","Erweiterte Arbeit an Führungspräsenz & Autorität",
        "Vorbereitung auf entscheidende Situationen","Prioritäre Terminplanung & voller Zugang zwischen Sessions",
        "Investment und Passung werden persönlich im Discovery Call besprochen"
      ]:[
        "Everything in the Signature Programme","Extended work on leadership presence & authority",
        "Preparation for high-stakes situations","Priority scheduling & full access between sessions",
        "Investment and fit are discussed personally in the Discovery Call"
      ]).map(x=>`<li>${x}</li>`).join("")}</ul>
      <a href="${dcLink(lang)}" class="btn">${de?"→ Für dieses Programm bewerben":"→ Apply for this programme"}</a>
    </div>

    <div class="offer">
      <div class="tag">${de?"Signature Programm · 8 Wochen":"Signature Programme · 8 Weeks"}</div>
      <h3>Calm Voice — Free Breath</h3>
      <div class="sub">${de?"Deine Stimme. Präsent. Auch unter Druck.":"Your voice. Present. Even under pressure."}</div>
      <div class="meta">${de?"8 Wochen · 90 Min/Woche · 1:1 · Online":"8 weeks · 90 min/week · 1:1 · Online"}</div>
      <p>${de
        ? "Das Grundlagenprogramm. Acht Wochen tiefe physiologische Arbeit — Atem, Körper, Stimme und Nervensystem — die Stabilität aufbaut, die unter echtem Druck hält."
        : "The foundational programme. Eight weeks of deep physiological work — breath, body, voice and nervous system — building the stability that holds under real pressure."}</p>
      <ul>${(de?[
        "Tiefe physiologische Grundlagenarbeit — Atem, Körper, Stimme","Nervensystemregulation unter Druck",
        "Integration von Mindset, innerer & äußerer Haltung","Session-Aufzeichnungen & Begleitung zwischen Sessions",
        "Investment im Discovery Call besprochen"
      ]:[
        "Deep physiological foundation work — breath, body, voice","Nervous system regulation under pressure",
        "Integration of mindset, inner & outer posture","Session recordings & support between sessions",
        "Investment discussed in the Discovery Call"
      ]).map(x=>`<li>${x}</li>`).join("")}</ul>
      <a href="${dcLink(lang)}" class="btn">${de?"→ Zum Discovery Call anmelden":"→ Apply for a Discovery Call"}</a>
    </div>

    <div class="offer">
      <div class="tag">${de?"Flexibel · 10 Sessions · Gültig 6 Monate":"Flexible · 10 Sessions · Valid 6 months"}</div>
      <h3>1:1 Session Pack</h3>
      <div class="sub">${de?"Noch nicht bereit für ein volles Programm — oder danach weitermachen?":"Not ready for a full programme — or want to continue after one?"}</div>
      <div class="meta">${de?"60 Min · 1:1 · Online · Innerhalb von 6 Monaten buchbar":"60 min · 1:1 · Online · Bookable within 6 months"}</div>
      <p>${de
        ? "Für alle, die laufende Begleitung ohne feste Struktur möchten — oder Absolventinnen eines Programms, die die Arbeit in eigenem Tempo fortführen wollen."
        : "For those who want ongoing support without a fixed structure — or graduates of a programme who want to continue the work at their own pace."}</p>
      <a href="${wwLink(lang)}" class="btn">${de?"→ Mehr erfahren":"→ Learn more"}</a>
    </div>

  </div>
</section>

<section>
  <div class="wrap-narrow">
    <div class="sec-head">
      <span class="eyebrow">06</span>
      <h2>${de?"Diese Arbeit ist nicht ":"This work is not "}<span class="italic">${de?"für jeden.":"for everyone."}</span></h2>
    </div>
    <p>${de
      ? "Wenn du Techniken suchst — schnelle Lösungen, oberflächliches Kommunikationstraining, Wege, beeindruckender zu klingen — ist das hier nicht der richtige Ort."
      : "If you are looking for techniques — quick fixes, surface-level communication training, ways to sound more impressive — this is not the right place."}</p>
    <p>${de
      ? "Wenn du Stabilität, Klarheit und eine Stimme suchst, der du vertrauen kannst — bietet diese Arbeit einen anderen Weg."
      : "If you are looking for stability, clarity and a voice you can rely on — this work offers a different path."}</p>
    <p>${de
      ? "Sie erfordert Präsenz, die Bereitschaft, von innen nach außen zu arbeiten, und Vertrauen in einen Prozess, der tiefer geht als Technik."
      : "It requires presence, willingness to work from the inside out, and trust in a process that goes deeper than technique."}</p>
    <p class="italic" style="font-family:'Cormorant Garamond',serif;font-size:22px;margin-top:32px">${de
      ? "Diese Arbeit ist für die Frau, die spürt, dass sich etwas darunter verschieben muss — und die bereit ist, diese Arbeit zu tun."
      : "This work is for the woman who senses that something underneath needs to shift — and who is ready to do that work."}</p>
  </div>
</section>

<section class="faq">
  <div class="wrap-narrow">
    <div class="sec-head">
      <span class="eyebrow">07 · FAQ</span>
      <h2>${de?"Deine Fragen — ":"Your questions — "}<span class="italic">${de?"beantwortet.":"answered."}</span></h2>
      <p class="lead">${de
        ? "Die häufigsten Fragen vor dem Start. Wenn dich etwas anderes beschäftigt — genau dafür ist der Discovery Call da."
        : "The most common questions before beginning this work. If something else is on your mind — that is exactly what the Discovery Call is for."}</p>
    </div>
    ${(de?[
      ["Muss ich Sängerin oder Rednerin sein, um mit dir zu arbeiten?","Überhaupt nicht. Diese Arbeit ist für alle, deren Stimme zählt — in Führung, im beruflichen Kontext, in wichtigen Gesprächen. Du brauchst keinen Hintergrund in Performance oder Sprechen."],
      ["Funktioniert Online-Arbeit wirklich für sowas?","Ja — oft sogar besser als in Präsenz. Das Online-Format ermöglicht es dir, in deinem eigenen Raum zu arbeiten, was die Präsenz und Offenheit fördert, die diese Arbeit erfordert."],
      ["Woher weiß ich, welches Programm das richtige für mich ist?","Genau dafür ist der Discovery Call da. In 45 Minuten erkunden wir, wo du stehst, was du suchst und welches Format wirklich zu deiner Situation passt."],
      ["Was passiert nach dem Discovery Call?","Wenn wir uns für eine Zusammenarbeit entscheiden, erhältst du innerhalb von 24 Stunden ein persönliches Angebot per E-Mail — mit Programmdetails, Investment und den nächsten Schritten."],
      ["Können wir auf Deutsch oder Englisch arbeiten?","Beides. Viele Klientinnen wechseln innerhalb einer Session zwischen beiden Sprachen — das kann sehr kraftvoll sein, da die Stimme in jeder Sprache anders reagiert."],
      ["Ist das Therapie?","Nein. Diese Arbeit ist physiologisch und somatisch fundiert — jedoch keine Therapie im klinischen Sinne. Wenn du bereits in therapeutischer Begleitung bist, kann diese Arbeit eine sehr sinnvolle Ergänzung sein."],
      ["Wie viel Zeit muss ich wöchentlich investieren?","Beim Signature Programm: 90 Minuten pro Session plus etwa 15 Minuten tägliche Praxis. Beim Sovereign Leader: 3 Stunden pro Woche plus tägliche Praxis."],
      ["Brauche ich spezielles Equipment oder Setup?","Einen ruhigen Raum, in dem du stehen und dich frei bewegen kannst, eine stabile Internetverbindung und idealerweise Kopfhörer. Mehr brauchst du nicht."],
      ["Ist Ratenzahlung möglich?","Ja — beide Programme können in 3 monatlichen Raten ohne Aufpreis gezahlt werden. Alle Details besprechen wir im Discovery Call."]
    ]:[
      ["Do I need to be a singer or speaker to work with you?","Not at all. This work is for anyone whose voice matters — in leadership, in professional contexts, in important conversations. You don't need a background in performance or speaking."],
      ["Does online work really work for this?","Yes — often even better than in person. The online format allows you to work in your own space, which supports the kind of presence and openness this work requires."],
      ["How do I know which programme is right for me?","That is exactly what the Discovery Call is for. In 45 minutes we explore where you stand, what you are looking for, and which format genuinely fits your situation."],
      ["What happens after the Discovery Call?","If we decide to work together, you receive a personalised offer by email within 24 hours — including programme details, investment and next steps."],
      ["Can we work in German or English?","Both. Many clients move between both languages within a session — this can be very powerful because the voice responds differently in each language."],
      ["Is this therapy?","No. This work is physiologically and somatically grounded — not therapeutic in the clinical sense. If you are currently in therapy, this work can complement it well."],
      ["How much time do I need each week?","For the Signature Programme: 90 minutes per session plus around 15 minutes of daily practice. For The Sovereign Leader: 3 hours per week plus daily practice."],
      ["Do I need any equipment or special setup?","A quiet room where you can stand and move freely, a stable internet connection, and headphones if possible. That is all."],
      ["Is payment in instalments possible?","Yes — both programmes can be paid in 3 monthly instalments at no extra cost. All details are discussed in the Discovery Call."]
    ]).map(([q,a])=>`<div class="faq-item"><h4>${q}</h4><p>${a}</p></div>`).join("")}
  </div>
</section>

<section class="cream lead-mag">
  <div class="wrap-narrow">
    <span class="eyebrow">${de?"Kostenfreie Audio · 3 Minuten":"Free Audio · 3 Minutes"}</span>
    <h2 style="margin:24px 0"><span class="italic">${de?"Das 3-Minuten Atem-Reset":"The 3-Minute Breath Reset"}</span></h2>
    <p style="max-width:560px;margin-left:auto;margin-right:auto">${de
      ? "Vor dem Meeting. Vor der Präsentation. Vor jedem Moment, der etwas von dir verlangt."
      : "Before the meeting. Before the presentation. Before any moment that asks something of you."}</p>
    <p style="max-width:620px;margin-left:auto;margin-right:auto">${de
      ? "Drei Minuten, die deinen Atem, dein Nervensystem und deine Stimme in einen Zustand zurückbringen, in dem du wirklich ankommen kannst."
      : "Three minutes that return your breath, your nervous system and your voice to a state where you can actually land."}</p>
    <a href="${brLink(lang)}" class="btn btn-on-cream" style="margin-top:32px">${de?"→ Audio zusenden":"→ Send me the audio"}</a>
    <p class="fine">${de?"Kostenlos. Kein Spam. Jederzeit abmelden. DSGVO-konform.":"Free. No spam. Unsubscribe anytime. GDPR compliant."}</p>
  </div>
</section>


<section class="final">
  <span class="eyebrow">${de?"Letzter Schritt":"Final step"}</span>
  <h2 style="margin:24px 0"><span class="italic">${de?"Dein nächster Schritt.":"Your next step."}</span></h2>
  <p>${de
    ? "Ein kostenloser 45-minütiger Discovery Call — um zu erkunden, wo deine Stimme steht, was darunter liegt und ob eine Zusammenarbeit der richtige nächste Schritt ist. Kein Druck. Kein Pitch. Nur ein echtes Gespräch."
    : "A free 45-minute Discovery Call — to explore where your voice stands, what lies beneath, and whether working together is the right next step. No pressure. No pitch. Just a real conversation."}</p>
  <a href="${dcLink(lang)}" class="btn">${de?"→ Zum Discovery Call bewerben":"→ Apply for a Discovery Call"}</a>
  <p style="margin-top:32px;font-size:13px;color:var(--sand);max-width:560px;margin-left:auto;margin-right:auto">${de
    ? "Das Investment spiegelt die Tiefe der Arbeit wider und wird persönlich auf deine Situation abgestimmt. Wir besprechen es gemeinsam im Discovery Call — kein Druck, nur Klarheit."
    : "The investment reflects the depth of the work and is personally tailored to your situation. We discuss it together in the Discovery Call — no pressure, just clarity."}</p>
</section>
`;
}

// ============================================================
// METHOD
// ============================================================
function method(lang) {
  const de = lang === "de";
  return `
<section class="page-hero">
  <div class="wrap-narrow">
    <span class="eyebrow">${de?"Die Methode":"The Method"}</span>
    <h1>${de?"Keine Korrektur. ":"Not correction. "}<span class="italic">${de?"Verbindung.":"Connection."}</span></h1>
    <p class="lead">${de?"Stimme beginnt vor dem Klang.":"Voice begins before sound."}</p>
  </div>
</section>

<section>
  <div class="wrap-narrow">
    <p>${de
      ? "Diese Arbeit beginnt nicht mit Technik. Sie beginnt mit einem ganzheitlichen Blick auf den Menschen — Atem, Nervensystem, Körper, Stimme und Präsenz gemeinsam."
      : "This work does not begin with technique. It begins with a holistic view of the person — breath, nervous system, body, voice and presence together."}</p>
    <p>${de
      ? "Stimme wird hier nicht trainiert. Sie wird als Ausdruck eines integrierten Systems verstanden — und dort abgeholt, wo sie wirklich lebt."
      : "Voice is not trained here. It is understood as the expression of an integrated system — and met where it actually lives."}</p>
    <p>${de
      ? "Das ist kein klassisches Stimmtraining. Es ist eine Praxis der Bedingungen — Atem, Körper, Nervensystem —, die deine wirkliche Stimme tragfähig machen. Verlässlich. Auch wenn es darauf ankommt."
      : "This is not voice training in the conventional sense. It is a practice of conditions — breath, body, nervous system — that allow your real voice to land. Reliably. Even when it counts most."}</p>
  </div>
</section>

<section style="background:var(--midnight-soft)">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${de?"Wurzeln":"Roots"}</span>
      <h2><span class="italic">${de?"Schlaffhorst-Andersen — und darüber hinaus":"Schlaffhorst-Andersen — and beyond"}</span></h2>
    </div>
    <div style="max-width:780px">
      <p>${de
        ? "Die Arbeit fußt auf der Methode Schlaffhorst-Andersen — einer über hundert Jahre alten deutschen Tradition, die Stimme als ganzkörperliches Geschehen versteht. Haltung, Atem, Klang und Bewegung sind untrennbar."
        : "The work is grounded in the Schlaffhorst-Andersen Method — a century-old German tradition that understands voice as a whole-body event. Posture, breath, tone and movement are inseparable."}</p>
      <p>${de
        ? "Diese Grundlage wird durch somatische und nervensystem-orientierte Arbeit erweitert — mit dem, was wir heute über Regulation, Faszien und verkörperte Präsenz wissen."
        : "This foundation is extended through somatic and nervous system work — integrating what we now understand about regulation, fascia and embodied presence."}</p>
      <p>${de
        ? "So entsteht eine präzise, zeitgemäße Praxis für Frauen in Führung und anspruchsvolle berufliche Kontexte."
        : "The result is a precise, contemporary practice for women in leadership and high-level professionals."}</p>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${de?"Vier Säulen":"Four Pillars"}</span>
      <h2><span class="italic">${de?"Atem · Körper · Nervensystem · Präsenz":"Breath · Body · Nervous System · Presence"}</span></h2>
    </div>
    <div class="pillars">
      ${[
        de?["01","Atem","Nicht tiefer. Freier.","Atem ist nichts, was kontrolliert werden muss. Er ist die physiologische Grundlage von Stimme, Energie und Präsenz. Wir stellen den Atem wieder her, der ohnehin geschehen will — dreidimensional, verbunden mit der Körperrückseite und dem Beckenboden. Wenn der Atem frei wird, beginnt sich das System zu beruhigen."]
           :["01","Breath","Not deeper. Freer.","Breath is not something to control. It is the physiological foundation of voice, energy and presence. We restore the breath that already wants to happen — three-dimensional, connected to the back of the body and the floor of the pelvis. When breath becomes free, the system begins to settle."],
        de?["02","Körper","Stimme ist ein körperliches Ereignis.","Die Stimme sitzt nicht im Hals. Sie entsteht im ganzen System. Haltung, Faszientonus, die Organisation der Wirbelsäule — all das bestimmt, wie die Stimme klingen und tragen kann. Wir arbeiten mit dem gesamten Instrument, nicht mit isolierten Teilen."]
           :["02","Body","Voice is a body event.","The voice does not live in the throat. It lives in the whole system. Posture, fascial tone, the organisation of the spine — all shape how the voice can resonate and carry. We work with the entire instrument, not isolated parts."],
        de?["03","Nervensystem","Regulation macht Stimme möglich.","Unter Druck zieht sich das System zusammen — und die Stimme mit ihm. Ein reguliertes Nervensystem schafft die Grundlage für Stabilität, Präsenz und Reaktionsfähigkeit. Das ist keine Technik über Anspannung — sondern das Lösen dessen, was Anspannung überhaupt erzeugt."]
           :["03","Nervous System","Regulation makes voice possible.","Under pressure, the system contracts — and the voice contracts with it. A regulated nervous system creates the conditions for stability, presence and responsiveness. This is not technique layered on top of tension — it is the removal of what creates the tension in the first place."],
        de?["04","Präsenz","Nicht gemacht. Entstehend.","Präsenz ist nichts, was erzeugt werden muss. Sie ist das, was bleibt, wenn nichts im Weg steht. Wenn Atem frei, der Körper organisiert und das Nervensystem reguliert ist — wird Präsenz mühelos. Die Stimme trägt dich — nicht umgekehrt."]
           :["04","Presence","Not performed. Emergent.","Presence is not something to create. It is what remains when nothing is in the way. When breath is free, the body organised and the nervous system regulated — presence is no longer effort. The voice carries you, not the other way round."]
      ].map(([n,t,sub,p])=>`<div class="pillar"><div class="n">${n}</div><h4>${t}</h4><p style="font-style:italic;color:var(--champ-light);font-family:'Cormorant Garamond',serif;font-size:18px;margin-bottom:14px">${sub}</p><p>${p}</p></div>`).join("")}
    </div>
  </div>
</section>

<section style="background:var(--midnight-soft)">
  <div class="wrap-narrow">
    <div class="sec-head">
      <span class="eyebrow">${de?"Was hier anders ist":"What makes this different"}</span>
      <h2><span class="italic">${de?"Nicht lauter. Nicht trainiert. Wahr.":"Not louder. Not trained. True."}</span></h2>
    </div>
    <ul class="checks">
      ${(de?[
        "Wir drücken die Stimme nicht. Wir nehmen weg, was ihr im Weg steht.",
        "Wir spielen keine Souveränität. Wir stellen die Bedingungen her, in denen sie entsteht.",
        "Wir arbeiten nicht an Symptomen. Wir arbeiten an der Wurzel — die Symptome lösen sich von selbst."
      ]:[
        "We do not push the voice. We remove what is in its way.",
        "We do not perform confidence. We restore the conditions where confidence becomes the natural state.",
        "We do not work on symptoms. We work at the root — and the symptoms resolve themselves."
      ]).map(x=>`<li>${x}</li>`).join("")}
    </ul>
  </div>
</section>

<section class="final">
  <span class="eyebrow">${de?"Ergebnis":"Outcome"}</span>
  <h2 style="margin:24px 0"><span class="italic">${de?"Eine Stimme, die verlässlich deine ist.":"A voice that is reliably yours."}</span></h2>
  <p>${de?"Keine neue Stimme. Deine Stimme — verfügbar, wenn es darauf ankommt. In den Räumen, die zählen. In den Momenten, die entscheiden.":"Not a new voice. Your voice — available when it matters. In the rooms that count. In the moments that decide."}</p>
  <a href="${dcLink(lang)}" class="btn">${de?"→ Discovery Call buchen":"→ Apply for a Discovery Call"}</a>
</section>
`;
}

// ============================================================
// WORK WITH ME
// ============================================================
function workWithMe(lang) {
  const de = lang === "de";
  return `
<section class="page-hero">
  <div class="wrap-narrow">
    <span class="eyebrow">${de?"Mit mir arbeiten":"Work with me"}</span>
    <h1>${de?"Zwei Wege. ":"Two paths. "}<span class="italic">${de?"Eine Tiefe.":"One depth."}</span></h1>
    <p class="lead">${de
      ? "Beide Programme sind 1:1, online und werden auf Deutsch oder Englisch durchgeführt. Sie unterscheiden sich in Länge, Intensität und Integrationstiefe — nicht in der Sorgfalt."
      : "Both programmes are 1:1, online, and held in German or English. They differ in length, intensity and the depth of integration — not in care."}</p>
  </div>
</section>

<section class="offers">
  <div class="wrap">
    <div class="offer featured">
      <div class="tag">${de?"The Sovereign Leader · 12 Wochen · Max. 2 pro Quartal":"The Sovereign Leader · 12 Weeks · Max. 2 per Quarter"}</div>
      <h3>${de?"Stimme als verkörperte Autorität.":"Voice as embodied authority."}</h3>
      <div class="sub">${de
        ? "Für erfahrene Frauen, deren Stimme Teil ihres Führungsinstruments ist — und die sie souverän wollen, nicht performt."
        : "For senior women whose voice is part of their leadership instrument — and who want it sovereign, not performed."}</div>
      <ul>${(de?[
        "Zwölf wöchentliche 1:1 Sessions (3 Std/Woche, online)",
        "Zwei Integrations-Intensives (90 Min)",
        "Stimmarbeit für High-Stakes-Formate — Keynote, Board, Verhandlung",
        "Begleitung zwischen den Sessions",
        "Investment wird persönlich im Discovery Call besprochen"
      ]:[
        "Twelve weekly 1:1 sessions (3 hrs/week, online)",
        "Two integration intensives (90 min)",
        "Voice work for high-stakes formats — keynote, board, negotiation",
        "Support between sessions",
        "Investment discussed personally in the Discovery Call"
      ]).map(x=>`<li>${x}</li>`).join("")}</ul>
      <p style="font-style:italic;color:var(--champ-light);font-family:'Cormorant Garamond',serif;font-size:20px">${de
        ? "Verkörperte Autorität, die nicht vom Tag, dem Raum oder dem Publikum abhängt."
        : "Embodied authority that does not depend on the day, the room or the audience."}</p>
      <a href="${dcLink(lang)}" class="btn">${de?"→ Über Discovery Call bewerben":"→ Apply via Discovery Call"}</a>
    </div>

    <div class="offer">
      <div class="tag">${de?"Signature Programm · 8 Wochen":"Signature Programme · 8 Weeks"}</div>
      <h3>Calm Voice — Free Breath</h3>
      <div class="sub">${de
        ? "Für Frauen, die möchten, dass ihre Stimme ankommt — verlässlich, in den Räumen, die zählen."
        : "For women who want their voice to land — reliably, in the rooms that matter."}</div>
      <ul>${(de?[
        "Acht wöchentliche 1:1 Sessions (90 Min/Woche, online)",
        "Persönliche somatische Praxis zwischen den Sessions",
        "Begleitung zwischen den Sessions",
        "Investment im Discovery Call besprochen"
      ]:[
        "Eight weekly 1:1 sessions (90 min/week, online)",
        "Personal somatic practice between sessions",
        "Support between sessions",
        "Investment discussed in the Discovery Call"
      ]).map(x=>`<li>${x}</li>`).join("")}</ul>
      <p style="font-style:italic;color:var(--champ-light);font-family:'Cormorant Garamond',serif;font-size:20px">${de
        ? "Eine Stimme, die trägt — in Meetings, auf Bühnen, in den Gesprächen, die entscheiden."
        : "A voice that holds you — in meetings, on stages, in the conversations that decide."}</p>
      <a href="${dcLink(lang)}" class="btn">${de?"→ Mit Discovery Call beginnen":"→ Start with a Discovery Call"}</a>
    </div>
  </div>
</section>

<section>
  <div class="wrap-narrow">
    <div class="sec-head">
      <span class="eyebrow">${de?"In beiden":"In both"}</span>
      <h2>${de?"Worauf du dich verlassen kannst":"What you can count on"}</h2>
    </div>
    <ul class="checks">
      ${(de?[
        "Online 1:1 — überall auf der Welt, Deutsch oder Englisch",
        "Investment im Premium-Segment, Ratenzahlung möglich",
        "Vertraulich, somatisch, kein performatives Coaching",
        "Echte Veränderungen innerhalb der ersten drei Sessions"
      ]:[
        "Online 1:1 — anywhere in the world, German or English",
        "Investment in the premium segment, instalments available",
        "Confidential, somatic, no performative coaching",
        "Real shifts within the first three sessions"
      ]).map(x=>`<li>${x}</li>`).join("")}
    </ul>
  </div>
</section>

<section style="background:var(--midnight-soft)">
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2>${de?"Ist das ":"Is this "}<span class="italic">${de?"für dich?":"for you?"}</span></h2>
    </div>
    <h4 style="color:var(--champagne);margin-bottom:18px;font-style:italic">${de?"Diese Arbeit ist für dich, wenn —":"This work is for you if —"}</h4>
    <ul class="checks" style="margin-bottom:48px">
      ${(de?[
        "Du kompetent, vorbereitet und oft die erfahrenste Frau im Raum bist — und deine Stimme nicht dem Gewicht dessen entspricht, was du trägst.",
        "Du die innere Arbeit getan hast. Therapie, Coaching, Führungsprogramme. Die nächste Schicht liegt im Körper.",
        "Du bereit bist, zu fühlen bevor du korrigierst. Langsamer zu werden bevor du schneller wirst.",
        "Du eine Stimme willst, die deine ist — nicht eine polierte Version von jemand anderem."
      ]:[
        "You are competent, prepared, often the most senior woman in the room — and your voice does not match the weight of what you carry.",
        "You have done the inner work. Therapy, coaching, leadership programmes. The next layer is in the body.",
        "You are willing to feel before you fix. To slow down before you go fast.",
        "You want a voice that is yours — not a more polished version of someone else's."
      ]).map(x=>`<li>${x}</li>`).join("")}
    </ul>
    <h4 style="color:var(--sand);margin-bottom:18px;font-style:italic">${de?"Nicht für dich, wenn —":"Not for you if —"}</h4>
    <ul class="checks">
      ${(de?[
        "Du schnelle Bühnentricks, Atemhacks oder isolierte Stimmübungen möchtest.",
        "Du medizinische oder therapeutische Behandlung einer klinischen Stimmerkrankung suchst.",
        "Du möchtest, dass jemand die Arbeit für dich macht, statt sie selbst zu tun."
      ]:[
        "You want quick stage tricks, breathing hacks or vocal warm-ups in isolation.",
        "You are looking for medical or therapeutic treatment for a clinical voice condition.",
        "You want someone to perform the work for you, instead of doing it yourself."
      ]).map(x=>`<li>${x}</li>`).join("")}
    </ul>
  </div>
</section>

<section class="final">
  <h2 style="margin:24px 0"><span class="italic">${de?"Beginne mit einem Gespräch.":"Start with a conversation."}</span></h2>
  <p>${de
    ? "Jede Zusammenarbeit beginnt mit einem kostenfreien Discovery Call. Wir hören, wo du stehst, was du trägst und ob diese Arbeit richtig ist — für dich und für mich."
    : "Every collaboration begins with a free Discovery Call. We listen to where you are, what you carry, and whether this work is right — for you, and for me."}</p>
  <a href="${dcLink(lang)}" class="btn">${de?"→ Zum Discovery Call bewerben":"→ Apply for a Discovery Call"}</a>
</section>
`;
}

// ============================================================
// WORKSHOPS
// ============================================================
function workshops(lang) {
  const de = lang === "de";
  return `
<section class="page-hero">
  <div class="wrap-narrow">
    <span class="eyebrow">Workshops</span>
    <h1>${de?"Gruppenarbeit — ":"Group work — "}<span class="italic">${de?"gehalten, präzise, verkörpert.":"held, precise, embodied."}</span></h1>
    <p class="lead">${de
      ? "Workshops sind verdichtete Einstiege in die Arbeit. Keine Vorträge, keine Warm-ups. Es ist Praxis — gehalten mit derselben Tiefe und Diskretion wie die 1:1-Arbeit."
      : "Workshops are condensed entries into the work. They are not lectures and not warm-ups. They are practice — held with the same depth and discretion as the 1:1 work."}</p>
  </div>
</section>

<section class="offers">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${de?"Online-Workshops · Jetzt verfügbar · weltweit":"Online Workshops · Available now · worldwide"}</span>
      <h2>${de?"Online":"Online"}</h2>
    </div>
    <div class="offer">
      <div class="tag">${de?"Atem & Stimme — Halbtag":"Breath & Voice — Half-Day"}</div>
      <h3>${de?"4 Stunden · online · max. 8 Frauen · €350":"4 hours · online · max 8 women · €350"}</h3>
      <p style="margin-top:24px">${de
        ? "Ein Nachmittag, um zu dem Atem zurückzukehren, der ohnehin geschehen will. Haltung, Körper und Klang arbeiten als ein System."
        : "An afternoon of returning to the breath that already wants to happen. Posture, body, sound — working as one system."}</p>
      <p>${de
        ? "Du gehst mit einer täglichen Praxis und einer anderen Beziehung zu deiner Stimme."
        : "You leave with a daily practice and a different relationship to your voice."}</p>
      <a href="mailto:hello@annewolter.com" class="btn">${de?"→ Anfragen":"→ Get in touch"}</a>
    </div>
    <div class="offer">
      <div class="tag">${de?"Stimme als Präsenz — Tages-Workshop":"Voice as Presence — Day Workshop"}</div>
      <h3>${de?"1 Tag · online · max. 6 Frauen · auf Anfrage":"1 day · online · max 6 women · on request"}</h3>
      <p style="margin-top:24px">${de
        ? "Ein voller Tag somatischer Boden, Atem, Stimme und Integration. Für Frauen, die ein klares Vorher-Nachher wollen — ohne direkt in ein Programm zu gehen."
        : "A full day of somatic ground, breath, voice and integration. For women who want a clear before-and-after — without entering a programme yet."}</p>
      <a href="mailto:hello@annewolter.com" class="btn">${de?"→ Kontakt aufnehmen":"→ Get in touch"}</a>
    </div>
  </div>
</section>

<section>
  <div class="wrap-narrow">
    <div class="sec-head">
      <span class="eyebrow">${de?"Präsenz-Workshops — Hannover":"In-Person Workshops — Hannover"}</span>
      <h2><span class="italic">${de?"In Vorbereitung — 2026 / 2027":"In preparation — 2026 / 2027"}</span></h2>
    </div>
    <p>${de
      ? "Präsenz-Workshops in Hannover sind in Planung. Wenn du benachrichtigt werden möchtest, sobald Termine feststehen, schreib mir direkt."
      : "In-person workshops in Hannover are in preparation. If you would like to be notified when dates are confirmed, write to me directly."}</p>
    <a href="mailto:hello@annewolter.com" class="btn" style="margin-top:24px">${de?"→ Interesse bekunden":"→ Register your interest"}</a>
  </div>
</section>

<section style="background:var(--midnight-soft)">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${de?"Für Organisationen":"For Organisations"}</span>
      <h2><span class="italic">${de?"Corporate-Formate — auf Anfrage":"Corporate formats — on request"}</span></h2>
    </div>
    <div style="max-width:780px">
      <p>${de
        ? "Ich arbeite mit Unternehmen und Leadership-Teams, die Präsenz, Stimme und verkörperte Kommunikation über Soft Skills hinaus ernst nehmen."
        : "I work with companies and leadership teams who want presence, voice and embodied communication to be more than a soft skill."}</p>
      <p>${de
        ? "Formate werden um eure Realität herum gestaltet — Keynote, Halbtag, Tag, Leadership-Offsite, online oder vor Ort."
        : "Formats are designed around your reality — keynote, half-day, full-day, leadership offsite, online or on-site."}</p>
      <ul class="checks">
        ${(de?[
          "Stimme & Präsenz für Frauen in Führung",
          "Verkörperte Kommunikation für Executive-Teams",
          "Mit Autorität sprechen — ohne zu performen",
          "Atem- & Nervensystem-Regulation in High-Stakes-Umgebungen"
        ]:[
          "Voice & presence for women in leadership",
          "Embodied communication for executive teams",
          "Speaking with authority — without performing",
          "Breath & nervous system regulation in high-stakes environments"
        ]).map(x=>`<li>${x}</li>`).join("")}
      </ul>
      <p style="margin-top:32px"><a href="mailto:hello@annewolter.com" class="btn">${de?"→ Corporate-Angebot anfragen":"→ Request a corporate proposal"}</a></p>
    </div>
  </div>
</section>

<section class="final">
  <h2 style="margin:24px 0"><span class="italic">${de?"Gehaltene Räume. Echte Veränderung.":"Held spaces. Real change."}</span></h2>
  <p>${de
    ? "Workshops sind bewusst klein — damit jede Teilnehmerin echten Kontakt mit der Arbeit bekommt. Schreib mir direkt für Termine, Verfügbarkeit oder ein individuelles Format für dein Team."
    : "Workshops are intentionally small — to allow real contact with the work. Write to me directly for dates, availability or a custom format for your team."}</p>
  <div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap">
    <a href="mailto:hello@annewolter.com" class="btn">${de?"→ Kontakt":"→ Get in touch"}</a>
    <a href="${wwLink(lang)}" class="btn">${de?"→ 1:1 Programme":"→ Explore 1:1 Programmes"}</a>
  </div>
</section>
`;
}

// ============================================================
// ABOUT
// ============================================================
function about(lang) {
  const de = lang === "de";
  return `
<section class="page-hero">
  <div class="wrap-narrow">
    <span class="eyebrow">${de?"Über mich":"About"}</span>
    <h1><span class="italic">${de?"Ich arbeite mit der Stimme, weil ich meine verloren hatte.":"I work with the voice because I lost mine."}</span></h1>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="about-grid">
      <div class="about-portrait"><img src="assets/about-portrait.jpg" alt="Anne Wolter"></div>
      <div>
        <p>${de
          ? "Nicht im klinischen Sinne. So wie viele fähige Frauen ihre verlieren — langsam, leise, während auf dem Papier alles in Ordnung aussieht."
          : "Not in a clinical sense. In the way many capable women lose theirs — slowly, quietly, while everything on paper looks fine."}</p>
        <span class="italic">${de?"Ich bin nicht durch eine Theorie zu dieser Arbeit gekommen. Ich bin durch meinen eigenen Körper gekommen.":"I didn't come to this work through a theory. I came through my own body."}</span>
        <p>${de
          ? "Ein Atem, der hoch im Brustkorb blieb. Eine Stimme, die ich liebte — zum Singen, zum Sprechen — die sich aber nicht immer ganz wie meine anfühlte. Ein Körper, den ich vollständiger bewohnen wollte."
          : "A breath that stayed high in the chest. A voice I loved using — singing, speaking — but that didn't always feel fully mine. A body I wanted to inhabit more completely, not just inhabit."}</p>
        <p>${de
          ? "Was ich wollte, war einfach: authentischer ich selbst zu sein. In der Art wie ich atme. In der Art wie ich klinge. In der Art wie ich mich durch die Welt bewege."
          : "What I wanted was simple: to be more authentically myself. In how I breathe. In how I sound. In how I carry myself through the world."}</p>
      </div>
    </div>
  </div>
</section>

<section style="background:var(--midnight-soft)">
  <div class="wrap-narrow">
    <p>${de
      ? "Diese Suche führte mich dazu, staatlich geprüfte Atem-, Sprech- und Stimmlehrerin zu werden — und dann tiefer, ins Nervensystem, in die somatische Arbeit, in das was es bedeutet, eine Stimme zu haben, die wirklich deine ist."
      : "That search led me to train as a state-certified Breath, Speech and Voice Teacher — and then deeper, into the nervous system, into somatic work, into what it means to have a voice that is genuinely yours."}</p>
    <p class="italic" style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--champagne);margin:32px 0">${de?"Dieser Weg war nicht geradlinig.":"This path wasn't linear."}</p>
    <p>${de
      ? "Ich bin seit meiner Schwangerschaft alleinerziehend — und ziehe meinen Sohn, der jetzt zehn Jahre alt ist, allein groß. Diese Erfahrung hat mir mehr über Nervensystemregulation, Präsenz unter Druck und die Verbindung zwischen Körper und Stimme beigebracht als jede Ausbildung es hätte können."
      : "I have been a single mother since my pregnancy — raising my son, who is now ten, alone. That experience taught me more about nervous system regulation, presence under pressure and the relationship between body and voice than any training could have."}</p>
    <p>${de?"Die Umwege waren nie verschwendet.":"The detours were never wasted."}</p>
    <p>${de
      ? "Heute arbeite ich mit Frauen, die dasselbe wollen — keine bessere Performance, sondern einen wahrhaftigeren Ausdruck."
      : "Today I work with women who want the same thing — not a better performance, but a truer expression."}</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${de?"Ausbildung & Hintergrund":"Credentials"}</span>
      <h2>${de?"Wurzeln der Arbeit":"Roots of the work"}</h2>
    </div>
    <ul class="checks">
      ${(de?[
        "Staatlich geprüfte Atem-, Sprech- & Stimmlehrerin",
        "Methode Schlaffhorst-Andersen",
        "Themenzentrierte Interaktion (TZI) · Ruth C. Cohn",
        "Somatische & Nervensystem-Praxis",
        "1:1 auf Deutsch und Englisch"
      ]:[
        "State-certified Breath, Speech & Voice Teacher",
        "Schlaffhorst-Andersen Method",
        "Theme-Centred Interaction (TCI) · Ruth C. Cohn",
        "Somatic & nervous system practice",
        "1:1 work in German and English"
      ]).map(x=>`<li>${x}</li>`).join("")}
    </ul>
  </div>
</section>

<section style="background:var(--midnight-soft)">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow">${de?"Wofür ich stehe":"What I stand for"}</span>
      <h2><span class="italic">${de?"Vier Prinzipien.":"Four principles."}</span></h2>
    </div>
    <div class="values">
      ${[
        de?["Tiefe statt Performance","Wir arbeiten an der Wurzel, nicht am Symptom. Echte Veränderung ist anfangs langsamer — und weit dauerhafter."]
           :["Depth over performance","We work at the root, not the symptom. Real change is slower at first — and far more durable."],
        de?["Diskretion als Standard","Was in unserer Arbeit geschieht, bleibt in unserer Arbeit. Immer. Besonders bei Frauen in sichtbaren Positionen."]
           :["Discretion as standard","What happens in our work stays in our work. Always. Especially with women in visible roles."],
        de?["Premium weil es ernst ist","Das ist kein Nebenprodukt. Es ist das zentrale Instrument deiner Führung. Das Investment spiegelt das wider."]
           :["Premium because it is serious","This is not a side product. It is the central instrument of your leadership. The investment reflects that."],
        de?["Souveränität, nicht Abhängigkeit","Du gehst mit einer Praxis, die du behältst. Das Ziel ist deine Unabhängigkeit, nicht deine Rückkehr."]
           :["Sovereignty, not dependency","You leave with a practice you keep. The goal is your independence, not your return."]
      ].map(([h,p])=>`<div class="value"><h4>${h}</h4><p>${p}</p></div>`).join("")}
    </div>
  </div>
</section>

<section class="final">
  <p style="max-width:680px;margin:0 auto 32px">${de
    ? "Wenn dich hier etwas erkannt hat — der nächste Schritt ist ein Discovery Call. Kein Skript, kein Verkauf. Wir hören, wo du stehst und ob diese Arbeit der richtige nächste Schritt ist."
    : "If something here recognised you — the next step is a Discovery Call. No script, no sales. We listen to where you are and whether this work is the right next move."}</p>
  <a href="${dcLink(lang)}" class="btn">${de?"→ Zum Discovery Call bewerben":"→ Apply for a Discovery Call"}</a>
</section>
`;
}

// ============================================================
// DISCOVERY CALL
// ============================================================
function discovery(lang) {
  const de = lang === "de";
  return `
<section class="page-hero">
  <div class="wrap-narrow">
    <span class="eyebrow">Discovery Call</span>
    <h1><span class="italic">${de?"Ein 45-minütiges Gespräch. Kein Skript.":"A 45-minute conversation. No script."}</span></h1>
    <p class="lead" style="color:rgba(247,242,234,.85);font-style:normal;font-family:'Jost',sans-serif;font-size:17px;margin-top:24px">${de
      ? "Der Discovery Call ist der Beginn jeder Zusammenarbeit. Wir hören, wo du stehst, was du trägst, und ob diese Arbeit der richtige nächste Schritt ist — für dich und für mich."
      : "The Discovery Call is how every collaboration begins. We listen to where you are, what you carry, and whether this work is the right next step — for you, and for me."}</p>
  </div>
</section>

<section>
  <div class="wrap-narrow">
    <div class="sec-head">
      <h2>${de?"Was du erwarten kannst":"What to expect"}</h2>
    </div>
    <ul class="checks" style="margin-bottom:64px">
      ${(de?[
        "45 Minuten, online, Deutsch oder Englisch",
        "Wir hören, was du mitbringst — kein Verkaufsskript",
        "Wenn es passt, erkläre ich dir das passende Format für deine Situation",
        "Wenn nicht, sage ich dir das auch — ehrlich",
        "Du hörst innerhalb von 24 Stunden nach dem Absenden deiner Anfrage von mir"
      ]:[
        "45 minutes, online, German or English",
        "We listen to what you bring — not a sales script",
        "If it's a fit, I'll explain the right format for your situation",
        "If it isn't, I'll tell you that too — honestly",
        "You will hear from me within 24 hours of sending your application"
      ]).map(x=>`<li>${x}</li>`).join("")}
    </ul>

    <h3 style="margin-bottom:32px">${de?"Discovery Call anfragen":"Apply for a Discovery Call"}</h3>
    <form class="form-block" action="mailto:hello@annewolter.com" method="post" enctype="text/plain">
      <label>${de?"Dein Name":"Your name"}</label>
      <input type="text" name="name" required>
      <label>${de?"Deine E-Mail-Adresse":"Your email address"}</label>
      <input type="email" name="email" required>
      <label>${de?"Deine Rolle oder dein Kontext (optional)":"Your role or context (optional)"}</label>
      <input type="text" name="role">
      <label>${de?"Was bringt dich hierher? (ein paar Sätze reichen)":"What is bringing you here? (a few sentences is enough)"}</label>
      <textarea name="message" required></textarea>
      <button type="submit" class="btn">${de?"→ Anfrage senden":"→ Send your application"}</button>
    </form>
    <p style="margin-top:32px;font-size:13px;color:var(--sand)">${de
      ? "Deine Nachricht kommt direkt bei mir an. Ich lese jede Anfrage persönlich."
      : "Your message arrives directly with me. I read every application personally."}</p>
  </div>
</section>
`;
}

// ============================================================
// BREATH RESET
// ============================================================
function breathReset(lang) {
  const de = lang === "de";
  return `
<section class="page-hero">
  <div class="wrap-narrow">
    <span class="eyebrow">${de?"Kostenlose Audio-Übung · 3 Minuten":"Free Audio · 3 Minutes"}</span>
    <h1><span class="italic">${de?"Das 3-Minuten Atem-Reset":"The 3-Minute Breath Reset"}</span></h1>
  </div>
</section>

<section>
  <div class="wrap-narrow">
    <p>${de
      ? "Vor dem Meeting. Vor der Präsentation. Vor jedem Moment, der etwas von dir verlangt."
      : "Before the meeting. Before the presentation. Before any moment that asks something of you."}</p>
    <p>${de
      ? "Drei Minuten, die deinen Atem, dein Nervensystem und deine Stimme in einen Zustand zurückbringen, in dem du wirklich ankommen kannst — im Körper, im Raum, bei dir."
      : "Three minutes that return your breath, your nervous system and your voice to a state where you can actually land — in your body, in the room, in yourself."}</p>

    <h3 style="margin-top:48px;margin-bottom:24px">${de?"Was du bekommst":"What you receive"}</h3>
    <ul class="checks">
      ${(de?[
        "Eine 3-minütige geführte Audio-Übung, die du überall nutzen kannst — vor einem Meeting, einer Präsentation oder einfach, wenn du zu dir zurückfinden möchtest",
        "Ein einseitiger somatischer Primer — eine kurze Einführung in den körperbasierten Ansatz hinter der Übung (PDF, per E-Mail)",
        "Eine kurze Folge-Sequenz — praktisch, geerdet, ohne Überflüssiges"
      ]:[
        "A 3-minute guided audio you can use anywhere — before a meeting, a presentation, or simply when you need to return to yourself",
        "A one-page somatic primer — a short introduction to the body-based approach behind the audio (PDF, sent by email)",
        "A short follow-up sequence — practical, grounded, no noise"
      ]).map(x=>`<li>${x}</li>`).join("")}
    </ul>

    <form class="form-block" action="mailto:hello@annewolter.com" method="post" enctype="text/plain" style="margin-top:48px">
      <label>${de?"Wohin darf ich es dir senden?":"Where should I send it?"}</label>
      <input type="email" name="email" placeholder="${de?'Deine E-Mail-Adresse':'Your email address'}" required>
      <button type="submit" class="btn">${de?"→ Audio zusenden":"→ Send me the audio"}</button>
    </form>
    <p class="fine" style="margin-top:16px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--sand)">${de
      ? "Kostenlos. Kein Spam. Jederzeit abmelden. DSGVO-konform."
      : "Free. No spam. Unsubscribe anytime. GDPR compliant."}</p>
  </div>
</section>

<section class="final">
  <h2 style="margin:24px 0"><span class="italic">${de?"Hast du die Übung bereits?":"Already have the audio?"}</span></h2>
  <p>${de
    ? "Wenn etwas darin resoniert hat — der nächste Schritt ist ein Discovery Call."
    : "If something in it resonated — the next step is a Discovery Call."}</p>
  <a href="${dcLink(lang)}" class="btn">${de?"→ Zum Discovery Call bewerben":"→ Apply for a Discovery Call"}</a>
</section>
`;
}

// ============================================================
// THANK YOU
// ============================================================
function thankYou(lang) {
  const de = lang === "de";
  return `
<section class="final" style="min-height:70vh;display:flex;flex-direction:column;justify-content:center">
  <span class="eyebrow">${de?"Danke":"Thank you"}</span>
  <h1 style="margin:24px 0;max-width:780px;margin-left:auto;margin-right:auto"><span class="italic">${de?"Deine Nachricht ist angekommen.":"Your message has arrived."}</span></h1>
  <p style="max-width:620px;margin:0 auto 16px">${de
    ? "Danke, dass du dich gemeldet hast. Ich lese jede Anfrage persönlich. Du hörst innerhalb von 24 Stunden von mir."
    : "Thank you for reaching out. I read every application personally. You will hear from me within 24 hours."}</p>
  <p style="max-width:620px;margin:0 auto 32px;font-family:'Cormorant Garamond',serif;font-style:italic;font-size:20px;color:var(--champagne)">${de
    ? "In der Zwischenzeit — nimm einfach wahr, wie dein Atem sich gerade bewegt. Du musst nichts verändern."
    : "In the meantime — just notice how your breath is moving right now. No need to change anything."}</p>
  <div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap">
    <a href="${brLink(lang)}" class="btn">${de?"→ Zum Atem-Reset":"→ Get the Breath Reset"}</a>
    <a href="${lang==='de'?'index.de.html':'index.html'}" class="btn">${de?"Zurück zur Startseite":"Back to home"}</a>
  </div>
</section>
`;
}

// ============================================================
// LEGAL
// ============================================================
function impressum(lang) {
  const de = lang === "de";
  const rows = de ? [
    ["Anbieter","Anne Wolter"],
    ["Anschrift","Hannover, Deutschland"],
    ["E-Mail","hello@annewolter.com"],
    ["USt-IdNr.","[wird ergänzt]"],
    ["Verantwortlich nach § 18 MStV","Anne Wolter, Anschrift wie oben"],
    ["Berufsbezeichnung","Staatlich geprüfte Atem-, Sprech- und Stimmlehrerin (Deutschland)"]
  ] : [
    ["Provider","Anne Wolter"],
    ["Address","Hannover, Germany"],
    ["Email","hello@annewolter.com"],
    ["VAT ID","[to be added]"],
    ["Responsible per § 18 MStV","Anne Wolter, address as above"],
    ["Professional title","Staatlich geprüfte Atem-, Sprech- und Stimmlehrerin (Germany)"]
  ];
  return `
<section class="page-hero">
  <div class="wrap-narrow">
    <span class="eyebrow">${de?"Impressum":"Imprint"}</span>
    <h1>${de?"Impressum":"Imprint"}</h1>
  </div>
</section>
<section><div class="wrap-narrow">
  <dl style="margin:0">
    ${rows.map(([k,v])=>`<div style="display:grid;grid-template-columns:1fr 2fr;gap:24px;padding:20px 0;border-bottom:1px solid var(--border)"><dt class="eyebrow">${k}</dt><dd style="margin:0;color:rgba(237,232,224,.85)">${v}</dd></div>`).join("")}
  </dl>
  <p style="margin-top:48px;color:rgba(237,232,224,.7);font-size:14px">${de
    ? "Trotz sorgfältiger Prüfung übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich. Alle Texte und Bilder auf dieser Seite sind urheberrechtlich geschützt."
    : "Despite careful review, we assume no liability for the content of external links. The operators of linked pages are solely responsible for their content. All texts and images on this site are protected by copyright."}</p>
</div></section>
`;
}

function datenschutz(lang) {
  const de = lang === "de";
  return `
<section class="page-hero">
  <div class="wrap-narrow">
    <span class="eyebrow">${de?"Datenschutz":"Privacy"}</span>
    <h1>${de?"Datenschutz":"Privacy Policy"}</h1>
  </div>
</section>
<section><div class="wrap-narrow">
  <p>${de
    ? "Wir nehmen den Schutz deiner persönlichen Daten ernst. Diese Seite informiert dich darüber, welche Daten beim Besuch von annewolter.com verarbeitet werden."
    : "We take the protection of your personal data seriously. This page informs you about which data is processed when you visit annewolter.com."}</p>
  <h3 style="margin-top:40px">${de?"Verantwortlicher":"Controller"}</h3>
  <p>Anne Wolter · Hannover, ${de?"Deutschland":"Germany"} · hello@annewolter.com</p>
  <h3 style="margin-top:40px">${de?"Kontaktaufnahme":"Contact"}</h3>
  <p>${de
    ? "Wenn du uns per Formular oder E-Mail kontaktierst, werden deine Angaben zur Bearbeitung der Anfrage gespeichert."
    : "When you contact us via form or email, your details will be stored for processing your inquiry."}</p>
  <h3 style="margin-top:40px">${de?"Deine Rechte":"Your Rights"}</h3>
  <p>${de
    ? "Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten. Wende dich dafür an hello@annewolter.com."
    : "You have the right to information, correction, deletion and restriction of the processing of your data. Please contact hello@annewolter.com."}</p>
  <p style="margin-top:48px;color:var(--sand);font-style:italic;font-size:13px">${de
    ? "Platzhalter — bitte vor Veröffentlichung rechtlich prüfen lassen."
    : "Placeholder — please have this legally reviewed before publishing."}</p>
</div></section>
`;
}

// ============================================================
// PAGE DEFINITIONS
// ============================================================
const pages = [
  { slug:"",                  body:home,        titles:{en:"Anne Wolter — breath. voice. aligned.",            de:"Anne Wolter — breath. voice. aligned."} },
  { slug:"method",            body:method,      titles:{en:"The Method — Anne Wolter",                          de:"Die Methode — Anne Wolter"} },
  { slug:"work-with-me",      body:workWithMe,  titles:{en:"Work With Me — Anne Wolter",                        de:"Mit mir arbeiten — Anne Wolter"} },
  { slug:"workshops",         body:workshops,   titles:{en:"Workshops — Anne Wolter",                           de:"Workshops — Anne Wolter"} },
  { slug:"about",             body:about,       titles:{en:"About — Anne Wolter",                               de:"Über mich — Anne Wolter"} },
  { slug:"discovery-call",    body:discovery,   reduced:true, titles:{en:"Discovery Call — Anne Wolter",                      de:"Discovery Call — Anne Wolter"} },
  { slug:"breath-reset",      body:breathReset, reduced:true, titles:{en:"The 3-Minute Breath Reset — Anne Wolter",           de:"Das 3-Minuten Atem-Reset — Anne Wolter"} },
  { slug:"thank-you",         body:thankYou,    titles:{en:"Thank You — Anne Wolter",                           de:"Danke — Anne Wolter"} },
  { slug:"impressum",         body:impressum,   titles:{en:"Imprint — Anne Wolter",                             de:"Impressum — Anne Wolter"} },
  { slug:"datenschutz",       body:datenschutz, titles:{en:"Privacy — Anne Wolter",                             de:"Datenschutz — Anne Wolter"} }
];
const desc = {
  en: "Authentic voice. Grounded presence. Somatic voice & breath work for women in leadership.",
  de: "Authentische Stimme. Geerdete Präsenz. Somatische Stimm- und Atemarbeit für Frauen in Führung."
};

// ---------- build ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets"), { recursive: true });
// copy images
for (const f of ["hero-portrait.jpg","about-portrait.jpg","breath-texture.jpg","workshop-scene.jpg","method-still.jpg"]) {
  cpSync(join(ROOT, "src/assets", f), join(OUT, "assets", f));
}

for (const p of pages) {
  for (const lang of ["en","de"]) {
    const file = p.slug === ""
      ? (lang === "de" ? "index.de.html" : "index.html")
      : `${p.slug}${lang === "de" ? ".de" : ""}.html`;
    const html = page({
      lang, slug: p.slug, reduced: !!p.reduced,
      title: p.titles[lang], desc: desc[lang],
      body: p.body(lang)
    });
    writeFileSync(join(OUT, file), html);
    console.log("wrote", file, (html.length/1024).toFixed(1)+"kb");
  }
}

writeFileSync(join(OUT, "README.txt"), `Anne Wolter — Static HTML Export
=================================

20 standalone HTML pages (10 pages x EN/DE), no build step required.

Pages:
  index.html / index.de.html              -> Home
  method.html / method.de.html
  work-with-me.html / work-with-me.de.html
  workshops.html / workshops.de.html
  about.html / about.de.html
  discovery-call.html / discovery-call.de.html
  breath-reset.html / breath-reset.de.html
  thank-you.html / thank-you.de.html
  impressum.html / impressum.de.html
  datenschutz.html / datenschutz.de.html

Assets:
  assets/hero-portrait.jpg, about-portrait.jpg, breath-texture.jpg,
  workshop-scene.jpg, method-still.jpg

Fonts:
  Cormorant Garamond + Jost (loaded from Google Fonts, no local files needed)

Usage:
  - Upload the entire folder to your web server (or to a /voice/ subdirectory).
  - Forms (Discovery, Breath Reset) currently use mailto: as a fallback.
    Replace the <form action="..."> with your Formspree / Tally / backend URL
    when ready.
`);
writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nAllow: /\n");

console.log("\nbuilt", pages.length*2, "html files in", OUT);
