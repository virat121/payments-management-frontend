<template>
  <div class="overflow-hidden bg-white shadow-md rounded-xl">
    <div v-if="title || $slots.header" class="px-6 py-4 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <slot name="header"></slot>
      </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors duration-200' : ''
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <div v-if="column.sortable" class="flex flex-col">
                  <svg
                    :class="[
                      'w-3 h-3 transition-colors duration-200',
                      sortKey === column.key && sortOrder === 'asc' ? 'text-blue-600' : 'text-gray-400'
                    ]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg
                    :class="[
                      'w-3 h-3 -mt-1 transition-colors duration-200',
                      sortKey === column.key && sortOrder === 'desc' ? 'text-blue-600' : 'text-gray-400'
                    ]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(item, index) in sortedData"
            :key="getRowKey(item, index)"
            class="hover:bg-gray-50 transition-colors duration-200"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="getNestedValue(item, column.key)"
                :index="index"
              >
                {{ getNestedValue(item, column.key) }}
              </slot>
            </td>
          </tr>
          <tr v-if="!data.length">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
              <div class="flex flex-col items-center space-y-2">
                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                </svg>
                <span>{{ emptyMessage }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface Props {
  data: any[]
  columns: Column[]
  title?: string
  emptyMessage?: string
  rowKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: 'No data available',
  rowKey: 'id'
})

const emit = defineEmits<{
  'sort': [key: string, order: 'asc' | 'desc']
}>()

const sortKey = ref<string>('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedData = computed(() => {
  if (!sortKey.value) return props.data
  
  return [...props.data].sort((a, b) => {
    const aValue = getNestedValue(a, sortKey.value)
    const bValue = getNestedValue(b, sortKey.value)
    
    if (aValue === bValue) return 0
    
    const comparison = aValue < bValue ? -1 : 1
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  
  emit('sort', key, sortOrder.value)
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const getRowKey = (item: any, index: number) => {
  return getNestedValue(item, props.rowKey) || index
}
</script>