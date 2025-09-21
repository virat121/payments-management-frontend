<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700">
      {{ label }}
      <span v-if="required" class="text-error-500 ml-1">*</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        :disabled="disabled"
        :required="required"
        class="block w-full px-4 py-3 pr-10 border rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer bg-white"
        style="background-image: none;"
        :class="{
          'border-gray-200 bg-white hover:border-gray-300': !error && !isFocused && !disabled,
          'border-primary-300 bg-primary-50': !error && isFocused && !disabled,
          'border-error-300 bg-error-50 focus:border-error-500 focus:ring-error-500': error,
          'bg-gray-50 cursor-not-allowed border-gray-200': disabled
        }"
      >
        <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Custom Dropdown Arrow -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDownIcon 
          class="h-5 w-5 transition-all duration-200"
          :class="{
            'text-gray-400': !error && !isFocused,
            'text-primary-500': !error && isFocused,
            'text-error-500': error,
            'rotate-180': isFocused
          }"
        />
      </div>
      
      <!-- Left Icon -->
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-gray-400" />
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
import { ChevronDownIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  options: (string | Option)[]
  label?: string
  placeholder?: string
  error?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  id?: string
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  required: false,
  id: () => `select-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const isFocused = ref(false)

const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'string') {
      return { value: option, label: option, disabled: false }
    }
    return { disabled: false, ...option }
  })
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}
</script>