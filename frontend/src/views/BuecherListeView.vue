<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusBadge from '../components/StatusBadge.vue'
import { ladeBuecher, ladeGenres, loescheBuch } from '../api/buecher'

const route = useRoute()
const router = useRouter()

const buecher = ref([])
const genres = ref([])
const laden = ref(true)
const fehler = ref('')

// Filter leben in der URL (?suchbegriff=&genre=), damit Links und der
// Zurück-Button den Zustand der Liste behalten.
const suchbegriff = computed(() => route.query.suchbegriff ?? '')
const genre = computed(() => route.query.genre ?? '')
const suchEingabe = ref(suchbegriff.value)
const filterAktiv = computed(() => Boolean(suchbegriff.value || genre.value))

// Sortierung ebenfalls in der URL (?sortierung=titel&richtung=ab).
const SPALTEN = [
  { feld: 'id', titel: 'ID' },
  { feld: 'titel', titel: 'Titel' },
  { feld: 'autor', titel: 'Autor:in' },
  { feld: 'genre', titel: 'Genre' },
  { feld: 'erscheinungsjahr', titel: 'Jahr' },
]
const sortierung = computed(() =>
  SPALTEN.some((spalte) => spalte.feld === route.query.sortierung)
    ? route.query.sortierung
    : 'id',
)
const richtung = computed(() => (route.query.richtung === 'ab' ? 'ab' : 'auf'))

const istLeer = (wert) => wert === null || wert === undefined || wert === ''

function vergleiche(a, b, faktor) {
  // Leere Werte landen unabhängig von der Richtung immer am Ende.
  if (istLeer(a) || istLeer(b)) return istLeer(a) - istLeer(b)
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * faktor
  return String(a).localeCompare(String(b), 'de', { numeric: true }) * faktor
}

const sortierteBuecher = computed(() => {
  const faktor = richtung.value === 'ab' ? -1 : 1
  const feld = sortierung.value
  return [...buecher.value].sort((a, b) => vergleiche(a[feld], b[feld], faktor))
})

function sortiereNach(feld) {
  const neueRichtung =
    sortierung.value === feld && richtung.value === 'auf' ? 'ab' : 'auf'
  setzeQuery({
    sortierung: feld === 'id' && neueRichtung === 'auf' ? '' : feld,
    richtung: neueRichtung === 'ab' ? 'ab' : '',
  })
}

function ariaSort(feld) {
  if (sortierung.value !== feld) return 'none'
  return richtung.value === 'ab' ? 'descending' : 'ascending'
}

function setzeQuery(aenderungen) {
  const query = { ...route.query, ...aenderungen }
  for (const [schluessel, wert] of Object.entries(query)) {
    if (wert === '' || wert === null || wert === undefined) delete query[schluessel]
  }
  router.replace({ query })
}

let suchTimer
watch(suchEingabe, (wert) => {
  clearTimeout(suchTimer)
  suchTimer = setTimeout(() => setzeQuery({ suchbegriff: wert.trim() }), 300)
})

// Falls die URL von außen geändert wird (z. B. Zurück-Button).
watch(suchbegriff, (wert) => {
  if (wert !== suchEingabe.value.trim()) suchEingabe.value = wert
})

function filterZuruecksetzen() {
  clearTimeout(suchTimer)
  suchEingabe.value = ''
  setzeQuery({ suchbegriff: '', genre: '' })
}

async function ladenBuecher() {
  laden.value = true
  fehler.value = ''
  try {
    buecher.value = await ladeBuecher({
      suchbegriff: suchbegriff.value,
      genre: genre.value,
    })
  } catch (error) {
    fehler.value = error.message || 'Bücher konnten nicht geladen werden.'
  } finally {
    laden.value = false
  }
}

async function ladenGenres() {
  try {
    genres.value = await ladeGenres()
  } catch {
    // Ohne Genre-Liste bleibt nur der Filter leer; der Fehler erscheint
    // bereits über ladenBuecher.
  }
}

async function loeschen(buch) {
  if (!window.confirm(`„${buch.titel}“ wirklich löschen?`)) return
  try {
    await loescheBuch(buch.id)
    await Promise.all([ladenBuecher(), ladenGenres()])
  } catch (error) {
    fehler.value = error.message || 'Buch konnte nicht gelöscht werden.'
  }
}

watch([suchbegriff, genre], ladenBuecher)

onMounted(() => {
  ladenBuecher()
  ladenGenres()
})
</script>

<template>
  <section>
    <header class="seitenkopf">
      <div>
        <h1>Bücher</h1>
        <p>Alle Bestände der Bücherei im Überblick.</p>
      </div>
      <RouterLink class="button button--primary" to="/buecher/neu">
        + Neues Buch
      </RouterLink>
    </header>

    <div class="karte">
      <form class="werkzeugleiste" role="search" @submit.prevent>
        <label class="werkzeugleiste__suche">
          <span class="sr-only">Suche nach Titel oder Autor:in</span>
          <input
            v-model="suchEingabe"
            type="search"
            placeholder="Titel oder Autor:in suchen …"
          />
        </label>
        <label>
          <span class="sr-only">Genre</span>
          <select
            :value="genre"
            @change="setzeQuery({ genre: $event.target.value })"
          >
            <option value="">Alle Genres</option>
            <option v-for="eintrag in genres" :key="eintrag" :value="eintrag">
              {{ eintrag }}
            </option>
          </select>
        </label>
        <button
          v-if="filterAktiv"
          type="button"
          class="button"
          @click="filterZuruecksetzen"
        >
          Filter zurücksetzen
        </button>
      </form>

      <p v-if="laden" class="leer">Lade Bücher …</p>
      <p v-if="fehler" class="fehler">{{ fehler }}</p>

      <table v-if="!laden && !fehler && buecher.length">
        <thead>
          <tr>
            <th
              v-for="spalte in SPALTEN"
              :key="spalte.feld"
              :aria-sort="ariaSort(spalte.feld)"
            >
              <button
                type="button"
                class="sortierknopf"
                :class="{ 'sortierknopf--aktiv': sortierung === spalte.feld }"
                @click="sortiereNach(spalte.feld)"
              >
                {{ spalte.titel }}
                <span aria-hidden="true">
                  {{
                    sortierung === spalte.feld
                      ? richtung === 'ab'
                        ? '↓'
                        : '↑'
                      : '↕'
                  }}
                </span>
              </button>
            </th>
            <th>Status</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="buch in sortierteBuecher" :key="buch.id">
            <td>{{ buch.id }}</td>
            <td>
              <RouterLink :to="`/buecher/${buch.id}`">{{ buch.titel }}</RouterLink>
            </td>
            <td>{{ buch.autor }}</td>
            <td>{{ buch.genre || '–' }}</td>
            <td>{{ buch.erscheinungsjahr || '–' }}</td>
            <td><StatusBadge :verfuegbar="buch.verfuegbar" /></td>
            <td>
              <div class="aktionen">
                <RouterLink :to="`/buecher/${buch.id}`">Details</RouterLink>
                <RouterLink :to="`/buecher/${buch.id}/bearbeiten`">Ändern</RouterLink>
                <button
                  type="button"
                  class="button button--gefahr"
                  @click="loeschen(buch)"
                >
                  Löschen
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!laden && !fehler && buecher.length === 0" class="leer">
        {{
          filterAktiv
            ? 'Keine Bücher passen zu Suche und Filter.'
            : 'Keine Bücher vorhanden.'
        }}
      </p>
    </div>
  </section>
</template>
