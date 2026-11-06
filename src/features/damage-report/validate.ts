/** Clientseitige Prüfung der Schadenmeldung. Das Backend muss dieselben Regeln serverseitig erneut prüfen. */
export const MAX_PHOTOS = 10
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export type ReportInput = {
  name: string
  phone: string
  email: string
  plate: string
  damageType: string
  date: string
  location: string
  description: string
  consent: boolean
  photos: { name: string; size: number; type: string }[]
}

export type ReportErrors = Partial<Record<keyof ReportInput, string>>

export function validateReport(input: ReportInput, today = new Date()): ReportErrors {
  const e: ReportErrors = {}
  if (input.name.trim().length < 2) e.name = 'Bitte geben Sie Ihren Namen an.'
  const phoneOk = /^[+\d][\d\s/()-]{5,}$/.test(input.phone.trim())
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.email.trim())
  if (!phoneOk && !emailOk) e.phone = 'Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an.'
  if (input.email.trim() && !emailOk) e.email = 'Bitte prüfen Sie die E-Mail-Adresse.'
  if (!input.damageType) e.damageType = 'Bitte wählen Sie die Schadenart.'
  if (input.date && new Date(input.date) > today) e.date = 'Das Datum liegt in der Zukunft.'
  if (input.description.length > 2000) e.description = 'Bitte fassen Sie sich kürzer (max. 2.000 Zeichen).'
  if (input.photos.length > MAX_PHOTOS) e.photos = `Bitte maximal ${MAX_PHOTOS} Fotos auswählen.`
  else if (input.photos.some((p) => !ACCEPTED_TYPES.includes(p.type)))
    e.photos = 'Erlaubt sind JPG, PNG, WebP und HEIC.'
  else if (input.photos.some((p) => p.size > MAX_PHOTO_BYTES)) e.photos = 'Jedes Foto darf höchstens 10 MB groß sein.'
  if (!input.consent) e.consent = 'Bitte stimmen Sie der Datenverarbeitung zu.'
  return e
}
