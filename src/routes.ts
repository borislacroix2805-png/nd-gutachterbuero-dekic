/** Routen-Metadaten: Quelle für Navigation, <title>/Description, Prerender und Sitemap. */
export type RouteMeta = { path: string; title: string; description: string; nav?: string }

export const routes = [
  {
    path: '/',
    title: 'Gutachterbüro Dekic – Kfz-Sachverständige in Norddeutschland',
    description:
      'Unfall? Wir kümmern uns. Unabhängige Kfz-Gutachten nach Unfall- und Fahrzeugschäden – schnelle Schadenaufnahme, digital, persönlich und regional in Norddeutschland.',
  },
  {
    path: '/unfallgutachten',
    nav: 'Unfallgutachten',
    title: 'Unfallgutachten nach Verkehrsunfall | Gutachterbüro Dekic',
    description:
      'Unverschuldeter Unfall? Ein unabhängiges Unfallgutachten dokumentiert Reparaturkosten, Wertminderung und Nutzungsausfall – die Grundlage für Ihre Ansprüche.',
  },
  {
    path: '/schadengutachten',
    nav: 'Schadengutachten',
    title: 'Schadengutachten für Kasko-, Hagel- und Parkschäden | Gutachterbüro Dekic',
    description:
      'Schadengutachten und Kurzgutachten für Kasko-, Hagel-, Wild-, Vandalismus- und Parkschäden – neutral, nachvollziehbar und schnell erstellt.',
  },
  {
    path: '/ablauf',
    nav: 'Ablauf',
    title: 'Ablauf: In 3 Schritten zum Kfz-Gutachten | Gutachterbüro Dekic',
    description:
      'So einfach geht’s: Schaden erfassen, Begutachtung vor Ort oder bei uns, Gutachten erhalten. Der Ablauf im Überblick – mit Antworten auf häufige Fragen.',
  },
  {
    path: '/ueber-uns',
    nav: 'Über uns',
    title: 'Über uns | Gutachterbüro Dekic',
    description:
      'Das Gutachterbüro Dekic: Kfz-Sachverständige in Norddeutschland – unabhängig, persönlich erreichbar und digital organisiert.',
  },
  {
    path: '/wissen',
    nav: 'Wissen',
    title: 'Wissen & Ratgeber nach dem Unfall | Gutachterbüro Dekic',
    description:
      'Gutachten oder Kostenvoranschlag? Wer zahlt den Gutachter? Was ist Wertminderung? Verständliche Antworten rund um Kfz-Schaden und Gutachten.',
  },
  {
    path: '/kontakt',
    nav: 'Kontakt',
    title: 'Kontakt | Gutachterbüro Dekic',
    description: 'Kontakt zum Gutachterbüro Dekic – telefonisch erreichbar für Schadenmeldung und Terminvereinbarung.',
  },
  {
    path: '/schaden-melden',
    nav: 'Schaden melden',
    title: 'Schaden melden | Gutachterbüro Dekic',
    description: 'Kfz-Schaden melden: So erreichen Sie uns nach einem Unfall schnell und unkompliziert.',
  },
  {
    path: '/datenschutz',
    nav: 'Datenschutz',
    title: 'Datenschutzerklärung | Gutachterbüro Dekic',
    description: 'Datenschutzerklärung des Gutachterbüros Dekic.',
  },
  {
    path: '/impressum',
    nav: 'Impressum',
    title: 'Impressum | Gutachterbüro Dekic',
    description: 'Impressum des Gutachterbüros Dekic.',
  },
] as const satisfies readonly RouteMeta[]

export const notFoundMeta: RouteMeta = {
  path: '/404',
  title: 'Seite nicht gefunden | Gutachterbüro Dekic',
  description: 'Die angeforderte Seite wurde nicht gefunden.',
}

export const normalizePath = (path: string) => path.replace(/\/+$/, '') || '/'

export const findRoute = (path: string): RouteMeta =>
  routes.find((r) => r.path === normalizePath(path)) ?? notFoundMeta
