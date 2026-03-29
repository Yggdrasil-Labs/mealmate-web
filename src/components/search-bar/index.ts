export {
  getSearchFieldComponent,
  registerDefaultSearchFieldComponents,
  registerSearchFieldComponent,
} from './search-bar-registry'
export { default as SearchBar } from './SearchBar.vue'
export { default as SearchBarField } from './SearchBarField.vue'

export type {
  SearchBarEmits,
  SearchBarExpose,
  SearchBarProps,
  SearchBarSearchPayload,
  SearchFieldSchema,
  SearchSerializedValues,
} from '@/types/search-bar'
