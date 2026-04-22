<template>
  <div class="login-view text-center">
    <!-- Logo -->
    <div class="mb-5 mt-4">
      <h1 class="instagram-logo">InstaClone</h1>
    </div>

    <form @submit.prevent="handleLogin" class="w-100">
      <div class="mb-3">
        <input 
          type="email" 
          class="form-control custom-input" 
          placeholder="E-mail" 
          v-model="form.email" 
          required
        >
      </div>
      <div class="mb-3">
        <input 
          type="password" 
          class="form-control custom-input" 
          placeholder="Senha" 
          v-model="form.password" 
          required
        >
      </div>
      
      <button 
        type="submit" 
        class="btn btn-primary-custom w-100 mb-4" 
        :disabled="loading"
      >
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <div class="mb-3">
        <a href="#" class="forgot-password">Esqueceu a senha?</a>
      </div>

      <div v-if="error" class="alert alert-danger py-2 small bg-danger border-0 text-white mt-3">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form)
    router.push('/feed')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  max-width: 350px;
  margin: 0 auto;
}

.instagram-logo {

  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Placeholder for a script font if available */
  font-weight: bold;
  font-size: 2.5rem;
  color: #ffffff;
}

.custom-input {
  background-color: #121212 !important;
  border: 1px solid #363636 !important;
  color: #ffffff !important;
  border-radius: 8px;
  padding: 12px;
}

.custom-input::placeholder {
  color: #8e8e8e;
}

.custom-input:focus {
  border-color: #555555 !important;
  box-shadow: none;
}

.btn-primary-custom {
  background-color: #0095f6;
  border: none;
  color: white;
  font-weight: 700;
  border-radius: 8px;
  padding: 10px;
}

.btn-primary-custom:hover {
  background-color: #1877f2;
}

.btn-primary-custom:disabled {
  background-color: #0095f6;
  opacity: 0.7;
}

.forgot-password {
  color: #ffffff;
  text-decoration: none;
  font-size: 0.85rem;
}

.forgot-password:hover {
  color: #dbdbdb;
}
</style>
