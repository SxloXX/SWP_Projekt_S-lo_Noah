import { createRouter, createWebHistory } from 'vue-router'
import BuecherListeView from '../views/BuecherListeView.vue'
import BuchDetailView from '../views/BuchDetailView.vue'
import BuchFormView from '../views/BuchFormView.vue'
import AusleihenView from '../views/AusleihenView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/buecher' },
    { path: '/buecher', name: 'buecher-liste', component: BuecherListeView },
    // "neu" vor ":id" notieren, damit die Route nicht als ID interpretiert wird.
    { path: '/buecher/neu', name: 'buch-neu', component: BuchFormView },
    {
      path: '/buecher/:id',
      name: 'buch-detail',
      component: BuchDetailView,
      props: true,
    },
    {
      path: '/buecher/:id/bearbeiten',
      name: 'buch-bearbeiten',
      component: BuchFormView,
      props: true,
    },
    { path: '/ausleihen', name: 'ausleihen', component: AusleihenView },
  ],
})

export default router
