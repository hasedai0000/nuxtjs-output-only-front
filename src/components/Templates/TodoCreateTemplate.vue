<script setup lang="ts">
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import BaseLayout from '../Organisms/BaseLayout.vue'
import InputForm from '../Atoms/InputForm.vue'
import TextArea from '../Atoms/TextArea.vue'
import CommonButton from '../Atoms/CommonButton.vue'
import { NAVIGATION_PATH } from '../../constants/navigation'
import { handleAddTodoInjectionKey } from '../../providers/TodoProviderInjectionKey.ts'

const router = useRouter()

const handleAddTodo = inject(handleAddTodoInjectionKey)

const handleSubmitAddTodo = (e: Event): void => {
  e.preventDefault()
  if (!handleAddTodo) return
  const formElements = (e.target as HTMLFormElement).elements
  const title = (formElements.namedItem("title") as HTMLInputElement).value
  const content = (formElements.namedItem("content") as HTMLTextAreaElement).value
  handleAddTodo(title, content)
  router.push(`${NAVIGATION_PATH.TOP}`)
}
</script>

<template>
  <BaseLayout title="TodoList">
    <form class="container" @submit.prevent="handleSubmitAddTodo">
      <div class="area">
        <InputForm name="title" placeholder="Title" />
      </div>
      <div class="area">
        <TextArea name="content" placeholder="Content" />
      </div>
      <div class="area">
        <CommonButton type="submit" label="Create" />
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
