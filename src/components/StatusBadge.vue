<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200',
      badgeClasses
    ]"
  >
    <span
      :class="[
        'w-1.5 h-1.5 rounded-full mr-1.5',
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
}

const props = withDefaults(defineProps<Props>(), {
  type: 'payment'
})

const badgeClasses = computed(() => {
  if (props.type === 'user') {
    return props.status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800'
  }

  // Payment status classes
  switch (props.status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800'
    case 'refunded':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const dotClasses = computed(() => {
  if (props.type === 'user') {
    return props.status === 'active'
      ? 'bg-green-400'
      : 'bg-gray-400'
  }

  // Payment status dot classes
  switch (props.status) {
    case 'completed':
      return 'bg-green-400'
    case 'pending':
      return 'bg-yellow-400'
    case 'failed':
      return 'bg-red-400'
    case 'cancelled':
      return 'bg-gray-400'
    case 'refunded':
      return 'bg-purple-400'
    default:
      return 'bg-gray-400'
  }
})

const displayText = computed(() => {
  return props.status.charAt(0).toUpperCase() + props.status.slice(1)
})
</script>