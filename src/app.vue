<script setup lang="ts">
import TodoProvider from './providers/TodoProvider.vue'
</script>

<template>
  <TodoProvider>
    <router-view />
  </TodoProvider>
</template>
