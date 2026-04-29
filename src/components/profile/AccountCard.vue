<template>
  <div class="card mb-3 border-0 shadow-sm">
    <div class="card-body d-flex align-items-center">
      <router-link :to="profileLink" class="text-decoration-none d-flex align-items-center flex-grow-1 text-white">
        <img 
          :src="user.avatar" 
          alt="Avatar" 
          class="rounded-circle me-3"
          style="width: 50px; height: 50px; object-fit: cover;"
        />
        <div class="flex-grow-1">
          <h6 class="mb-0 fw-bold text-white">{{ user.username }}</h6>
          <small class="text-white-50">{{ user.name }}</small>
        </div>
      </router-link>
      
      <!-- Só mostra o botão se não for o próprio usuário logado -->
      <button 
        v-if="!isMe"
        @click="handleToggleFollow"
        class="btn btn-sm px-4 rounded-pill fw-bold"
        :class="isCurrentlyFollowing ? 'btn-outline-secondary' : 'btn-primary'"
        :disabled="followsStore.isPending(user.id)"
      >
        <span v-if="followsStore.isPending(user.id)" class="spinner-border spinner-border-sm me-1" role="status"></span>
        {{ isCurrentlyFollowing ? 'Seguindo' : 'Seguir' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useFollowsStore } from '@/stores/follows';

interface User {
  id: number;
  username: string;
  name: string;
  avatar: string;
}

const props = defineProps<{
  user: User;
}>();

const authStore = useAuthStore();
const followsStore = useFollowsStore();

const isMe = computed(() => authStore.user?.id === props.user.id);
const isCurrentlyFollowing = computed(() => followsStore.isFollowing(props.user.id));

const profileLink = computed(() => {
  if (isMe.value) {
    return { name: 'profile' };
  }
  return { name: 'profile', query: { user: props.user.username } };
});

const handleToggleFollow = async () => {
  if (isCurrentlyFollowing.value) {
    await followsStore.unfollow(props.user.id);
  } else {
    await followsStore.follow(props.user.id);
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-2px);
}
</style>
