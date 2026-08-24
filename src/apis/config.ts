import axios, { type AxiosError, type AxiosInstance } from 'axios'

let _client: AxiosInstance | null = null

/**
 * axios インスタンスを遅延生成して返す。
 * useRuntimeConfig() が Nuxt setup 文脈でしか呼べないため、
 * モジュール top-level ではなく最初のアクセス時に初期化する。
 */
export const globalAxios = (): AxiosInstance => {
  if (!_client) {
    const config = useRuntimeConfig()
    _client = axios.create({
      baseURL: config.public.apiBase,
      timeout: 1000,
      headers: {
        'Content-type': 'application/json'
      }
    })
  }
  return _client
}

export const isAxiosError = (error: unknown): error is AxiosError =>
  (error as AxiosError)?.isAxiosError
