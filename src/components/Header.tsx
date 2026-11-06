import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ArrowRight, ChevronDown, Menu, Phone, X } from 'lucide-react'
import { Logo } from './Logo'
import { company } from '../content/site'
import './Header.css'

const services = [
  { to: '/unfallgutachten', label: 'Unfallgutachten', text: 'Nach unverschuldetem Unfall' },
  { to: '/schadengutachten', label: 'Schadengutachten', text: 'Kasko-, Hagel-, Park- & Wildschäden' },
]

const mainLinks = [
  { to: '/ablauf', label: 'Ablauf' },
  { to: '/wissen', label: 'Wissen' },
  { to: '/ueber-uns', label: 'Über uns' },
  { to: '/kontakt', label: 'Kontakt' },
]

const menuLinks = [{ to: '/', label: 'Startseite' }, ...services, ...mainLinks, { to: '/schaden-melden', label: 'Schaden melden' }]

export function Header() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const servicesBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menü-Dialog bei Seitenwechsel schließen
  useEffect(() => {
    dialogRef.current?.close()
  }, [pathname])

  useEffect(() => {
    if (!servicesOpen) return
    const onDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setServicesOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setServicesOpen(false)
      servicesBtnRef.current?.focus()
    }
    // Per Tastatur aus dem Menü heraus → schließen
    const onFocusOut = (e: FocusEvent) => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) setServicesOpen(false)
    }
    const dropdown = dropdownRef.current
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    dropdown?.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
      dropdown?.removeEventListener('focusout', onFocusOut)
    }
  }, [servicesOpen])

  const servicesActive = services.some((s) => pathname.startsWith(s.to))

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__inner container">
        <Link to="/" className="site-header__brand">
          <Logo />
          <span className="sr-only"> – zur Startseite</span>
        </Link>

        <nav className="site-nav" aria-label="Hauptnavigation">
          <div className="site-nav__dropdown" ref={dropdownRef}>
            <button
              ref={servicesBtnRef}
              type="button"
              className={`site-nav__link${servicesActive ? ' is-active' : ''}`}
              aria-expanded={servicesOpen}
              aria-controls="nav-services"
              onClick={() => setServicesOpen((o) => !o)}
            >
              Leistungen <ChevronDown aria-hidden="true" className="site-nav__chev" />
            </button>
            <ul id="nav-services" className="site-nav__menu" hidden={!servicesOpen}>
              {services.map((s) => (
                <li key={s.to}>
                  <NavLink to={s.to} className="site-nav__menu-link" onClick={() => setServicesOpen(false)}>
                    <strong>{s.label}</strong>
                    <span>{s.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {mainLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className="site-nav__link">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="btn btn--ghost btn--sm site-header__phone" href={company.phoneHref}>
            <Phone aria-hidden="true" />
            <span>{company.phoneDisplay}</span>
          </a>
          <Link className="btn btn--primary btn--sm site-header__cta" to="/schaden-melden">
            Schaden melden <ArrowRight aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="site-header__burger"
            aria-label="Menü öffnen"
            aria-haspopup="dialog"
            onClick={() => dialogRef.current?.showModal()}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="mobile-menu"
        aria-label="Menü"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      >
        {/* Jeder Link-Klick schließt – auch wenn er zur aktuellen Seite führt */}
        <div className="mobile-menu__panel" onClick={(e) => (e.target as Element).closest('a') && dialogRef.current?.close()}>
          <div className="mobile-menu__top">
            <Logo />
            <button
              type="button"
              className="site-header__burger"
              aria-label="Menü schließen"
              onClick={() => dialogRef.current?.close()}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Menü-Navigation">
            <ul className="mobile-menu__list">
              {menuLinks.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end className="mobile-menu__link">
                    {l.label}
                    <ArrowRight aria-hidden="true" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mobile-menu__foot">
            <a className="btn btn--primary" href={company.phoneHref}>
              <Phone aria-hidden="true" /> {company.phoneDisplay}
            </a>
            <div className="mobile-menu__legal">
              <Link to="/impressum">Impressum</Link>
              <Link to="/datenschutz">Datenschutz</Link>
            </div>
          </div>
        </div>
      </dialog>
    </header>
  )
}
