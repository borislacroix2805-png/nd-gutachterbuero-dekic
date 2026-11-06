import { Link } from 'react-router'
import { ArrowRight, Camera, CarFront, FileSearch, Images, Phone, ScanLine, ShieldAlert } from 'lucide-react'
import { company, damageReportEnabled, serviceArea } from '../../content/site'
import './sections.css'

/* ── Digitale Schadenmeldung ─────────────────────────────────────────────── */
export function DamageReportTeaser() {
  return (
    <section className="section section--petrol report" aria-labelledby="report-title">
      <div className="container report__grid">
        <div>
          <p className="eyebrow">Digitale Schadenmeldung</p>
          <h2 id="report-title" className="h2 report__title">
            Schaden fotografieren. <span className="accent">Wir übernehmen.</span>
          </h2>
          <p className="lead report__lead">
            Mit wenigen Fotos und Angaben verschaffen wir uns einen ersten Überblick über Ihren Schaden – und melden uns
            mit dem passenden nächsten Schritt: Termin vor Ort, Begutachtung bei uns oder Kurzeinschätzung.
          </p>
          <div className="report__actions">
            <Link className="btn btn--primary" to="/schaden-melden">
              <Camera aria-hidden="true" /> Schaden melden <ArrowRight aria-hidden="true" />
            </Link>
            <a className="btn btn--ghost" href={company.phoneHref}>
              <Phone aria-hidden="true" /> {company.phoneDisplay}
            </a>
          </div>
          {!damageReportEnabled && (
            <p className="notice notice--dark report__notice">
              Die Online-Übermittlung von Fotos wird derzeit eingerichtet. Bis dahin nehmen wir Ihre Schadenmeldung
              gerne telefonisch auf.
            </p>
          )}
        </div>
        <ul className="report__checklist" aria-label="Das hilft bei der Schadenmeldung">
          <li>
            <Images aria-hidden="true" />
            <div>
              <strong>Fotos des Schadens</strong>
              <span>Nah und aus mehreren Blickwinkeln, dazu eine Gesamtansicht mit Kennzeichen.</span>
            </div>
          </li>
          <li>
            <FileSearch aria-hidden="true" />
            <div>
              <strong>Fahrzeugschein</strong>
              <span>Zulassungsbescheinigung Teil I – für Fahrzeugdaten und Ausstattung.</span>
            </div>
          </li>
          <li>
            <ShieldAlert aria-hidden="true" />
            <div>
              <strong>Angaben zum Unfall</strong>
              <span>Datum, Ort, Hergang und – falls vorhanden – Daten und Versicherung des Unfallgegners.</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ── Leistungen ──────────────────────────────────────────────────────────── */
const services = [
  {
    to: '/unfallgutachten',
    icon: CarFront,
    title: 'Unfallgutachten',
    text: 'Nach einem unverschuldeten Unfall: Beweissicherung, Reparaturkosten, Wertminderung und Nutzungsausfall – als Grundlage für Ihre Ansprüche gegenüber der gegnerischen Versicherung.',
  },
  {
    to: '/schadengutachten',
    icon: ScanLine,
    title: 'Schadengutachten',
    text: 'Für Kasko-, Hagel-, Wild-, Vandalismus- und Parkschäden: neutrale Feststellung von Schadenumfang und Reparaturweg.',
  },
  {
    to: '/schaden-melden',
    icon: Camera,
    title: 'Digitale Schadenaufnahme',
    text: 'Strukturierte Schadenaufnahme mit Fotodokumentation – damit die Begutachtung schnell und zielgerichtet stattfinden kann.',
  },
]

export function Services() {
  return (
    <section className="section section--ice services" aria-labelledby="services-title">
      <div className="container">
        <p className="eyebrow">Leistungen</p>
        <h2 id="services-title" className="h2 services__title">
          Gutachten, die <span className="accent">Klarheit schaffen.</span>
        </h2>
        <ul className="services__grid">
          {services.map(({ to, icon: Icon, title, text }) => (
            <li key={to}>
              <Link to={to} className="service-card">
                <Icon aria-hidden="true" className="service-card__icon" />
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="service-card__more">
                  Mehr erfahren <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── Einsatzgebiet ───────────────────────────────────────────────────────── */
// Reale Lage der Orte relativ zu Kiel (km, gerundet; x = Ost, y = Süd).
const placeCoords: Record<string, [number, number]> = {
  Kiel: [0, 0],
  Neumünster: [-10, 28],
  Rendsburg: [-31, 2],
  Eckernförde: [-19, -17],
  Plön: [19, 18],
  Lübeck: [37, 50],
  Flensburg: [-45, -52],
  Hamburg: [-9, 85],
}

export function ServiceArea() {
  return (
    <section className="section section--petrol area" aria-labelledby="area-title">
      <div className="container area__grid">
        <div>
          <p className="eyebrow">Einsatzgebiet</p>
          <h2 id="area-title" className="h2">
            Vor Ort in <span className="accent">{serviceArea.headline}.</span>
          </h2>
          <p className="lead area__lead">
            Wir begutachten Ihr Fahrzeug dort, wo es steht – zu Hause, am Arbeitsplatz oder in der Werkstatt. Ist Ihr Ort
            nicht aufgeführt, fragen Sie einfach kurz telefonisch nach.
          </p>
          <ul className="area__chips" aria-label="Orte im Einsatzgebiet">
            {serviceArea.places.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <svg className="area__map" viewBox="-108 -108 216 216" role="img" aria-label="Schematische Karte des Einsatzgebiets rund um Kiel">
          {[25, 50, 75, 100].map((r) => (
            <circle key={r} r={r} className="area__ring" />
          ))}
          <circle r="100" className="area__sweep" />
          {serviceArea.places.map((p) => {
            const c = placeCoords[p]
            if (!c) return null
            const [x, y] = c
            const main = p === 'Kiel'
            return (
              <g key={p} transform={`translate(${x} ${y})`} className={main ? 'area__pin area__pin--main' : 'area__pin'}>
                <circle r={main ? 4 : 2.4} />
                <text x={x < -15 ? -6 : main ? 7 : 6} y={main ? 11 : 2} textAnchor={x < -15 ? 'end' : 'start'}>
                  {p}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}

/* ── Abschluss-CTA (auf allen Seiten) ────────────────────────────────────── */
export function ContactCta() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container cta__inner">
        <div>
          <h2 id="cta-title" className="cta__title">
            Unfall gehabt? <span className="accent">Wir sind für Sie da.</span>
          </h2>
          <p className="cta__text">Rufen Sie uns an – wir besprechen die nächsten Schritte und vereinbaren einen Termin.</p>
        </div>
        <div className="cta__actions">
          <a className="btn btn--primary" href={company.phoneHref}>
            <Phone aria-hidden="true" /> {company.phoneDisplay}
          </a>
          <Link className="btn btn--ghost" to="/kontakt">
            Kontakt <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
