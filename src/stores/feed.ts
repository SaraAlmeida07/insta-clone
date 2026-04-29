import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';
import { defaultAuthor } from './profileUtils';

/**
 * Normaliza os dados de um comentário para garantir consistência na UI.
 */
export const normalizeComment = (comment: any) => ({
  ...comment,
  user: comment.user || defaultAuthor(),
  created_at: comment.created_at || new Date().toISOString()
});

export interface Post {
  id: number;
  caption: string;
  image_url: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  created_at: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export const useFeedStore = defineStore('feed', () => {
  const postsById = ref<Record<number, Post>>({});
  const postIds = ref<number[]>([]);
  const nextCursor = ref<string | null>(null);
  const loading = ref(false);

  const allPosts = computed(() =>
    postIds.value
      .map(id => postsById.value[id])
      .filter((post): post is Post => !!post)
  );

  const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '');

  /**
   * Garante que a URL da imagem aponte para o backend
   */
  function formatUrl(url: string | null, isAvatar = false) {
    if (!url) {
      return isAvatar
        ? 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        : 'https://placehold.co/600x600/262626/white?text=Imagem+indisponível';
    }
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  async function fetchFeed() {
    try {
      loading.value = true;
      const response = await api.get('/feed');

      const items = response.data.data || [];
      const next_cursor = response.data.meta?.next_cursor;

      postsById.value = {};
      postIds.value = [];

      (items || []).forEach((post: Post) => {
        postsById.value[post.id] = normalizePost(post);
        postIds.value.push(post.id);
      });

      nextCursor.value = next_cursor;
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Carrega mais posts usando o cursor da paginação
   */
  async function loadMoreFeed() {
    if (!nextCursor.value || loading.value) return;

    try {
      loading.value = true;
      const response = await api.get('/feed', { params: { cursor: nextCursor.value } });

      const items = response.data.data || [];
      const next_cursor = response.data.meta?.next_cursor;

      (items || []).forEach((post: Post) => {
        if (!postsById.value[post.id]) {
          postsById.value[post.id] = normalizePost(post);
          postIds.value.push(post.id);
        }
      });

      nextCursor.value = next_cursor;
    } catch (error) {
      console.error('Erro ao carregar mais posts:', error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Alterna o estado de curtida de forma otimista
   */
  async function toggleLike(postId: number) {
    const post = postsById.value[postId];
    if (!post) return;

    const originalState = { is_liked: post.is_liked, likes_count: post.likes_count };

    // Atualização Otimista: Muda na interface antes de receber resposta do servidor
    post.is_liked = !post.is_liked;
    post.likes_count += post.is_liked ? 1 : -1;

    try {
      if (post.is_liked) {
        await api.post(`/posts/${postId}/like`);
      } else {
        await api.post(`/posts/${postId}/like`, { _method: 'DELETE' });
      }
    } catch (error) {
      // Rollback se der erro
      post.is_liked = originalState.is_liked;
      post.likes_count = originalState.likes_count;
      console.error('Erro ao curtir/descurtir:', error);
    }
  }

  /**
   * Adiciona um comentário (a implementação da UI virá depois)
   */
  async function addComment(postId: number, body: string) {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { body });
      const post = postsById.value[postId];
      if (post) {
        post.comments_count++;
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao comentar:', error);
      throw error;
    }
  }

  function normalizePost(post: any): Post {
  return {
    ...post,
    image_url: formatUrl(post.image_url, false),
    user: {
      ...(post.user || defaultAuthor()),
      avatar: formatUrl(post.user?.avatar, true)
    }
  };
  }

  /**
   * Cria um novo post
   */
  async function createPost(formData: FormData) {
    try {
      const response = await api.post('/posts', formData);

      const postData = response.data.data || response.data;

      const newPost = normalizePost(postData);

      // Adicionamos o post novo localmente para ele aparecer na hora
      postsById.value[newPost.id] = newPost;
      postIds.value.unshift(newPost.id);

      return newPost;
    } catch (error) {
      console.error('Erro ao criar post:', error);
      throw error;
    }
  }

  return {
    postsById,
    postIds,
    allPosts,
    nextCursor,
    loading,
    fetchFeed,
    loadMoreFeed,
    toggleLike,
    addComment,
    createPost
  };
});
