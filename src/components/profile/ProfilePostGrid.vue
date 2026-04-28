<script setup lang="ts">
import { useProfileStore } from '@/stores/profile';

const profileStore = useProfileStore();
</script>

<template>
  <div class="profile-post-grid">
    <div v-if="profileStore.posts.length > 0" class="row g-1 g-md-3">
      <div v-for="post in profileStore.posts" :key="post.id" class="col-4">
        <!-- Link para os detalhes do post (Item 108) -->
        <router-link 
          :to="`/posts/${post.id}`" 
          class="ratio ratio-1x1 bg-dark post-thumbnail d-block"
        >
          <img 
            :src="post.image_url" 
            class="object-fit-cover rounded" 
            :alt="post.caption"
          >
          
          <!-- Overlay de hover (estilo instagram) -->
          <div class="post-overlay d-flex align-items-center justify-content-center">
            <div class="text-white">
              <i class="bi bi-heart-fill me-2"></i> {{ post.likes_count || 0 }}
              <i class="bi bi-chat-fill ms-3 me-2"></i> {{ post.comments_count || 0 }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
    
    <div v-else class="text-center py-5 text-muted">
      <i class="bi bi-camera fs-1 d-block mb-2"></i>
      <p>Ainda não há publicações.</p>
    </div>
  </div>
</template>

<style scoped>
.post-thumbnail {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.post-thumbnail:hover .post-overlay {
  opacity: 1;
}

.object-fit-cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .post-overlay {
    display: none !important; /* Esconde overlay em mobile para melhor performance */
  }
}
</style>
