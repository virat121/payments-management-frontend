<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
      'border border-opacity-20 shadow-sm hover:shadow-md',
      badgeClasses
    ]"
  >
    <span
      :class="[
        'w-2 h-2 rounded-full mr-2 animate-pulse-soft',
        dotClasses
      ]"
    ></span>
    {{ displayText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: string
  type?: 'payment' | 'user'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'payment',
  size: 'md'
})

const badgeClasses = computed(() => {
  
  if (props.type === 'user') {
    return props.status === 'active'
      ? 'bg-success-50 text-success-700 border-success-200'
      : 'bg-gray-50 text-gray-600 border-gray-200'
  }

  // Payment status classes with new color scheme
  switch (props.status) {
    case 'completed':
      return 'bg-success-50 text-success-700 border-success-200 shadow-glow-success'
    case 'pending':
      return 'bg-warning-50 text-warning-700 border-warning-200 shadow-glow-warning'
    case 'failed':
      return 'bg-error-50 text-error-700 border-error-200 shadow-glow-error'
    case 'cancelled':
      return 'bg-gray-50 text-gray-600 border-gray-200'
    case 'refunded':
      return 'bg-accent-50 text-accent-700 border-accent-200'
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200'
  }
})

const dotClasses = computed(() => {
  if (props.type === 'user') {
    return props.status === 'active'
      ? 'bg-success-500'
      : 'bg-gray-400'
  }

  // Payment status dot classes with new colors
  switch (props.status) {
    case 'completed':
      return 'bg-success-500'
    case 'pending':
      return 'bg-warning-500'
    case 'failed':
      return 'bg-error-500'
    case 'cancelled':
      return 'bg-gray-400'
    case 'refunded':
      return 'bg-accent-500'
    default:
      return 'bg-gray-400'
  }
})

const displayText = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})
</script>