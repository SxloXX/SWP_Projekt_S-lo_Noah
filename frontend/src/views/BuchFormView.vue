<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBuecher } from '../api/buecher'

const props = defineProps({
  id: {
    type: [String, Number],
    default: null,
  },
})

const router = useRouter()
const { buchNachId, buchAnlegen, buchAendern } = useBuecher()

const istBearbeitung = Boolean(props.id)
const fehler = ref('')

const formular = reactive({
  titel: '',
  autor: '',
  isbn: '',
  erscheinungsjahr: null,
  genre: '',
  verfuegbar: true,
})

if (istBearbeitung) {
  const buch = buchNachId(props.id)
  if (buch) {
    const { titel, autor, isbn, erscheinungsjahr, genre, verfuegbar } = buch
    Object.assign(formular, {
      titel,
      autor,
      isbn,
      erscheinungsjahr,
      genre,
      verfuegbar,
    })
  } else {
    fehler.value = 'Buch nicht gefunden.'
  }
}

function speichern() {
  if (!formular.titel.trim() || !formular.autor.trim()) {
    fehler.value = 'Titel und Autor:in sind Pflichtfelder.'
    return
  }

  const daten = {
    ...formular,
    titel: formular.titel.trim(),
    autor: formular.autor.trim(),
    erscheinungsjahr: formular.erscheinungsjahr || null,
  }

  const gespeichert = istBearbeitung
    ? buchAendern(props.id, daten)
    : buchAnlegen(daten)

  if (gespeichert) router.push(`/buecher/${gespeichert.id}`)
}
</script>

<template>
  <section>
    <RouterLink to="/buecher" class="zurueck">← Zurück zur Liste</RouterLink>
    <header class="seitenkopf">
      <div>
        <h1>{{ istBearbeitung ? 'Buch ändern' : 'Neues Buch' }}</h1>
        <p>
          {{
            istBearbeitung
              ? 'Die Angaben des Buches bearbeiten.'
              : 'Ein neues Buch in den Bestand aufnehmen.'
          }}
        </p>
      </div>
    </header>

    <form class="karte formular" @submit.prevent="speichern">
      <p v-if="fehler" class="fehler">{{ fehler }}</p>

      <label>
        Titel *
        <input v-model="formular.titel" type="text" required />
      </label>
      <label>
        Autor:in *
        <input v-model="formular.autor" type="text" required />
      </label>
      <label>
        ISBN
        <input v-model="formular.isbn" type="text" />
      </label>
      <label>
        Erscheinungsjahr
        <input v-model="formular.erscheinungsjahr" type="number" min="0" />
      </label>
      <label>
        Genre
        <input v-model="formular.genre" type="text" />
      </label>
      <label class="checkbox">
        <input v-model="formular.verfuegbar" type="checkbox" />
        Verfügbar
      </label>

      <div class="formular-aktionen">
        <button type="submit" class="button button--primary">
          {{ istBearbeitung ? 'Speichern' : 'Anlegen' }}
        </button>
        <RouterLink to="/buecher" class="button">Abbrechen</RouterLink>
      </div>
    </form>
  </section>
</template>
