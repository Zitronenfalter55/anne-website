// Renders the React app to static HTML files for offline / standalone use.
// Each output file contains both EN and DE markup; a tiny inline script
// toggles which language is visible (based on localStorage 'aw_lang').
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, readdirSync, cpSync, rmSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(process.cwd());
const OUT = join(ROOT, "html-export");
const DIST = join(ROOT, "dist");
const SSR = join(ROOT, "dist-ssr");

const ROUTES = [
  { path: "/", file: "index.html", titleEn: "Anne Wolter — breath. voice. aligned.", titleDe: "Anne Wolter — breath. voice. aligned." },
  { path: "/method", file: "method.html", titleEn: "The Method — Anne Wolter", titleDe: "Die Methode — Anne Wolter" },
  { path: "/work-with-me", file: "work-with-me.html", titleEn: "Work With Me — Anne Wolter", titleDe: "Zusammenarbeit — Anne Wolter" },
  { path: "/workshops", file: "workshops.html", titleEn: "Workshops — Anne Wolter", titleDe: "Workshops — Anne Wolter" },
  { path: "/about", file: "about.html", titleEn: "About — Anne Wolter", titleDe: "Über mich — Anne Wolter" },
  { path: "/discovery-call", file: "discovery-call.html", titleEn: "Discovery Call — Anne Wolter", titleDe: "Discovery Call — Anne Wolter" },
  { path: "/breath-reset", file: "breath-reset.html", titleEn: "The 3-Minute Reset — Anne Wolter", titleDe: "Der 3-Minuten Reset — Anne Wolter" },
  { path: "/thank-you", file: "thank-you.html", titleEn: "Thank You — Anne Wolter", titleDe: "Danke — Anne Wolter" },
  { path: "/datenschutz", file: "datenschutz.html", titleEn: "Datenschutz — Anne Wolter", titleDe: "Datenschutz — Anne Wolter" },
  { path: "/impressum", file: "impressum.html", titleEn: "Impressum — Anne Wolter", titleDe: "Impressum — Anne Wolter" },
];

const PATH_TO_FILE = Object.fromEntries(ROUTES.map(r => [r.path, r.file]));

function sh(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: ROOT });
}

// 1. Build client (CSS + assets)
sh("npx vite build");
// 2. Build SSR bundle
sh("npx vite build -c vite.ssr.config.ts");

// 3. Find the built CSS file
const assetsDir = join(DIST, "assets");
const cssFile = readdirSync(assetsDir).find(f => f.endsWith(".css"));
const cssContent = readFileSync(join(assetsDir, cssFile), "utf8");

// 4. Load the SSR render function
const entry = pathToFileURL(join(SSR, "entry-server.mjs")).href;
const { render } = await import(entry);

// 5. Prepare output dir
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(assetsDir, join(OUT, "assets"), { recursive: true });
// favicon + robots
for (const f of ["favicon.ico", "robots.txt", "placeholder.svg"]) {
  const src = join(DIST, f);
  if (existsSync(src)) cpSync(src, join(OUT, f));
}

function rewriteLinks(html) {
  // Rewrite internal route hrefs to .html files. /method -> method.html, / -> index.html
  return html.replace(/href="(\/[^"#?]*)"/g, (m, href) => {
    const file = PATH_TO_FILE[href];
    if (file) return `href="${file}"`;
    // Keep external/asset paths untouched but turn /assets/... into ./assets/...
    if (href.startsWith("/assets/")) return `href=".${href}"`;
    return m;
  });
}

function rewriteAssetUrls(html) {
  // src="/assets/..." -> src="./assets/..."
  return html.replace(/(src|href)="\/assets\//g, '$1="./assets/');
}

const TOGGLE_SCRIPT = `
(function(){
  var KEY='aw_lang';
  function getLang(){
    try{ var s=localStorage.getItem(KEY); if(s==='en'||s==='de') return s; }catch(e){}
    var b=(navigator.language||'').toLowerCase();
    return b.indexOf('de')===0?'de':'en';
  }
  function apply(l){
    document.documentElement.setAttribute('lang', l);
    document.querySelectorAll('[data-lang-root]').forEach(function(el){
      el.hidden = (el.getAttribute('data-lang-root')!==l);
    });
    try{ localStorage.setItem(KEY,l); }catch(e){}
  }
  function wire(){
    document.querySelectorAll('[data-set-lang]').forEach(function(btn){
      btn.addEventListener('click', function(ev){
        ev.preventDefault();
        apply(btn.getAttribute('data-set-lang'));
      });
    });
    // For static export, reveal all .reveal elements immediately.
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-visible'); });
  }
  apply(getLang());
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
`;

function wrap(route, enHtml, deHtml) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${route.titleEn}</title>
<meta name="description" content="Authentic voice. Grounded presence. Somatic voice & breath work for women in leadership and professionals." />
<meta name="author" content="Anne Wolter" />
<meta property="og:title" content="${route.titleEn}" />
<meta property="og:description" content="Authentic voice. Grounded presence. Somatic voice & breath work for women in leadership and professionals." />
<meta property="og:type" content="website" />
<style>${cssContent}</style>
</head>
<body>
<div data-lang-root="en">${enHtml}</div>
<div data-lang-root="de" hidden>${deHtml}</div>
<script>${TOGGLE_SCRIPT}</script>
</body>
</html>
`;
}

for (const route of ROUTES) {
  console.log(`render ${route.path}`);
  const enRaw = render(route.path, "en");
  const deRaw = render(route.path, "de");
  const en = rewriteAssetUrls(rewriteLinks(enRaw));
  const de = rewriteAssetUrls(rewriteLinks(deRaw));
  const html = wrap(route, en, de);
  writeFileSync(join(OUT, route.file), html);
}

// README + robots
writeFileSync(join(OUT, "README.txt"), `Anne Wolter — Static Site Export
=================================

Diese Dateien sind eigenstaendige HTML-Seiten (kein React-Build noetig).
Jede Datei enthaelt beide Sprachen (EN/DE); der Toggle oben rechts in der
Nav schaltet um (Auswahl wird im Browser per localStorage gespeichert).

Inhalt:
- index.html, method.html, work-with-me.html, workshops.html, about.html,
  discovery-call.html, breath-reset.html, thank-you.html, datenschutz.html,
  impressum.html
- assets/ : CSS, Bilder, Fonts werden ueber Google Fonts geladen

Verwendung:
1) Komplett uebernehmen: Ordner auf den Server (z.B. annewolter.com/voice/).
2) Einzelne Sektionen: Datei im Browser oeffnen, gewuenschte <section>
   via Inspector / View Source kopieren. Styles aus assets/*.css uebernehmen
   oder durch deine bestehenden ersetzen.

Hinweise:
- Discovery- und Breath-Reset-Formulare sind reines Frontend; an dein
  Backend / Formular-Tool anzubinden.
`);

if (!existsSync(join(OUT, "robots.txt"))) {
  writeFileSync(join(OUT, "robots.txt"), "User-agent: *\nAllow: /\n");
}

console.log("done.");
