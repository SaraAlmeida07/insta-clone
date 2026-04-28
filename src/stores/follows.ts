import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useFollowsStore = defineStore('follows', () => {
  // Mantemos como Set para buscas rápidas (O(1))
  // Trocamos a referência do Set a cada mudança para garantir a reatividade total
  const followingIds = ref<Set<number>>(new Set());
  const pendingIds = ref<Set<number>>(new Set());
  const loading = ref(false);

  /**
   * Verifica se o usuário está sendo seguido
   */
  function isFollowing(userId: number): boolean {
    return followingIds.value.has(userId);
  }

  /**
   * Verifica se uma ação de follow/unfollow está pendente para este usuário
   */
  function isPending(userId: number): boolean {
    return pendingIds.value.has(userId);
  }

  /**
   * Busca a lista de quem o usuário atual segue
   */
  async function fetchFollowing(userId: number) {
    if (!userId) return;
    
    try {
      loading.value = true;
      const response = await api.get(`/users/${userId}/following`);
      
      const users = response.data.data || response.data || [];
      const ids = users.map((u: any) => u.id);
      
      // Atualizamos o Set com uma nova instância
      followingIds.value = new Set(ids);
    } catch (error) {
      console.error('Erro ao buscar lista de seguindo:', error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Segue um usuário
   */
  async function follow(userId: number) {
    if (isPending(userId) || isFollowing(userId)) return;

    try {
      // Marcamos como pendente criando um novo Set
      const newPending = new Set(pendingIds.value);
      newPending.add(userId);
      pendingIds.value = newPending;

      await api.post(`/users/${userId}/follow`);

      // Adicionamos aos seguidos criando um novo Set
      const newFollowing = new Set(followingIds.value);
      newFollowing.add(userId);
      followingIds.value = newFollowing;
    } catch (error) {
      console.error('Erro ao seguir usuário:', error);
    } finally {
      // Removemos dos pendentes criando um novo Set
      const newPending = new Set(pendingIds.value);
      newPending.delete(userId);
      pendingIds.value = newPending;
    }
  }

  /**
   * Deixa de seguir um usuário
   */
  async function unfollow(userId: number) {
    if (isPending(userId) || !isFollowing(userId)) return;

    try {
      // Marcamos como pendente
      const newPending = new Set(pendingIds.value);
      newPending.add(userId);
      pendingIds.value = newPending;

      // Usamos o padrão de spoofing do Laravel: POST com _method DELETE no endpoint original
      await api.post(`/users/${userId}/follow`, { _method: 'DELETE' });

      // Removemos dos seguidos
      const newFollowing = new Set(followingIds.value);
      newFollowing.delete(userId);
      followingIds.value = newFollowing;
    } catch (error) {
      console.error('Erro ao deixar de seguir usuário:', error);
    } finally {
      // Removemos dos pendentes
      const newPending = new Set(pendingIds.value);
      newPending.delete(userId);
      pendingIds.value = newPending;
    }
  }

  return {
    followingIds,
    pendingIds,
    loading,
    isFollowing,
    isPending,
    fetchFollowing,
    follow,
    unfollow
  };
});
