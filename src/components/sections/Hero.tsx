import { Link } from 'react-router'
import { ArrowRight, CalendarDays, Camera } from 'lucide-react'
import { HeroScene } from '../hero/HeroScene'
import './Hero.css'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__visual">
        <HeroScene />
      </div>
      <div className="container hero__content">
        <p className="eyebrow hero__eyebrow">Kfz-Sachverständige in Norddeutschland</p>
        <h1 id="hero-title" className="hero__title">
          Unfall?
          <span className="hero__title-accent">Wir kümmern uns.</span>
        </h1>
        <p className="hero__text">
          Schnelle Schadenaufnahme, professionelle Begutachtung und rechtssichere Gutachten – digital, persönlich und
          regional.
        </p>
        <div className="hero__actions">
          <Link className="btn btn--primary" to="/schaden-melden">
            <Camera aria-hidden="true" /> Schaden jetzt melden <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="btn btn--ghost" to="/kontakt">
            <CalendarDays aria-hidden="true" /> Termin vereinbaren
          </Link>
        </div>
      </div>
    </section>
  )
}
