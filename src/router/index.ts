import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

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
      meta: {
        requireAuth: true
      },
      component: () => import('../views/ContactsList.vue')
    },
    {
      path: '/contact/:id',
      name: 'contact-view',
      meta: {
        requireAuth: true
      },
      component: () => import('../views/ContactsView.vue')
    },
    {
      path: '/contact/:id/edit',
      name: 'contact-edit',
      meta: {
        requireAuth: true
      },
      component: () => import('../views/ContactsEdit.vue')
    },
    {
      path: '/contact',
      name: 'contact-create',
      meta: {
        requireAuth: true
      },
      component: () => import('../views/ContactsCreate.vue')
    },
    {
      path: "/:pathMatch(.*)*",
      name: 'ErrorView',
      component: () => import('../views/404View.vue'),
    },
  ]
})


router.beforeEach((to, from, next) => {
  const isAuthenticated = useAuthStore().isLoggedIn;

  if (to.meta.requireAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
