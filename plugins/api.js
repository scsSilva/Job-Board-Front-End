import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase,
  })

  api.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) req.headers.Authorization = `Bearer ${token}`
    return req
  })

  return {
    provide: {
      api,
    },
  }
})
