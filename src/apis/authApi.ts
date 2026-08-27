import axios, { type AxiosResponse } from 'axios'
import { appBaseUrl, globalAxios, isAxiosError } from '@/apis/config'
import type { UserType } from '~/types/user'

/**
 * Sanctum SPA 認証の前段として XSRF-TOKEN / laravel-session Cookie を発行させる。
 * /sanctum/csrf-cookie は /api の外側にあるため、globalAxios ではなく
 * オリジン直下の絶対 URL に対して発火させる。
 */
export const fetchCsrfCookieApi = async (): Promise<boolean> => {
  try {
    await axios.get(`${appBaseUrl()}/sanctum/csrf-cookie`, {
      withCredentials: true
    })
    return true
  } catch (err) {
    if (isAxiosError(err)) return false
    throw err
  }
}

/**
 * ユーザー登録 (成功時はサーバー側で自動ログイン)
 */
export const registerApi = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<UserType | string | undefined> => {
  try {
    await fetchCsrfCookieApi()
    const { data }: AxiosResponse<UserType> = await globalAxios().post('/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation
    })
    return data
  } catch (err) {
    if (isAxiosError(err)) return err.code
  }
}

/**
 * ログイン
 */
export const loginApi = async (
  email: string,
  password: string
): Promise<UserType | string | undefined> => {
  try {
    await fetchCsrfCookieApi()
    const { data }: AxiosResponse<UserType> = await globalAxios().post('/login', {
      email,
      password
    })
    return data
  } catch (err) {
    if (isAxiosError(err)) return err.code
  }
}

/**
 * ログアウト
 */
export const logoutApi = async (): Promise<boolean | string> => {
  try {
    await globalAxios().post('/logout')
    return true
  } catch (err) {
    if (isAxiosError(err)) return err.code ?? 'ERR_UNKNOWN'
    throw err
  }
}

/**
 * ログイン中ユーザー取得 (未認証時は 401 → undefined)
 */
export const fetchMeApi = async (): Promise<UserType | undefined> => {
  try {
    const { data }: AxiosResponse<UserType> = await globalAxios().get('/me')
    return data
  } catch (err) {
    if (isAxiosError(err)) return undefined
    throw err
  }
}
