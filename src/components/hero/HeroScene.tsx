import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import heroImg from '../../assets/images/hero-scene.webp'
import './HeroScene.css'

/**
 * Fotografische Hero-Szene: Das Kamerabild auf dem Smartphone-Display wird live aus
 * derselben Fotografie berechnet (identischer Bildausschnitt des Fahrzeugschadens),
 * daher zeigt das aufgenommene Foto exakt denselben Schaden wie das Fahrzeug.
 *
 * shortcut: Hand und Smartphone sind Teil des Standbilds und bewegen sich daher nicht
 * selbst. Für Schritt 1 („Smartphone bewegt sich zum Schaden“) wird ein freigestellter
 * Hand-/Smartphone-Layer oder ein Video benötigt – siehe docs/ASSETS.md.
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
        const flash = q('.vf__flash')
        const badge = q('.vf__badge')
        const thumb = q('.phone__thumb')
        const disc = q('.phone__shutter-disc')
        const carLight = q('.hero-scene__carlight')
        const plate = q('.hero-scene__plate')

        // Freihand-Wackeln läuft als CSS-Animation auf dem Compositor (HeroScene.css), nicht im Hauptthread.
        const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4, defaults: { ease: 'power2.out' } })
        tl.set(live, { autoAlpha: 1 })
          .set(liveImg, { scale: 1.2, xPercent: 4, yPercent: 9 })
          .set(live, { filter: 'blur(7px) brightness(1.08)' })
          .set(shot, { autoAlpha: 0, scale: 1, borderRadius: 0 })
          .set(focus, { autoAlpha: 0, scale: 1.3 })
          .set(badge, { autoAlpha: 0, y: 6 })
          // 1) Kamera schwenkt auf den beschädigten Bereich, Szene rückt minimal näher
          .to(liveImg, { scale: 1, xPercent: 0, yPercent: 0, duration: 1.7, ease: 'power3.inOut' }, 0.15)
          .to(plate, { scale: 1.018, duration: 2.4, ease: 'sine.inOut' }, 0)
          // 2) Fokus sucht und rastet ein
          .to(live, { filter: 'blur(2px) brightness(1.03)', duration: 0.5, ease: 'sine.inOut' }, 0.95)
          .to(live, { filter: 'blur(3.5px) brightness(1.04)', duration: 0.22, ease: 'sine.inOut' }, 1.45)
          .to(live, { filter: 'blur(0px) brightness(1)', duration: 0.32, ease: 'power2.out' }, 1.67)
          // 3) Fokusrahmen erscheint und bestätigt
          .to(focus, { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'back.out(1.7)' }, 1.55)
          .to(focus, { opacity: 0.55, duration: 0.08, yoyo: true, repeat: 1, ease: 'none' }, 2.02)
          // 4) Auslöser wird gedrückt
          .to(disc, { scale: 0.8, duration: 0.09, ease: 'power2.in' }, 2.5)
          .to(disc, { scale: 1, duration: 0.24, ease: 'power3.out' }, 2.59)
          // 5) Blitz: Display + reale Aufhellung der Fahrzeugoberfläche am Schaden
          .to(flash, { opacity: 1, duration: 0.04, ease: 'none' }, 2.58)
          .to(flash, { opacity: 0, duration: 0.32, ease: 'power2.out' }, 2.62)
          .to(carLight, { opacity: 1, duration: 0.05, ease: 'none' }, 2.58)
          .to(carLight, { opacity: 0, duration: 0.75, ease: 'power3.out' }, 2.63)
          // 6) Foto ist aufgenommen und wird auf dem Display angezeigt
          .set(shot, { autoAlpha: 1 }, 2.6)
          .set(live, { autoAlpha: 0 }, 2.6)
          .to(focus, { autoAlpha: 0, duration: 0.2 }, 2.62)
          .to(shot, { scale: 0.9, borderRadius: '6%', duration: 0.6, ease: 'power3.inOut' }, 3.0)
          .to(badge, { autoAlpha: 1, y: 0, duration: 0.35 }, 3.35)
          .fromTo(thumb, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 3.1)
          // Halten, dann zurück zum Live-Bild
          .to(badge, { autoAlpha: 0, duration: 0.3 }, 6.9)
          .to(shot, { autoAlpha: 0, duration: 0.45, ease: 'power1.inOut' }, 7.0)
          .set(live, { autoAlpha: 1 }, 7.0)
          .to(liveImg, { scale: 1.2, xPercent: 4, yPercent: 9, duration: 0.45 }, 7.0)
          .to(live, { filter: 'blur(7px) brightness(1.08)', duration: 0.45 }, 7.0)
          .to(plate, { scale: 1, duration: 0.9, ease: 'sine.inOut' }, 6.6)
          .to(thumb, { autoAlpha: 0, duration: 0.3 }, 7.1)

        // Erst nach dem Laden starten (schont die Ladephase) und nur abspielen, solange sichtbar.
        let ready = false
        let visible = false
        const sync = () => tl.paused(!(ready && visible))
        const io = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          sync()
        })
        io.observe(el)
        const start = () => {
          ready = true
          sync()
        }
        const timer = window.setTimeout(start, document.readyState === 'complete' ? 400 : 1200)
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
      aria-label="Eine Hand fotografiert mit dem Smartphone den Frontschaden eines Fahrzeugs: Die Kamera fokussiert die gerissene Stoßstange, löst mit Blitz aus und zeigt das aufgenommene Schadenfoto."
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

        {/* Auf das Display des Smartphones projizierte Kamera-Oberfläche */}
        <div className="phone">
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
            <div className="vf__badge">
              <Check aria-hidden="true" /> Foto aufgenommen
            </div>
          </div>
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
