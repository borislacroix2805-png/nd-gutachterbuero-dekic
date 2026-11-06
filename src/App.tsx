import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigationType } from 'react-router'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { findRoute } from './routes'
import Home from './pages/Home'
import Unfallgutachten from './pages/Unfallgutachten'
import Schadengutachten from './pages/Schadengutachten'
import Ablauf from './pages/Ablauf'
import UeberUns from './pages/UeberUns'
import Wissen from './pages/Wissen'
import Kontakt from './pages/Kontakt'
import SchadenMelden from './pages/SchadenMelden'
import { Datenschutz, Impressum } from './pages/Legal'
import NotFound from './pages/NotFound'

/** Titel/Description bei clientseitiger Navigation aktualisieren und nach oben scrollen. */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  useEffect(() => {
    const meta = findRoute(pathname)
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    // Nur bei aktiver Navigation nach oben; Neuladen und Zurück/Vor behalten die Browser-Position.
    if (!hash && navType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash, navType])
  return null
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Zum Inhalt springen
      </a>
      <RouteEffects />
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route caseSensitive path="/unfallgutachten" element={<Unfallgutachten />} />
          <Route caseSensitive path="/schadengutachten" element={<Schadengutachten />} />
          <Route caseSensitive path="/ablauf" element={<Ablauf />} />
          <Route caseSensitive path="/ueber-uns" element={<UeberUns />} />
          <Route caseSensitive path="/wissen" element={<Wissen />} />
          <Route caseSensitive path="/kontakt" element={<Kontakt />} />
          <Route caseSensitive path="/schaden-melden" element={<SchadenMelden />} />
          <Route caseSensitive path="/datenschutz" element={<Datenschutz />} />
          <Route caseSensitive path="/impressum" element={<Impressum />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
