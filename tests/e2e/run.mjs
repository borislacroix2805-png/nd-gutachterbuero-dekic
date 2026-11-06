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
  for (let i = 0; i < 30; i++) {
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

  await check('Hero-Animation: Fokus → Blitz → Foto auf dem Display', async () => {
    await page.goto(base + '/', { waitUntil: 'networkidle' })
    const seen = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const s = { focus: false, flash: false, shot: false, thumb: false }
          const op = (sel) => Number(getComputedStyle(document.querySelector(sel)).opacity)
          const t0 = performance.now()
          const tick = () => {
            s.focus ||= op('.vf__focus') > 0.9
            // Blitz ist sehr kurz – bei langsamen Frames reicht jede sichtbare Aufhellung
            s.flash ||= op('.vf__flash') > 0.05
            s.shot ||= op('.vf__shot') > 0.9
            s.thumb ||= op('.phone__thumb') > 0.9
            if ((s.focus && s.flash && s.shot && s.thumb) || performance.now() - t0 > 9500) resolve(s)
            else requestAnimationFrame(tick)
          }
          tick()
        }),
    )
    assert.deepEqual(seen, { focus: true, flash: true, shot: true, thumb: true }, `erfasst: ${JSON.stringify(seen)}`)
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
