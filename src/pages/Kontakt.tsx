import { Link } from 'react-router'
import { Camera, Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '../components/PageHero'
import { ServiceArea } from '../components/sections/HomeSections'
import { company } from '../content/site'
import './pages.css'

export default function Kontakt() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title={
          <>
            Wir sind <span className="accent">für Sie da.</span>
          </>
        }
        lead="Ob Schadenmeldung, Terminvereinbarung oder eine kurze Frage vorab – rufen Sie uns einfach an."
      />
      <section className="section section--ice">
        <div className="container">
          <ul className="contact-cards">
            <li>
              <a className="contact-card" href={company.phoneHref}>
                <Phone aria-hidden="true" />
                <span className="contact-card__label">Telefon</span>
                <strong>{company.phoneDisplay}</strong>
                <span>Schadenmeldung & Termine</span>
              </a>
            </li>
            {company.email && (
              <li>
                <a className="contact-card" href={`mailto:${company.email}`}>
                  <Mail aria-hidden="true" />
                  <span className="contact-card__label">E-Mail</span>
                  <strong>{company.email}</strong>
                  <span>Unterlagen & Rückfragen</span>
                </a>
              </li>
            )}
            {company.street && company.city && (
              <li>
                <div className="contact-card">
                  <MapPin aria-hidden="true" />
                  <span className="contact-card__label">Büro</span>
                  <strong>{company.street}</strong>
                  <span>{company.city}</span>
                </div>
              </li>
            )}
            <li>
              <Link className="contact-card" to="/schaden-melden">
                <Camera aria-hidden="true" />
                <span className="contact-card__label">Schaden melden</span>
                <strong>So geht’s</strong>
                <span>Was Sie bereithalten sollten</span>
              </Link>
            </li>
          </ul>
          {company.openingHours && <p className="contact-hours">Erreichbarkeit: {company.openingHours}</p>}
        </div>
      </section>
      <ServiceArea />
    </>
  )
}
