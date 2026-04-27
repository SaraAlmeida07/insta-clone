import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';
import router from '../router';
import { ROUTE_NAMES } from '../router/routeNames';

export const useAuthStore = defineStore('auth', () => {
  // --- ESTADO (State) ---
  // Armazenamos o usuário e o token. 
  // Tentamos carregar do localStorage para manter a sessão ao atualizar a página.
  const user = ref(JSON.parse(localStorage.getItem('instaclone.user') || 'null'));
  const token = ref(localStorage.getItem('instaclone.token') || null);

  // --- GETTERS (Computed) ---
  // isAuthenticated será verdadeiro se houver um token
  const isAuthenticated = computed(() => !!token.value);

  // --- AÇÕES (Actions) ---
  
  // Função para fazer login
  async function login(credentials: any) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token, user: userData } = response.data;

      // Salva no estado da store
      token.value = access_token;
      user.value = userData;

      // Salva no navegador para persistência
      localStorage.setItem('instaclone.token', access_token);
      localStorage.setItem('instaclone.user', JSON.stringify(userData));

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Função para registrar um novo usuário
  async function register(userData: any) {
    try {
      const response = await api.post('/auth/register', userData);
      const { access_token, user: newUser } = response.data;

      // No InstaClone, ao registrar já logamos o usuário
      token.value = access_token;
      user.value = newUser;

      localStorage.setItem('instaclone.token', access_token);
      localStorage.setItem('instaclone.user', JSON.stringify(newUser));

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Função para deslogar
  async function logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao deslogar no backend:', error);
    } finally {
      token.value = null;
      user.value = null;
      localStorage.removeItem('instaclone.token');
      localStorage.removeItem('instaclone.user');
      router.push({ name: ROUTE_NAMES.LOGIN });
    }
  }

  // Função para buscar os dados do usuário logado (perfil)
  async function fetchMe() {
    try {
      const response = await api.get('/auth/me');
      user.value = response.data;
      localStorage.setItem('instaclone.user', JSON.stringify(response.data));
    } catch (error) {
      logout(); // Se der erro ao buscar (ex: token expirado), desloga
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchMe
  };
});
