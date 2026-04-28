<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { useFollowsStore } from '@/stores/follows';

const route = useRoute();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const followsStore = useFollowsStore();

const isMe = computed(() => profileStore.user?.id === authStore.user?.id);
const isFollowing = computed(() => profileStore.user ? followsStore.isFollowing(profileStore.user.id) : false);

const handleToggleFollow = async () => {
  if (!profileStore.user) return;
  
  if (isFollowing.value) {
    await followsStore.unfollow(profileStore.user.id);
  } else {
    await followsStore.follow(profileStore.user.id);
  }
  
  // Após seguir/deixar de seguir, atualizamos o contador de seguidores
  await profileStore.fetchFollowersCount(profileStore.user.id);
};
</script>

<template>
  <div v-if="profileStore.user" class="row mb-5 align-items-center">
    <!-- Avatar -->
    <div class="col-4 text-center">
      <img :src="profileStore.user.avatar" class="rounded-circle avatar-large shadow-sm">
    </div>
    
    <!-- Informações e Ações -->
    <div class="col-8">
      <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
        <h2 class="fw-light m-0">@{{ profileStore.user.username }}</h2>
        
        <!-- Botões de Ação -->
        <div v-if="isMe">
          <router-link to="/profile/edit" class="btn btn-secondary btn-sm px-3 fw-bold">
            Editar perfil
          </router-link>
        </div>
        <div v-else>
          <button 
            @click="handleToggleFollow"
            class="btn btn-sm px-4 fw-bold"
            :class="isFollowing ? 'btn-outline-secondary' : 'btn-primary'"
            :disabled="followsStore.isPending(profileStore.user.id)"
          >
            <span v-if="followsStore.isPending(profileStore.user.id)" class="spinner-border spinner-border-sm me-1" role="status"></span>
            {{ isFollowing ? 'Seguindo' : 'Seguir' }}
          </button>
        </div>
      </div>
      
      <!-- Contadores -->
      <div class="d-flex gap-4 mb-3">
        <span><strong>{{ profileStore.posts.length }}</strong> publicações</span>
        
        <router-link 
          :to="{ path: '/profile/list/followers', query: route.query }" 
          class="text-decoration-none text-reset cursor-pointer"
        >
          <strong>{{ profileStore.followersCount }}</strong> seguidores
        </router-link>

        <router-link 
          :to="{ path: '/profile/list/following', query: route.query }" 
          class="text-decoration-none text-reset cursor-pointer"
        >
          <strong>{{ profileStore.followingCount }}</strong> seguindo
        </router-link>
      </div>

      <!-- Nome e Bio -->
      <p class="fw-bold mb-0">{{ profileStore.user.name }}</p>
      <p v-if="profileStore.user.bio" class="mb-0 text-break whitespace-pre-wrap">{{ profileStore.user.bio }}</p>
    </div>
  </div>
</template>

<style scoped>
.avatar-large {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 1px solid var(--input-border);
}

.cursor-pointer {
  cursor: pointer;
}

@media (max-width: 768px) {
  .avatar-large {
    width: 80px;
    height: 80px;
  }
}
</style>
