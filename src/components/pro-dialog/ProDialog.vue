<script setup lang="ts">
import type {
  ProDialogBeforeCloseContext,
  ProDialogCloseReason,
  ProDialogEmits,
  ProDialogExpose,
  ProDialogProps,
  ProDialogSlotProps,
} from './types'
import { ElButton, ElDialog, ElScrollbar } from 'element-plus'
import { computed, onBeforeUnmount, useSlots, watch } from 'vue'
import {
  canCloseByReason,
  resolveConfirmButtonType,
  resolveDialogWidth,
  resolveFooterVisibility,
} from './pro-dialog.utils'

defineOptions({ name: 'ProDialog' })

const props = withDefaults(defineProps<ProDialogProps>(), {
  mode: 'custom',
  placement: 'center',
  showClose: true,
  maskClosable: true,
  escClosable: true,
  showFooter: true,
  loading: false,
  confirmLoading: false,
  confirmDisabled: false,
  confirmType: 'primary',
  closeOnConfirm: true,
  destroyOnClose: true,
  footerAlign: 'right',
})

const emit = defineEmits<ProDialogEmits>()

const slots = useSlots()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const hasHeaderExtras = computed(() => Boolean(slots['header-extra']))
const shouldRenderCustomHeader = computed(() => props.showClose || hasHeaderExtras.value)
const hasFooterSlot = computed(() => Boolean(slots.footer))
const footerVisible = computed(() => props.showFooter !== false)
const renderDefaultFooter = computed(() =>
  resolveFooterVisibility(hasFooterSlot.value, props.showFooter),
)
const confirmButtonType = computed(() => resolveConfirmButtonType(props.confirmType))
const resolvedWidth = computed(() => resolveDialogWidth(props.mode, props.width))
const bodyBusy = computed(() => props.loading || props.confirmLoading)
const confirmDisabled = computed(() =>
  props.confirmDisabled || props.confirmLoading || props.loading,
)

const dialogSlotProps = computed<ProDialogSlotProps>(() => ({
  close: handleClose,
  confirm: handleConfirm,
  loading: props.loading,
  confirmLoading: props.confirmLoading,
  confirmDisabled: confirmDisabled.value,
}))

let closeRequestToken = 0
let hasDocumentListeners = false

function syncDocumentListeners(visible: boolean) {
  if (typeof document === 'undefined')
    return

  if (visible && !hasDocumentListeners) {
    document.addEventListener('click', handleDocumentClick, true)
    document.addEventListener('keydown', handleDocumentKeydown, true)
    hasDocumentListeners = true
    return
  }

  if (!visible && hasDocumentListeners) {
    document.removeEventListener('click', handleDocumentClick, true)
    document.removeEventListener('keydown', handleDocumentKeydown, true)
    hasDocumentListeners = false
  }
}

function emitVisibilityChange(nextVisible: boolean) {
  dialogVisible.value = nextVisible
}

function finalizeClose(options: { emitCancel?: boolean } = {}) {
  if (options.emitCancel)
    emit('cancel')
  emitVisibilityChange(false)
}

async function attemptClose(
  reason: ProDialogCloseReason,
  options: { emitCancel?: boolean } = {},
) {
  if (!canCloseByReason(reason, props))
    return

  const token = ++closeRequestToken
  let committed = false

  const context: ProDialogBeforeCloseContext = {
    reason,
    close: () => {
      if (token !== closeRequestToken || committed)
        return
      committed = true
      finalizeClose(options)
    },
  }

  if (props.beforeClose) {
    const result = await props.beforeClose(reason, context)
    if (token !== closeRequestToken || committed)
      return
    if (result === false)
      return
  }

  if (token !== closeRequestToken || committed)
    return

  finalizeClose(options)
}

function handleClose() {
  void attemptClose('programmatic')
}

function handleCancel() {
  void attemptClose('cancel', { emitCancel: true })
}

function handleCloseIcon() {
  void attemptClose('close-icon')
}

function handleConfirm() {
  emit('confirm')
  if (props.closeOnConfirm !== false)
    void attemptClose('programmatic')
}

function handleDocumentClick(event: MouseEvent) {
  if (!props.modelValue)
    return

  const target = event.target
  if (!(target instanceof HTMLElement))
    return

  if (target.closest('.el-dialog'))
    return

  if (target.closest('.el-overlay'))
    void attemptClose('mask')
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (!props.modelValue || event.key !== 'Escape')
    return

  void attemptClose('esc')
}

watch(
  () => props.modelValue,
  (visible) => {
    syncDocumentListeners(visible)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  syncDocumentListeners(false)
})

defineExpose<ProDialogExpose>({
  open() {
    emitVisibilityChange(true)
  },
  close() {
    void attemptClose('programmatic')
  },
  toggle(force?: boolean) {
    const nextVisible = typeof force === 'boolean' ? force : !props.modelValue
    if (nextVisible)
      emitVisibilityChange(true)
    else
      void attemptClose('programmatic')
  },
})
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="title"
    :width="resolvedWidth"
    :show-close="false"
    :center="placement === 'center'"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :body-class="bodyClass"
    @open="emit('open')"
    @opened="emit('opened')"
    @close="emit('close')"
    @closed="emit('closed')"
  >
    <template
      v-if="shouldRenderCustomHeader"
      #header
    >
      <header class="dialog-header">
        <div class="dialog-header__main">
          <h2
            v-if="title"
            class="dialog-title"
            data-testid="dialog-title"
          >
            {{ title }}
          </h2>
          <slot name="header-extra" />
        </div>

        <button
          v-if="showClose"
          type="button"
          class="dialog-close"
          data-testid="dialog-close"
          aria-label="关闭"
          @click="handleCloseIcon"
        >
          ×
        </button>
      </header>
    </template>

    <template #default>
      <ElScrollbar
        class="dialog-body__scrollbar"
        wrap-class="dialog-body__scrollbar-wrap"
      >
        <section
          class="dialog-body"
          data-testid="dialog-body"
          :aria-busy="bodyBusy"
        >
          <slot
            name="body-prefix"
            v-bind="dialogSlotProps"
          />
          <div class="dialog-body__content">
            <slot v-bind="dialogSlotProps" />
          </div>
          <slot
            name="body-suffix"
            v-bind="dialogSlotProps"
          />
        </section>
      </ElScrollbar>
    </template>

    <template v-if="footerVisible" #footer>
      <footer
        class="dialog-footer"
        :class="[`dialog-footer--${footerAlign}`]"
        data-testid="dialog-footer"
      >
        <slot
          v-if="hasFooterSlot"
          name="footer"
          v-bind="dialogSlotProps"
        />
        <template v-else-if="renderDefaultFooter">
          <div class="dialog-footer__extra">
            <slot
              name="footer-extra"
              v-bind="dialogSlotProps"
            />
          </div>
          <div class="dialog-footer__actions">
            <ElButton
              data-testid="dialog-cancel"
              :disabled="loading"
              @click="handleCancel"
            >
              {{ cancelText || '取消' }}
            </ElButton>
            <ElButton
              data-testid="dialog-confirm"
              :type="confirmButtonType"
              :loading="confirmLoading"
              :disabled="confirmDisabled"
              @click="handleConfirm"
            >
              {{ confirmText || '确认' }}
            </ElButton>
          </div>
        </template>
      </footer>
    </template>
  </ElDialog>
</template>

<style scoped lang="scss">
.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.dialog-header__main {
  min-width: 0;
  flex: 1;
}

.dialog-title {
  margin: 0;
  color: var(--el-text-color-primary, #1f2937);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.dialog-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--el-text-color-regular, #6b7280);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.dialog-close:hover {
  background: rgb(0 0 0 / 6%);
}

.dialog-body__scrollbar {
  height: 100%;
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}

.dialog-body__content {
  min-height: 0;
}

.dialog-footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dialog-footer--left {
  justify-content: flex-start;
}

.dialog-footer--center {
  justify-content: center;
}

.dialog-footer--right {
  justify-content: flex-end;
}

.dialog-footer__extra {
  margin-right: auto;
}

.dialog-footer__actions {
  display: inline-flex;
  gap: 12px;
}
</style>
