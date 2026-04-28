<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProfileStore } from '@/stores/profile';
import { useAuthStore } from '@/stores/auth';
import { useFollowsStore } from '@/stores/follows';
import ProfileHeader from '@/components/profile/ProfileHeader.vue';
import ProfilePostGrid from '@/components/profile/ProfilePostGrid.vue';

const route = useRoute();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const followsStore = useFollowsStore();

const loadProfileData = async () => {
  const username = (route.query.user as string) || authStore.user?.username;
  
  if (username) {
    try {
      const userData = await profileStore.fetchProfile(username);
      
      if (userData?.id) {
        const promises: Promise<any>[] = [
          profileStore.fetchUserPosts(userData.id),
          profileStore.fetchFollowersCount(userData.id),
          profileStore.fetchFollowingCount(userData.id)
        ];

        if (userData.id !== authStore.user?.id) {
          promises.push(followsStore.checkIfFollowing(userData.id));
        }

        await Promise.all(promises);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil');
    }
  }
};

onMounted(loadProfileData);

watch(() => route.query.user, loadProfileData);
</script>

<template>
  <div class="profile-container py-4">
    <div v-if="profileStore.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    
    <div v-else-if="profileStore.user" class="profile-content">
      <!-- Topo do Perfil (Avatar, Bio, Botões, Contadores) -->
      <ProfileHeader />
      
      <hr class="my-4 border-secondary opacity-25">
      
      <!-- Grade de Posts -->
      <ProfilePostGrid />
    </div>
    
    <div v-else class="text-center py-5">
      <h3 class="text-muted">Usuário não encontrado</h3>
      <router-link to="/feed" class="btn btn-link">Voltar para o feed</router-link>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 935px;
  margin: 0 auto;
}
</style>
