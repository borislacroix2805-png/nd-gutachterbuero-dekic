import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ImagePlus, Send, X } from 'lucide-react'
import { submitDamageReport } from './api'
import { ACCEPTED_TYPES, MAX_PHOTOS, validateReport, type ReportErrors } from './validate'
import './DamageReportForm.css'

const damageTypes = ['Unfall (unverschuldet)', 'Unfall (Schuldfrage offen)', 'Parkschaden / Unfallflucht', 'Hagel / Sturm', 'Wildunfall', 'Vandalismus', 'Sonstiges']

/** Wird nur gerendert, wenn VITE_DAMAGE_REPORT_ENABLED=true (Backend + Datenschutz umgesetzt). */
export function DamageReportForm() {
  // Vorschau-URLs entstehen beim Auswählen und werden beim Entfernen bzw. Verlassen freigegeben.
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([])
  const urls = useRef<string[]>([])
  const [errors, setErrors] = useState<ReportErrors>({})
  const [state, setState] = useState<{ status: 'idle' | 'sending' | 'done' | 'error'; message?: string }>({ status: 'idle' })

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), [])

  function addPhotos(files: FileList | null) {
    const added = Array.from(files ?? [], (file) => ({ file, url: URL.createObjectURL(file) }))
    urls.current.push(...added.map((p) => p.url))
    setPhotos((prev) => [...prev, ...added])
  }

  function removePhoto(url: string) {
    URL.revokeObjectURL(url)
    urls.current = urls.current.filter((u) => u !== url)
    setPhotos((prev) => prev.filter((p) => p.url !== url))
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const field = (k: string) => String(fd.get(k) ?? '')
    const errs = validateReport({
      name: field('name'),
      phone: field('phone'),
      email: field('email'),
      plate: field('plate'),
      damageType: field('damageType'),
      date: field('date'),
      location: field('location'),
      description: field('description'),
      consent: fd.get('consent') === 'on',
      photos: photos.map((p) => p.file),
    })
    setErrors(errs)
    if (Object.keys(errs).length) {
      const form = e.currentTarget
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    fd.delete('photos')
    photos.forEach((p) => fd.append('photos', p.file))
    setState({ status: 'sending' })
    const res = await submitDamageReport(fd)
    setState(res.ok ? { status: 'done', message: res.id } : { status: 'error', message: res.message })
  }

  if (state.status === 'done') {
    return (
      <div className="report-form__done">
        {/* Fokus auf die Bestätigung, damit Screenreader sie sicher vorlesen */}
        <h2 tabIndex={-1} ref={(h) => h?.focus()}>Vielen Dank – Ihre Schadenmeldung ist eingegangen.</h2>
        <p>Vorgangsnummer: {state.message}. Wir melden uns schnellstmöglich bei Ihnen.</p>
      </div>
    )
  }

  const err = (k: keyof ReportErrors) =>
    errors[k] ? (
      <span className="report-form__error" id={`${k}-error`}>
        {errors[k]}
      </span>
    ) : null
  const a11y = (k: keyof ReportErrors) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${k}-error` : undefined,
  })

  return (
    <form className="report-form" onSubmit={onSubmit} noValidate>
      <fieldset>
        <legend>Ihre Kontaktdaten</legend>
        <label>
          Name*
          <input name="name" autoComplete="name" required {...a11y('name')} />
          {err('name')}
        </label>
        <label>
          Telefon
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" {...a11y('phone')} />
          {err('phone')}
        </label>
        <label>
          E-Mail
          <input name="email" type="email" autoComplete="email" {...a11y('email')} />
          {err('email')}
        </label>
      </fieldset>

      <fieldset>
        <legend>Zum Schaden</legend>
        <label>
          Schadenart*
          <select name="damageType" defaultValue="" required {...a11y('damageType')}>
            <option value="" disabled>
              Bitte wählen
            </option>
            {damageTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {err('damageType')}
        </label>
        <label>
          Datum des Schadens
          <input name="date" type="date" {...a11y('date')} />
          {err('date')}
        </label>
        <label>
          Kennzeichen
          <input name="plate" autoComplete="off" />
        </label>
        <label>
          Standort des Fahrzeugs (PLZ / Ort)
          <input name="location" autoComplete="address-level2" />
        </label>
        <label className="report-form__wide">
          Kurze Beschreibung
          <textarea name="description" rows={4} maxLength={2000} {...a11y('description')} />
          {err('description')}
        </label>
      </fieldset>

      <fieldset>
        <legend>Fotos (optional, max. {MAX_PHOTOS})</legend>
        <label className="report-form__drop">
          <ImagePlus aria-hidden="true" />
          <span>Fotos auswählen oder aufnehmen</span>
          <input
            className="sr-only"
            name="photos"
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            {...a11y('photos')}
            onChange={(e) => {
              addPhotos(e.target.files)
              e.target.value = ''
            }}
          />
        </label>
        {err('photos')}
        {photos.length > 0 && (
          <ul className="report-form__previews">
            {photos.map(({ url }, i) => (
              <li key={url}>
                <img src={url} alt={`Foto ${i + 1}`} />
                <button type="button" aria-label={`Foto ${i + 1} entfernen`} onClick={() => removePhoto(url)}>
                  <X aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <label className="report-form__consent">
        <input type="checkbox" name="consent" {...a11y('consent')} />
        <span>
          Ich willige ein, dass meine Angaben und Fotos zur Bearbeitung der Schadenmeldung verarbeitet werden. Details in
          der <Link to="/datenschutz">Datenschutzerklärung</Link>.*
        </span>
      </label>
      {err('consent')}

      {state.status === 'error' && (
        <p className="report-form__error" role="alert">
          {state.message}
        </p>
      )}
      <button className="btn btn--primary" type="submit" disabled={state.status === 'sending'}>
        <Send aria-hidden="true" /> {state.status === 'sending' ? 'Wird gesendet …' : 'Schadenmeldung absenden'}
      </button>
    </form>
  )
}
