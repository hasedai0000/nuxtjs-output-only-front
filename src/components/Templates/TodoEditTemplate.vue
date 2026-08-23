<script setup lang="ts">
import { inject } from 'vue'
import BaseLayout from '../Organisms/BaseLayout.vue'
import InputForm from '../Atoms/InputForm.vue'
import TextArea from '../Atoms/TextArea.vue'
import CommonButton from '../Atoms/CommonButton.vue'
import { NAVIGATION_PATH } from '../../constants/navigation'
import {
  originTodoListInjectionKey,
  handleUpdateTodoInjectionKey
} from '../../providers/TodoProviderInjectionKey'

const router = useRouter()
const route = useRoute()
const todoId = String(route.params.id)

const originTodoList = inject(originTodoListInjectionKey)
const handleUpdateTodo = inject(handleUpdateTodoInjectionKey)
const todo = originTodoList
  ? originTodoList.value.find((todo) => String(todo.id) === todoId)
  : undefined

const handleSubmitUpdateTodo = (e: Event): void => {
  e.preventDefault()
  if (!handleUpdateTodo) return;
  const formElements = (e.target as HTMLFormElement).elements
  const title = (formElements.namedItem("title") as HTMLInputElement).value
  const content = (formElements.namedItem("content") as HTMLTextAreaElement).value
  handleUpdateTodo(String(todoId), title, content)
  router.push(`${NAVIGATION_PATH.TOP}`)
}
</script>

<template>
  <BaseLayout title="Edit Todo">
    <form v-if="todo" class="container" @submit.prevent="handleSubmitUpdateTodo">
      <div class="area">
        <InputForm v-model="todo.title" name="title" placeholder="Title" />
      </div>
      <div class="area">
        <TextArea v-model="todo.content" name="content" placeholder="Content" />
      </div>
      <div class="area">
        <CommonButton type="submit" label="Update" />
      </div>
    </form>
  </BaseLayout>
</template>

<style scoped>
.container {
  width: 80%;
  margin: 40px auto;
}

.area {
  margin-top: 40px;
}
</style>
