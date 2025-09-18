<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-white rounded-xl shadow-lg max-w-md w-full p-6"
            @click.stop
          >
            <div class="flex items-center mb-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3"
                :class="iconBgClass"
              >
                <component :is="iconComponent" class="w-6 h-6" :class="iconClass" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
            </div>
            
            <p class="text-gray-600 mb-6">
              {{ message }}
            </p>
            
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all hover:scale-105"
                :class="confirmButtonClass"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'

interface Props {
  isOpen: boolean
  title: string
  message: string
  type?: 'warning' | 'info' | 'success' | 'danger'
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'warning',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<Emits>()

const iconComponent = computed(() => {
  switch (props.type) {
    case 'info':
      return InformationCircleIcon
    case 'success':
      return CheckCircleIcon
    case 'danger':
    case 'warning':
    default:
      return ExclamationTriangleIcon
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'info':
      return 'text-blue-600'
    case 'success':
      return 'text-green-600'
    case 'danger':
      return 'text-red-600'
    case 'warning':
    default:
      return 'text-amber-600'
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'info':
      return 'bg-blue-100'
    case 'success':
      return 'bg-green-100'
    case 'danger':
      return 'bg-red-100'
    case 'warning':
    default:
      return 'bg-amber-100'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'info':
      return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    case 'success':
      return 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    case 'warning':
    default:
      return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
  }
})

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const handleBackdropClick = () => {
  emit('close')
}
</script>