<script setup lang="ts">
import { storeToRefs } from 'pinia'
import NavigationLink from '../Atoms/NavigationLink.vue'
import { NAVIGATION_PATH } from '../../constants/navigation'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { currentUser, isAuthenticated } = storeToRefs(authStore)

const onLogout = async (): Promise<void> => {
  const ok = await authStore.logout()
  if (ok) router.push(NAVIGATION_PATH.LOGIN)
}
</script>

<template>
  <nav>
    <ul v-if="isAuthenticated" class="ul">
      <NavigationLink title="Top" :path="NAVIGATION_PATH.TOP" />
      <NavigationLink title="Create" :path="NAVIGATION_PATH.CREATE" />
      <li class="item">
        <span class="user">{{ currentUser?.name }}</span>
      </li>
      <li class="item">
        <button type="button" class="logout" @click="onLogout">Logout</button>
      </li>
    </ul>
    <ul v-else class="ul">
      <NavigationLink title="Login" :path="NAVIGATION_PATH.LOGIN" />
      <NavigationLink title="Register" :path="NAVIGATION_PATH.REGISTER" />
    </ul>
  </nav>
</template>

<style scoped>
.ul {
  width: 100%;
  padding-left: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.item {
  list-style: none;
}

.user {
  color: #fff;
  font-family: 'Times New Roman', Times, serif;
  font-size: 18px;
}

.logout {
  background: none;
  border: 1px solid #ff9900;
  color: #ff9900;
  padding: 6px 14px;
  font-family: 'Times New Roman', Times, serif;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s;
}

.logout:hover {
  background-color: #ff9900;
  color: #fff;
}
</style>
