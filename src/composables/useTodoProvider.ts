import { ref, computed } from 'vue'
import { INIT_UNIQUE_ID } from '../constants/data'
import {
  fetchTodoListApi,
  updateTodoApi
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

  const handleUpdateTodo = async (
    targetId: TodoId | string,
    title: string,
    content: string
  ) => {
    if (title.trim() === "" || content.trim() === "") return
    const todoId = Number(targetId)
    if (Number.isNaN(todoId)) return
    const data = await updateTodoApi(todoId, title, content)
    if (data && typeof data !== "string") {
      const newTodoList = originTodoList.value.map((todo) => {
        return todo.id === todoId ? data : todo;
      })
      originTodoList.value = newTodoList
    }
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
