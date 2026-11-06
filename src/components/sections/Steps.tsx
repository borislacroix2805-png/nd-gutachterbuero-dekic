import { Camera, Car, ChevronRight, FileText } from 'lucide-react'
import { damageReportEnabled } from '../../content/site'
import './sections.css'

const steps = [
  {
    icon: Camera,
    title: 'Schaden erfassen',
    // Solange die Online-Übermittlung nicht freigeschaltet ist, keinen Foto-Upload versprechen.
    text: damageReportEnabled ? 'Fotos hochladen oder online melden.' : 'Telefonisch melden, Fotos bereithalten.',
  },
  { icon: Car, title: 'Begutachtung', text: 'Vor Ort oder in unserer Werkstatt.' },
  { icon: FileText, title: 'Gutachten erhalten', text: 'Rechtssicher, digital und direkt an Sie.' },
]

export function Steps() {
  return (
    <section className="steps" aria-labelledby="steps-title">
      <div className="container steps__inner">
        <div className="steps__intro">
          <p className="eyebrow steps__eyebrow">So einfach geht’s</p>
          <h2 id="steps-title" className="steps__title">
            In 3 Schritten <span className="accent">zum Gutachten.</span>
          </h2>
        </div>
        <ol className="steps__list">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="steps__item">
              {i > 0 && <ChevronRight aria-hidden="true" className="steps__arrow" />}
              <span className="steps__num" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <Icon aria-hidden="true" className="steps__icon" />
                <h3 className="steps__item-title">{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="steps__streak" aria-hidden="true" />
    </section>
  )
}
