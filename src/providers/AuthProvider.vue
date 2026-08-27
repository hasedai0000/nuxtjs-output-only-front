<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { useAuthProvider } from '../composables/useAuthProvider'
import {
  authErrorInjectionKey,
  currentUserInjectionKey,
  handleLoginInjectionKey,
  handleLogoutInjectionKey,
  handleRegisterInjectionKey,
  initAuthInjectionKey,
  isAuthenticatedInjectionKey,
  isAuthInitializedInjectionKey
} from './AuthProviderInjectionKey'

const {
  currentUser,
  isAuthenticated,
  authError,
  isInitialized,
  initAuth,
  handleLogin,
  handleRegister,
  handleLogout
} = useAuthProvider()

provide(currentUserInjectionKey, currentUser)
provide(isAuthenticatedInjectionKey, isAuthenticated)
provide(authErrorInjectionKey, authError)
provide(isAuthInitializedInjectionKey, isInitialized)
provide(initAuthInjectionKey, initAuth)
provide(handleLoginInjectionKey, handleLogin)
provide(handleRegisterInjectionKey, handleRegister)
provide(handleLogoutInjectionKey, handleLogout)

onMounted(() => {
  initAuth()
})
</script>

<template>
  <slot />
</template>
