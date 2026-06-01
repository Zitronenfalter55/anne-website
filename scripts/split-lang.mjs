// Splits each combined html-export/*.html into /en/<file>.html and /de/<file>.html
// Also writes a root /index.html that redirects to English by default.
import fs from "node:fs";
import path from "node:path";

const dir = "html-export";

// Collect combined source files (skip already-split .en./.de. and asset/static files)
const allFiles = fs.readdirSync(dir);
const combined = allFiles.filter(
  (f) => f.endsWith(".html") && !/\.(en|de)\.html$/.test(f),
);

// Clean previous split outputs / language folders
for (const f of allFiles) {
  if (/\.(en|de)\.html$/.test(f)) fs.rmSync(path.join(dir, f));
}
for (const sub of ["en", "de"]) {
  fs.rmSync(path.join(dir, sub), { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, sub), { recursive: true });
}

const revealScript = `<script>document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('.reveal').forEach(function(el,i){setTimeout(function(){el.classList.add('is-visible');},80*i);});});</script>`;

// Language-switch script: rewrites data-set-lang clicks to navigate sibling folder
const switchScript = `<script>(function(){
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-set-lang]').forEach(function(btn){
    var l = btn.getAttribute('data-set-lang');
    btn.addEventListener('click', function(ev){
      ev.preventDefault();
      location.href = '../' + l + '/' + here;
    });
  });
})();</script>`;

function processForLang(html, lang) {
  const other = lang === "en" ? "de" : "en";
  let out = html;

  // Remove the other-language root block entirely (single top-level <div data-lang-root="other"...>...</div>)
  // SSR markup is `<div data-lang-root="xx">...</div>`. Use a balanced-ish regex by matching the wrapper div.
  const otherRe = new RegExp(
    `<div[^>]*data-lang-root="${other}"[^>]*>([\\s\\S]*?)</div>\\s*(?=<div[^>]*data-lang-root="${lang}"|<script>|</body>)`,
    "g",
  );
  out = out.replace(otherRe, "");

  // Unwrap the keeper div (optional - leave it for safety; just unhide)
  out = out.replace(
    new RegExp(`<div([^>]*)data-lang-root="${lang}"([^>]*)hidden([^>]*)>`, "g"),
    `<div$1data-lang-root="${lang}"$2$3>`,
  );

  // Fix html lang attribute
  out = out.replace(/<html([^>]*?)\slang="[^"]*"/, `<html$1 lang="${lang}"`);
  if (!/<html[^>]*\slang=/.test(out)) {
    out = out.replace(/<html/, `<html lang="${lang}"`);
  }

  // Rewrite asset paths: ./assets/ -> ../assets/ (now nested one level deeper)
  out = out.replace(/(src|href)="\.\/assets\//g, '$1="../assets/');
  // Also handle src/href that start with "assets/" (no leading ./)
  out = out.replace(/(src|href)="assets\//g, '$1="../assets/');
  // Embedded CSS may contain url(./assets/...) after the files move into /en and /de.
  out = out.replace(/url\((['"]?)\.\/assets\//g, 'url($1../assets/');
  // Root hash links break when the export is uploaded at domain root; keep FAQ within the language folder.
  out = out.replace(/href="\/#faq"/g, 'href="index.html#faq"');

  // React SSR omits event handlers, so add explicit language-switch hooks for the static export.
  const otherPressed = lang === "en" ? "de" : "en";
  out = out.replace(
    '<button type="button" aria-pressed="true"',
    `<button type="button" data-set-lang="${lang}" aria-pressed="true"`,
  );
  out = out.replace(
    '<button type="button" aria-pressed="false"',
    `<button type="button" data-set-lang="${otherPressed}" aria-pressed="false"`,
  );

  // Strip the original combined-page TOGGLE_SCRIPT that hides
  // [data-lang-root] blocks based on localStorage. In split mode each
  // folder is already language-specific; if that script runs and the user
  // has the other language stored, the visible block gets hidden and the
  // page renders blank.
  out = out.replace(
    /<script>\s*\n?\s*\(function\(\)\{[\s\S]*?data-lang-root[\s\S]*?\}\)\(\);?\s*<\/script>/g,
    "",
  );

  // Inject reveal + switch scripts before </body>
  // Always inject reveal + switch scripts before </body>.
  // (The earlier `!includes("is-visible")` check was unreliable because the CSS
  // rule .reveal.is-visible always matches that substring, so the reveal script
  // was never added and .reveal elements stayed at opacity:0.)
  out = out.replace("</body>", `${revealScript}${switchScript}</body>`);
  return out;
}

for (const file of combined) {
  const full = path.join(dir, file);
  const html = fs.readFileSync(full, "utf8");
  for (const lang of ["en", "de"]) {
    const out = processForLang(html, lang);
    fs.writeFileSync(path.join(dir, lang, file), out);
  }
  // Remove the original combined file (root)
  if (file !== "index.html") fs.rmSync(full);
}
// Remove the old combined index too — replaced by redirect stub below
const rootIndex = path.join(dir, "index.html");
if (fs.existsSync(rootIndex)) fs.rmSync(rootIndex);

// Write the root redirect. The public root must always start on English;
// users can switch to German from the language toggle after landing.
const redirectHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Anne Wolter — breath. voice. aligned.</title>
<meta name="description" content="Authentic voice. Grounded presence. Somatic voice & breath work for women in leadership and professionals." />
<script>
(function(){
  location.replace('en/index.html');
})();
</script>
<meta http-equiv="refresh" content="0; url=en/index.html" />
<link rel="canonical" href="en/index.html" />
</head>
<body>
<p>Redirecting… <a href="en/index.html">English</a> · <a href="de/index.html">Deutsch</a></p>
</body>
</html>
`;
fs.writeFileSync(rootIndex, redirectHtml);

console.log("split done — /en and /de folders created, root index.html redirects by browser language.");
