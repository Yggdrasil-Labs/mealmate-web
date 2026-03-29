import type {
  ProDialogCloseReason,
  ProDialogConfirmType,
  ProDialogProps,
} from './types'

function hasOwnDefined(value: boolean | undefined, fallback = true) {
  return value ?? fallback
}

export function canCloseByReason(
  reason: ProDialogCloseReason,
  props: Pick<ProDialogProps, 'maskClosable' | 'escClosable'>,
): boolean {
  if (reason === 'mask')
    return hasOwnDefined(props.maskClosable)
  if (reason === 'esc')
    return hasOwnDefined(props.escClosable)
  return true
}

export function resolveFooterVisibility(
  hasFooterSlot: boolean,
  showFooter?: boolean,
): boolean {
  if (hasFooterSlot)
    return false
  if (showFooter === false)
    return false
  return true
}

export function resolveDialogWidth(
  mode: ProDialogProps['mode'],
  width?: ProDialogProps['width'],
) {
  if (width !== undefined)
    return width
  return mode === 'confirm' ? 480 : undefined
}

export function resolveConfirmButtonType(confirmType?: ProDialogConfirmType): ProDialogConfirmType {
  return confirmType === 'danger' ? 'danger' : 'primary'
}
