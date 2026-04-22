<template>
  <div class="auth-layout d-flex flex-column min-vh-100 bg-black text-white">
    <main class="flex-grow-1 d-flex align-items-center justify-content-center px-3">
      <div class="auth-card-container w-100" style="max-width: 350px;">
        <RouterView />
      </div>
    </main>
    
    <footer class="p-3 text-center">
      <div class="container" style="max-width: 350px;">
        <template v-if="isLoginPage">
          <RouterLink to="/cadastro" class="btn btn-outline-custom w-100 py-2">
            Criar nova conta
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-outline-custom w-100 py-2">
            Já tem uma conta? Entre
          </RouterLink>
        </template>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const isLoginPage = computed(() => route.name === 'login')
</script>

<style scoped>
.auth-layout {
  background-color: #000000 !important;
  width: 100%;
}

.btn-outline-custom {
  border: 1px solid #0095f6;
  color: #0095f6;
  background-color: transparent;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-outline-custom:hover {
  background-color: rgba(0, 149, 246, 0.1);
  color: #0095f6;
}
</style>
