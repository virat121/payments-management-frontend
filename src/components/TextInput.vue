<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700">
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        class="block w-full px-4 py-3 border rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm font-medium"
        :class="{
          'border-gray-200 bg-white hover:border-gray-300': !error && !isFocused && !disabled,
          'border-primary-300 bg-primary-50': !error && isFocused && !disabled,
          'border-error-300 bg-error-50 focus:border-error-500 focus:ring-error-500': error,
          'bg-gray-50 cursor-not-allowed border-gray-200': disabled,
          'pr-12': error || type === 'password',
          'pl-10': icon
        }"
      />
      
      <!-- Left Icon -->
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-gray-400" />
      </div>
      
      <!-- Right Icons -->
      <div class="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
        <!-- Error Icon -->
        <ExclamationCircleIcon v-if="error" class="h-5 w-5 text-error-500" />
        <!-- Success Icon -->
        <CheckCircleIcon v-else-if="isValid && modelValue" class="h-5 w-5 text-success-500" />
        <!-- Password Toggle -->
        <button
          v-else-if="type === 'password'"
          type="button"
          @click="togglePasswordVisibility"
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <EyeIcon v-if="!showPassword" class="h-5 w-5" />
          <EyeSlashIcon v-else class="h-5 w-5" />
        </button>
      </div>
    </div>
    
    <!-- Error Message -->
    <p v-if="error" class="text-sm text-error-600 font-medium flex items-center">
      <ExclamationTriangleIcon class="h-4 w-4 mr-1 flex-shrink-0" />
      {{ error }}
    </p>
    
    <!-- Helper Text -->
    <p v-else-if="helperText" class="text-sm text-gray-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  ExclamationCircleIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/24/outline'

interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  min?: string | number
  max?: string | number
  step?: string | number
  id?: string
  icon?: any
  isValid?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  required: false,
  isValid: false,
  id: () => `input-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const isFocused = ref(false)
const showPassword = ref(false)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? parseFloat(target.value) || 0 : target.value
  emit('update:modelValue', value)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// Computed property for input type (for password toggle)
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>