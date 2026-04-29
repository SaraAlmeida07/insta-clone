import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';
import { useAuthStore } from './auth';
import { profileUtils } from './profileUtils';

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

  const authStore = useAuthStore();
  const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '');

  function formatUrl(url: string | null) {
    return profileUtils.formatUrl(url, API_BASE);
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

  /**
   * Atualiza os dados básicos do perfil (Item 113)
   */
  async function updateProfile(data: { name: string; username: string; bio: string | null }) {
    try {
      loading.value = true;
      const response = await api.put('/users/me', data);
      const updatedUser = response.data.data || response.data;

      // Sincroniza com o authStore para atualizar a UI global (avatar, nome na sidebar)
      if (authStore.user) {
        authStore.user = {
          ...authStore.user,
          ...updatedUser
        };
      }

      // Se estivermos vendo o nosso próprio perfil, atualizamos o estado local
      if (user.value && user.value.id === updatedUser.id) {
        user.value = {
          ...user.value,
          ...updatedUser,
          avatar: formatUrl(updatedUser.avatar)
        };
      }

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Atualiza a foto de perfil (Item 114)
   */
  async function updateAvatar(file: File) {
    try {
      loading.value = true;
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/me/avatar', formData);

      const updatedUser = response.data.data || response.data;

      // Sincroniza com o authStore
      if (authStore.user) {
        authStore.user.avatar = updatedUser.avatar;
      }

      if (user.value) {
        user.value.avatar = formatUrl(updatedUser.avatar);
      }

      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar avatar:', error);
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
    updateProfile,
    updateAvatar,
    fetchUserPosts,
    fetchFollowersCount,
    fetchFollowingCount
  };
});
