<script setup>
import { onMounted, ref } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import { ladeBuecher, loescheBuch } from '../api/buecher'

const buecher = ref([])
const laden = ref(true)
const fehler = ref('')

async function ladenBuecher() {
  laden.value = true
  fehler.value = ''
  try {
    buecher.value = await ladeBuecher()
  } catch (error) {
    fehler.value = error.message || 'Bücher konnten nicht geladen werden.'
  } finally {
    laden.value = false
  }
}

async function loeschen(buch) {
  if (!window.confirm(`„${buch.titel}“ wirklich löschen?`)) return
  try {
    await loescheBuch(buch.id)
    await ladenBuecher()
  } catch (error) {
    fehler.value = error.message || 'Buch konnte nicht gelöscht werden.'
  }
}

onMounted(ladenBuecher)
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
      <p v-if="laden" class="leer">Lade Bücher …</p>
      <p v-if="fehler" class="fehler">{{ fehler }}</p>

      <table v-if="!laden && !fehler">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titel</th>
            <th>Autor:in</th>
            <th>Genre</th>
            <th>Jahr</th>
            <th>Status</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="buch in buecher" :key="buch.id">
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
        Keine Bücher vorhanden.
      </p>
    </div>
  </section>
</template>
