<script setup>
import { computed, onMounted, ref } from 'vue'
import { ladeAusleihen, ladeBuecher } from '../api/buecher'

const ausleihen = ref([])
const buecher = ref([])
const laden = ref(true)
const fehler = ref('')

const buchNachId = computed(
  () => new Map(buecher.value.map((buch) => [buch.id, buch])),
)

async function ladenAusleihen() {
  laden.value = true
  fehler.value = ''
  try {
    const [geladeneAusleihen, geladeneBuecher] = await Promise.all([
      ladeAusleihen(),
      ladeBuecher(),
    ])
    ausleihen.value = geladeneAusleihen
    buecher.value = geladeneBuecher
  } catch (error) {
    fehler.value = error.message || 'Ausleihen konnten nicht geladen werden.'
  } finally {
    laden.value = false
  }
}

onMounted(ladenAusleihen)
</script>

<template>
  <section>
    <header class="seitenkopf">
      <div>
        <h1>Ausleihen</h1>
        <p>Aktuell ausgeliehene Bücher der Bücherei.</p>
      </div>
    </header>

    <div class="karte">
      <p v-if="laden" class="leer">Lade Ausleihen …</p>
      <p v-if="fehler" class="fehler">{{ fehler }}</p>

      <ul v-if="!laden && !fehler && ausleihen.length" class="liste">
        <li v-for="ausleihe in ausleihen" :key="ausleihe.id">
          <strong>
            <RouterLink
              v-if="buchNachId.get(ausleihe.buch_id)"
              :to="`/buecher/${ausleihe.buch_id}`"
            >
              {{ buchNachId.get(ausleihe.buch_id).titel }}
            </RouterLink>
            <template v-else>Buch #{{ ausleihe.buch_id }}</template>
          </strong>
          an {{ ausleihe.mitglied }}
          · {{ ausleihe.ausgeliehen_am }} → {{ ausleihe.rueckgabe_am }}
        </li>
      </ul>
      <p v-if="!laden && !fehler && ausleihen.length === 0" class="leer">
        Keine Ausleihen vorhanden.
      </p>
    </div>
  </section>
</template>
