<script setup lang="ts">
import { inject } from 'vue'
import BaseLayout from '../Organisms/BaseLayout.vue'
import TodoList from '../Organisms/TodoList.vue'
import InputForm from '../Atoms/InputForm.vue'

import { searchKeywordInjectionKey } from '../../providers/TodoProviderInjectionKey'

const searchKeyword = inject(searchKeywordInjectionKey)
</script>

<template>
  <BaseLayout title="TodoList">
    <div class="container">
      <section
        v-if="searchKeyword !== undefined"
        class="area"
      >
        <InputForm
          v-model="searchKeyword"
          name="searchKeyword"
          :placeholder="`Search Keyword`"
        />
      </section>
      <!-- Todo 一覧表示エリア -->
      <section class="area">
        <TodoList />
      </section>
    </div>
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
