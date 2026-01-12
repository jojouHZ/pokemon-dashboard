import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/pokemon/PokemonDetailView.vue'),
    },
    /**{
      path: '/',
      name: 'home',
      component: HomeView,
    },**/
    {
      path: '/pokemon/:name',
      component: () => import('@/views/pokemon/PokemonDetailView.vue'),
    },
  ],
})

export default router
