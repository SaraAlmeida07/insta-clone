import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: localStorage.getItem('instaclone.token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(credentials: any) {
      try {
        const response = await api.post('/auth/login', credentials)
        this.token = response.data.access_token
        this.user = response.data.user
        localStorage.setItem('instaclone.token', this.token)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async register(userData: any) {
      try {
        const response = await api.post('/auth/register', userData)
        this.token = response.data.access_token
        this.user = response.data.user
        localStorage.setItem('instaclone.token', this.token)
        return response.data
      } catch (error) {
        throw error
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch (error) {
        // Even if the request fails, we clear the local state
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('instaclone.token')
        window.location.href = '/login'
      }
    },

    async fetchMe() {
      if (!this.token) return
      try {
        const response = await api.get('/auth/me')
        this.user = response.data
      } catch (error) {
        this.logout()
      }
    }
  }
})
