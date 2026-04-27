import { ref } from 'vue';

/**
 * Composable para gerenciar upload de imagens (preview, limpeza, validação).
 */
export function useImageUpload(maxSize = 5 * 1024 * 1024) {
  const file = ref<File | null>(null);
  const previewUrl = ref<string | null>(null);
  const error = ref<string | null>(null);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files?.[0];

    if (!selectedFile) return;

    // Reset
    error.value = null;
    cleanup();

    // Validação de tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      error.value = 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP.';
      return;
    }

    // Validação de tamanho
    if (selectedFile.size > maxSize) {
      error.value = `Arquivo muito grande. O limite é ${Math.round(maxSize / (1024 * 1024))}MB.`;
      return;
    }

    file.value = selectedFile;
    previewUrl.value = URL.createObjectURL(selectedFile);
  };

  const cleanup = () => {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value);
    }
    file.value = null;
    previewUrl.value = null;
  };

  return {
    file,
    previewUrl,
    error,
    handleFileChange,
    cleanup
  };
}
