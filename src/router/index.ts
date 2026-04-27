import { createRouter, createWebHistory } from 'vue-router'
import { ROUTE_NAMES } from './routeNames'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: ROUTE_NAMES.LOGIN,
        component: () => import('../views/LoginView.vue'),
        meta: { requiresGuest: true }
      },
      {
        path: 'cadastro',
        name: ROUTE_NAMES.REGISTER,
        component: () => import('../views/RegisterView.vue'),
        meta: { requiresGuest: true }
      }
    ]
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'feed',
        name: ROUTE_NAMES.FEED,
        component: () => import('../views/HomeView.vue')
      },
      // Placeholder routes for other sections
      {
        path: 'discover',
        name: ROUTE_NAMES.DISCOVER,
        component: () => import('../views/HomeView.vue') // Temporarily reuse HomeView
      },
      {
        path: 'create',
        name: ROUTE_NAMES.CREATE,
        component: () => import('../views/CreatePostView.vue')
      },
      {
        path: 'profile',
        name: ROUTE_NAMES.PROFILE,
        component: () => import('../views/HomeView.vue') // Temporarily reuse HomeView
      },
      {
        path: 'posts/:postId',
        name: ROUTE_NAMES.POST_DETAILS,
        component: () => import('../views/HomeView.vue') // Placeholder
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.NOT_FOUND,
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)

  if (requiresAuth && !auth.isAuthenticated) {
    return { name: ROUTE_NAMES.LOGIN }
  } 
  
  if (requiresGuest && auth.isAuthenticated) {
    return { name: ROUTE_NAMES.FEED }
  }
})

export default router