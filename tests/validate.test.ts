import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateReport, type ReportInput } from '../src/features/damage-report/validate.ts'

const valid: ReportInput = {
  name: 'Max Muster',
  phone: '0431 123456',
  email: '',
  plate: '',
  damageType: 'Wildunfall',
  date: '2026-11-01',
  location: '',
  description: '',
  consent: true,
  photos: [{ name: 'a.jpg', size: 1000, type: 'image/jpeg' }],
}
const today = new Date('2026-11-06')

test('gültige Meldung ohne Fehler', () => {
  assert.deepEqual(validateReport(valid, today), {})
})

test('Telefon oder E-Mail ist Pflicht', () => {
  assert.ok(validateReport({ ...valid, phone: '' }, today).phone)
  assert.deepEqual(validateReport({ ...valid, phone: '', email: 'max@example.de' }, today), {})
})

test('Einwilligung, Schadenart, Name und Zukunftsdatum werden geprüft', () => {
  const e = validateReport({ ...valid, consent: false, damageType: '', name: ' ', date: '2027-01-01' }, today)
  assert.deepEqual(Object.keys(e).sort(), ['consent', 'damageType', 'date', 'name'])
})

test('Fotos: Anzahl, Typ und Größe', () => {
  const photo = valid.photos[0]
  assert.ok(validateReport({ ...valid, photos: Array(11).fill(photo) }, today).photos)
  assert.ok(validateReport({ ...valid, photos: [{ ...photo, type: 'application/pdf' }] }, today).photos)
  assert.ok(validateReport({ ...valid, photos: [{ ...photo, size: 11 * 1024 * 1024 }] }, today).photos)
})
