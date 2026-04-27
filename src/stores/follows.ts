import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useFollowsStore = defineStore('follows', () => {
  // Mantemos como Set para buscas rápidas (O(1))
  // Trocamos a referência do Set a cada mudança para garantir a reatividade total
  const followingIds = ref<Set<number>>(new Set());
  const loading = ref(false);

  /**
   * Verifica se o usuário está sendo seguido
   */
  function isFollowing(userId: number): boolean {
    return followingIds.value.has(userId);
  }

  /**
   * Busca a lista de quem o usuário atual segue
   */
  async function fetchFollowing(userId: number) {
    if (!userId) return;
    
    try {
      loading.value = true;
      const response = await api.get(`/users/${userId}/following`);
      
      // O backend pode retornar { data: [...] } ou direto a lista
      const users = response.data.data || response.data || [];
      
      // Extraímos apenas os IDs e criamos um novo Set
      const ids = users.map((u: any) => u.id);
      followingIds.value = new Set(ids);
    } catch (error) {
      console.error('Erro ao buscar lista de seguindo:', error);
    } finally {
      loading.value = false;
    }
  }

  return {
    followingIds,
    loading,
    isFollowing,
    fetchFollowing
  };
});
