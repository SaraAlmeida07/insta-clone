import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Views - Auth
import LoginView from '../views/auth/LoginView.vue'
import SignupView from '../views/auth/SignupView.vue'

// Views - Main
import LayoutView from '../views/LayoutView.vue'
import FeedView from '../views/feed/FeedView.vue'
import ExploreView from '../views/explore/ExploreView.vue'
import NotificationsView from '../views/notifications/NotificationsView.vue'

// Views - Post
import CreatePostView from '../views/post/CreatePostView.vue'
import PostDetailView from '../views/post/PostDetailView.vue'

// Views - Profile
import ProfileView from '../views/profile/ProfileView.vue'
import EditProfileView from '../views/profile/EditProfileView.vue'
import FollowersView from '../views/profile/FollowersView.vue'
import FollowingView from '../views/profile/FollowingView.vue'

const routes: Array<RouteRecordRaw> = [
  // Rotas públicas (sem layout)
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false, layout: 'blank' }
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView,
    meta: { requiresAuth: false, layout: 'blank' }
  },

  // Rotas protegidas (com layout)
  {
    path: '/',
    component: LayoutView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'feed',
        component: FeedView
      },
      {
        path: 'create',
        name: 'createPost',
        component: CreatePostView
      },
      {
        path: 'post/:id',
        name: 'postDetail',
        component: PostDetailView,
        props: true
      },
      {
        path: 'explore',
        name: 'explore',
        component: ExploreView
      },
      {
        path: 'notifications',
        name: 'notifications',
        component: NotificationsView
      },
      {
        path: 'profile/:username',
        name: 'profile',
        component: ProfileView,
        props: true
      },
      {
        path: 'profile/:username/edit',
        name: 'editProfile',
        component: EditProfileView,
        props: true
      },
      {
        path: 'profile/:username/followers',
        name: 'followers',
        component: FollowersView,
        props: true
      },
      {
        path: 'profile/:username/following',
        name: 'following',
        component: FollowingView,
        props: true
      }
    ]
  },

  // Rota 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de rotas (proteção)
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isAuthenticated) {
    // Tenta acessar rota protegida sem autenticação → redireciona pro login
    next({ name: 'login' })
  } else if (!requiresAuth && isAuthenticated && (to.name === 'login' || to.name === 'signup')) {
    // Já está logado e tenta acessar login/signup → redireciona pro feed
    next({ name: 'feed' })
  } else {
    next()
  }
})

export default router