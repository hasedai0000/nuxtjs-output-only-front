<script setup lang="ts">
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '../Organisms/BaseLayout.vue'
import InputForm from '../Atoms/InputForm.vue'
import TextArea from '../Atoms/TextArea.vue'
import { originTodoListInjectionKey } from '../../providers/TodoProviderInjectionKey.ts'

const route = useRoute()
const todoId = String(route.params.id)

const originTodoList = inject(originTodoListInjectionKey)
const todo = originTodoList
  ? originTodoList.value.find((todo) => String(todo.id) === todoId)
  : undefined
</script>

<template>
  <BaseLayout title="Edit Todo">
    <form v-if="todo" class="container">
      <div class="area">
        <InputForm v-model="todo.title" disabled name="title" placeholder="Title" />
      </div>
      <div class="area">
        <TextArea v-model="todo.content" disabled name="content" placeholder="Content" />
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
