<template>
  <div>
    <h1>Feed</h1>
    <p>Bem-vindo, {{ auth.user?.name }}!</p>
    <button @click="auth.logout" class="btn btn-outline-danger btn-sm">Sair</button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
