import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';
import { defaultAuthor } from './profileUtils';

export interface SuggestedUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

export const useDiscoverStore = defineStore('discover', () => {
  const suggestions = ref<SuggestedUser[]>([]);
  const loading = ref(false);

  const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '');

  function formatUrl(url: string | null) {
    if (!url) {
      return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    }
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  async function fetchSuggestions() {
    try {
      loading.value = true;
      const response = await api.get('/users/suggestions');
      
      const items = response.data.data || response.data || [];
      
      suggestions.value = items.map((user: any) => ({
        ...user,
        avatar: formatUrl(user.avatar)
      }));
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    } finally {
      loading.value = false;
    }
  }

  return {
    suggestions,
    loading,
    fetchSuggestions
  };
});
