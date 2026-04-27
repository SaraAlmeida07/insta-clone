<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  filled?: boolean;
  size?: number | string;
  color?: string;
}>();

/**
 * Mapeia nomes amigáveis para classes do Bootstrap Icons.
 * Se 'filled' for true, tenta pegar a versão '-fill' do ícone.
 */
const iconClass = computed(() => {
  const isFillable = ['heart', 'house-door', 'chat', 'send', 'bookmark', 'person-circle'].includes(props.name);
  
  if (props.filled && isFillable) {
    return `bi bi-${props.name}-fill`;
  }
  
  return `bi bi-${props.name}`;
});

const style = computed(() => ({
  fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color || 'currentColor'
}));
</script>

<template>
  <i :class="iconClass" :style="style"></i>
</template>

<style scoped>
i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease;
}

i:active {
  transform: scale(1.2);
}
</style>
