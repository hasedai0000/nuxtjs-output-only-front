import { ref, computed } from 'vue'
import { INIT_UNIQUE_ID } from '../constants/data'
import {
  fetchTodoListApi,
  createTodoApi,
  updateTodoApi,
  deleteTodoApi
} from "../apis/todoApi"
import type { TodoType, TodoId } from '../types/todo'

export const useTodoProvider = () => {
  const originTodoList = ref<Array<TodoType>>([])
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

  const handleAddTodo = async (
    title: string,
    content: string
  ) => {
    if (title.trim() !== "" && content.trim() !== "") {
      const data = await createTodoApi(title, content)
      if (data && typeof data !== "string") originTodoList.value.push(data)
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

  const handleDeleteTodo = (
    targetId: TodoId | string, 
    targetTitle: string
  ) => {
    if (window.confirm(`「${targetTitle}」を削除しますか？`)) {
      const todoId = Number(targetId)
      if (Number.isNaN(todoId)) return
      deleteTodoApi(Number(targetId))
      const newTodoList = originTodoList.value.filter((todo) => {
        return String(todo.id) !== targetId
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
