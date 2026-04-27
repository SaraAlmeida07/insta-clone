<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/');
};
</script>

<template>
  <div class="container mt-5 text-white">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <h1 class="instagram-logo mb-4">Bem-vindo ao InstaClone!</h1>
        <p class="lead">Olá, <strong>{{ auth.user?.name }}</strong> (@{{ auth.user?.username }})</p>
        <p>Você está logado com sucesso. Este é o seu feed (em construção).</p>
        
        <hr class="bg-secondary my-4">
        
        <button @click="handleLogout" class="btn btn-outline-danger">
          <i class="bi bi-box-arrow-right"></i> Sair
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.instagram-logo {
  font-size: 3rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
