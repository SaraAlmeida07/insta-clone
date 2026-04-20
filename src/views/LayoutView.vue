<template>
  <div class="layout">
    <nav>
      <!-- Navbar aqui depois -->
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

nav {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e5e5e5;
  padding: 0.5rem;
}

main {
  flex: 1;
  max-width: 100%;
}
</style>
