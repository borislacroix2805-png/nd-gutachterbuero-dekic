// Minimaler Cloudflare-Pages-Emulator für lokale Tests (workerd läuft nicht auf macOS < 13.5):
// statische Dateien aus dist/, Regeln aus dist/_headers, 404.html mit Status 404 und
// die echte Pages Function für /api/damage-reports.
// shortcut: nur die von diesem Projekt genutzten _headers-Muster (exakt und „/prefix/*“).
import { createServer } from 'node:http'
import { readFile, realpath, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { brotliCompressSync, constants } from 'node:zlib'

const root = fileURLToPath(new URL('../../', import.meta.url))
const dist = join(root, 'dist')
const port = Number(process.env.PORT ?? 8788)
const { onRequestPost } = await import(join(root, 'functions/api/damage-reports.ts'))

const rules = []
for (const line of (await readFile(join(dist, '_headers'), 'utf8')).split('\n')) {
  if (!line.trim() || line.trim().startsWith('#')) continue
  if (!/^\s/.test(line)) rules.push({ pattern: line.trim(), headers: [] })
  else {
    const i = line.indexOf(':')
    rules.at(-1).headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()])
  }
}
const matches = (p, url) => (p.endsWith('/*') ? url.startsWith(p.slice(0, -1)) : p === url)

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain' }

async function resolve(urlPath) {
  const p = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  for (const candidate of [join(dist, p), join(dist, p, 'index.html')]) {
    try {
      // Groß-/Kleinschreibung exakt wie bei Cloudflare (macOS-Dateisystem ist case-insensitiv)
      if ((await stat(candidate)).isFile() && (await realpath(candidate)) === candidate) return candidate
    } catch {}
  }
  return null
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  if (url.pathname === '/api/damage-reports' && req.method === 'POST') {
    const r = onRequestPost()
    res.writeHead(r.status, Object.fromEntries(r.headers))
    return res.end(await r.text())
  }
  const file = await resolve(url.pathname)
  const status = file ? 200 : 404
  const path = file ?? join(dist, '404.html')
  for (const rule of rules) if (matches(rule.pattern, url.pathname)) for (const [k, v] of rule.headers) if (k !== 'Strict-Transport-Security') res.setHeader(k, v) // HSTS nur über HTTPS sinnvoll
  const type = types[extname(path)] ?? 'application/octet-stream'
  let body = await readFile(path)
  // Cloudflare komprimiert Text automatisch (Brotli) – hier nachgebildet für realistische Messwerte
  if (/text|javascript|xml|svg/.test(type) && /\bbr\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }) // ähnlich Cloudflares dynamischer Kompression
    res.setHeader('Content-Encoding', 'br')
  }
  res.writeHead(status, { 'Content-Type': type })
  res.end(body)
}).listen(port, () => console.log(`Pages-Emulator: http://localhost:${port}`))
