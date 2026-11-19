<script setup>
import StatusBadge from '../components/StatusBadge.vue'
import { useBuecher } from '../api/buecher'

const { alleBuecher, buchLoeschen } = useBuecher()

function loeschen(buch) {
  if (window.confirm(`„${buch.titel}“ wirklich löschen?`)) {
    buchLoeschen(buch.id)
  }
}
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
      <table>
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
          <tr v-for="buch in alleBuecher" :key="buch.id">
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
      <p v-if="alleBuecher.length === 0" class="leer">Keine Bücher vorhanden.</p>
    </div>
  </section>
</template>
