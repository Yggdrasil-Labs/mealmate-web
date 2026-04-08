import type { FamilyMemberSummary, FamilySummary } from './types'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { fetchFamilyMembers, fetchFamilySummary } from './api'
import { DEFAULT_FAMILY_ID } from './constants'

export const useFamilyStore = defineStore('family', () => {
  const activeFamilyId = shallowRef(DEFAULT_FAMILY_ID)
  const familySummary = ref<FamilySummary | null>(null)
  const memberList = ref<FamilyMemberSummary[]>([])
  const loading = shallowRef(false)

  async function fetchFamilySummaryAction() {
    loading.value = true
    try {
      const summary = await fetchFamilySummary(activeFamilyId.value)
      familySummary.value = summary
      return summary
    }
    finally {
      loading.value = false
    }
  }

  async function fetchFamilyMembersAction() {
    loading.value = true
    try {
      const members = await fetchFamilyMembers(activeFamilyId.value)
      memberList.value = members
      return members
    }
    finally {
      loading.value = false
    }
  }

  async function refreshFamilyProfile() {
    loading.value = true
    try {
      const [summary, members] = await Promise.all([
        fetchFamilySummary(activeFamilyId.value),
        fetchFamilyMembers(activeFamilyId.value),
      ])

      familySummary.value = summary
      memberList.value = members

      return {
        summary,
        members,
      }
    }
    finally {
      loading.value = false
    }
  }

  function clearFamilyProfile() {
    familySummary.value = null
    memberList.value = []
  }

  return {
    activeFamilyId,
    familySummary,
    memberList,
    loading,
    clearFamilyProfile,
    fetchFamilySummary: fetchFamilySummaryAction,
    fetchFamilyMembers: fetchFamilyMembersAction,
    refreshFamilyProfile,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useFamilyStore, import.meta.hot))
