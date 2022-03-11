import { useFetch } from '@vueuse/core'
const BASE_PREFIX_ADMIN = `${import.meta.env.VITE_API_BASEURL_ADMIN}`
const BASE_PREFIX = `${import.meta.env.VITE_API_BASEURL}`

const jobsApi = {
  // Jobs instance
  jobs: async() => useFetch(`${BASE_PREFIX_ADMIN}/jobs`).json(),
  posts: async() => useFetch(`${BASE_PREFIX_ADMIN}/posts`).json(),
  languages: async() => useFetch(`${BASE_PREFIX}/api/languages`).get().json(),
  activities: async() => useFetch(`${BASE_PREFIX}/api/sector-activity`).get().json(),
  // profile: async() => useFetch('https://green-freelance-test.herokuapp.com/freelancer/get/620eb6c589d456bf53f9ac0b').get().json(),
  profile: async(id: string) => useFetch(`https://green-freelance-test.herokuapp.com/freelancer/get/${id}`).get().json(),
}

export default jobsApi
