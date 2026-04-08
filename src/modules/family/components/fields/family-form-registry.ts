import { registerDefaultFieldComponents, registerFieldComponent } from '@/components/pro-form'
import FamilyTagInputField from './FamilyTagInputField.vue'

let registered = false

export function ensureFamilyFormFieldComponents() {
  if (registered)
    return

  registerDefaultFieldComponents()
  registerFieldComponent('FamilyTagInput', FamilyTagInputField)

  registered = true
}
