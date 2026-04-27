<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { Post } from '@/stores/feed';
import { useFeedStore } from '@/stores/feed';
import { formatRelative } from '@/utils/dates';
import AppIcon from '@/components/common/AppIcon.vue';
import { ROUTE_NAMES } from '@/router/routeNames';

const props = defineProps<{
  post: Post;
}>();

const feedStore = useFeedStore();
const commentBody = ref('');
const isSubmitting = ref(false);

const handleLike = () => {
  feedStore.toggleLike(props.post.id);
};

const handleComment = async () => {
  if (!commentBody.value.trim() || isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    await feedStore.addComment(props.post.id, commentBody.value);
    commentBody.value = '';
  } catch (error) {
    alert('Erro ao enviar comentário.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <article class="post-card mb-4 border rounded bg-black">
    <!-- Cabeçalho: Autor -->
    <header class="d-flex align-items-center p-3">
      <RouterLink 
        :to="{ name: ROUTE_NAMES.PROFILE, query: { user: post.user.username } }"
        class="text-decoration-none d-flex align-items-center gap-2"
      >
        <img :src="post.user.avatar" :alt="post.user.username" class="rounded-circle avatar">
        <span class="fw-bold text-white">{{ post.user.username }}</span>
      </RouterLink>
    </header>

    <!-- Imagem do Post -->
    <div class="post-image-container bg-dark d-flex align-items-center justify-content-center">
      <img :src="post.image_url" :alt="post.caption" class="img-fluid w-100 h-100 object-fit-cover">
    </div>

    <!-- Ações e Conteúdo -->
    <div class="p-3">
      <div class="d-flex gap-3 mb-2">
        <button @click="handleLike" class="btn-icon p-0 border-0 bg-transparent text-white">
          <AppIcon 
            name="heart" 
            :filled="post.is_liked" 
            :color="post.is_liked ? '#ed4956' : 'white'"
            size="24"
          />
        </button>
        <RouterLink :to="{ name: ROUTE_NAMES.POST_DETAILS, params: { postId: post.id } }" class="text-white">
          <AppIcon name="chat" size="24" />
        </RouterLink>
      </div>

      <!-- Curtidas -->
      <p class="fw-bold mb-1 small text-white">
        {{ (post.likes_count || 0).toLocaleString() }} curtidas
      </p>

      <!-- Legenda -->
      <p class="mb-1 small">
        <span class="fw-bold me-2">{{ post.user.username }}</span>
        <span class="text-white">{{ post.caption }}</span>
      </p>

      <!-- Contador de comentários -->
      <RouterLink 
        v-if="(post.comments_count || 0) > 0"
        :to="{ name: ROUTE_NAMES.POST_DETAILS, params: { postId: post.id } }" 
        class="text-grey text-decoration-none small d-block mb-1"
      >
        Ver todos os {{ post.comments_count }} comentários
      </RouterLink>

      <!-- Data -->
      <time class="text-grey text-uppercase extra-small d-block mb-3">
        {{ formatRelative(post.created_at) }}
      </time>

      <!-- Campo de comentário inline -->
      <form @submit.prevent="handleComment" class="comment-form d-flex border-top pt-3 mt-2">
        <input 
          v-model="commentBody"
          type="text" 
          placeholder="Adicione um comentário..." 
          class="form-control bg-transparent border-0 text-white small px-0 shadow-none"
          :disabled="isSubmitting"
        >
        <button 
          type="submit" 
          class="btn-post text-primary border-0 bg-transparent fw-bold small"
          :disabled="!commentBody.trim() || isSubmitting"
        >
          Publicar
        </button>
      </form>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  max-width: 470px;
  margin: 0 auto;
  border-color: var(--input-border) !important;
}

.avatar {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border: 1px solid var(--input-border);
}

.post-image-container {
  min-height: 470px;
  max-height: 587px;
  overflow: hidden;
}

.text-grey {
  color: var(--text-grey);
}

.extra-small {
  font-size: 0.65rem;
}

.btn-icon {
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 0.7;
}

.comment-form input::placeholder {
  color: var(--text-grey);
}

.btn-post {
  opacity: 1;
  transition: opacity 0.2s;
}

.btn-post:disabled {
  opacity: 0.3;
  cursor: default;
}
</style>
