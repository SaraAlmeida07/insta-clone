<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { PROFILE_LIMITS } from '@/stores/profileUtils';
import { useImageUpload } from '@/composables/useImageUpload';

const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();

const { 
  file, 
  previewUrl, 
  handleFileChange, 
  cleanup 
} = useImageUpload(PROFILE_LIMITS.AVATAR_MAX_SIZE);

// Estado do formulário
const form = ref({
  name: '',
  username: '',
  bio: ''
});

const errors = ref<Record<string, string[]>>({});
const saving = ref(false);
const avatarInput = ref<HTMLInputElement | null>(null);

// Inicializa o formulário com os dados do usuário logado
onMounted(() => {
  if (authStore.user) {
    form.value = {
      name: authStore.user.name || '',
      username: authStore.user.username || '',
      bio: authStore.user.bio || ''
    };
  }
});

// Validações básicas no cliente
const isFormValid = computed(() => {
  const { name, username, bio } = form.value;
  return (
    name.length > 0 && 
    name.length <= PROFILE_LIMITS.NAME_MAX &&
    username.length > 0 && 
    username.length <= PROFILE_LIMITS.USERNAME_MAX &&
    PROFILE_LIMITS.USERNAME_REGEX.test(username) &&
    bio.length <= PROFILE_LIMITS.BIO_MAX
  );
});

const handleAvatarClick = () => {
  avatarInput.value?.click();
};

const onAvatarChange = async (event: Event) => {
  handleFileChange(event);
  
  if (file.value) {
    try {
      saving.value = true;
      await profileStore.updateAvatar(file.value);
    } catch (err) {
      console.error('Erro ao atualizar avatar.');
    } finally {
      saving.value = false;
    }
  }
};

const handleSubmit = async () => {
  errors.value = {};
  saving.value = true;

  try {
    await profileStore.updateProfile(form.value);
    router.push({ name: 'profile' });
  } catch (err: any) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors;
    }
  } finally {
    saving.value = false;
  }
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="edit-profile-view py-4 px-3">
    <div class="edit-card mx-auto shadow-lg">
      
      <!-- Header com Botão Voltar -->
      <header class="d-flex align-items-start mb-4">
        <button @click="goBack" class="btn-back me-3 mt-1">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div>
          <h1 class="h3 fw-bold mb-1 text-white">Editar perfil</h1>
          <p class="text-secondary small mb-0">Atualize suas informações e como você se apresenta para o mundo.</p>
        </div>
      </header>

      <!-- Seção do Avatar -->
      <section class="avatar-section d-flex align-items-center mb-5 p-4 rounded-4">
        <div class="position-relative cursor-pointer" @click="handleAvatarClick">
          <div class="avatar-frame rounded-circle d-flex align-items-center justify-content-center">
            <img 
              v-if="previewUrl || authStore.user?.avatar"
              :src="previewUrl || authStore.user?.avatar" 
              class="rounded-circle avatar-img object-fit-cover"
              alt="Avatar"
            >
            <div class="avatar-overlay d-flex align-items-center justify-content-center rounded-circle">
              <i class="bi bi-camera fs-4"></i>
            </div>
          </div>
        </div>
        <div class="ms-4">
          <h6 class="fw-bold mb-1 text-white">@{{ authStore.user?.username }}</h6>
          <button 
            type="button" 
            class="btn btn-link text-primary p-0 fw-bold text-decoration-none small"
            @click="handleAvatarClick"
          >
            Alterar foto de perfil
          </button>
          <input 
            ref="avatarInput"
            type="file" 
            class="d-none" 
            accept="image/*"
            @change="onAvatarChange"
          >
        </div>
      </section>

      <!-- Formulário de Edição -->
      <form @submit.prevent="handleSubmit" class="edit-form">
        
        <!-- Campo: Nome -->
        <div class="form-group mb-4">
          <label class="label-muted fw-bold mb-2">NOME</label>
          <div class="input-wrapper d-flex align-items-center px-3 rounded-3" :class="{ 'has-error': errors.name }">
            <i class="bi bi-person text-secondary me-3"></i>
            <input 
              v-model="form.name"
              type="text" 
              class="custom-input flex-grow-1 py-3 text-white"
              placeholder="Seu nome"
              :maxlength="PROFILE_LIMITS.NAME_MAX"
            >
          </div>
          <div class="d-flex justify-content-between mt-1">
            <span class="error-msg small" v-if="errors.name">{{ errors.name[0] }}</span>
            <span class="counter-text ms-auto">{{ form.name.length }}/{{ PROFILE_LIMITS.NAME_MAX }}</span>
          </div>
        </div>

        <!-- Campo: Nome de Usuário -->
        <div class="form-group mb-4">
          <label class="label-muted fw-bold mb-2">NOME DE USUÁRIO</label>
          <div class="input-wrapper d-flex align-items-center px-3 rounded-3" :class="{ 'has-error': errors.username }">
            <i class="bi bi-at text-secondary me-3 fs-5"></i>
            <input 
              v-model="form.username"
              type="text" 
              class="custom-input flex-grow-1 py-3 text-white"
              placeholder="usuário"
              :maxlength="PROFILE_LIMITS.USERNAME_MAX"
            >
            <i v-if="form.username.length > 0 && !errors.username" class="bi bi-check-circle-fill text-success ms-2"></i>
          </div>
          <div class="d-flex justify-content-between mt-1">
            <span class="error-msg small" v-if="errors.username">{{ errors.username[0] }}</span>
            <span class="counter-text ms-auto">{{ form.username.length }}/{{ PROFILE_LIMITS.USERNAME_MAX }}</span>
          </div>
        </div>

        <!-- Campo: Bio -->
        <div class="form-group mb-5">
          <label class="label-muted fw-bold mb-2">BIO</label>
          <div class="input-wrapper p-3 rounded-3" :class="{ 'has-error': errors.bio }">
            <textarea 
              v-model="form.bio"
              class="custom-input w-100 text-white"
              rows="4"
              placeholder="Conte um pouco sobre você..."
              :maxlength="PROFILE_LIMITS.BIO_MAX"
            ></textarea>
          </div>
          <div class="d-flex justify-content-between mt-1">
            <span class="error-msg small" v-if="errors.bio">{{ errors.bio[0] }}</span>
            <span class="counter-text ms-auto">{{ form.bio?.length || 0 }}/{{ PROFILE_LIMITS.BIO_MAX }}</span>
          </div>
        </div>

        <!-- Botão Salvar -->
        <button 
          type="submit" 
          class="btn-save w-100 d-flex align-items-center justify-content-center rounded-3 fw-bold py-3"
          :disabled="!isFormValid || saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-hdd-fill me-2"></i>
          {{ saving ? 'Salvando...' : 'Salvar alterações' }}
        </button>

      </form>
    </div>
  </div>
</template>

<style scoped>
.edit-profile-view {
  background-color: var(--bg-black);
  min-height: 100vh;
}

.edit-card {
  max-width: 600px;
  background-color: var(--input-bg);
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid var(--input-border);
}

.btn-back {
  background-color: var(--input-border);
  border: none;
  color: var(--text-white);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.btn-back:hover {
  background-color: var(--text-grey);
}

/* Avatar Section */
.avatar-section {
  background-color: var(--bg-black);
  border: 1px solid var(--input-border);
}

.avatar-frame {
  width: 80px;
  height: 80px;
  border: 2px solid var(--input-border);
  background-color: var(--input-bg);
  position: relative;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  color: var(--text-white);
  opacity: 0.6;
}

/* Form Styles */
.label-muted {
  font-size: 0.75rem;
  color: var(--text-grey);
  letter-spacing: 0.05em;
}

.input-wrapper {
  background-color: var(--bg-black);
  border: 1px solid var(--input-border);
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
  border-color: var(--primary-blue);
}

.input-wrapper.has-error {
  border-color: #f85149; /* Mantido para erro específico, ou use uma nova variável se disponível */
}

.custom-input {
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
}

.custom-input::placeholder {
  color: var(--text-grey);
}

.counter-text {
  font-size: 0.75rem;
  color: var(--text-grey);
}

.error-msg {
  color: #f85149;
}

/* Button Save */
.btn-save {
  background-color: var(--primary-blue);
  color: var(--text-white);
  border: none;
  transition: opacity 0.2s;
}

.btn-save:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* General Utilities */
.cursor-pointer {
  cursor: pointer;
}

textarea.custom-input {
  resize: none;
}
</style>
