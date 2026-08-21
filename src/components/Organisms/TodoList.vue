<script setup lang="ts">
import { inject } from 'vue'
import {
  showTodoListInjectionKey,
  handleDeleteTodoInjectionKey
} from '../../providers/TodoProviderInjectionKey'

const showTodoList = inject(showTodoListInjectionKey)
const handleDeleteTodo = inject(handleDeleteTodoInjectionKey)

const handleDelete = (id: string, title: string) => {
  if (!handleDeleteTodo) return
  handleDeleteTodo(id, title)
}

</script>

<template>
  <ul class="list">
    <li v-for="(todo, index) in showTodoList" :key="index" class="todo">
      <span class="task">{{ todo.title }}</span>
      <div class="area">
        <div class="far">
          <router-link :to="{ name: 'detail', params: { id: todo.id } }">
            <font-awesome-icon class="far" icon="fa-circle-info" />
          </router-link>
        </div>
        <div class="far">
          <router-link :to="{ name: 'edit', params: { id: todo.id } }">
            <font-awesome-icon class="far" icon="fa-pen-to-square" />
          </router-link>
        </div>

        <div class="far">
          <font-awesome-icon class="far" icon="fa-trash" @click="handleDelete(String(todo.id), todo.title)" />
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.list {
  padding: 0;
}

.todo {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  list-style: none;
  line-height: 1.5;
  font-weight: bold;
  background-color: rgba(3, 80, 63, 0.5);
  border-radius: 5px;
  padding: 10px;
  height: 50px;
}

.task {
  cursor: pointer;
  display: block;
  padding-top: 8px;
  padding-left: 10px;
  font-size: 24px;
  font-family: 'Times New Roman', Times, serif;
  color: #fff;
}

.area {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  width: 130px;
  height: 30px;
}

.far {
  display: block;
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: #ff9900;
}
</style>
