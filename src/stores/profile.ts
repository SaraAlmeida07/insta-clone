import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string | null;
  posts_count: number;
  followers_count: number;
  following_count: number;
}

export const useProfileStore = defineStore('profile', () => {
  const user = ref<UserProfile | null>(null);
  const posts = ref<any[]>([]);
  const followersCount = ref(0);
  const followingCount = ref(0);
  const loading = ref(false);

  const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '');

  function formatUrl(url: string | null) {
    if (!url) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  /**
   * Resolve o perfil alvo pelo username
   */
  async function fetchProfile(username: string) {
    try {
      loading.value = true;
      const response = await api.get(`/users/${username}`);
      const userData = response.data.data || response.data;
      
      user.value = {
        ...userData,
        avatar: formatUrl(userData.avatar)
      };

      // Resetamos os dados antigos antes de carregar os novos em paralelo
      posts.value = [];
      
      return user.value;
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      user.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserPosts(userId: number) {
    try {
      const response = await api.get(`/users/${userId}/posts`);
      const items = response.data.data || response.data || [];
      posts.value = items.map((post: any) => ({
        ...post,
        image_url: formatUrl(post.image_url)
      }));
    } catch (error) {
      console.error('Erro ao carregar posts do usuário:', error);
    }
  }

  async function fetchFollowersCount(userId: number) {
    try {
      const response = await api.get(`/users/${userId}/followers`);
      // O backend pode retornar a lista completa ou um objeto com count
      followersCount.value = response.data.meta?.total || response.data.total || response.data.length || 0;
    } catch (error) {
      console.error('Erro ao carregar contador de seguidores:', error);
    }
  }

  async function fetchFollowingCount(userId: number) {
    try {
      const response = await api.get(`/users/${userId}/following`);
      followingCount.value = response.data.meta?.total || response.data.total || response.data.length || 0;
    } catch (error) {
      console.error('Erro ao carregar contador de seguindo:', error);
    }
  }

  return {
    user,
    posts,
    followersCount,
    followingCount,
    loading,
    fetchProfile,
    fetchUserPosts,
    fetchFollowersCount,
    fetchFollowingCount
  };
});
