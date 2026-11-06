import { Phone } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { Steps } from '../components/sections/Steps'
import { DamageReportForm } from '../features/damage-report/DamageReportForm'
import { company, damageReportEnabled } from '../content/site'

export default function SchadenMelden() {
  return (
    <>
      <PageHero
        eyebrow="Schaden melden"
        title={
          <>
            Schaden melden – <span className="accent">schnell & einfach.</span>
          </>
        }
        lead={
          damageReportEnabled
            ? 'Fotos und Angaben hochladen – wir melden uns schnellstmöglich mit dem nächsten Schritt.'
            : 'Rufen Sie uns an. Wir nehmen Ihre Schadenmeldung direkt auf und vereinbaren einen Termin zur Besichtigung.'
        }
      >
        <a className="btn btn--primary" href={company.phoneHref}>
          <Phone aria-hidden="true" /> {company.phoneDisplay}
        </a>
      </PageHero>

      <section className="section section--ice">
        <div className="container content-grid">
          {damageReportEnabled ? (
            <DamageReportForm />
          ) : (
            <article className="prose">
              <h2>So melden Sie Ihren Schaden</h2>
              <p>
                Telefonisch unter <a href={company.phoneHref}>{company.phoneDisplay}</a>. Halten Sie, wenn möglich,
                folgende Angaben bereit:
              </p>
              <ul className="check-list">
                <li>Fahrzeugschein (Zulassungsbescheinigung Teil I)</li>
                <li>Datum, Ort und kurzer Hergang des Unfalls bzw. Schadens</li>
                <li>Kennzeichen und Versicherung des Unfallgegners, falls bekannt</li>
                <li>Standort des Fahrzeugs und ob es noch fahrbereit ist</li>
                <li>Fotos des Schadens – nah, aus mehreren Blickwinkeln und mit Gesamtansicht</li>
              </ul>
              <p className="notice">
                Die digitale Schadenmeldung mit Foto-Upload wird derzeit eingerichtet. Sie wird erst freigeschaltet, wenn
                Datenschutz und sichere Übertragung vollständig umgesetzt sind.
              </p>
            </article>
          )}
          <aside className="aside-card" aria-label="Direkter Kontakt">
            <h2>Lieber direkt sprechen?</h2>
            <p>Wir beantworten Ihre Fragen und klären, ob ein Gutachten sinnvoll ist.</p>
            <a className="btn btn--primary" href={company.phoneHref}>
              <Phone aria-hidden="true" /> {company.phoneDisplay}
            </a>
          </aside>
        </div>
      </section>
      <Steps />
    </>
  )
}
