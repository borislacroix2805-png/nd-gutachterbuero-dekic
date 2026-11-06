# Gutachterbüro Dekic – Website

Website des **Gutachterbüros Dekic** (Kfz-Sachverständige in Norddeutschland).
React 19 · TypeScript · Vite · GSAP · statisches Prerendering · vorbereitet für Cloudflare Pages.

> **Status:** Entwicklungsstand, **nicht veröffentlicht**. Vor dem Go-live müssen die
> [offenen Punkte](#offene-punkte-vor-der-veröffentlichung) erledigt sein.

## Seiten

| Pfad | Inhalt |
|---|---|
| `/` | Startseite: Hero mit Kamera-Animation, Vorteile, Warum Dekic, 3 Schritte, digitale Schadenmeldung, Leistungen, Einsatzgebiet, Kontakt |
| `/unfallgutachten` | Unfallgutachten (Haftpflichtschaden) inkl. FAQ |
| `/schadengutachten` | Schadengutachten (Kasko, Hagel, Wild, Parkschaden) inkl. FAQ |
| `/ablauf` | Ablauf der Begutachtung, Checkliste, FAQ |
| `/ueber-uns` | Haltung/Werte, Einsatzgebiet |
| `/wissen` | Ratgeber (Verhalten nach dem Unfall, Kostenvoranschlag, Wertminderung, Totalschaden …) |
| `/kontakt` | Kontaktwege (nur bestätigte Angaben werden angezeigt) |
| `/schaden-melden` | Schadenmeldung – derzeit telefonisch; Online-Formular per Feature-Flag |
| `/datenschutz`, `/impressum` | **Entwürfe** mit markierten Lücken |
| `404.html` | Fehlerseite (echter HTTP-Status 404 auf Cloudflare Pages) |

## Entwicklung

Voraussetzung: Node.js ≥ 22.18 (Tests nutzen Nodes eingebautes TypeScript-Stripping).

```bash
npm ci                 # Abhängigkeiten
cp .env.example .env.local   # optional, siehe „Umgebungsvariablen“
npm run dev            # Entwicklungsserver (http://localhost:5173)
npm run lint           # oxlint
npm test               # Unit-Tests (node:test)
npm run build          # Typecheck + Client-Build + SSR-Build + Prerender → dist/
```

### End-to-End-Tests

```bash
npm run build
node tests/e2e/serve.mjs &                      # Cloudflare-Pages-Emulator auf :8788
BROWSER=chromium BASE_URL=http://localhost:8788 npm run e2e
BROWSER=webkit   BASE_URL=http://localhost:8788 npm run e2e
```

Geprüft werden je Browser auf Desktop (1512×950), iPad (1024×1366) und iPhone (390×844):
Statuscodes, eine `h1` je Seite, Title/Description, `lang`, kein horizontaler Überlauf, Alt-Texte,
alle internen Links, Hero-Animation (Fokus → Blitz → Foto → Galerie-Vorschau), Navigation/Menü,
Console-Fehler, reduzierte Bewegung, 404, Barrierefreiheit (axe-core, WCAG 2.2 AA) und
Content-Security-Policy-Verstöße. Screenshots landen in `test-results/`.

Der Emulator (`tests/e2e/serve.mjs`) bildet Cloudflare Pages nach (statische Dateien, `_headers`,
`404.html`, Brotli, echte Pages Function), weil `wrangler pages dev` macOS ≥ 13.5 voraussetzt.

> macOS 12: Aktuelle Playwright-Browser laufen dort nicht. Chromium funktioniert mit dem
> mitgelieferten `playwright-core@1.49.1`; WebKit nur mit `playwright-core@1.45.3`
> (`PW_CORE=/pfad/zu/playwright-core/index.mjs`). In GitHub Actions laufen beide regulär.

## Architektur

```
src/
  content/site.ts        Unternehmensdaten, Einsatzgebiet, Feature-Flag (eine Quelle der Wahrheit)
  routes.ts              Routen-Metadaten (Title, Description) für Navigation, Prerender, Sitemap
  components/            Header, Footer, Logo (SVG), PageHero, Abschnitte der Startseite
  components/hero/       HeroScene – fotografische Kamera-Animation (GSAP, nachgeladen)
  features/damage-report Formular, Validierung, API-Client der Online-Schadenmeldung
  pages/                 Seiten
  entry-server.tsx       SSR-Einstieg für das Prerendering
scripts/prerender.mjs    rendert jede Route zu dist/<pfad>/index.html, 404.html, sitemap.xml, robots.txt
functions/api/           Cloudflare Pages Functions (Schadenmeldung: derzeit 503, siehe unten)
public/_headers          Sicherheits- und Cache-Header
```

Design-Tokens (Petrol, Eisweiß, Türkis) stehen in `src/index.css`, gemessen aus der Bildvorlage.
Schrift: *Plus Jakarta Sans* (lokal eingebunden, keine Verbindung zu Google).
Details zur Hero-Animation und benötigten Assets: [`docs/ASSETS.md`](docs/ASSETS.md).
Ausbau Schadenmeldung/KI/Gutachtersoftware: [`docs/ARCHITEKTUR.md`](docs/ARCHITEKTUR.md).

## Umgebungsvariablen

| Variable | Wo | Zweck |
|---|---|---|
| `SITE_URL` | Build | Basis-URL für `canonical`, `og:url`, `og:image`, `sitemap.xml`. Leer = wird ausgelassen. |
| `VITE_DAMAGE_REPORT_ENABLED` | Build | `true` schaltet das Online-Formular frei – **erst nach Backend + Datenschutz**. |
| `TURNSTILE_SECRET_KEY`, `NOTIFY_EMAIL` | Cloudflare (Secret) | später für die Schadenmeldung, nie ins Repository. |

`VITE_*`-Variablen landen im ausgelieferten JavaScript und sind öffentlich – dort niemals Geheimnisse.

## Deployment (Cloudflare Pages) – vorbereitet, nicht ausgeführt

1. Cloudflare Dashboard → *Workers & Pages* → *Create* → *Pages* → *Connect to Git* → dieses Repository.
2. Build-Einstellungen:
   - Framework preset: *None*
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Node-Version: über `.node-version` (22)
3. Umgebungen:
   - **Production** = Branch `main`, Variablen `SITE_URL=https://<domain>` und `VITE_DAMAGE_REPORT_ENABLED=false`.
   - **Preview** = alle anderen Branches/PRs. Preview-URLs (`*.pages.dev`) sind öffentlich erreichbar –
     für einen geschützten Vorabzugang *Cloudflare Access* auf die Preview-Domain legen.
4. Eigene Domain unter *Custom domains* verbinden (erst nach Freigabe).

Alternativ per CLI (benötigt Cloudflare-Login, **nur nach ausdrücklicher Freigabe**):
`npx wrangler pages project create nd-gutachterbuero-dekic` und `npx wrangler pages deploy dist`.

Routing: Jede Seite liegt als echtes HTML vor (`dist/<pfad>/index.html`), React übernimmt danach
clientseitig. Unbekannte Pfade liefern `404.html` mit Status 404 – bewusst **kein** SPA-Fallback,
damit Suchmaschinen keine „Soft-404“ sehen.

Sicherheitsheader (`public/_headers`): strikte CSP (`'self'`, keine Inline-Skripte/-Styles),
HSTS, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP.

## Offene Punkte vor der Veröffentlichung

- **Unternehmensangaben bestätigen:** Telefonnummer 0157 5362 8154 (vom Auftraggeber genannt), Anschrift, E-Mail, Rechtsform,
  Inhaber, ggf. USt-IdNr. und berufsrechtliche Angaben → `src/content/site.ts`, dann `verified: true`.
- **Impressum und Datenschutzerklärung** vervollständigen und rechtlich prüfen lassen.
- **Aussagen verifizieren:** „Zertifizierte Kfz-Sachverständige“ und „Anerkannt bei Versicherungen“
  (Vorlage) wurden bis zum Nachweis neutral formuliert; ebenso prüfen: „Begutachtung … in unserer
  Werkstatt“, „Übermittlung an Versicherung & Anwalt“, „Rechtssichere Gutachten“, Einsatzgebiet/Orte.
- **Bildrechte klären:** Alle Fotos stammen aus der Designvorlage. Nutzungsrechte bestätigen und durch
  hochauflösende Originale ersetzen (siehe `docs/ASSETS.md`).
- **Domain** festlegen → `SITE_URL`.
- **Online-Schadenmeldung** erst nach Backend, Einwilligungstext, Löschkonzept und AV-Vertrag freischalten.
  Vorher im Formular die Fehlermeldungen aus den `<label>`-Elementen herauslösen (sie werden sonst
  zusätzlich zum `aria-describedby` als Teil des Feldnamens vorgelesen).
- **Hero-Animation:** Handbewegung (Schritt 1) und hochauflösende Bilder fehlen – siehe `docs/ASSETS.md`.
