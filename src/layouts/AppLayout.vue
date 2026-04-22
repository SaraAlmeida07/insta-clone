<template>
  <div class="app-container">
    <NavBar />
    
    <main class="main-content">
      <div class="container py-4">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/common/NavBar.vue'
</script>

<style scoped>
.app-container {
  display: flex;
}

.main-content {
  flex: 1;
  min-height: 100vh;
}

/* Desktop layout: adjust for sidebar */
@media (min-width: 768px) {
  .main-content {
    margin-left: 245px;
  }
}

/* Mobile layout: adjust for bottom navbar */
@media (max-width: 767.98px) {
  .main-content {
    padding-bottom: 60px;
  }
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
