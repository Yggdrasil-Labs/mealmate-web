<script setup lang="ts">
import { ElButton } from 'element-plus'
import { computed, onMounted, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import FamilyMemberDeleteDialog from '@/modules/family/components/FamilyMemberDeleteDialog.vue'
import FamilyMemberDrawer from '@/modules/family/components/FamilyMemberDrawer.vue'
import FamilyMemberGrid from '@/modules/family/components/FamilyMemberGrid.vue'
import FamilyProfileHeader from '@/modules/family/components/FamilyProfileHeader.vue'
import { useFamilyMemberEditor } from '@/modules/family/composables/useFamilyMemberEditor'
import { useFamilyProfile } from '@/modules/family/composables/useFamilyProfile'

const profile = useFamilyProfile()
const editor = useFamilyMemberEditor()
const { t } = useI18n()

const drawerVisible = shallowRef(false)
const deleteDialogVisible = shallowRef(false)
const pendingDeleteName = shallowRef('')

const memberCount = computed(() => profile.memberList.value.length)

async function openAddDrawer() {
  editor.openAdd()
  drawerVisible.value = true
}

async function openEditDrawer(memberId: string) {
  drawerVisible.value = true
  await editor.openEdit(memberId)
}

async function handleDrawerSave() {
  await editor.save()
  drawerVisible.value = false
}

async function openDeleteDialog(memberId: string) {
  const member = profile.memberList.value.find(item => item.memberId === memberId)
  pendingDeleteName.value = member?.name ?? ''
  editor.selectMember(memberId)
  deleteDialogVisible.value = true
}

async function confirmDelete() {
  await editor.remove()
  deleteDialogVisible.value = false
  drawerVisible.value = false
}

onMounted(async () => {
  await profile.ready
})
</script>

<template>
  <section class="family-profile-page">
    <div class="family-profile-page__content">
      <div
        v-if="profile.loading.value"
        class="family-profile-page__state"
      >
        {{ t('status.loading') }}
      </div>

      <div
        v-else-if="profile.error.value"
        class="family-profile-page__state"
      >
        <p class="family-profile-page__state-copy">
          {{ profile.error.value.message }}
        </p>
        <ElButton
          type="primary"
          class="family-profile-page__state-button"
          @click="profile.retry()"
        >
          {{ t('message.retry') }}
        </ElButton>
      </div>

      <template v-else>
        <FamilyProfileHeader
          :summary="profile.familySummary.value"
          :member-count="memberCount"
          @add-member="openAddDrawer"
        />

        <FamilyMemberGrid
          :members="profile.memberList.value"
          @add-member="openAddDrawer"
          @edit-member="openEditDrawer"
          @delete-member="openDeleteDialog"
        />
      </template>
    </div>

    <FamilyMemberDrawer
      v-model="drawerVisible"
      :mode="editor.mode.value"
      :detail-loading="editor.loading.value"
      :basic-form="editor.basicForm"
      :preference-form="editor.preferenceForm"
      :is-baby-role="editor.basicForm.roleType === 'BABY'"
      @update:basic-form="Object.assign(editor.basicForm, $event)"
      @update:preference-form="Object.assign(editor.preferenceForm, $event)"
      @save="handleDrawerSave"
      @delete="deleteDialogVisible = true"
    />

    <FamilyMemberDeleteDialog
      v-model="deleteDialogVisible"
      :member-name="pendingDeleteName"
      @confirm="confirmDelete"
    />
  </section>
</template>

<style scoped>
.family-profile-page {
  min-height: 100%;
  padding: var(--space-6);
}

.family-profile-page__content {
  width: min(1120px, 100%);
  margin: 0 auto;
  display: grid;
  gap: var(--space-4);
}

.family-profile-page__state {
  display: grid;
  gap: var(--space-3);
  place-items: center;
  padding: var(--space-8);
  border-radius: var(--card-radius);
  background: var(--color-surface);
  border: var(--card-border);
  border-left: 3px solid var(--color-danger);
  background: var(--color-danger-soft);
}

.family-profile-page__state-copy {
  margin: 0;
  color: var(--color-text-secondary);
}

.family-profile-page__state-button {
  min-height: var(--btn-height-lg);
  border: none;
  border-radius: var(--btn-radius-pill);
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: #fff;
  font: inherit;
  cursor: pointer;
}

@media (max-width: 640px) {
  .family-profile-page {
    padding: var(--space-4);
  }
}
</style>
