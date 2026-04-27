<template>
  <div class="auth-layout">
    <main>
      <RouterView />
    </main>
    
    <footer class="auth-footer mt-5 pb-5">
      <div class="container text-center">
        <nav class="d-flex flex-wrap justify-content-center gap-3 mb-3">
          <a href="#" class="text-decoration-none text-grey small">Meta</a>
          <a href="#" class="text-decoration-none text-grey small">Sobre</a>
          <a href="#" class="text-decoration-none text-grey small">Blog</a>
          <a href="#" class="text-decoration-none text-grey small">Carreiras</a>
          <a href="#" class="text-decoration-none text-grey small">Ajuda</a>
          <a href="#" class="text-decoration-none text-grey small">API</a>
          <a href="#" class="text-decoration-none text-grey small">Privacidade</a>
          <a href="#" class="text-decoration-none text-grey small">Termos</a>
          <a href="#" class="text-decoration-none text-grey small">Localizações</a>
          <a href="#" class="text-decoration-none text-grey small">Instagram Lite</a>
          <a href="#" class="text-decoration-none text-grey small">Threads</a>
        </nav>
        <div class="text-grey small">
          © 2026 InstaClone da Sara Almeida
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: var(--bg-black);
}

.text-grey {
  color: var(--text-grey);
}

.small {
  font-size: 0.75rem;
}
</style>
