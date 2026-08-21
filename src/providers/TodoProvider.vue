<script setup lang="ts">
import { provide } from 'vue'
import { useTodoProvider } from '../composables/useTodoProvider'
import {
  originTodoListInjectionKey,
  showTodoListInjectionKey,
  searchKeywordInjectionKey,
  handleAddTodoInjectionKey,
  handleUpdateTodoInjectionKey,
  handleDeleteTodoInjectionKey
} from './TodoProviderInjectionKey'

const {
  originTodoList,
  showTodoList,
  searchKeyword,
  handleAddTodo,
  handleUpdateTodo,
  handleDeleteTodo
} = useTodoProvider()

provide(originTodoListInjectionKey, originTodoList)
provide(showTodoListInjectionKey, showTodoList)
provide(searchKeywordInjectionKey, searchKeyword)
provide(handleAddTodoInjectionKey, handleAddTodo)
provide(handleUpdateTodoInjectionKey, handleUpdateTodo)
provide(handleDeleteTodoInjectionKey, handleDeleteTodo)
</script>

<template>
  <slot />
</template>
