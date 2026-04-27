<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useImageUpload } from '@/composables/useImageUpload';
import { useFeedStore } from '@/stores/feed';
import { ROUTE_NAMES } from '@/router/routeNames';

const router = useRouter();
const feedStore = useFeedStore();
const { file, previewUrl, error: uploadError, handleFileChange, cleanup } = useImageUpload();

const caption = ref('');
const isSubmitting = ref(false);
const serverError = ref('');
const MAX_CAPTION_LENGTH = 2200;

onUnmounted(() => {
  cleanup();
});

const handlePublish = async () => {
  if (!file.value || isSubmitting.value) return;

  try {
    isSubmitting.value = true;
    serverError.value = '';

    // Montamos o FormData para enviar o arquivo + texto
    const formData = new FormData();
    formData.append('image', file.value);
    formData.append('caption', caption.value);

    // Chamamos a store
    await feedStore.createPost(formData);

    // Sucesso! Voltamos para o Feed
    router.push({ name: ROUTE_NAMES.FEED });
  } catch (err: any) {
    console.error('Erro ao publicar:', err);
    serverError.value = err.response?.data?.message || 'Ocorreu um erro ao publicar. Tente novamente.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="create-post-container d-flex align-items-center justify-content-center p-4">
    <div class="create-card border rounded bg-black d-flex flex-column" :class="{ 'wide-card': previewUrl }">
      
      <!-- Cabeçalho -->
      <header class="border-bottom p-2 d-flex justify-content-between align-items-center">
        <button v-if="previewUrl" @click="cleanup" class="btn text-white small" :disabled="isSubmitting">Cancelar</button>
        <h2 class="text-white fs-6 fw-bold m-0 flex-grow-1 text-center">Criar nova publicação</h2>
        <button 
          v-if="previewUrl" 
          @click="handlePublish"
          class="btn text-primary fw-bold small"
          :disabled="!file || !caption.trim() || isSubmitting"
        >
          {{ isSubmitting ? 'Compartilhando...' : 'Compartilhar' }}
        </button>
      </header>

      <div class="flex-grow-1 d-flex flex-column flex-md-row position-relative overflow-hidden">
        
        <!-- Estado Inicial: Selecionar Arquivo -->
        <div v-if="!previewUrl" class="text-center p-5 w-100">
          <div class="upload-icon mb-3">
            <i class="bi bi-images fs-1 text-white"></i>
          </div>
          <h3 class="text-white fs-5 mb-4">Arraste as fotos e os vídeos aqui</h3>
          
          <input 
            type="file" 
            id="file-input"
            class="d-none"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            @change="handleFileChange"
          >
          <label for="file-input" class="btn btn-primary fw-bold px-4">
            Selecionar do computador
          </label>

          <p v-if="uploadError" class="text-danger small mt-3">{{ uploadError }}</p>
        </div>

        <!-- Estado de Preview: Imagem + Legenda -->
        <template v-else>
          <!-- Lado Esquerdo: Imagem -->
          <div class="preview-side bg-dark">
            <img :src="previewUrl" class="img-fluid w-100 h-100 object-fit-cover">
          </div>

          <!-- Lado Direito: Legenda -->
          <div class="caption-side p-3 border-start">
            <!-- Erro do Servidor -->
            <div v-if="serverError" class="alert alert-danger py-2 small mb-3">
              {{ serverError }}
            </div>

            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="user-avatar-placeholder"></div>
              <span class="text-white fw-bold small">Seu Perfil</span>
            </div>

            <textarea 
              v-model="caption"
              class="form-control bg-transparent border-0 text-white shadow-none px-0"
              placeholder="Escreva uma legenda..."
              rows="8"
              :maxlength="MAX_CAPTION_LENGTH"
              :disabled="isSubmitting"
            ></textarea>

            <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
              <i class="bi bi-emoji-smile text-grey fs-5"></i>
              <span class="text-grey extra-small">
                {{ caption.length }} / {{ MAX_CAPTION_LENGTH }}
              </span>
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<style scoped>
.create-post-container {
  min-height: 80vh;
}

.create-card {
  width: 100%;
  max-width: 500px;
  height: 500px;
  border-color: var(--input-border) !important;
  transition: max-width 0.3s ease;
}

.wide-card {
  max-width: 800px;
}

.preview-side {
  flex: 1.5;
  background-color: #000;
}

.caption-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-black);
}

.user-avatar-placeholder {
  width: 28px;
  height: 28px;
  background-color: #262626;
  border-radius: 50%;
}

.text-grey {
  color: var(--text-grey);
}

.extra-small {
  font-size: 0.7rem;
}

.object-fit-cover {
  object-fit: cover;
}

textarea {
  resize: none;
}

textarea::placeholder {
  color: var(--text-grey);
}

.btn:disabled {
  opacity: 0.3;
}
</style>
