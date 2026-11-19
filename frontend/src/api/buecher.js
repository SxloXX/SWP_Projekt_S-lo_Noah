/**
 * Mock-Store als Platzhalter für die spätere Datenbindung.
 *
 * TODO: Die Funktionen durch HTTP-Calls auf die Flask-API ersetzen:
 *   GET    /api/buecher
 *   GET    /api/buecher/:id
 *   POST   /api/buecher
 *   PUT    /api/buecher/:id
 *   DELETE /api/buecher/:id
 * Der Vite-Proxy leitet /api bereits an http://localhost:5000 weiter.
 */
import { computed, reactive } from 'vue'

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
