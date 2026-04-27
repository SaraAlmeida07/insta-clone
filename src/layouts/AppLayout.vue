<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/router/routeNames';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await auth.logout();
};
</script>

<template>
  <div class="app-layout">
    <!-- Desktop Sidebar -->
    <aside class="desktop-sidebar d-none d-md-flex flex-column p-4">
      <div class="logo-section mb-5">
        <h1 class="instagram-logo fs-3">InstaClone</h1>
      </div>

      <nav class="flex-grow-1">
        <ul class="list-unstyled d-flex flex-column gap-4">
          <li>
            <RouterLink :to="{ name: ROUTE_NAMES.FEED }" class="nav-link-custom d-flex align-items-center gap-3">
              <i class="bi bi-house-door-fill fs-4"></i>
              <span class="nav-text">Página inicial</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: ROUTE_NAMES.DISCOVER }" class="nav-link-custom d-flex align-items-center gap-3">
              <i class="bi bi-search fs-4"></i>
              <span class="nav-text">Pesquisa</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: ROUTE_NAMES.CREATE }" class="nav-link-custom d-flex align-items-center gap-3">
              <i class="bi bi-plus-square fs-4"></i>
              <span class="nav-text">Criar</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="{ name: ROUTE_NAMES.PROFILE }" class="nav-link-custom d-flex align-items-center gap-3">
              <i class="bi bi-person-circle fs-4"></i>
              <span class="nav-text">Perfil</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="mt-auto">
        <button @click="handleLogout" class="btn-logout d-flex align-items-center gap-3 w-100">
          <i class="bi bi-box-arrow-right fs-4"></i>
          <span class="nav-text">Sair</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </Transition>
      </RouterView>
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="mobile-nav d-md-none fixed-bottom bg-black border-top border-secondary">
      <ul class="list-unstyled d-flex justify-content-around align-items-center mb-0 py-2">
        <li>
          <RouterLink :to="{ name: ROUTE_NAMES.FEED }" class="mobile-nav-link">
            <i class="bi bi-house-door-fill fs-3"></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: ROUTE_NAMES.DISCOVER }" class="mobile-nav-link">
            <i class="bi bi-search fs-3"></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: ROUTE_NAMES.CREATE }" class="mobile-nav-link">
            <i class="bi bi-plus-square fs-3"></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: ROUTE_NAMES.PROFILE }" class="mobile-nav-link">
            <i class="bi bi-person-circle fs-3"></i>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-black);
}

.desktop-sidebar {
  width: 245px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid var(--input-border);
  background-color: var(--bg-black);
  z-index: 1000;
}

.main-content {
  flex-grow: 1;
  margin-left: 245px;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding-bottom: 60px; /* Space for mobile nav */
  }
}

.nav-link-custom {
  color: var(--text-white);
  text-decoration: none;
  transition: transform 0.2s;
  padding: 12px;
  border-radius: 8px;
}

.nav-link-custom:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.nav-link-custom.router-link-active {
  font-weight: bold;
}

.btn-logout {
  background: none;
  border: none;
  color: var(--text-white);
  padding: 12px;
  cursor: pointer;
  text-align: left;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-nav {
  height: 60px;
  z-index: 1000;
}

.mobile-nav-link {
  color: var(--text-white);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
