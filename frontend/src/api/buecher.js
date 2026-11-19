/**
 * Datenzugriff für das Bücherei-Portal.
 *
 * Es gibt zwei Betriebsarten:
 * - USE_MOCK = true: lokale Mock-Daten (Standard, bis Sülos API läuft)
 * - USE_MOCK = false: HTTP-Calls gegen die Flask-API über src/api/client.js
 *
 * Die async-Funktionen (ladeBuecher, ladeBuch, ...) sind die neue Schnittstelle.
 * Die alten useBuecher/useAusleihen-Exports bleiben vorerst für die Views
 * erhalten und werden entfernt, sobald alle Views umgestellt sind.
 */
import { computed, reactive } from 'vue'
import { request } from './client'

export const USE_MOCK = true

const state = reactive({
  buecher: [
    {
      id: 1,
      titel: 'Der Zauberberg',
      autor: 'Thomas Mann',
      isbn: '978-3-16-148410-0',
      erscheinungsjahr: 1924,
      genre: 'Roman',
      verfuegbar: true,
    },
    {
      id: 2,
      titel: 'Die Verwandlung',
      autor: 'Franz Kafka',
      isbn: '978-3-16-148411-7',
      erscheinungsjahr: 1915,
      genre: 'Erzählung',
      verfuegbar: true,
    },
    {
      id: 3,
      titel: 'Die Hauptstadt',
      autor: 'Robert Menasse',
      isbn: '978-3-10-002249-4',
      erscheinungsjahr: 2017,
      genre: 'Roman',
      verfuegbar: false,
    },
  ],
  ausleihen: [
    {
      id: 1,
      buch_id: 3,
      mitglied: 'Anna Schmidt',
      ausgeliehen_am: '2026-10-12',
      rueckgabe_am: '2026-11-12',
    },
    {
      id: 2,
      buch_id: 1,
      mitglied: 'Jonas Weber',
      ausgeliehen_am: '2026-11-01',
      rueckgabe_am: '2026-12-01',
    },
  ],
  naechsteId: 4,
})

function kopie(element) {
  return element ? { ...element } : null
}

function suchbegriffPasst(buch, suchbegriff) {
  if (!suchbegriff) return true
  const begriff = suchbegriff.toLocaleLowerCase('de')
  return (
    buch.titel.toLocaleLowerCase('de').includes(begriff) ||
    buch.autor.toLocaleLowerCase('de').includes(begriff)
  )
}

// ---------------------------------------------------------------------------
// Neue Schnittstelle: async, mit Mock-Fallback
// ---------------------------------------------------------------------------

export async function ladeBuecher(params = {}) {
  if (USE_MOCK) {
    return state.buecher
      .filter((buch) => suchbegriffPasst(buch, params.suchbegriff))
      .filter((buch) => !params.genre || buch.genre === params.genre)
      .map(kopie)
  }

  const abfrage = new URLSearchParams()
  if (params.suchbegriff) abfrage.set('suchbegriff', params.suchbegriff)
  if (params.genre) abfrage.set('genre', params.genre)
  const query = abfrage.toString()
  return request(`/buecher${query ? `?${query}` : ''}`)
}

export async function ladeBuch(id) {
  if (USE_MOCK) {
    return kopie(state.buecher.find((buch) => buch.id === Number(id)))
  }
  return request(`/buecher/${id}`)
}

export async function legeBuchAn(daten) {
  if (USE_MOCK) {
    const buch = {
      id: state.naechsteId++,
      titel: daten.titel,
      autor: daten.autor,
      isbn: daten.isbn ?? '',
      erscheinungsjahr: daten.erscheinungsjahr ?? null,
      genre: daten.genre ?? '',
      verfuegbar: daten.verfuegbar ?? true,
    }
    state.buecher.push(buch)
    return kopie(buch)
  }
  return request('/buecher', {
    method: 'POST',
    body: JSON.stringify(daten),
  })
}

export async function aendereBuch(id, daten) {
  if (USE_MOCK) {
    const buch = state.buecher.find((eintrag) => eintrag.id === Number(id))
    if (!buch) throw new Error('Buch nicht gefunden')
    Object.assign(buch, daten)
    return kopie(buch)
  }
  return request(`/buecher/${id}`, {
    method: 'PUT',
    body: JSON.stringify(daten),
  })
}

export async function loescheBuch(id) {
  if (USE_MOCK) {
    const index = state.buecher.findIndex((eintrag) => eintrag.id === Number(id))
    if (index === -1) throw new Error('Buch nicht gefunden')
    state.buecher.splice(index, 1)
    return null
  }
  return request(`/buecher/${id}`, { method: 'DELETE' })
}

export async function ladeAusleihen() {
  if (USE_MOCK) return state.ausleihen.map(kopie)
  return request('/ausleihen')
}

// ---------------------------------------------------------------------------
// Alte Schnittstelle – wird in einem späteren Commit entfernt
// ---------------------------------------------------------------------------

export function useBuecher() {
  const alleBuecher = computed(() => state.buecher)

  function buchNachId(id) {
    return state.buecher.find((buch) => buch.id === Number(id))
  }

  function buchAnlegen(daten) {
    const buch = {
      id: state.naechsteId++,
      titel: daten.titel,
      autor: daten.autor,
      isbn: daten.isbn ?? '',
      erscheinungsjahr: daten.erscheinungsjahr ?? null,
      genre: daten.genre ?? '',
      verfuegbar: daten.verfuegbar ?? true,
    }
    state.buecher.push(buch)
    return buch
  }

  function buchAendern(id, daten) {
    const buch = buchNachId(id)
    if (!buch) return null
    Object.assign(buch, daten)
    return buch
  }

  function buchLoeschen(id) {
    const index = state.buecher.findIndex((buch) => buch.id === Number(id))
    if (index !== -1) state.buecher.splice(index, 1)
  }

  return { alleBuecher, buchNachId, buchAnlegen, buchAendern, buchLoeschen }
}

export function useAusleihen() {
  const alleAusleihen = computed(() => state.ausleihen)

  function ausleihenFuerBuch(buchId) {
    return state.ausleihen.filter((ausleihe) => ausleihe.buch_id === Number(buchId))
  }

  return { alleAusleihen, ausleihenFuerBuch }
}
