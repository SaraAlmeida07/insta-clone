<template>
  <div class="register-view text-center">
    <div class="mb-4 mt-4">
      <h1 class="instagram-logo">InstaClone</h1>
      <p class="text-muted fw-bold">Cadastre-se para ver fotos dos seus amigos.</p>
    </div>

    <form @submit.prevent="handleRegister" class="w-100">
      <div class="mb-2">
        <input 
          type="text" 
          class="form-control custom-input" 
          placeholder="Nome completo" 
          v-model="form.name" 
          required
        >
      </div>
      <div class="mb-2">
        <input 
          type="text" 
          class="form-control custom-input" 
          placeholder="Nome de usuário" 
          v-model="form.username" 
          required
        >
      </div>
      <div class="mb-2">
        <input 
          type="email" 
          class="form-control custom-input" 
          placeholder="E-mail" 
          v-model="form.email" 
          required
        >
      </div>
      <div class="mb-2">
        <input 
          type="password" 
          class="form-control custom-input" 
          placeholder="Senha" 
          v-model="form.password" 
          required
        >
      </div>
      <div class="mb-4">
        <input 
          type="password" 
          class="form-control custom-input" 
          placeholder="Confirmar senha" 
          v-model="form.password_confirmation" 
          required
        >
      </div>

      <button 
        type="submit" 
        class="btn btn-primary-custom w-100 mb-3" 
        :disabled="loading"
      >
        {{ loading ? 'Cadastrando...' : 'Cadastre-se' }}
      </button>

      <div v-if="error" class="alert alert-danger py-2 small bg-danger border-0 text-white">
        {{ error }}
      </div>

      <p class="text-muted small mt-3 px-3">
        Ao se cadastrar, você concorda com nossos Termos, Política de Privacidade e Política de Cookies.
      </p>
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
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await auth.register(form)
    router.push('/feed')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Erro ao criar conta. Verifique os dados informados.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-view {
  max-width: 350px;
  margin: 0 auto;
}

.instagram-logo {

  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
  color: #ffffff;
}

.custom-input {
  background-color: #121212 !important;
  border: 1px solid #363636 !important;
  color: #ffffff !important;
  border-radius: 8px;
  padding: 10px;
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

.text-muted {
  color: #8e8e8e !important;
  font-size: 0.9rem;
}
</style>
