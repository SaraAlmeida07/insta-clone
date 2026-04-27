<script setup lang="ts">
import { onMounted } from 'vue';
import { useFeedStore } from '@/stores/feed';
import PostCard from '@/components/post/PostCard.vue';

const feedStore = useFeedStore();

onMounted(async () => {
  try {
    // Só carrega se o feed estiver vazio (para evitar re-fetch ao voltar de outra aba)
    if (feedStore.postIds.length === 0) {
      await feedStore.fetchFeed();
    }
  } catch (error) {
    console.error('Erro ao inicializar o feed:', error);
  }
});

const handleLoadMore = () => {
  feedStore.loadMoreFeed();
};
</script>

<template>
  <div class="feed-container py-5 px-3">
    <!-- Lista de Posts -->
    <div class="posts-list">
      <template v-if="feedStore.loading && feedStore.postIds.length === 0">
        <!-- Skeleton / Loading State simplificado -->
        <div v-for="i in 3" :key="i" class="text-center text-grey mb-4">
          Carregando conteúdo incrível...
        </div>
      </template>

      <PostCard 
        v-for="post in feedStore.allPosts" 
        :key="post.id" 
        :post="post" 
      />

      <!-- Botão Carregar Mais -->
      <div v-if="feedStore.nextCursor" class="text-center mt-5 mb-5">
        <button 
          @click="handleLoadMore" 
          class="btn btn-outline-light btn-sm px-4 rounded-pill"
          :disabled="feedStore.loading"
        >
          <span v-if="feedStore.loading">Carregando...</span>
          <span v-else>Carregar mais</span>
        </button>
      </div>

      <!-- Fim do Feed -->
      <div v-if="!feedStore.nextCursor && feedStore.postIds.length > 0" class="text-center text-grey mt-5 mb-5 small">
        Você chegou ao fim! Siga mais pessoas para ver novas postagens.
      </div>
    </div>
  </div>
</template>

<style scoped>
.feed-container {
  max-width: 630px;
  margin: 0 auto;
}

.text-grey {
  color: var(--text-grey);
}

/* Centralizar os posts na main-content */
.posts-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
