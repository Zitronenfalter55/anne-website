Anne Wolter — Static Site Export
=================================

Diese Dateien sind eigenstaendige HTML-Seiten (kein React-Build noetig).
Root- und /en-Seiten enthalten Englisch, /de-Seiten enthalten Deutsch.
Die Sprachumschaltung verlinkt zwischen den getrennten Sprachdateien.

Inhalt:
  - index.html, method.html, work-with-me.html, workshops.html, about.html,
    discovery-call.html, breath-reset.html, thank-you.html,
    privacy-policy.html, legal-notice.html, withdrawal-policy.html,
    terms-and-conditions.html
  - en/ : englische Duplikate
  - de/ : deutsche Seiten inkl. datenschutz.html, impressum.html, agb.html,
    widerruf.html
- assets/ : CSS, Bilder, Fonts werden ueber Google Fonts geladen

Verwendung:
1) Komplett uebernehmen: Ordner auf den Server (z.B. annewolter.com/voice/).
2) Einzelne Sektionen: Datei im Browser oeffnen, gewuenschte <section>
   via Inspector / View Source kopieren. Styles aus assets/*.css uebernehmen
   oder durch deine bestehenden ersetzen.

Hinweise:
- Discovery- und Breath-Reset-Formulare sind reines Frontend; an dein
  Backend / Formular-Tool anzubinden.
