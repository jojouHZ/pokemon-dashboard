import { createRouter, createWebHistory } from 'vue-router'
import PokemonDashboard from '@/pages/PokemonDashboard.vue'
import PokemonDetailPage from '@/pages/PokemonDetailPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PokemonDashboard',
      component: PokemonDashboard,
    },
    {
      path: '/pokemon/:name',
      name: 'PokemonDetailPage',
      component: PokemonDetailPage,
      props: true,
    },
  ],
})

export default router
