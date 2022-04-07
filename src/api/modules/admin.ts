import { useFetch } from '@vueuse/core'

const BASE_PREFIX = `${import.meta.env.VITE_API_ADMIN}`

const adminApi = {
  jobs: async() => useFetch(`${BASE_PREFIX}/jobs/`).get().json(),
  posts: async() => useFetch(`${BASE_PREFIX}/posts/`).get().json(),
  getPostById: async(id: string) => useFetch(`${BASE_PREFIX}/posts/${id}`).get().json(),
  skills: async() => useFetch(`${BASE_PREFIX}/skills/`).get().json(),
  addSubscription: async(email: string) => useFetch(`${BASE_PREFIX}/subscriptions/`).post({ email }).json(),
}

export default adminApi
