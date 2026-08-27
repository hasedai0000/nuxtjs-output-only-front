import axios, { type AxiosError, type AxiosInstance } from 'axios'

let _client: AxiosInstance | null = null

/**
 * axios インスタンスを遅延生成して返す。
 * useRuntimeConfig() が Nuxt setup 文脈でしか呼べないため、
 * モジュール top-level ではなく最初のアクセス時に初期化する。
 *
 * Sanctum SPA (Cookie) 認証のため:
 * - withCredentials: Cookie を必ず送出
 * - withXSRFToken: XSRF-TOKEN Cookie を X-XSRF-TOKEN ヘッダへ自動転写 (axios >= 1.5)
 * - X-Requested-With: XHR を明示し Laravel 側の expectsJson を有効化
 */
export const globalAxios = (): AxiosInstance => {
  if (!_client) {
    const config = useRuntimeConfig()
    _client = axios.create({
      baseURL: config.public.apiBase,
      withCredentials: true,
      withXSRFToken: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
  }
  return _client
}

/**
 * apiBase (例: http://localhost:8000/api) から末尾の /api を除いた
 * アプリのオリジンを返す。CSRF Cookie エンドポイント (/sanctum/csrf-cookie) は
 * /api の外側にあるためこちらを使う。
 */
export const appBaseUrl = (): string => {
  const apiBase = useRuntimeConfig().public.apiBase
  return apiBase.replace(/\/api\/?$/, '')
}

export const isAxiosError = (error: unknown): error is AxiosError =>
  (error as AxiosError)?.isAxiosError
