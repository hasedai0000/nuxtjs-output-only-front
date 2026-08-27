import { useAuthStore } from '../stores/auth'
import { NAVIGATION_PATH } from '../constants/navigation'

const GUEST_ONLY_PATHS: readonly string[] = [
  NAVIGATION_PATH.LOGIN,
  NAVIGATION_PATH.REGISTER
]

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  await auth.initAuth()

  const isGuestOnly = GUEST_ONLY_PATHS.includes(to.path)

  if (!auth.isAuthenticated && !isGuestOnly) {
    return navigateTo(NAVIGATION_PATH.LOGIN)
  }

  if (auth.isAuthenticated && isGuestOnly) {
    return navigateTo(NAVIGATION_PATH.TOP)
  }
})
