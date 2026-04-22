import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          redirect: '/login'
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
          meta: { requiresGuest: true }
        },
        {
          path: 'cadastro',
          name: 'register',
          component: () => import('@/views/RegisterView.vue'),
          meta: { requiresGuest: true }
        }
      ]
    },
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      children: [
        {
          path: 'feed',
          name: 'feed',
          component: () => import('@/views/FeedView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'perfil',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  // Hydrate user if token exists but user doesn't
  if (auth.token && !auth.user) {
    await auth.fetchMe()
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && auth.isAuthenticated) {
    next('/feed')
  } else {
    next()
  }
})

export default router