/**
 * Zentrale Unternehmensangaben.
 * ACHTUNG: Telefonnummer und alle Angaben stammen aus der Designvorlage und sind
 * vor produktiver Nutzung vom Inhaber zu verifizieren (siehe README → „Offene Punkte“).
 * Leere Felder (null) werden auf der Website nicht angezeigt.
 */
export const company = {
  name: 'Gutachterbüro Dekic',
  legalName: null as string | null, // z. B. Rechtsform/Inhaber – vom Inhaber zu liefern
  phoneDisplay: '0431 7200 1120',
  phoneHref: 'tel:+4943172001120',
  email: null as string | null,
  street: null as string | null,
  city: null as string | null,
  openingHours: null as string | null,
  /** true erst setzen, wenn alle obigen Angaben vom Inhaber bestätigt sind. */
  verified: false,
}

/** Einsatzgebiet – Annahme aus Vorwahl 0431 (Kiel), vom Inhaber zu bestätigen. */
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
