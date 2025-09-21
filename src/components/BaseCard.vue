<template>
  <div 
    :class="[
      'bg-white rounded-2xl shadow-soft border border-gray-100/50 transition-all duration-300',
      'hover:shadow-medium hover:border-gray-200/50 hover:-translate-y-0.5',
      'backdrop-blur-sm',
      paddingClass,
      variantClass
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  variant: 'default'
})

const paddingClass = computed(() => {
  const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  return paddingMap[props.padding]
})

const variantClass = computed(() => {
  const variantMap = {
    default: 'bg-white',
    elevated: 'bg-white shadow-large',
    outlined: 'bg-white border-2 border-gray-200 shadow-none',
    glass: 'bg-white/80 backdrop-blur-md border border-white/20'
  }
  return variantMap[props.variant]
})
</script>