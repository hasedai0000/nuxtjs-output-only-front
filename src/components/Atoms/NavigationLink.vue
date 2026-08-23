<script setup lang="ts">
type Props = {
  title: string
  path: string
}

const { title, path } = defineProps<Props>()
</script>

<template>
  <li class="li">
    <NuxtLink :to="path">
      {{ title }}
    </NuxtLink>
  </li>
</template>

<style scoped>
.li {
  text-align: center;
  list-style-type: none;
}

.li > a {
  transition: 0.3s;
  display: block;
  background-color: #fff;
  text-decoration: none;
  color: #008080;
  font-size: 24px;
  font-weight: bold;
  width: 80px;
  padding: 10px 20px;
  border-radius: 10px;
}

.li > a:hover {
  background-color: #d8d8d8;
}
</style>
