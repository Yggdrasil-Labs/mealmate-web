<script setup lang="ts">
import { ElInput, ElTag } from 'element-plus'

defineOptions({ name: 'FamilyTagInputField' })

const props = defineProps<{
  disabled?: boolean
  readonly?: boolean
  inputAttrs?: Record<string, unknown>
}>()

const model = defineModel<string[]>({ default: [] })

const draft = ref('')

function commitDraft(value = draft.value) {
  const tokens = value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

  if (!tokens.length)
    return

  model.value = [...model.value, ...tokens]
  draft.value = ''
}

function handleKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly)
    return

  draft.value = (event.target as HTMLInputElement).value

  if (event.key !== 'Enter' && event.key !== ',')
    return

  event.preventDefault()
  commitDraft()
}

function removeTag(tag: string) {
  if (props.disabled || props.readonly)
    return

  model.value = model.value.filter(item => item !== tag)
}
</script>

<template>
  <div class="family-tag-input">
    <ElInput
      v-model="draft"
      :disabled="disabled"
      :readonly="readonly"
      class="family-tag-input__control"
      v-bind="inputAttrs"
      @blur="commitDraft()"
      @keydown="(event: Event | KeyboardEvent) => handleKeydown(event as KeyboardEvent)"
    />

    <div class="family-tag-input__tags">
      <ElTag
        v-for="tag in model"
        :key="tag"
        class="family-tag-input__tag"
        :closable="!(disabled || readonly)"
        @close="removeTag(tag)"
      >
        {{ tag }}
      </ElTag>
    </div>
  </div>
</template>

<style scoped>
.family-tag-input {
  display: grid;
  gap: 0.5rem;
  width: 100%;
}

.family-tag-input__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.family-tag-input__tag {
  margin-right: 0.25rem;
}

.family-tag-input__control {
  width: 100%;
}
</style>
