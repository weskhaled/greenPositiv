import { useFetch } from '@vueuse/core'

const BASE_PREFIX = `${import.meta.env.VITE_API_ADMIN}`

const adminApi = {
  jobs: async() => useFetch(`${BASE_PREFIX}/jobs/`).get().json(),
  posts: async() => useFetch(`${BASE_PREFIX}/posts/`).get().json(),
  skills: async() => useFetch(`${BASE_PREFIX}/skills/`).get().json(),
}

export default adminApi
