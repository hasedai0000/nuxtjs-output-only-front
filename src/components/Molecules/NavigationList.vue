<script setup lang="ts">
import NavigationLink from '../Atoms/NavigationLink.vue'
import { NAVIGATION_PATH } from '../../constants/navigation'

const top = NAVIGATION_PATH.TOP
const create = NAVIGATION_PATH.CREATE
</script>

<template>
  <nav>
    <ul class="ul">
      <NavigationLink title="Top" :path="top" />
      <NavigationLink title="Create" :path="create" />
    </ul>
  </nav>
</template>

<style scoped>
.ul {
  width: 100%;
  padding-left: 0;
  display: flex;
  justify-content: space-around;
}
</style>
