import { Gauge, Handshake, MonitorSmartphone, Scale } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { WhyDekic } from '../components/sections/WhyDekic'
import { ContactCta, ServiceArea } from '../components/sections/HomeSections'
import './pages.css'

// shortcut: Team, Werdegang und Qualifikationen fehlen bewusst – erst nach Angaben des Inhabers ergänzen.
const values = [
  {
    icon: Scale,
    title: 'Unabhängig',
    text: 'Wir arbeiten für Sie als Auftraggeber – nicht für die Versicherung des Unfallgegners.',
  },
  {
    icon: Gauge,
    title: 'Schnell',
    text: 'Kurze Wege, zügige Termine und ein Gutachten, das ohne unnötige Wartezeit bei Ihnen ist.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Digital',
    text: 'Fotos, Unterlagen und Gutachten digital – Sie behalten den Überblick, ohne Papierkram.',
  },
  {
    icon: Handshake,
    title: 'Persönlich',
    text: 'Ein fester Ansprechpartner, der erreichbar ist und Ihre Fragen verständlich beantwortet.',
  },
]

export default function UeberUns() {
  return (
    <>
      <PageHero
        eyebrow="Über uns"
        title={
          <>
            Gutachterbüro Dekic – <span className="accent">Ihr Partner nach dem Unfall.</span>
          </>
        }
        lead="Ein Unfall ist ärgerlich genug. Wir sorgen dafür, dass Ihr Schaden vollständig, neutral und schnell dokumentiert wird – und Sie wissen, wie es weitergeht."
      />
      <section className="section section--ice">
        <div className="container">
          <p className="eyebrow">Unsere Haltung</p>
          <h2 className="h2 values__title">
            Wofür wir <span className="accent">stehen.</span>
          </h2>
          <ul className="values">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="values__item">
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <WhyDekic />
      <ServiceArea />
      <ContactCta />
    </>
  )
}
