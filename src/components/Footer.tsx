import { Link } from 'react-router'
import { Phone } from 'lucide-react'
import { Logo } from './Logo'
import { company, serviceArea } from '../content/site'
import './Footer.css'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Logo />
          <p>Kfz-Sachverständige in {serviceArea.headline}. Unabhängig, digital und persönlich erreichbar.</p>
          <a className="site-footer__phone" href={company.phoneHref}>
            <Phone aria-hidden="true" /> {company.phoneDisplay}
          </a>
        </div>
        <nav aria-label="Leistungen">
          <h2 className="site-footer__title">Leistungen</h2>
          <ul>
            <li><Link to="/unfallgutachten">Unfallgutachten</Link></li>
            <li><Link to="/schadengutachten">Schadengutachten</Link></li>
            <li><Link to="/schaden-melden">Schaden melden</Link></li>
          </ul>
        </nav>
        <nav aria-label="Büro">
          <h2 className="site-footer__title">Büro</h2>
          <ul>
            <li><Link to="/ablauf">Ablauf</Link></li>
            <li><Link to="/ueber-uns">Über uns</Link></li>
            <li><Link to="/wissen">Wissen &amp; Ratgeber</Link></li>
            <li><Link to="/kontakt">Kontakt</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="site-footer__title">Einsatzgebiet</h2>
          <ul>
            {serviceArea.regions.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container site-footer__bottom">
        {/* Jahr im vorgerenderten HTML = Build-Jahr; Abweichung zum Jahreswechsel ist unkritisch */}
        <p suppressHydrationWarning>© {year} {company.name}</p>
        <nav aria-label="Rechtliches" className="site-footer__legal">
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </nav>
      </div>
    </footer>
  )
}
