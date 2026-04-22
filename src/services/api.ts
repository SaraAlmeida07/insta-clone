import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor to inject the token into every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('instaclone.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Interceptor to handle unauthorized responses
api.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('instaclone.token')
    window.location.href = '/login'
  }
  return Promise.reject(error)
})

export default api
