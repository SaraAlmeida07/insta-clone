<template>
  <!-- Desktop Sidebar -->
  <aside class="d-none d-md-flex flex-column p-3 bg-white border-end sidebar vh-100 position-fixed">
    <div class="mb-5 px-2">
      <h1 class="h4">InstaClone</h1>
    </div>
    
    <nav class="nav nav-pills flex-column mb-auto">
      <RouterLink to="/feed" class="nav-link py-3 d-flex align-items-center mb-1" active-class="active-link">
        <i class="bi bi-house-door fs-4 me-3"></i>
        <span>Página inicial</span>
      </RouterLink>
      <RouterLink to="/descobrir" class="nav-link py-3 d-flex align-items-center mb-1" active-class="active-link">
        <i class="bi bi-compass fs-4 me-3"></i>
        <span>Explorar</span>
      </RouterLink>
      <RouterLink to="/criar" class="nav-link py-3 d-flex align-items-center mb-1" active-class="active-link">
        <i class="bi bi-plus-square fs-4 me-3"></i>
        <span>Criar</span>
      </RouterLink>
      <RouterLink to="/perfil" class="nav-link py-3 d-flex align-items-center mb-1" active-class="active-link">
        <i class="bi bi-person-circle fs-4 me-3"></i>
        <span>Perfil</span>
      </RouterLink>
    </nav>

    <div class="mt-auto">
      <button @click="handleLogout" class="btn btn-link nav-link py-3 d-flex align-items-center text-danger w-100 border-0">
        <i class="bi bi-box-arrow-right fs-4 me-3"></i>
        <span>Sair</span>
      </button>
    </div>
  </aside>

  <!-- Mobile Bottom Navbar -->
  <nav class="d-md-none fixed-bottom bg-white border-top d-flex justify-content-around p-2">
    <RouterLink to="/feed" class="text-dark" active-class="active-link">
      <i class="bi bi-house-door fs-3"></i>
    </RouterLink>
    <RouterLink to="/descobrir" class="text-dark" active-class="active-link">
      <i class="bi bi-compass fs-3"></i>
    </RouterLink>
    <RouterLink to="/criar" class="text-dark" active-class="active-link">
      <i class="bi bi-plus-square fs-3"></i>
    </RouterLink>
    <RouterLink to="/perfil" class="text-dark" active-class="active-link">
      <i class="bi bi-person-circle fs-3"></i>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    auth.logout()
  }
}
</script>

<style scoped>
.sidebar {
  width: 245px;
  z-index: 1000;
}

.nav-link {
  color: #262626;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.active-link {
  font-weight: bold;
}

.active-link i {
  -webkit-text-stroke: 1px black;
}
</style>
