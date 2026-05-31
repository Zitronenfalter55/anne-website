Anne Wolter — Static Site Export
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
- Kein Lovable-Branding enthalten.
- Discovery- und Breath-Reset-Formulare sind reines Frontend; an dein
  Backend / Formular-Tool anzubinden.
