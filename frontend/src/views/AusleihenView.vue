<script setup>
import { useAusleihen, useBuecher } from '../api/buecher'

const { alleAusleihen } = useAusleihen()
const { buchNachId } = useBuecher()
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
      <ul class="liste">
        <li v-for="ausleihe in alleAusleihen" :key="ausleihe.id">
          <strong>
            <RouterLink
              v-if="buchNachId(ausleihe.buch_id)"
              :to="`/buecher/${ausleihe.buch_id}`"
            >
              {{ buchNachId(ausleihe.buch_id).titel }}
            </RouterLink>
            <template v-else>Buch #{{ ausleihe.buch_id }}</template>
          </strong>
          an {{ ausleihe.mitglied }}
          · {{ ausleihe.ausgeliehen_am }} → {{ ausleihe.rueckgabe_am }}
        </li>
      </ul>
      <p v-if="alleAusleihen.length === 0" class="leer">
        Keine Ausleihen vorhanden.
      </p>
    </div>
  </section>
</template>
