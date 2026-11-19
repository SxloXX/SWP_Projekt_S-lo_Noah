<script setup>
import { computed } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useAusleihen, useBuecher } from '../api/buecher'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const { buchNachId } = useBuecher()
const { ausleihenFuerBuch } = useAusleihen()

const buch = computed(() => buchNachId(props.id))
const ausleihen = computed(() =>
  buch.value ? ausleihenFuerBuch(buch.value.id) : [],
)
</script>

<template>
  <section v-if="buch">
    <header class="seitenkopf">
      <div>
        <RouterLink to="/buecher" class="zurueck">← Zurück zur Liste</RouterLink>
        <h1>{{ buch.titel }}</h1>
        <p>von {{ buch.autor }}</p>
      </div>
      <RouterLink
        class="button button--primary"
        :to="`/buecher/${buch.id}/bearbeiten`"
      >
        Buch ändern
      </RouterLink>
    </header>

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
      <ul v-if="ausleihen.length" class="liste">
        <li v-for="ausleihe in ausleihen" :key="ausleihe.id">
          <strong>{{ ausleihe.mitglied }}</strong>
          · ausgeliehen am {{ ausleihe.ausgeliehen_am }}
          · Rückgabe am {{ ausleihe.rueckgabe_am }}
        </li>
      </ul>
      <p v-else class="leer">Dieses Buch ist aktuell nicht ausgeliehen.</p>
    </div>
  </section>

  <section v-else class="karte">
    <h1>Buch nicht gefunden</h1>
    <RouterLink to="/buecher">Zurück zur Bücherliste</RouterLink>
  </section>
</template>
