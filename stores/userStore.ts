'use client'
import { create } from 'zustand'

interface UiState {
  preferredLanguage: string
  preferredCurrency: string
}

interface UiActions {
  setLanguage: (lang: string) => void
  setCurrency: (currency: string) => void
}

export const useUserPrefsStore = create<UiState & UiActions>((set) => ({
  preferredLanguage: 'es',
  preferredCurrency: 'USD',
  setLanguage: (lang) => set({ preferredLanguage: lang }),
  setCurrency: (currency) => set({ preferredCurrency: currency }),
}))
