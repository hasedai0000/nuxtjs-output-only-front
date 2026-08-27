import { computed, ref } from 'vue'
import {
  fetchMeApi,
  loginApi,
  logoutApi,
  registerApi
} from '../apis/authApi'
import type { UserType } from '../types/user'

export const useAuthProvider = () => {
  const currentUser = ref<UserType | null>(null)
  const authError = ref<string | null>(null)
  const isInitialized = ref<boolean>(false)

  const isAuthenticated = computed<boolean>(() => currentUser.value !== null)

  /**
   * 初回起動時に /me を叩き、既存セッションがあれば currentUser を復元する。
   * middleware から呼ばれるため多重実行を防ぐ。
   */
  const initAuth = async (): Promise<void> => {
    if (isInitialized.value) return
    const user = await fetchMeApi()
    currentUser.value = user ?? null
    isInitialized.value = true
  }

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    authError.value = null
    const result = await loginApi(email, password)
    if (result && typeof result !== 'string') {
      currentUser.value = result
      return true
    }
    authError.value = 'メールアドレスまたはパスワードが正しくありません'
    return false
  }

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<boolean> => {
    authError.value = null
    const result = await registerApi(name, email, password, passwordConfirmation)
    if (result && typeof result !== 'string') {
      currentUser.value = result
      return true
    }
    authError.value = '登録に失敗しました。入力内容をご確認ください'
    return false
  }

  const handleLogout = async (): Promise<boolean> => {
    authError.value = null
    const result = await logoutApi()
    if (result === true) {
      currentUser.value = null
      return true
    }
    authError.value = 'ログアウトに失敗しました'
    return false
  }

  return {
    currentUser,
    isAuthenticated,
    authError,
    isInitialized,
    initAuth,
    handleLogin,
    handleRegister,
    handleLogout
  }
}
