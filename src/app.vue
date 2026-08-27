<script setup lang="ts">
import AuthProvider from './providers/AuthProvider.vue'
import TodoProvider from './providers/TodoProvider.vue'
</script>

<template>
  <AuthProvider>
    <TodoProvider>
      <NuxtPage />
    </TodoProvider>
  </AuthProvider>
</template>
