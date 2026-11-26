<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import StatusBadge from '../components/StatusBadge.vue'
import { ladeAusleihen, ladeBuch, loescheBuch } from '../api/buecher'
import {
  AUSLEIH_STATUS_TEXT,
  ausleihStatus,
  formatiereDatum,
} from '../utils/ausleihe'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()

const buch = ref(null)
const ausleihen = ref([])
const laden = ref(true)
const fehler = ref('')
const aktionsFehler = ref('')
const loescht = ref(false)

async function loeschen() {
  if (!window.confirm(`„${buch.value.titel}“ wirklich löschen?`)) return
  loescht.value = true
  aktionsFehler.value = ''
  try {
    await loescheBuch(buch.value.id)
    router.push('/buecher')
  } catch (error) {
    aktionsFehler.value = error.message || 'Buch konnte nicht gelöscht werden.'
  } finally {
    loescht.value = false
  }
}

async function ladenBuch() {
  laden.value = true
  fehler.value = ''
  try {
    const [geladenesBuch, alleAusleihen] = await Promise.all([
      ladeBuch(props.id),
      ladeAusleihen(),
    ])
    buch.value = geladenesBuch
    // Neueste Ausleihe zuerst, jede mit berechnetem Status.
    ausleihen.value = alleAusleihen
      .filter((ausleihe) => ausleihe.buch_id === Number(props.id))
      .sort((a, b) => b.ausgeliehen_am.localeCompare(a.ausgeliehen_am))
      .map((ausleihe) => ({ ...ausleihe, status: ausleihStatus(ausleihe) }))
  } catch (error) {
    buch.value = null
    fehler.value = error.message || 'Buch konnte nicht geladen werden.'
  } finally {
    laden.value = false
  }
}

watch(() => props.id, ladenBuch, { immediate: true })
</script>

<template>
  <section v-if="laden" class="karte">
    <p class="leer">Lade Buch …</p>
  </section>

  <section v-else-if="buch">
    <header class="seitenkopf">
      <div>
        <RouterLink to="/buecher" class="zurueck">← Zurück zur Liste</RouterLink>
        <h1>{{ buch.titel }}</h1>
        <p>von {{ buch.autor }}</p>
      </div>
      <div class="aktionen">
        <RouterLink
          class="button button--primary"
          :to="`/buecher/${buch.id}/bearbeiten`"
        >
          Buch ändern
        </RouterLink>
        <button
          type="button"
          class="button button--gefahr"
          :disabled="loescht"
          @click="loeschen"
        >
          {{ loescht ? 'Löscht …' : 'Löschen' }}
        </button>
      </div>
    </header>

    <p v-if="aktionsFehler" class="fehler fehler--abstand">{{ aktionsFehler }}</p>

    <div class="karte">
      <dl class="detailfelder">
        <dt>ID</dt>
        <dd>{{ buch.id }}</dd>
        <dt>ISBN</dt>
        <dd>{{ buch.isbn || '–' }}</dd>
        <dt>Genre</dt>
        <dd>{{ buch.genre || '–' }}</dd>
        <dt>Erscheinungsjahr</dt>
        <dd>{{ buch.erscheinungsjahr || '–' }}</dd>
        <dt>Status</dt>
        <dd><StatusBadge :verfuegbar="buch.verfuegbar" /></dd>
      </dl>
    </div>

    <div class="karte">
      <h2>Ausleihen</h2>
      <table v-if="ausleihen.length">
        <thead>
          <tr>
            <th>Mitglied</th>
            <th>Ausgeliehen am</th>
            <th>Rückgabe bis</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ausleihe in ausleihen" :key="ausleihe.id">
            <td>{{ ausleihe.mitglied }}</td>
            <td>{{ formatiereDatum(ausleihe.ausgeliehen_am) }}</td>
            <td>{{ formatiereDatum(ausleihe.rueckgabe_am) }}</td>
            <td>
              <span class="status" :class="`status--${ausleihe.status}`">
                {{ AUSLEIH_STATUS_TEXT[ausleihe.status] }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="leer">Dieses Buch wurde noch nicht ausgeliehen.</p>
    </div>
  </section>

  <section v-else class="karte">
    <h1>Buch nicht gefunden</h1>
    <p v-if="fehler && fehler !== 'Buch nicht gefunden'" class="fehler">
      {{ fehler }}
    </p>
    <RouterLink to="/buecher">Zurück zur Bücherliste</RouterLink>
  </section>
</template>
