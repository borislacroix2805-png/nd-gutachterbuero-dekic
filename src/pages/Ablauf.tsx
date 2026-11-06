import { Link } from 'react-router'
import { Faq, PageHero } from '../components/PageHero'
import { Steps } from '../components/sections/Steps'
import { ContactCta } from '../components/sections/HomeSections'
import { company } from '../content/site'

export default function Ablauf() {
  return (
    <>
      <PageHero
        eyebrow="Ablauf"
        title={
          <>
            Vom Schaden <span className="accent">zum Gutachten.</span>
          </>
        }
        lead="Klar strukturiert, digital organisiert und persönlich begleitet: So läuft die Begutachtung bei uns ab."
      />
      <Steps />
      <section className="section section--ice">
        <div className="container content-grid">
          <article className="prose">
            <h2>1. Schaden erfassen</h2>
            <p>
              Sie melden sich telefonisch unter <a href={company.phoneHref}>{company.phoneDisplay}</a>. Wir nehmen die
              wichtigsten Eckdaten auf: Fahrzeug, Unfall- bzw. Schadenhergang und – falls vorhanden – die Daten des
              Unfallgegners. Fotos des Schadens helfen uns bei der ersten Einschätzung.
            </p>
            <h2>2. Begutachtung</h2>
            <p>
              Wir besichtigen Ihr Fahrzeug vor Ort – zu Hause, am Arbeitsplatz, in der Werkstatt – oder bei uns. Dabei
              dokumentieren wir den Schaden fotografisch, prüfen Umfang und Vorschäden und nehmen alle Daten für die
              Kalkulation auf.
            </p>
            <h2>3. Gutachten erhalten</h2>
            <p>
              Sie erhalten das Gutachten digital. Auf Ihren Wunsch übermitteln wir es direkt an die zuständige
              Versicherung oder Ihre Anwaltskanzlei.
            </p>
            <h2>Was Sie bereithalten sollten</h2>
            <ul className="check-list">
              <li>Fahrzeugschein (Zulassungsbescheinigung Teil I)</li>
              <li>Unfalldaten: Datum, Ort, Hergang, ggf. polizeiliches Aktenzeichen</li>
              <li>Name, Kennzeichen und Versicherung des Unfallgegners</li>
              <li>Fotos des Schadens und der Unfallstelle, sofern vorhanden</li>
              <li>Hinweise auf frühere, reparierte oder unreparierte Schäden</li>
            </ul>
            <h2>Häufige Fragen</h2>
            <Faq
              items={[
                {
                  q: 'Muss ich bei der Besichtigung dabei sein?',
                  a: (
                    <p>
                      Nicht zwingend. Das Fahrzeug muss zugänglich sein, und für Rückfragen sollten Sie telefonisch
                      erreichbar sein. Die Details stimmen wir bei der Terminvereinbarung ab.
                    </p>
                  ),
                },
                {
                  q: 'Ist mein Fahrzeug nach dem Unfall nicht mehr fahrbereit?',
                  a: (
                    <p>
                      Kein Problem – wir kommen dorthin, wo Ihr Fahrzeug steht, etwa zum Abschleppunternehmen oder in die
                      Werkstatt.
                    </p>
                  ),
                },
              ]}
            />
          </article>
          <aside className="aside-card" aria-label="Weiterführende Informationen">
            <h2>Noch Fragen?</h2>
            <p>Antworten rund um Kosten, Wertminderung und Totalschaden finden Sie im Ratgeber.</p>
            <Link className="btn btn--primary" to="/wissen">
              Zum Ratgeber
            </Link>
          </aside>
        </div>
      </section>
      <ContactCta />
    </>
  )
}
