import { useFetch } from '@vueuse/core'
const BASE_PREFIX_ADMIN = `${import.meta.env.VITE_API_BASEURL_ADMIN}`
const BASE_PREFIX = `${import.meta.env.VITE_API_BASEURL}`

const jobsApi = {
  // Jobs instance
  jobs: async() => useFetch(`${BASE_PREFIX_ADMIN}/jobs`).json(),
  posts: async() => useFetch(`${BASE_PREFIX_ADMIN}/posts`).json(),
  languages: async() => useFetch(`${BASE_PREFIX}/api/languages`).get().json(),
  skills: async() => useFetch(`${BASE_PREFIX_ADMIN}/skills`).get().json(),
  countries: async() => useFetch(`${BASE_PREFIX}/api/countries`).get().json(),
  activities: async() => useFetch(`${BASE_PREFIX}/api/sector-activity`).get().json(),
  legalForms: async() => useFetch(`${BASE_PREFIX}/api/legal-forms`).get().json(),
  iban: async() => useFetch(`${BASE_PREFIX}/api/iban-us-ca-others-countries`).get().json(),
  profile: async(id: string) => useFetch(`https://green-freelance-test.herokuapp.com/freelancer/get/${id}`).get().json(),
}

export default jobsApi
