import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '../components/PageHero'

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Fehler 404"
      title={
        <>
          Diese Seite <span className="accent">gibt es nicht.</span>
        </>
      }
      lead="Vielleicht hat sich die Adresse geändert. Über die Startseite finden Sie schnell weiter."
    >
      <Link className="btn btn--primary" to="/">
        Zur Startseite <ArrowRight aria-hidden="true" />
      </Link>
      <Link className="btn btn--ghost" to="/kontakt">
        Kontakt
      </Link>
    </PageHero>
  )
}
