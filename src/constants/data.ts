import type { TodoType } from '../types/todo'

/**
 * Todoリストの初期値
 */
export const INIT_TODO_LIST: Array<TodoType> = [
  {
    id: 1,
    title: 'Todo1',
    content: 'Todo1の内容'
  },
  {
    id: 2,
    title: 'Todo2',
    content: 'Todo2の内容'
  }
]

/**
 * Todo採番IDの初期値
 */
export const INIT_UNIQUE_ID: number = INIT_TODO_LIST.length
