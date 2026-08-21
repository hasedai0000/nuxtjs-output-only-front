import { REPOSITORY_NAME } from '../config/config'

export const BASE_PATH: string = import.meta.env.PROD ? `/${REPOSITORY_NAME}` : ''

/**
 * リンク先一覧
 * 遷移先定義の際に使用
 */
export const NAVIGATION_LIST = {
  TOP: `${BASE_PATH}/`,
  DETAIL: `${BASE_PATH}/detail/:id`,
  CREATE: `${BASE_PATH}/create`,
  EDIT: `${BASE_PATH}/edit/:id`
} as const

/**
 * パス一覧
 * 画面遷移時の使用
 */
export const NAVIGATION_PATH = {
  TOP: `${BASE_PATH}/`,
  DETAIL: `${BASE_PATH}/detail/`,
  CREATE: `${BASE_PATH}/create`,
  EDIT: `${BASE_PATH}/edit/`
} as const
