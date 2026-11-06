# Ausbau: Digitale Schadenmeldung, KI-Unterstützung, Gutachtersoftware

Stand heute: Das Formular (`src/features/damage-report/`) ist fertig, aber per
`VITE_DAMAGE_REPORT_ENABLED=false` ausgeblendet. Die Pages Function
`functions/api/damage-reports.ts` antwortet bewusst mit **503** und nimmt keine Daten an.

## Zielbild

```
Browser ──POST multipart──▶ Pages Function /api/damage-reports
                              │ 1. Turnstile prüfen (Bots)
                              │ 2. Serverseitig validieren (Regeln wie validate.ts)
                              │ 3. Fotos → R2 (Binding PHOTOS), Schlüssel reports/<id>/<n>.jpg
                              │ 4. Metadaten → D1 (Binding DB)
                              │ 5. Büro benachrichtigen (E-Mail)
                              ▼
                        Queue / Worker (asynchron)
                              │ 6. optional KI-Vorprüfung der Fotos (z. B. Workers AI):
                              │    Bildqualität, erkennbare Schadenbereiche, fehlende Perspektiven
                              │ 7. Export an die Gutachtersoftware (Schnittstelle je nach Anbieter)
```

## Vorschlag Datenmodell (D1)

```sql
CREATE TABLE damage_reports (
  id TEXT PRIMARY KEY,               -- zufällige ID (crypto.randomUUID)
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'neu',-- neu | in_bearbeitung | erledigt | geloescht
  name TEXT NOT NULL,
  phone TEXT, email TEXT,
  plate TEXT, damage_type TEXT NOT NULL, damage_date TEXT, location TEXT, description TEXT,
  consent_at TEXT NOT NULL,          -- Zeitpunkt der Einwilligung
  delete_after TEXT NOT NULL         -- Löschfrist laut Löschkonzept
);
CREATE TABLE damage_report_photos (
  report_id TEXT NOT NULL REFERENCES damage_reports(id),
  r2_key TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL
);
```

## Voraussetzungen vor der Freischaltung

- Datenschutz: Einwilligungstext, Ergänzung der Datenschutzerklärung (Abschnitt 6), Löschkonzept,
  AV-Vertrag mit Cloudflare, ggf. mit E-Mail-/KI-Anbieter.
- Sicherheit: Turnstile, Größen-/Typprüfung serverseitig (Magic Bytes, nicht nur MIME), Rate-Limit,
  R2-Bucket **privat** (Zugriff nur über signierte URLs/Worker), keine personenbezogenen Daten in Logs.
- Interner Zugang zu den Meldungen (z. B. per Cloudflare Access geschützte Admin-Ansicht).
- Bindings in `wrangler.toml` einkommentieren, Ressourcen anlegen (`wrangler d1 create`, `wrangler r2 bucket create`).

## Gutachtersoftware

Welche Software eingesetzt wird, ist offen. Je nach Anbieter: REST-API, Import-Datei (z. B. XML/JSON)
oder E-Mail-Import. Der Export wird als eigener Worker umgesetzt, damit die Website davon unabhängig bleibt.
