import { MapPin, ShieldCheck, Star, Zap } from 'lucide-react'
import './sections.css'

const items = [
  { icon: Zap, label: ['Schnelle', 'Erstbewertung'] },
  { icon: ShieldCheck, label: ['Rechtssichere', 'Gutachten'] },
  { icon: MapPin, label: ['Vor-Ort-Service', 'in Ihrer Region'] },
  { icon: Star, label: ['Unabhängig', '& neutral'] },
]

export function BenefitsBar() {
  return (
    <section className="benefits" aria-label="Ihre Vorteile">
      <ul className="container benefits__list">
        {items.map(({ icon: Icon, label }) => (
          <li key={label[0]} className="benefits__item">
            <Icon aria-hidden="true" className="benefits__icon" />
            <span>
              {label[0]}
              <br />
              {label[1]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
