/**
 * Client für die Schadenmeldungs-API (Cloudflare Pages Function `functions/api/damage-reports.ts`).
 * Das Backend ist noch nicht umgesetzt und antwortet mit 503 – siehe docs/ARCHITEKTUR.md.
 */
export async function submitDamageReport(data: FormData): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  try {
    const res = await fetch('/api/damage-reports', { method: 'POST', body: data })
    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string }
    if (res.ok && body.id) return { ok: true, id: body.id }
    return { ok: false, message: body.message ?? 'Die Schadenmeldung konnte nicht übermittelt werden.' }
  } catch {
    return { ok: false, message: 'Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung.' }
  }
}
