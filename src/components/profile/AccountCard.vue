<template>
  <div class="card mb-3 border-0 shadow-sm">
    <div class="card-body d-flex align-items-center">
      <router-link :to="profileLink" class="text-decoration-none d-flex align-items-center flex-grow-1 text-dark">
        <img 
          :src="user.avatar" 
          alt="Avatar" 
          class="rounded-circle me-3"
          style="width: 50px; height: 50px; object-fit: cover;"
        />
        <div class="flex-grow-1">
          <h6 class="mb-0 fw-bold">{{ user.username }}</h6>
          <small class="text-muted">{{ user.name }}</small>
        </div>
      </router-link>
      
      <button 
        class="btn btn-sm px-4 rounded-pill fw-bold"
        :class="isFollowing ? 'btn-outline-secondary' : 'btn-primary'"
      >
        {{ isFollowing ? 'Seguindo' : 'Seguir' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

interface User {
  id: number;
  username: string;
  name: string;
  avatar: string;
}

const props = defineProps<{
  user: User;
  isFollowing: boolean;
}>();

const authStore = useAuthStore();

const profileLink = computed(() => {
  if (authStore.user?.id === props.user.id) {
    return { name: 'profile' };
  }
  return { name: 'profile', query: { user: props.user.username } };
});
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-2px);
}
</style>
