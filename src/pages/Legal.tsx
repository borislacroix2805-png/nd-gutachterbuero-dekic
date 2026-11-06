import type { ReactNode } from 'react'
import { PageHero } from '../components/PageHero'
import { company } from '../content/site'
import './pages.css'

const Fill = ({ value }: { value: string | null }) =>
  value ? <>{value}</> : <mark className="todo">[vom Inhaber zu ergänzen]</mark>

function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <section className="section section--ice">
        <div className="container">
          <article className="prose">
            {!company.verified && (
              <p className="notice">
                <strong>Entwurf:</strong> Dieser Text ist vor der Veröffentlichung mit den Angaben des Inhabers zu
                vervollständigen und rechtlich prüfen zu lassen.
              </p>
            )}
            {children}
          </article>
        </div>
      </section>
    </>
  )
}

export function Impressum() {
  return (
    <LegalPage eyebrow="Rechtliches" title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {company.name}
        <br />
        <Fill value={company.legalName} />
        <br />
        <Fill value={company.street} />
        <br />
        <Fill value={company.city} />
      </p>
      <h2>Kontakt</h2>
      <p>
        Telefon: <a href={company.phoneHref}>{company.phoneDisplay}</a>
        <br />
        E-Mail: <Fill value={company.email} />
      </p>
      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG, sofern vorhanden: <Fill value={null} />
      </p>
      <h2>Berufsbezeichnung und berufsrechtliche Angaben</h2>
      <p>
        Nur anzugeben, falls zutreffend (z. B. öffentliche Bestellung und Vereidigung, zuständige Kammer):{' '}
        <Fill value={null} />
      </p>
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        <Fill value={null} />
      </p>
      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen.
      </p>
    </LegalPage>
  )
}

export function Datenschutz() {
  return (
    <LegalPage eyebrow="Rechtliches" title="Datenschutzerklärung">
      <h2>1. Verantwortlicher</h2>
      <p>
        {company.name}, <Fill value={company.street} />, <Fill value={company.city} />
        <br />
        Telefon: {company.phoneDisplay}, E-Mail: <Fill value={company.email} />
      </p>

      <h2>2. Hosting und Server-Logfiles</h2>
      <p>
        Diese Website wird bei Cloudflare, Inc. (101 Townsend St, San Francisco, CA 94107, USA) gehostet. Beim Aufruf der
        Website werden technisch notwendige Daten verarbeitet, insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs,
        aufgerufene Seite, Referrer und Browserinformationen. Die Verarbeitung erfolgt zur sicheren und stabilen
        Bereitstellung der Website auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO). Cloudflare
        ist unter dem EU-US Data Privacy Framework zertifiziert; ergänzend bestehen Standardvertragsklauseln.
      </p>

      <h2>3. Keine Cookies, kein Tracking</h2>
      <p>
        Diese Website setzt keine Cookies zu Analyse- oder Marketingzwecken und verwendet keine Tracking- oder
        Analysedienste. Schriftarten werden lokal von unserem Server geladen; es findet keine Verbindung zu Servern von
        Google oder anderen Drittanbietern statt.
      </p>

      <h2>4. Kontaktaufnahme</h2>
      <p>
        Wenn Sie uns telefonisch oder per E-Mail kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung Ihrer Anfrage
        und zur Durchführung vorvertraglicher Maßnahmen bzw. des Auftrags (Art. 6 Abs. 1 lit. b DSGVO). Die Daten werden
        gelöscht, sobald sie nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten bestehen.
      </p>

      <h2>5. Ihre Rechte</h2>
      <p>
        Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der
        Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).
        Außerdem können Sie sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO).
      </p>

      <h2>6. Digitale Schadenmeldung</h2>
      <p>
        Die Online-Schadenmeldung mit Foto-Upload ist derzeit nicht aktiv. Vor ihrer Freischaltung wird dieser Abschnitt
        um Zweck, Rechtsgrundlage, Speicherort und Speicherdauer der übermittelten Daten und Fotos ergänzt.
      </p>
    </LegalPage>
  )
}
