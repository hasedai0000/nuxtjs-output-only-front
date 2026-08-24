import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { INIT_TODO_LIST, INIT_UNIQUE_ID } from '../constants/data'
import type { TodoType, TodoId } from '../types/todo'

export type UseTodoProvider = {
  originTodoList: Ref<TodoType[]>
  showTodoList: ComputedRef<TodoType[]>
  searchKeyword: Ref<string>
  handleAddTodo: (title: string, content: string) => void
  handleUpdateTodo: (targetId: TodoId | string, title: string, content: string) => void
  handleDeleteTodo: (targetId: TodoId | string, targetTitle: string) => void
}

export const useTodoProvider = (): UseTodoProvider => {
  const originTodoList = ref<TodoType[]>([...INIT_TODO_LIST])
  const uniqueId = ref<number>(INIT_UNIQUE_ID)
  const searchKeyword = ref<string>('')

  const showTodoList = computed<TodoType[]>(() => {
    return originTodoList.value.filter((todo) => {
      const regexp = new RegExp('^' + searchKeyword.value, 'i')
      return todo.title.match(regexp)
    })
  })

  const handleAddTodo = (title: string, content: string): void => {
    if (title.trim() !== '' && content.trim() !== '') {
      const nextUniqueId = uniqueId.value + 1
      originTodoList.value.push({
        id: nextUniqueId,
        title: title.trim(),
        content: content.trim()
      })

      uniqueId.value = nextUniqueId
    }
  }

  const handleUpdateTodo = (targetId: TodoId | string, title: string, content: string): void => {
    originTodoList.value = originTodoList.value.map((todo) => {
      if (String(todo.id) === String(targetId)) {
        return {
          ...todo,
          title: title.trim(),
          content: content.trim()
        }
      }
      return todo
    })
  }

  const handleDeleteTodo = (targetId: TodoId | string, targetTitle: string): void => {
    if (window.confirm(`「${targetTitle}」を削除しますか？`)) {
      const newTodoList = originTodoList.value.filter((todo) => {
        return String(todo.id) !== String(targetId)
      })
      originTodoList.value = newTodoList
    }
  }

  return {
    originTodoList,
    showTodoList,
    searchKeyword,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo
  }
}
