import { ref, computed } from 'vue'
import { INIT_UNIQUE_ID } from '../constants/data'
import {
  fetchTodoListApi,
} from "../apis/todoApi"
import type { TodoType, TodoId } from '../types/todo'

export const useTodoProvider = () => {
  const originTodoList = ref<Array<TodoType>>([])
  const uniqueId = ref<number>(INIT_UNIQUE_ID)
  const searchKeyword = ref<string>('')

  const fetchTodoList = async () => {
    const data = await fetchTodoListApi();
    if (Array.isArray(data)) originTodoList.value = data;
  }

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
    fetchTodoList,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo
  }
}
