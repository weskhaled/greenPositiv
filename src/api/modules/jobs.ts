import { useFetch } from '@vueuse/core'
const BASE_PREFIX = `${import.meta.env.VITE_API_BASEURL_ADMIN}`

const jobsApi = {
  // Jobs instance
  jobs: () => useFetch(`${BASE_PREFIX}/jobs`).json(),
}

export default jobsApi
