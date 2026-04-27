<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  try {
    error.value = '';
    loading.value = true;
    console.log('Tentando logar com:', email.value);
    
    await auth.login({
      email: email.value,
      password: password.value
    });

    router.push('/feed');
  } catch (err) {
    console.error('Erro no login:', err);
    error.value = 'E-mail ou senha incorretos.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <div class="login-card p-4 text-center">
      <h1 class="instagram-logo mb-4 fs-2">InstaClone</h1>
      
      <form @submit.prevent="handleLogin">
        <div v-if="error" class="alert alert-danger py-2 small mb-3" role="alert">
          {{ error }}
        </div>

        <div class="mb-3">
          <input 
            v-model="email"
            type="email" 
            class="form-control custom-input" 
            placeholder="E-mail"
            required
            :disabled="loading"
          >
        </div>
        
        <div class="mb-3">
          <input 
            v-model="password"
            type="password" 
            class="form-control custom-input" 
            placeholder="Senha"
            required
            :disabled="loading"
          >
        </div>
        
        <button type="submit" class="btn btn-primary w-100 fw-bold" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="divider my-4">
        <span>OU</span>
      </div>

      <div class="register-link">
        <p class="mb-0 text-grey">
          Não tem uma conta? 
          <router-link to="/cadastro" class="text-primary fw-bold text-decoration-none">
            Cadastre-se
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: var(--bg-black);
}

.login-card {
  width: 100%;
  max-width: 350px;
  border: 1px solid var(--input-border);
  background-color: var(--bg-black);
}

.custom-input {
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--text-white);
  padding: 10px;
  font-size: 0.9rem;
}

.custom-input:focus {
  background-color: var(--input-bg);
  border-color: var(--text-grey);
  color: var(--text-white);
  box-shadow: none;
}

.custom-input::placeholder {
  color: var(--text-grey);
}

.btn-primary {
  background-color: var(--primary-blue);
  border: none;
  padding: 8px;
}

.btn-primary:hover {
  background-color: var(--secondary-blue);
}

.divider {
  display: flex;
  align-items: center;
  color: var(--text-grey);
  font-size: 0.8rem;
  font-weight: bold;
}

.divider::before, .divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--input-border);
}

.divider span {
  padding: 0 15px;
}

.text-grey {
  color: var(--text-grey);
  font-size: 0.9rem;
}
</style>
