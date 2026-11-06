/**
 * Cloudflare Pages Function: POST /api/damage-reports
 *
 * Bewusst noch NICHT aktiv: Echte Schadenmeldungen werden erst angenommen, wenn
 * Datenschutz (Einwilligung, Löschfristen, AV-Vertrag), Spam-/Missbrauchsschutz und
 * Speicherung umgesetzt sind. Geplanter Ausbau (siehe docs/ARCHITEKTUR.md):
 *   - serverseitige Validierung (gleiche Regeln wie src/features/damage-report/validate.ts)
 *   - Turnstile-Prüfung gegen Bots
 *   - Metadaten in D1 (Binding DB), Fotos in R2 (Binding PHOTOS)
 *   - Benachrichtigung des Büros, später KI-Vorprüfung und Export an die Gutachtersoftware
 */
export const onRequestPost = () =>
  Response.json(
    { message: 'Die Online-Schadenmeldung ist noch nicht freigeschaltet. Bitte melden Sie Ihren Schaden telefonisch.' },
    { status: 503, headers: { 'Retry-After': '86400', 'Cache-Control': 'no-store' } },
  )
