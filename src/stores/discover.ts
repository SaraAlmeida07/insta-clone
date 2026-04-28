import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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
  const currentPage = ref(1);
  const lastPage = ref(1);

  const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '');

  const hasMore = computed(() => currentPage.value < lastPage.value);

  function formatUrl(url: string | null) {
    if (!url) {
      return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    }
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  async function fetchSuggestions(page = 1) {
    try {
      loading.value = true;
      const response = await api.get('/users/suggestions', { 
        params: { page } 
      });
      
      // O Laravel geralmente retorna os itens em 'data' ou direto na raiz se for um Resource Collection
      const items = response.data.data || response.data || [];
      const meta = response.data.meta || response.data;
      
      const formattedItems = items.map((user: any) => ({
        ...user,
        avatar: formatUrl(user.avatar)
      }));

      if (page === 1) {
        suggestions.value = formattedItems;
      } else {
        suggestions.value = [...suggestions.value, ...formattedItems];
      }

      currentPage.value = meta.current_page || page;
      lastPage.value = meta.last_page || page;
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    } finally {
      loading.value = false;
    }
  }

  async function loadMore() {
    if (loading.value || !hasMore.value) return;
    await fetchSuggestions(currentPage.value + 1);
  }

  return {
    suggestions,
    loading,
    currentPage,
    lastPage,
    hasMore,
    fetchSuggestions,
    loadMore
  };
});
