import { Link } from 'react-router'
import { ArrowRight, Phone } from 'lucide-react'
import { Faq, PageHero } from '../components/PageHero'
import { Steps } from '../components/sections/Steps'
import { ContactCta } from '../components/sections/HomeSections'
import { company } from '../content/site'

export default function Unfallgutachten() {
  return (
    <>
      <PageHero
        eyebrow="Leistungen"
        title={
          <>
            Unfallgutachten <span className="accent">nach Verkehrsunfall.</span>
          </>
        }
        lead="Nach einem unverschuldeten Unfall stehen Ihnen Ansprüche gegenüber der Haftpflichtversicherung des Unfallverursachers zu. Ein unabhängiges Gutachten dokumentiert den Schaden vollständig und nachvollziehbar."
      >
        <Link className="btn btn--primary" to="/schaden-melden">
          Schaden melden <ArrowRight aria-hidden="true" />
        </Link>
        <a className="btn btn--ghost" href={company.phoneHref}>
          <Phone aria-hidden="true" /> {company.phoneDisplay}
        </a>
      </PageHero>

      <section className="section section--ice">
        <div className="container content-grid">
          <article className="prose">
            <h2>Wann ein Unfallgutachten sinnvoll ist</h2>
            <p>
              Wurden Sie unverschuldet in einen Verkehrsunfall verwickelt, muss die Kfz-Haftpflichtversicherung des
              Verursachers Ihren Schaden ersetzen. Dazu gehört bei Schäden oberhalb der sogenannten Bagatellgrenze – nach
              gängiger Rechtsprechung rund 750&nbsp;Euro – in der Regel auch ein Gutachten durch einen unabhängigen
              Kfz-Sachverständigen Ihrer Wahl.
            </p>
            <p>
              Sie sind nicht verpflichtet, den Sachverständigen der gegnerischen Versicherung zu akzeptieren. Ein selbst
              beauftragtes, unabhängiges Gutachten stellt sicher, dass alle Schadenpositionen erfasst werden.
            </p>

            <h2>Was das Gutachten enthält</h2>
            <ul className="check-list">
              <li>Fotodokumentation und Beschreibung des Schadens</li>
              <li>Kalkulation der Reparaturkosten und der voraussichtlichen Reparaturdauer</li>
              <li>Merkantile Wertminderung</li>
              <li>Wiederbeschaffungswert und Restwert – wichtig bei wirtschaftlichem Totalschaden</li>
              <li>Grundlage für Nutzungsausfall bzw. Mietwagenklasse</li>
              <li>Abgrenzung von Vor- und Altschäden</li>
            </ul>

            <h2>Wer die Kosten trägt</h2>
            <p>
              Bei einem unverschuldeten Unfall gehören die Kosten des Gutachtens zum erstattungsfähigen Schaden und werden
              in der Regel von der gegnerischen Haftpflichtversicherung übernommen. Bei einer Mithaftung werden die Kosten
              grundsätzlich nur anteilig erstattet.
            </p>
            <p className="notice">
              Hinweis: Wir erstellen Gutachten, erbringen aber keine Rechtsberatung. Für rechtliche Fragen zur
              Schadenregulierung empfehlen wir eine Fachanwältin bzw. einen Fachanwalt für Verkehrsrecht.
            </p>

            <h2>Häufige Fragen</h2>
            <Faq
              items={[
                {
                  q: 'Reicht nicht auch ein Kostenvoranschlag?',
                  a: (
                    <p>
                      Bei kleineren Schäden unterhalb der Bagatellgrenze kann ein Kostenvoranschlag genügen. Er enthält
                      jedoch keine Wertminderung, keinen Wiederbeschaffungswert und keine Beweissicherung – bei größeren
                      Schäden ist deshalb ein Gutachten die verlässlichere Grundlage.
                    </p>
                  ),
                },
                {
                  q: 'Wie schnell sollte ich den Schaden begutachten lassen?',
                  a: (
                    <p>
                      Möglichst zeitnah und vor Beginn der Reparatur. So lässt sich der Schaden im Originalzustand
                      dokumentieren.
                    </p>
                  ),
                },
                {
                  q: 'Was ist, wenn die Schuldfrage noch offen ist?',
                  a: (
                    <p>
                      Sprechen Sie uns an. Bei ungeklärter Haftung stimmen wir gemeinsam ab, ob und in welchem Umfang ein
                      Gutachten sinnvoll ist.
                    </p>
                  ),
                },
              ]}
            />
          </article>
          <aside className="aside-card" aria-label="Schnellkontakt">
            <h2>Unfall gehabt?</h2>
            <p>Rufen Sie uns an – wir klären die nächsten Schritte und vereinbaren einen Termin zur Besichtigung.</p>
            <a className="btn btn--primary" href={company.phoneHref}>
              <Phone aria-hidden="true" /> {company.phoneDisplay}
            </a>
            <Link className="btn btn--ghost" to="/wissen">
              Ratgeber lesen
            </Link>
          </aside>
        </div>
      </section>
      <Steps />
      <ContactCta />
    </>
  )
}
