import { useEffect, useRef } from 'react'
import heroImg from '../../assets/images/hero-scene.webp'
import './HeroScene.css'

/**
 * Fotografische Hero-Szene: Das Kamerabild auf dem Smartphone-Display wird live aus
 * derselben Fotografie berechnet (identischer Bildausschnitt des Fahrzeugschadens),
 * daher zeigt das aufgenommene Foto exakt denselben Schaden wie das Fahrzeug.
 * Fahrzeug und Hintergrund werden nie transformiert – animiert werden nur Display-Inhalte
 * und der kurze Blitz-Lichtimpuls auf Scheinwerfer und Kotflügel.
 *
 * shortcut: Hand und Smartphone sind Teil des Standbilds und bewegen sich daher nicht.
 * Ausrichten des Smartphones und Fingerdruck auf den Auslöser brauchen getrennte Ebenen
 * (Hintergrund ohne Hand + freigestellte Hand) oder ein Video – siehe docs/ASSETS.md.
 */
export function HeroScene() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    // Reduzierte Bewegung: statischer Endzustand kommt rein aus CSS, GSAP wird gar nicht geladen.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // GSAP erst nachladen – die Animation startet ohnehin nach dem Seitenaufbau.
    const abort = new AbortController()
    import('gsap').then(({ gsap }) => {
      if (abort.signal.aborted) return
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(el)
        const live = q('.vf__live')
        const liveImg = q('.vf__live .vf__img')
        const shot = q('.vf__shot')
        const focus = q('.vf__focus')
        const blink = q('.vf__flash')
        const thumb = q('.phone__thumb')
        const disc = q('.phone__shutter-disc')
        const carLight = q('.hero-scene__carlight')
        const reflex = q('.hero-scene__reflex')
        // Phasen als data-Attribut: nachvollziehbar im DevTools-Inspektor und prüfbar in den E2E-Tests
        const phase = (name: string) => () => (el.dataset.phase = name)

        // Ein Durchlauf, endet ruhig mit dem aufgenommenen Foto auf dem Display.
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
        tl.call(phase('start'), undefined, 0)
          // 1) Fokusrahmen erscheint über der Beschädigung, Bild noch leicht unscharf (Startzustand aus CSS)
          .call(phase('fokus'), undefined, 0.6)
          .fromTo(focus, { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 0.28 }, 0.6)
          // 2) Kamera stellt in ca. 0,5 s scharf
          .to(liveImg, { filter: 'blur(0px)', duration: 0.5, ease: 'power1.inOut' }, 0.8)
          .set(liveImg, { filter: 'none' }, 1.3)
          // 3) Fokusrahmen bestätigt die Schärfe
          .call(phase('scharf'), undefined, 1.3)
          .to(focus, { opacity: 0.45, duration: 0.07, yoyo: true, repeat: 1, ease: 'none' }, 1.32)
          // 4) Auslöser wird sichtbar aktiviert (Finger bleibt unbewegt), zeitgleich Aufnahme
          .call(phase('ausloesen'), undefined, 1.95)
          .to(disc, { scale: 0.76, filter: 'brightness(0.82)', duration: 0.08, ease: 'power2.in' }, 1.95)
          .to(disc, { scale: 1, filter: 'brightness(1)', duration: 0.26, ease: 'power3.out' }, 2.05)
          // 5) Kräftiger LED-Blitz ca. 190 ms: schnell an, kurz halten, weich abklingen
          .to([carLight, reflex], { opacity: 1, duration: 0.02, ease: 'none' }, 2.0)
          .to([carLight, reflex], { opacity: 0, duration: 0.09, ease: 'power2.out' }, 2.1)
          .to(blink, { opacity: 0.7, duration: 0.02, ease: 'none' }, 2.0)
          .to(blink, { opacity: 0, duration: 0.1, ease: 'power1.out' }, 2.04)
          // 6) Aufgenommenes Foto ersetzt das Livebild – gleicher Ausschnitt, gleiche Displaymaske
          .call(phase('foto'), undefined, 2.03)
          .set(shot, { autoAlpha: 1 }, 2.03)
          .set(live, { autoAlpha: 0 }, 2.03)
          .to(focus, { autoAlpha: 0, duration: 0.15 }, 2.03)
          .to(thumb, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, 2.25)
          .call(phase('fertig'), undefined, 2.8)

        // Start beim ersten Aufruf, sobald ca. 60 % der Szene sichtbar sind. Erst wenn die Szene den
        // Sichtbereich vollständig verlassen hat, wird zurückgesetzt und beim Zurückscrollen neu gestartet –
        // kleine Scrollbewegungen lösen keinen Neustart aus.
        let ready = false
        let armed = true
        let ratio = 0
        const maybeStart = () => {
          // Sehr niedrige Viewports (Smartphone quer): 60 % der Szene passen evtl. gar nicht ins Bild
          const needed = Math.min(0.6, (window.innerHeight / el.offsetHeight) * 0.9)
          if (!ready || !armed || ratio < needed - 0.02) return
          armed = false
          tl.restart()
        }
        const io = new IntersectionObserver(
          ([entry]) => {
            ratio = entry.intersectionRatio
            if (!entry.isIntersecting) {
              if (!armed) {
                tl.pause(0)
                el.dataset.phase = 'bereit'
                armed = true
              }
              return
            }
            maybeStart()
          },
          { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
        )
        io.observe(el)
        const timer = window.setTimeout(
          () => {
            ready = true
            maybeStart()
          },
          document.readyState === 'complete' ? 400 : 1200,
        )
        return () => {
          io.disconnect()
          window.clearTimeout(timer)
        }
      }, el)
      abort.signal.addEventListener('abort', () => ctx.revert())
    })
    return () => abort.abort()
  }, [])

  return (
    <div
      className="hero-scene"
      ref={root}
      role="img"
      aria-label="Eine Hand fotografiert mit dem Smartphone den Frontschaden eines Fahrzeugs: Die Kamera stellt den Schaden am Kotflügel scharf, löst mit Blitz aus und zeigt das aufgenommene Schadenfoto."
    >
      <div className="hero-scene__plate">
        <img
          className="hero-scene__img"
          src={heroImg}
          alt=""
          width={647}
          height={483}
          fetchPriority="high"
          decoding="async"
        />
        <img className="hero-scene__carlight" src={heroImg} alt="" width={647} height={483} />
        <div className="hero-scene__reflex" />

        {/* Kamerabild, perspektivisch auf die vier Innenecken des Displays projiziert */}
        <div className="vf">
          <div className="vf__live">
            <img className="vf__img" src={heroImg} alt="" />
          </div>
          <div className="vf__shot">
            <img className="vf__img" src={heroImg} alt="" />
          </div>
          <div className="vf__focus">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="vf__flash" />
        </div>
        {/* Bedienelemente des Smartphones (Auslöser, Galerie-Vorschau) */}
        <div className="phone">
          <div className="phone__shutter">
            <span className="phone__shutter-disc" />
          </div>
          <div className="phone__thumb">
            <img src={heroImg} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}
