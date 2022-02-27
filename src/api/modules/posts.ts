import { useFetch } from '@vueuse/core'
const BASE_PREFIX = `${import.meta.env.VITE_API_BASEURL_ADMIN}`

const jobsApi = {
  // Jobs instance
  posts: () => useFetch(`${BASE_PREFIX}/posts`).json(),
}

export default jobsApi
