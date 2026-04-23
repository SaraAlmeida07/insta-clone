<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');

const handleRegister = () => {
  console.log('Registering:', {
    name: name.value,
    username: username.value,
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value
  });
  // Aqui futuramente chamaremos a API
};

const goToLogin = () => {
  router.push('/');
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="logo-section">
        <h1 class="instagram-logo">InstaClone</h1>
        <p class="subtitle">Cadastre-se para ver fotos e vídeos dos seus amigos.</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="input-group">
          <input 
            type="email" 
            v-model="email" 
            placeholder="Email" 
            required
            id="email"
          >
        </div>

        <div class="input-group">
          <input 
            type="text" 
            v-model="name" 
            placeholder="Nome completo" 
            required
            id="name"
          >
        </div>

        <div class="input-group">
          <input 
            type="text" 
            v-model="username" 
            placeholder="Nome de usuário" 
            required
            id="username"
          >
        </div>

        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            placeholder="Senha" 
            required
            id="password"
          >
        </div>

        <div class="input-group">
          <input 
            type="password" 
            v-model="password_confirmation" 
            placeholder="Confirme a senha" 
            required
            id="password_confirmation"
          >
        </div>

        <button type="submit" class="btn-register">Cadastre-se</button>
      </form>

      <div class="terms">
        Ao se cadastrar, você concorda com nossos Termos, Política de Privacidade e Política de Cookies.
      </div>
    </div>

    <div class="login-redirect-card">
      <p>Tem uma conta? <a @click="goToLogin" href="javascript:void(0)">Conecte-se</a></p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background-color: var(--bg-black);
}

.register-card {
  background-color: var(--bg-black);
  border: 1px solid var(--input-border);
  padding: 40px 20px;
  width: 100%;
  max-width: 350px;
  text-align: center;
  margin-bottom: 10px;
}

.logo-section {
  margin-bottom: 30px;
}

.instagram-logo {
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: -1px;
}

.subtitle {
  color: var(--text-grey);
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.4;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 3px;
  color: var(--text-white);
  font-size: 0.85rem;
}

.input-group input:focus {
  border-color: var(--text-grey);
  outline: none;
}

.btn-register {
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-register:hover {
  opacity: 0.9;
}

.terms {
  color: var(--text-grey);
  font-size: 0.75rem;
  margin-top: 20px;
  line-height: 1.3;
}

.login-redirect-card {
  background-color: var(--bg-black);
  border: 1px solid var(--input-border);
  padding: 20px;
  width: 100%;
  max-width: 350px;
  text-align: center;
}

.login-redirect-card p {
  margin: 0;
  font-size: 0.9rem;
}

.login-redirect-card a {
  color: var(--primary-blue);
  text-decoration: none;
  font-weight: 600;
}
</style>
