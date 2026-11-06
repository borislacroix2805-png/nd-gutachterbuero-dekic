import { CircleCheck } from 'lucide-react'
import { LogoMark } from '../Logo'
import portrait from '../../assets/images/sachverstaendiger.webp'
import './sections.css'

/*
 * Inhaltlicher Hinweis: Die Vorlage nennt „Zertifizierte KFZ-Sachverständige“ und
 * „Anerkannt bei Versicherungen“. Solche Aussagen dürfen erst nach Nachweis durch den
 * Inhaber verwendet werden – bis dahin neutrale, zutreffende Formulierungen.
 */
const whyPoints = [
  'Unabhängige Kfz-Sachverständige',
  'Schnelle Terminvergabe',
  'Digitale Schadenaufnahme',
  'Übermittlung an Versicherung & Anwalt',
  'Persönliche Betreuung',
]

export function WhyDekic() {
  return (
    <section className="why section--ice" aria-labelledby="why-title">
      <div className="why__media">
        <img
          src={portrait}
          alt="Kfz-Sachverständiger mit Tablet dokumentiert den Frontschaden eines Fahrzeugs"
          width={578}
          height={366}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="why__body">
        <LogoMark className="why__watermark" light />
        <p className="eyebrow eyebrow--both">Gutachterbüro Dekic</p>
        <h2 id="why-title" className="h2 why__title">
          Warum <span className="accent">Dekic?</span>
        </h2>
        <ul className="why__list">
          {whyPoints.map((p) => (
            <li key={p}>
              <CircleCheck aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
