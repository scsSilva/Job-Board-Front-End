import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),

  actions: {
    async login(email, password) {
      const { $api } = useNuxtApp()
      const { data } = await $api.post('/auth/login', { email, password })

      this.user = data.user
      this.token = data.token

      if (import.meta.client) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    },

    async register(name, email, password, role) {
      const { $api } = useNuxtApp()
      const { data } = await $api.post('/users', { name, email, password, role })
      return data
    },

    load() {
      if (import.meta.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
        }
      }
    },

    logout() {
      this.user = null
      this.token = null

      if (import.meta.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }

      navigateTo('/auth')
    },
  },
})
