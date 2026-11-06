// Rendert jede Route als statisches HTML (SEO, schnelle erste Anzeige) und erzeugt 404.html,
// sitemap.xml und robots.txt. Läuft nach `vite build` und `vite build --ssr`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = `${root}dist`
const ssrEntry = `${root}dist-ssr/entry-server.js`
const siteUrl = (process.env.SITE_URL ?? '').replace(/\/+$/, '')

// Produktions-Build auf Cloudflare (Branch main) ohne Domain würde canonical und Sitemap verlieren → abbrechen.
if (!siteUrl && process.env.CF_PAGES_BRANCH === 'main') {
  console.error('SITE_URL fehlt: Für den Produktions-Build (main) in Cloudflare Pages setzen.')
  process.exit(1)
}

const { render, routes, notFoundMeta } = await import(ssrEntry)
const template = await readFile(`${dist}/index.html`, 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function page(meta, html, { noindex = false } = {}) {
  const url = siteUrl ? `${siteUrl}${meta.path === '/' ? '/' : meta.path}` : ''
  const head = [
    noindex ? '<meta name="robots" content="noindex" />' : '',
    url && !noindex ? `<link rel="canonical" href="${url}" />` : '',
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="de_DE" />',
    '<meta property="og:site_name" content="Gutachterbüro Dekic" />',
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    url ? `<meta property="og:url" content="${url}" />` : '',
    siteUrl ? `<meta property="og:image" content="${siteUrl}/og/og-default.jpg" />` : '',
    '<meta name="twitter:card" content="summary_large_image" />',
  ]
    .filter(Boolean)
    .join('\n    ')
  // Funktions-Ersetzer, damit „$“ im Seiteninhalt nicht als Ersetzungsmuster gedeutet wird
  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, () => `<meta name="description" content="${esc(meta.description)}" />`)
    .replace('<!--head-->', () => head)
    .replace('<!--app-->', () => html)
}

for (const meta of routes) {
  const out = meta.path === '/' ? dist : `${dist}${meta.path}`
  await mkdir(out, { recursive: true })
  await writeFile(`${out}/index.html`, page(meta, render(meta.path)))
}
await writeFile(`${dist}/404.html`, page(notFoundMeta, render('/404-seite-nicht-gefunden'), { noindex: true }))

const robots = ['User-agent: *', 'Allow: /']
if (siteUrl) {
  const urls = routes.map((r) => `  <url><loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc></url>`).join('\n')
  await writeFile(
    `${dist}/sitemap.xml`,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
  robots.push(`Sitemap: ${siteUrl}/sitemap.xml`)
} else {
  console.warn('SITE_URL nicht gesetzt: canonical, og:url und sitemap.xml werden ausgelassen.')
}
await writeFile(`${dist}/robots.txt`, robots.join('\n') + '\n')
await rm(`${root}dist-ssr`, { recursive: true, force: true })
console.log(`Prerender: ${routes.length} Seiten + 404.html`)
