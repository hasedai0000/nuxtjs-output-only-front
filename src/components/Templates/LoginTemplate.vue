<script setup lang="ts">
import { inject, ref } from 'vue'
import BaseLayout from '../Organisms/BaseLayout.vue'
import InputForm from '../Atoms/InputForm.vue'
import CommonButton from '../Atoms/CommonButton.vue'
import { NAVIGATION_PATH } from '../../constants/navigation'
import {
  authErrorInjectionKey,
  handleLoginInjectionKey
} from '../../providers/AuthProviderInjectionKey'

const router = useRouter()

const handleLogin = inject(handleLoginInjectionKey)
const authError = inject(authErrorInjectionKey)

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault()
  if (!handleLogin || isSubmitting.value) return
  isSubmitting.value = true
  const ok = await handleLogin(email.value, password.value)
  isSubmitting.value = false
  if (ok) router.push(NAVIGATION_PATH.TOP)
}
</script>

<template>
  <BaseLayout title="Login">
    <form class="container" @submit.prevent="handleSubmit">
      <p v-if="authError" class="error">{{ authError }}</p>
      <div class="area">
        <InputForm
          v-model="email"
          type="email"
          name="email"
          placeholder="Email"
          autocomplete="email"
        />
      </div>
      <div class="area">
        <InputForm
          v-model="password"
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
        />
      </div>
      <div class="area">
        <CommonButton type="submit" :label="isSubmitting ? '...' : 'Login'" />
      </div>
      <p class="link">
        アカウントをお持ちでない場合は
        <NuxtLink :to="NAVIGATION_PATH.REGISTER">こちら</NuxtLink>
      </p>
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

.error {
  color: #ff6666;
  font-weight: bold;
  text-align: center;
}

.link {
  margin-top: 30px;
  text-align: center;
  color: #fff;
}

.link a {
  color: #ff9900;
  text-decoration: underline;
}
</style>
