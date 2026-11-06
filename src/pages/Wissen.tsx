import { PageHero } from '../components/PageHero'
import { ContactCta } from '../components/sections/HomeSections'
import './pages.css'

const articles = [
  {
    id: 'nach-dem-unfall',
    title: 'Was tun direkt nach dem Unfall?',
    body: (
      <>
        <ul>
          <li>Warnblinker einschalten, Warnweste anziehen, Unfallstelle mit dem Warndreieck absichern.</li>
          <li>Verletzte versorgen und im Zweifel den Notruf 112 wählen.</li>
          <li>Polizei rufen – insbesondere bei Verletzten, unklarer Schuldfrage oder wenn der Unfallgegner flüchtet.</li>
          <li>Unfallstelle, Fahrzeugpositionen und Schäden fotografieren.</li>
          <li>Namen, Anschrift, Kennzeichen und Versicherung des Unfallgegners notieren, Zeugen festhalten.</li>
          <li>Kein Schuldanerkenntnis unterschreiben.</li>
          <li>Fahrzeug vor der Reparatur begutachten lassen.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'gutachten-oder-kostenvoranschlag',
    title: 'Gutachten oder Kostenvoranschlag?',
    body: (
      <p>
        Bei Bagatellschäden – nach gängiger Rechtsprechung bis etwa 750&nbsp;Euro – reicht häufig ein Kostenvoranschlag.
        Darüber ist ein Gutachten in der Regel die bessere Wahl: Es enthält neben den Reparaturkosten auch Wertminderung,
        Wiederbeschaffungswert, Restwert und eine Beweissicherung des Schadens.
      </p>
    ),
  },
  {
    id: 'wer-zahlt',
    title: 'Wer bezahlt den Gutachter?',
    body: (
      <>
        <p>
          Bei einem unverschuldeten Unfall gehören die Gutachterkosten zum Schaden und werden in der Regel von der
          Kfz-Haftpflichtversicherung des Unfallverursachers getragen. Bei einer Mithaftung werden sie grundsätzlich nur
          anteilig erstattet.
        </p>
        <p>
          Bei Kaskoschäden hängt die Kostenübernahme von Ihren Versicherungsbedingungen ab – häufig beauftragt die
          Versicherung selbst einen Sachverständigen.
        </p>
      </>
    ),
  },
  {
    id: 'freie-gutachterwahl',
    title: 'Darf ich den Gutachter selbst wählen?',
    body: (
      <p>
        Ja. Als Geschädigter eines Haftpflichtschadens dürfen Sie einen unabhängigen Sachverständigen Ihrer Wahl
        beauftragen. Sie müssen sich nicht auf den Gutachter verweisen lassen, den die gegnerische Versicherung vorschlägt.
      </p>
    ),
  },
  {
    id: 'wertminderung',
    title: 'Was ist die merkantile Wertminderung?',
    body: (
      <p>
        Auch nach fachgerechter Reparatur gilt ein Fahrzeug als Unfallwagen und erzielt beim Verkauf meist einen
        geringeren Preis. Diesen Minderwert bezeichnet man als merkantile Wertminderung. Sie wird im Gutachten
        berechnet und kann gegenüber der gegnerischen Versicherung geltend gemacht werden.
      </p>
    ),
  },
  {
    id: 'nutzungsausfall',
    title: 'Nutzungsausfall oder Mietwagen?',
    body: (
      <p>
        Während Ihr Fahrzeug repariert oder ersetzt wird, können Sie bei einem unverschuldeten Unfall einen Mietwagen
        nehmen oder stattdessen eine Nutzungsausfallentschädigung verlangen. Deren Höhe richtet sich nach dem
        Fahrzeugtyp, die Dauer nach der im Gutachten ermittelten Reparatur- bzw. Wiederbeschaffungszeit.
      </p>
    ),
  },
  {
    id: 'totalschaden',
    title: 'Totalschaden: Wiederbeschaffungswert, Restwert und 130-%-Regel',
    body: (
      <>
        <p>
          Ein wirtschaftlicher Totalschaden liegt vor, wenn die Reparaturkosten den Wiederbeschaffungswert – also den
          Preis eines vergleichbaren Fahrzeugs – übersteigen. Ersetzt wird dann in der Regel der Wiederbeschaffungswert
          abzüglich des Restwerts des beschädigten Fahrzeugs.
        </p>
        <p>
          Nach der Rechtsprechung kann eine Reparatur dennoch erstattet werden, wenn die Kosten höchstens 130&nbsp;% des
          Wiederbeschaffungswerts betragen, die Reparatur fachgerecht und vollständig erfolgt und Sie das Fahrzeug
          anschließend mindestens sechs Monate weiter nutzen.
        </p>
      </>
    ),
  },
]

export default function Wissen() {
  return (
    <>
      <PageHero
        eyebrow="Wissen & Ratgeber"
        title={
          <>
            Gut informiert <span className="accent">nach dem Unfall.</span>
          </>
        }
        lead="Die wichtigsten Begriffe und Abläufe rund um Kfz-Schaden und Gutachten – kurz und verständlich erklärt."
      />
      <section className="section section--ice">
        <div className="container knowledge">
          <nav className="knowledge__toc" aria-label="Themen">
            <h2>Themen</h2>
            <ol>
              {articles.map((a) => (
                <li key={a.id}>
                  <a href={`#${a.id}`}>{a.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="knowledge__articles">
            {articles.map((a) => (
              <article key={a.id} id={a.id} className="knowledge__article prose">
                <h2>{a.title}</h2>
                {a.body}
              </article>
            ))}
            <p className="notice">
              Die Informationen auf dieser Seite sind allgemeiner Natur und ersetzen keine Rechtsberatung. Maßgeblich ist
              immer der Einzelfall.
            </p>
          </div>
        </div>
      </section>
      <ContactCta />
    </>
  )
}
