<template>
  <div class="discover-container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h2 class="mb-4">Descobrir</h2>
        
        <div v-if="discoverStore.loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
        </div>

        <div v-else-if="discoverStore.suggestions.length === 0" class="text-center py-5 text-muted">
          Nenhuma sugestão encontrada no momento.
        </div>

        <div v-else class="suggestions-list">
          <AccountCard 
            v-for="user in discoverStore.suggestions" 
            :key="user.id"
            :user="user"
          />

          <!-- Botão Carregar Mais -->
          <div v-if="discoverStore.hasMore" class="text-center mt-5 mb-5">
            <button 
              @click="handleLoadMore" 
              class="btn btn-outline-primary btn-sm px-4 rounded-pill"
              :disabled="discoverStore.loading"
            >
              <span v-if="discoverStore.loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              <span v-if="discoverStore.loading">Carregando...</span>
              <span v-else>Carregar mais</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDiscoverStore } from '@/stores/discover';
import { useFollowsStore } from '@/stores/follows';
import { useAuthStore } from '@/stores/auth';
import AccountCard from '@/components/profile/AccountCard.vue';

const discoverStore = useDiscoverStore();
const followsStore = useFollowsStore();
const authStore = useAuthStore();

onMounted(async () => {
  // Carregamos as sugestões e a lista de quem seguimos em paralelo
  await Promise.all([
    discoverStore.fetchSuggestions(),
    authStore.user?.id ? followsStore.fetchFollowing(authStore.user.id) : Promise.resolve()
  ]);
});

const handleLoadMore = () => {
  discoverStore.loadMore();
};
</script>

<style scoped>
.discover-container {
  max-width: 100%;
}
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-2px);
}
</style>
