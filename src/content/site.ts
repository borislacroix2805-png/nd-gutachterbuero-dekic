/**
 * Zentrale Unternehmensangaben.
 * ACHTUNG: Telefonnummer vom Auftraggeber (2026-11-06), übrige Angaben aus der Designvorlage; alle Angaben sind
 * vor produktiver Nutzung vom Inhaber zu verifizieren (siehe README → „Offene Punkte“).
 * Leere Felder (null) werden auf der Website nicht angezeigt.
 */
export const company = {
  name: 'Gutachterbüro Dekic',
  legalName: null as string | null, // z. B. Rechtsform/Inhaber – vom Inhaber zu liefern
  phoneDisplay: '0157 5362 8154',
  phoneHref: 'tel:+4915753628154',
  email: null as string | null,
  street: null as string | null,
  city: null as string | null,
  openingHours: null as string | null,
  /** true erst setzen, wenn alle obigen Angaben vom Inhaber bestätigt sind. */
  verified: false,
}

/** Einsatzgebiet – Annahme aus der Designvorlage (Raum Kiel), vom Inhaber zu bestätigen. */
export const serviceArea = {
  headline: 'Norddeutschland',
  regions: ['Kiel & Umgebung', 'Schleswig-Holstein', 'Hamburg & Umland'],
  places: ['Kiel', 'Neumünster', 'Rendsburg', 'Eckernförde', 'Plön', 'Lübeck', 'Flensburg', 'Hamburg'],
}

/**
 * Feature-Flag: Die Online-Schadenmeldung nimmt erst echte Daten entgegen, wenn
 * Backend, Datenschutz und Sicherheit umgesetzt sind (VITE_DAMAGE_REPORT_ENABLED=true).
 */
export const damageReportEnabled = import.meta.env.VITE_DAMAGE_REPORT_ENABLED === 'true'
