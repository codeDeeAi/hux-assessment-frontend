import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsList.vue')
    },
    {
      path: '/contact/:id',
      name: 'contact-view',
      component: () => import('../views/ContactsView.vue')
    },
    {
      path: '/contact/:id/edit',
      name: 'contact-edit',
      component: () => import('../views/ContactsEdit.vue')
    },
    {
      path: '/contact',
      name: 'contact-create',
      component: () => import('../views/ContactsCreate.vue')
    },
    {
      path: "/:pathMatch(.*)*",
      name: 'ErrorView',
      component: () => import('../views/404View.vue'),
    },
  ]
})

export default router
