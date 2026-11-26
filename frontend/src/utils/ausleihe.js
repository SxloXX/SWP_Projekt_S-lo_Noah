/**
 * Hilfsfunktionen rund um Ausleihen (Detailansicht, später Ausleihen-UI).
 * Datumswerte kommen laut API-Vertrag als ISO-String `YYYY-MM-DD`.
 */

/** Heutiges Datum als `YYYY-MM-DD` in lokaler Zeit. */
export function heuteIso() {
  const jetzt = new Date()
  const monat = String(jetzt.getMonth() + 1).padStart(2, '0')
  const tag = String(jetzt.getDate()).padStart(2, '0')
  return `${jetzt.getFullYear()}-${monat}-${tag}`
}

/**
 * Status einer Ausleihe:
 * - 'zurueckgegeben' wenn `zurueckgegeben_am` gesetzt ist (kommt mit B3)
 * - 'ueberfaellig' wenn das Rückgabedatum vor heute liegt
 * - 'aktiv' sonst
 */
export function ausleihStatus(ausleihe, heute = heuteIso()) {
  if (ausleihe.zurueckgegeben_am) return 'zurueckgegeben'
  if (ausleihe.rueckgabe_am && ausleihe.rueckgabe_am < heute) return 'ueberfaellig'
  return 'aktiv'
}

export const AUSLEIH_STATUS_TEXT = {
  aktiv: 'Aktiv',
  ueberfaellig: 'Überfällig',
  zurueckgegeben: 'Zurückgegeben',
}

/** Datum `YYYY-MM-DD` als `TT.MM.JJJJ` anzeigen. */
export function formatiereDatum(iso) {
  if (!iso) return '–'
  const [jahr, monat, tag] = iso.split('-')
  return `${tag}.${monat}.${jahr}`
}
