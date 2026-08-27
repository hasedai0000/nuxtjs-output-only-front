/**
 * パス一覧
 * 画面遷移時の使用
 * ベースURLは nuxt.config.ts の app.baseURL で制御する
 */
export const NAVIGATION_PATH = {
  TOP: '/',
  DETAIL: '/detail/',
  CREATE: '/create',
  EDIT: '/edit/',
  LOGIN: '/login',
  REGISTER: '/register'
} as const
