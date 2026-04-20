<template>
  <div class="not-found">
    <h1>404 - Página não encontrada</h1>
    <p>Desculpe, a página que você está procurando não existe.</p>
    <router-link to="/">Voltar ao feed</router-link>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
}

a {
  color: #0095f6;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: #0074b9;
  }
}
</style>
