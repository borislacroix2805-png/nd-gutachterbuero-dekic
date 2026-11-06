import { Link } from 'react-router'
import { ArrowRight, Phone } from 'lucide-react'
import { Faq, PageHero } from '../components/PageHero'
import { Steps } from '../components/sections/Steps'
import { ContactCta } from '../components/sections/HomeSections'
import { company } from '../content/site'

export default function Schadengutachten() {
  return (
    <>
      <PageHero
        eyebrow="Leistungen"
        title={
          <>
            Schadengutachten <span className="accent">für jeden Fahrzeugschaden.</span>
          </>
        }
        lead="Ob Hagel, Wildunfall, Vandalismus oder ein Parkschaden mit unbekanntem Verursacher: Wir stellen Schadenumfang und Reparaturweg neutral und nachvollziehbar fest."
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
            <h2>Typische Anlässe</h2>
            <ul className="check-list">
              <li>Teilkaskoschäden wie Hagel, Sturm, Wildunfall oder Glasbruch</li>
              <li>Vollkaskoschäden, etwa nach einem selbst verursachten Unfall oder durch Vandalismus</li>
              <li>Parkschäden und Unfallflucht mit unbekanntem Verursacher</li>
              <li>Schäden, deren Umfang oder Ursache strittig ist</li>
            </ul>

            <h2>Was wir feststellen</h2>
            <p>
              Wir dokumentieren den Schaden fotografisch, beschreiben Art und Umfang und kalkulieren einen fachgerechten
              Reparaturweg mit den zu erwartenden Kosten. Bei Bedarf ermitteln wir zusätzlich Wiederbeschaffungs- und
              Restwert.
            </p>

            <h2>Kasko: vorher die Kostenfrage klären</h2>
            <p>
              Bei Kaskoschäden beauftragt häufig die eigene Versicherung einen Sachverständigen. Ob die Kosten eines selbst
              beauftragten Gutachtens übernommen werden, hängt von Ihren Versicherungsbedingungen ab. Sprechen Sie uns an –
              wir besprechen vorab, welcher Weg in Ihrem Fall sinnvoll ist.
            </p>

            <h2>Kleinere Schäden</h2>
            <p>
              Nicht jeder Kratzer braucht ein vollständiges Gutachten. Wir sagen Ihnen ehrlich, ob sich der Aufwand lohnt –
              und welche Alternative ausreicht.
            </p>

            <h2>Häufige Fragen</h2>
            <Faq
              items={[
                {
                  q: 'Was ist der Unterschied zum Unfallgutachten?',
                  a: (
                    <p>
                      Das Unfallgutachten dient vor allem der Durchsetzung von Ansprüchen gegenüber der Versicherung eines
                      Unfallgegners. Das Schadengutachten erfasst Schäden unabhängig davon, wer sie reguliert – zum
                      Beispiel bei Kasko- oder Elementarschäden.
                    </p>
                  ),
                },
                {
                  q: 'Kann ich vor der Begutachtung schon reparieren lassen?',
                  a: (
                    <p>
                      Bitte nicht. Der Schaden sollte im Originalzustand begutachtet werden. Ausnahmen – etwa eine
                      notwendige Notreparatur – sollten vorher fotografisch dokumentiert werden.
                    </p>
                  ),
                },
              ]}
            />
          </article>
          <aside className="aside-card" aria-label="Schnellkontakt">
            <h2>Schaden entdeckt?</h2>
            <p>Melden Sie sich telefonisch – wir besprechen, ob ein Gutachten sinnvoll ist, und vereinbaren einen Termin.</p>
            <a className="btn btn--primary" href={company.phoneHref}>
              <Phone aria-hidden="true" /> {company.phoneDisplay}
            </a>
            <Link className="btn btn--ghost" to="/ablauf">
              Ablauf ansehen
            </Link>
          </aside>
        </div>
      </section>
      <Steps />
      <ContactCta />
    </>
  )
}
