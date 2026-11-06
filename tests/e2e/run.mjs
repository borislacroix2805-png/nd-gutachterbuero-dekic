// End-to-End-Prüfung gegen einen laufenden Server (vite preview oder wrangler pages dev).
// Aufruf:  BASE_URL=http://127.0.0.1:8788 BROWSER=chromium|webkit node tests/e2e/run.mjs
// macOS 12: WebKit nur mit playwright-core 1.45.3 → PW_CORE=/pfad/zu/playwright-core
import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const base = (process.env.BASE_URL ?? 'http://127.0.0.1:4317').replace(/\/$/, '')
const browserName = process.env.BROWSER ?? 'chromium'
const pw = await import(process.env.PW_CORE ?? 'playwright-core')
const out = fileURLToPath(new URL('../../test-results/', import.meta.url))
await mkdir(out, { recursive: true })

const paths = ['/', '/unfallgutachten', '/schadengutachten', '/ablauf', '/ueber-uns', '/wissen', '/kontakt', '/schaden-melden', '/datenschutz', '/impressum']
const viewports = {
  desktop: { width: 1512, height: 950 },
  ipad: { width: 1024, height: 1366, isMobile: true, hasTouch: true },
  iphone: { width: 390, height: 844, isMobile: true, hasTouch: true },
}

const browser = await pw[browserName].launch(browserName === 'chromium' ? { channel: process.env.PW_CHANNEL } : {})
// Polling statt waitForFunction (nutzt in WebKit eval und scheitert an der strengen CSP)
const waitFor = async (page, fn, arg) => {
  for (let i = 0; i < 80; i++) {
    if (await page.evaluate(fn, arg)) return
    await page.waitForTimeout(100)
  }
  throw new Error('Zeitüberschreitung beim Warten auf Zustand')
}
let failures = 0
const check = async (name, fn) => {
  try {
    await fn()
    console.log(`  ✓ ${name}`)
  } catch (e) {
    failures++
    console.log(`  ✗ ${name}\n    ${e.message.split('\n')[0]}`)
  }
}

for (const [vpName, vp] of Object.entries(viewports)) {
  console.log(`\n${browserName} · ${vpName}`)
  const { isMobile, hasTouch, ...size } = vp
  // bypassCSP: Playwright-Hilfsfunktionen (eval, Screenshot-Styles) würden sonst selbst die CSP verletzen; die CSP wird unten separat geprüft.
  const ctx = await browser.newContext({ bypassCSP: true, viewport: size, ...(browserName === 'chromium' ? { isMobile, hasTouch } : { hasTouch }) })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  const links = new Set()

  for (const path of paths) {
    await check(`${path} lädt korrekt`, async () => {
      const res = await page.goto(base + path, { waitUntil: 'networkidle' })
      assert.equal(res.status(), 200)
      assert.equal(await page.locator('h1').count(), 1, 'genau eine h1')
      assert.ok((await page.title()).includes('Dekic'), 'Titel')
      assert.ok(await page.locator('meta[name="description"]').getAttribute('content'), 'Description')
      assert.equal(await page.locator('html').getAttribute('lang'), 'de')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert.ok(overflow <= 1, `horizontaler Überlauf ${overflow}px`)
      const noAlt = await page.locator('img:not([alt])').count()
      assert.equal(noAlt, 0, 'Bilder ohne alt')
      // Rufnummer: alle Anruf-Links auf die aktuelle Nummer, alte Nummer nirgends im HTML
      const tels = await page.$$eval('a[href^="tel:"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))])
      assert.ok(tels.every((t) => t === 'tel:+4915753628154'), `Anruf-Links: ${tels}`)
      const html = await page.content()
      assert.ok(!/0431\s?7200|4943172001120/.test(html), 'alte Rufnummer gefunden')
      for (const h of await page.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')))) links.add(h)
    })
    // caret: 'initial' verhindert, dass Playwright ein Inline-<style> einfügt (würde die CSP verletzen)
    if (vpName === 'desktop' || path === '/') await page.screenshot({ path: `${out}${browserName}-${vpName}${path.replace(/\//g, '_') || '_'}.png`, caret: 'initial' })
  }

  await check(`alle internen Links erreichbar (${links.size})`, async () => {
    for (const href of links) {
      const res = await page.request.get(base + href.split('#')[0])
      assert.equal(res.status(), 200, href)
    }
  })

  await check('Hero-Animation: Fokus → scharf → Auslöser/Blitz → Foto, endet ruhig', async () => {
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    // Phasen kommen als data-phase aus der GSAP-Timeline; MutationObserver verpasst auch sehr kurze Phasen nicht.
    const seen = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const el = document.querySelector('.hero-scene')
          const phases = []
          let flashSeen = false
          const record = () => {
            const p = el.dataset.phase
            if (p && phases.at(-1) !== p) phases.push(p)
            if (p === 'fertig') done()
          }
          const mo = new MutationObserver(record)
          mo.observe(el, { attributes: true, attributeFilter: ['data-phase'] })
          const tick = () => {
            flashSeen ||= Number(getComputedStyle(el.querySelector('.hero-scene__carlight')).opacity) > 0.05
            if (!finished) requestAnimationFrame(tick)
          }
          let finished = false
          const timer = setTimeout(() => done(), 12000)
          function done() {
            finished = true
            mo.disconnect()
            clearTimeout(timer)
            const op = (sel) => Number(getComputedStyle(el.querySelector(sel)).opacity)
            resolve({ phases, flashSeen, shot: op('.vf__shot'), live: op('.vf__live'), thumb: op('.phone__thumb'), text: el.querySelector('.vf').textContent.trim() })
          }
          record()
          tick()
        }),
    )
    assert.deepEqual(seen.phases.slice(-5), ['fokus', 'scharf', 'ausloesen', 'foto', 'fertig'], `Phasen: ${seen.phases}`)
    assert.deepEqual([seen.shot, seen.live, seen.thumb], [1, 0, 1], 'Endzustand: Foto auf dem Display')
    assert.equal(seen.text, '', 'keine Texteinblendung auf dem Display')
    // Kurzer Blitz kann zwischen zwei Frames liegen – verbindlich geprüft wird er im eingefrorenen Test unten.
    if (!seen.flashSeen) console.log('    (Hinweis: Blitz-Frame hier nicht erfasst)')
    // Endzustand bleibt stehen: kein erneuter Durchlauf
    await page.waitForTimeout(1500)
    assert.equal(await page.evaluate(() => document.querySelector('.hero-scene').dataset.phase), 'fertig')
  })

  await check('Hero: Blitz hellt Fahrzeug sichtbar auf, Display exakt ausgerichtet', async () => {
    const fp = await ctx.newPage()
    // Im ersten Frame mit voller Blitzstärke die Zeit für GSAP (Date.now) einfrieren. requestAnimationFrame läuft
    // weiter – WebKit zeichnet sonst keine neuen Frames und der Screenshot zeigt einen veralteten Stand.
    await fp.addInitScript(() => {
      const realNow = Date.now
      let frozenAt = null
      window.__frozen = false
      Date.now = () => frozenAt ?? realNow()
      const raf = window.requestAnimationFrame.bind(window)
      window.requestAnimationFrame = (cb) =>
        raf((t) => {
          cb(t)
          const light = document.querySelector('.hero-scene__carlight')
          if (frozenAt === null && light && Number(light.style.opacity) > 0.9) {
            frozenAt = realNow()
            window.__frozen = true
          }
        })
    })
    await fp.goto(base + '/', { waitUntil: 'networkidle' })
    await fp.locator('.hero-scene').scrollIntoViewIfNeeded()
    await waitFor(fp, () => window.__frozen)
    await fp.waitForTimeout(100)
    const box = await fp.locator('.hero-scene').boundingBox()
    // Kotflügel/Scheinwerfer (Szene x 62–98 %, y 35–90 %): mittlere Helligkeit mit und ohne Blitz-Ebenen
    const clip = { x: box.x + box.width * 0.62, y: box.y + box.height * 0.35, width: box.width * 0.36, height: box.height * 0.55 }
    const lit = await fp.screenshot({ clip, caret: 'initial' })
    await fp.evaluate(() => {
      for (const s of ['.hero-scene__carlight', '.hero-scene__reflex']) document.querySelector(s).style.opacity = '0'
    })
    const dark = await fp.screenshot({ clip, caret: 'initial' })
    const mean = async (png) =>
      fp.evaluate(async (b64) => {
        const img = await createImageBitmap(await (await fetch('data:image/png;base64,' + b64)).blob())
        const c = new OffscreenCanvas(img.width, img.height).getContext('2d')
        c.drawImage(img, 0, 0)
        const d = c.getImageData(0, 0, img.width, img.height).data
        let sum = 0
        for (let i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]
        return sum / (d.length / 4)
      }, png.toString('base64'))
    const [mLit, mDark] = [await mean(lit), await mean(dark)]
    assert.ok(mLit > mDark * 1.25, `Blitz zu schwach: Helligkeit ${mDark.toFixed(1)} → ${mLit.toFixed(1)}`)
    // Display: Kamerabild, Foto und Fokusrahmen liegen in der vermessenen Display-Perspektive
    const geo = await fp.evaluate(() => {
      const r = (s) => JSON.stringify(document.querySelector(s).getBoundingClientRect())
      // Gerenderte Ecken des Kamerabilds in Bildpixeln der Szene (647 px breit)
      const vf = document.querySelector('.vf')
      const plate = document.querySelector('.hero-scene__plate').getBoundingClientRect()
      const k = 647 / plate.width
      const corners = [['0', '0'], ['100%', '0'], ['100%', '100%'], ['0', '100%']].map(([l, t]) => {
        const m = document.createElement('i')
        m.style.cssText = `position:absolute;left:${l};top:${t};width:0;height:0`
        vf.appendChild(m)
        const b = m.getBoundingClientRect()
        m.remove()
        return [(b.x - plate.x) * k, (b.y - plate.y) * k]
      })
      return { corners, same: r('.vf__live') === r('.vf__shot') }
    })
    // Vermessene Innenecken des Kamerabereichs im Foto (oben links, oben rechts, unten rechts, unten links)
    const quad = [[168.8, 99.6], [318.9, 122.1], [285.4, 336.3], [126.4, 311.1]]
    geo.corners.forEach(([x, y], i) =>
      assert.ok(Math.hypot(x - quad[i][0], y - quad[i][1]) < 1, `Display-Ecke ${i}: ${x.toFixed(1)} | ${y.toFixed(1)}`),
    )
    assert.ok(geo.same, 'Foto und Livebild nicht deckungsgleich')
    // Bild deckt das Display vollständig ab (keine schwarzen Ränder), Fokusrahmen und Schadenszentrum mittig.
    // Gemessen in lokalen Display-Koordinaten (offset*), unabhängig von der perspektivischen Matrix.
    const local = await fp.evaluate(() => {
      const vf = document.querySelector('.vf')
      const img = document.querySelector('.vf__shot .vf__img')
      const f = document.querySelector('.vf__focus')
      const W = vf.offsetWidth
      const H = vf.offsetHeight
      // Zentrum des Rissbilds im Szenenbild: Bildpunkt 528 | 370 von 647 × 483
      const dmg = [img.offsetLeft + (img.offsetWidth * 528) / 647, img.offsetTop + (img.offsetHeight * 370) / 483]
      return {
        covers: img.offsetLeft <= 0 && img.offsetTop <= 0 && img.offsetLeft + img.offsetWidth >= W && img.offsetTop + img.offsetHeight >= H,
        dmg: [dmg[0] / W, dmg[1] / H],
        focus: [(f.offsetLeft + f.offsetWidth / 2) / W, (f.offsetTop + f.offsetHeight / 2) / H],
      }
    })
    assert.ok(local.covers, 'Bild deckt das Display nicht vollständig ab')
    for (const [name, [x, y]] of Object.entries({ Schaden: local.dmg, Fokusrahmen: local.focus }))
      assert.ok(Math.abs(x - 0.5) < 0.02 && Math.abs(y - 0.5) < 0.02, `${name} nicht zentriert: ${x.toFixed(3)} / ${y.toFixed(3)}`)
    await fp.close()
  })

  await check('Hero: Neustart erst nach vollständigem Verlassen und Zurückscrollen', async () => {
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    const phase = () => page.evaluate(() => document.querySelector('.hero-scene').dataset.phase)
    await waitFor(page, () => document.querySelector('.hero-scene').dataset.phase === 'fertig')
    // kleine Scrollbewegung: kein Neustart, Foto bleibt sichtbar
    await page.evaluate(() => window.scrollBy(0, 120))
    await page.waitForTimeout(400)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    assert.equal(await phase(), 'fertig', 'Neustart bei kleiner Scrollbewegung')
    // Hero vollständig verlassen → zurückgesetzt
    await page.evaluate(() => window.scrollTo(0, document.querySelector('.hero-scene').getBoundingClientRect().bottom + window.scrollY + 50))
    await waitFor(page, () => document.querySelector('.hero-scene').dataset.phase === 'bereit')
    // zurückscrollen → kompletter neuer Durchlauf
    await page.evaluate(() => window.scrollTo(0, 0))
    await waitFor(page, () => document.querySelector('.hero-scene').dataset.phase === 'fokus')
    await waitFor(page, () => document.querySelector('.hero-scene').dataset.phase === 'fertig')
    assert.equal(await page.evaluate(() => getComputedStyle(document.querySelector('.vf__shot')).opacity), '1')
  })

  await check('Hero: Fahrzeug und Hintergrund bleiben pixelstabil', async () => {
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    await page.locator('.hero-scene').scrollIntoViewIfNeeded()
    await waitFor(page, () => ['start', 'fokus'].includes(document.querySelector('.hero-scene').dataset.phase))
    const box = await page.locator('.hero-scene').boundingBox()
    // Bereich rechts vom Smartphone (Scheinwerfer, Kotflügel, Schaden), unterhalb des fixierten Headers
    const clip = { x: box.x + box.width * 0.6, y: box.y + box.height * 0.2, width: box.width * 0.4, height: box.height * 0.75 }
    const transforms = () =>
      page.evaluate(() =>
        ['.hero-scene__plate', '.hero-scene__img'].map((s) => {
          const e = document.querySelector(s)
          return [getComputedStyle(e).transform, JSON.stringify(e.getBoundingClientRect())]
        }),
      )
    const before = await page.screenshot({ clip, caret: 'initial' })
    const tBefore = await transforms()
    const phaseAfterShot = await page.evaluate(() => document.querySelector('.hero-scene').dataset.phase)
    assert.ok(['start', 'fokus', 'scharf'].includes(phaseAfterShot), `Screenshot zu spät (${phaseAfterShot})`)
    await waitFor(page, () => document.querySelector('.hero-scene').dataset.phase === 'fertig')
    await page.waitForTimeout(400)
    const after = await page.screenshot({ clip, caret: 'initial' })
    assert.deepEqual(await transforms(), tBefore, 'Hintergrund wurde transformiert')
    assert.ok(tBefore.every(([t]) => t === 'none'), `Transform gesetzt: ${tBefore.map(([t]) => t)}`)
    // ±2 Helligkeitsstufen Toleranz: Rundungsrauschen des Compositors (Display ist eine eigene 3D-Ebene).
    // Jede echte Bewegung oder Skalierung des Fotos erzeugt Abweichungen von Dutzenden Stufen.
    const changed = await page.evaluate(async ([a, b]) => {
      const load = async (x) => {
        const i = await createImageBitmap(await (await fetch('data:image/png;base64,' + x)).blob())
        const c = new OffscreenCanvas(i.width, i.height).getContext('2d')
        c.drawImage(i, 0, 0)
        return c.getImageData(0, 0, i.width, i.height).data
      }
      const [A, B] = [await load(a), await load(b)]
      let n = 0
      for (let i = 0; i < A.length; i += 4) if ([0, 1, 2].some((k) => Math.abs(A[i + k] - B[i + k]) > 2)) n++
      return n
    }, [before.toString('base64'), after.toString('base64')])
    assert.equal(changed, 0, `Hintergrund-Pixel haben sich verändert (${changed})`)
  })

  if (vpName !== 'desktop') {
    await check('Menü öffnet und navigiert', async () => {
      await page.goto(base + '/', { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Menü öffnen' }).click()
      await page.locator('dialog.mobile-menu').getByRole('link', { name: 'Wissen' }).click()
      await page.waitForURL('**/wissen')
      await waitFor(page, () => !document.querySelector("dialog.mobile-menu").open)
      // Link zur aktuellen Seite schließt das Menü ebenfalls
      await page.getByRole('button', { name: 'Menü öffnen' }).click()
      await page.locator('dialog.mobile-menu').getByRole('link', { name: 'Wissen' }).click()
      await waitFor(page, () => !document.querySelector("dialog.mobile-menu").open)
    })
  } else {
    await check('Desktop-Navigation vollständig, ohne Menü-Button', async () => {
      await page.goto(base + '/', { waitUntil: 'networkidle' })
      assert.equal(await page.getByRole('button', { name: 'Menü öffnen' }).isVisible(), false)
      for (const name of ['Ablauf', 'Wissen', 'Über uns', 'Kontakt'])
        assert.ok(await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name }).isVisible(), name)
      const tops = await page.$$eval('.hero__actions .btn', (bs) => bs.map((b) => Math.round(b.getBoundingClientRect().top)))
      assert.equal(new Set(tops).size, 1, `Hero-Buttons nicht nebeneinander: ${tops}`)
    })
    await check('Leistungen-Dropdown öffnet und navigiert', async () => {
      await page.goto(base + '/', { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: 'Leistungen' }).click()
      await page.locator('#nav-services').getByRole('link', { name: /Schadengutachten/ }).click()
      await page.waitForURL('**/schadengutachten')
      await waitFor(page, (t) => document.title === t, 'Schadengutachten für Kasko-, Hagel- und Parkschäden | Gutachterbüro Dekic')
    })
  }

  await check('keine Console-Fehler', async () => assert.equal(errors.length, 0, [...new Set(errors)].map((e) => e.slice(0, 200)).join(' | ')))
  await ctx.close()
}

console.log(`\n${browserName} · Zusatzprüfungen`)
const ctx = await browser.newContext({ bypassCSP: true, reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })
const page = await ctx.newPage()
await check('große Bildschirme (Full-HD, WQHD, 4K): volle Breite, proportional skaliert', async () => {
  for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
    const p = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' })
    await p.goto(base + '/', { waitUntil: 'networkidle' })
    // Verhältnisse statt absoluter Pixel: WebKit meldet Rechtecke unter CSS-zoom unskaliert
    const m = await p.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect()
      const hero = r('.hero')
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        burger: getComputedStyle(document.querySelector('.site-header__burger')).display,
        sceneRight: (r('.hero-scene').right - hero.right) / hero.width,
        textLeft: r('.hero__title').left / hero.width,
        titleSize: r('.hero__title').height / hero.width,
      }
    })
    await p.close()
    assert.ok(m.overflow <= 1, `${w}px: horizontaler Überlauf ${m.overflow}px`)
    assert.equal(m.burger, 'none', `${w}px: Menü-Button sichtbar`)
    assert.ok(Math.abs(m.sceneRight) < 0.01, `${w}px: Hero-Szene nicht randabfallend (${m.sceneRight.toFixed(3)})`)
    assert.ok(m.textLeft < 0.12, `${w}px: zu breiter linker Rand (${m.textLeft.toFixed(3)})`)
    assert.ok(m.titleSize > 0.07, `${w}px: Überschrift zu klein (${m.titleSize.toFixed(3)})`)
  }
})
await check('reduzierte Bewegung: aufgenommenes Foto sofort statisch sichtbar', async () => {
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await waitFor(page, () => getComputedStyle(document.querySelector(".vf__shot")).opacity === "1")
})
await check('Großschreibung in der URL: 404 ohne Hydration-Fehler', async () => {
  const errs = []
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
  const res = await page.goto(base + '/Kontakt', { waitUntil: 'networkidle' })
  if (base.includes(':8788')) assert.equal(res.status(), 404)
  assert.ok((await page.locator('h1').textContent()).includes('gibt es nicht'))
  assert.ok((await page.title()).startsWith('Seite nicht gefunden'))
  assert.equal(errs.filter((e) => !e.includes('404')).length, 0, errs.join(' | '))
})
await check('unbekannte Adresse liefert 404-Seite', async () => {
  const res = await page.goto(base + '/gibt-es-nicht', { waitUntil: 'networkidle' })
  if (base.includes(':8788')) assert.equal(res.status(), 404)
  assert.ok((await page.locator('h1').textContent()).includes('gibt es nicht'))
})
await ctx.close()

const axeCtx = await browser.newContext({ bypassCSP: true, viewport: { width: 1280, height: 800 } })
const axePage = await axeCtx.newPage()
const axeSource = await readFile(fileURLToPath(import.meta.resolve('axe-core/axe.min.js')), 'utf8')
await check('Barrierefreiheit (axe-core, WCAG 2.2 AA): keine ernsten Verstöße', async () => {
  const found = []
  for (const path of paths) {
    await axePage.goto(base + path, { waitUntil: 'networkidle' })
    await axePage.addScriptTag({ content: axeSource })
    const res = await axePage.evaluate(() => window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }))
    for (const v of res.violations) if (['serious', 'critical'].includes(v.impact)) found.push(`${path}: ${v.id} (${v.nodes.length}×) ${v.nodes[0].target}`)
  }
  assert.equal(found.length, 0, found.join(' | '))
})
await axeCtx.close()

const cspCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const cspPage = await cspCtx.newPage()
await cspPage.addInitScript(() =>
  document.addEventListener('securitypolicyviolation', (e) => console.error(`CSP: ${e.violatedDirective} ${e.blockedURI}`)),
)
const violations = []
cspPage.on('console', (m) => m.text().startsWith('CSP:') && violations.push(m.text()))
await check('Content-Security-Policy: keine Verstöße auf allen Seiten', async () => {
  for (const path of paths) await cspPage.goto(base + path, { waitUntil: 'networkidle' })
  await cspPage.goto(base + '/', { waitUntil: 'networkidle' })
  await cspPage.waitForTimeout(3500)
  assert.deepEqual(violations, [])
})
await cspCtx.close()
await browser.close()

console.log(failures ? `\n${failures} Prüfung(en) fehlgeschlagen` : '\nAlle Prüfungen bestanden')
process.exit(failures ? 1 : 0)
