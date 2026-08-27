import { defineStore } from 'pinia'
import {
  fetchMeApi,
  loginApi,
  logoutApi,
  registerApi
} from '../apis/authApi'
import type { UserType } from '../types/user'

type AuthState = {
  currentUser: UserType | null
  authError: string | null
  isInitialized: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    currentUser: null,
    authError: null,
    isInitialized: false
  }),
  getters: {
    isAuthenticated: (state): boolean => state.currentUser !== null
  },
  actions: {
    /**
     * 起動時に /me を叩き既存セッションを復元する。
     * middleware から都度呼ばれるため多重実行を防ぐ。
     */
    async initAuth(): Promise<void> {
      if (this.isInitialized) return
      const user = await fetchMeApi()
      this.currentUser = user ?? null
      this.isInitialized = true
    },

    async login(email: string, password: string): Promise<boolean> {
      this.authError = null
      const result = await loginApi(email, password)
      if (result && typeof result !== 'string') {
        this.currentUser = result
        return true
      }
      this.authError = 'メールアドレスまたはパスワードが正しくありません'
      return false
    },

    async register(
      name: string,
      email: string,
      password: string,
      passwordConfirmation: string
    ): Promise<boolean> {
      this.authError = null
      const result = await registerApi(name, email, password, passwordConfirmation)
      if (result && typeof result !== 'string') {
        this.currentUser = result
        return true
      }
      this.authError = '登録に失敗しました。入力内容をご確認ください'
      return false
    },

    async logout(): Promise<boolean> {
      this.authError = null
      const result = await logoutApi()
      if (result === true) {
        this.currentUser = null
        return true
      }
      this.authError = 'ログアウトに失敗しました'
      return false
    }
  }
})
