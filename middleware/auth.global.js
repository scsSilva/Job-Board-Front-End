import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  if (!getCurrentInstance()) {
    const pinia = createPinia()
    setActivePinia(pinia)
  }

  const auth = useAuthStore()
  auth.load()

  const isAuth = !!auth.token

  if (!isAuth && to.path !== '/auth') {
    return navigateTo('/auth')
  }

  if (isAuth && to.path === '/auth') {
    return navigateTo('/feed')
  }
})
