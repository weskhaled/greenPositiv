import { useFetch } from '@vueuse/core'

const BASE_PREFIX = `${import.meta.env.VITE_API_BASEAPI}`

const globalApi = {
  languages: async () => useFetch(`${BASE_PREFIX}/api/languages`).get().json(),
  countries: async () => useFetch(`${BASE_PREFIX}/api/countries`).get().json(),
  activities: async () => useFetch(`${BASE_PREFIX}/api/sector-activity`).get().json(),
  legalForms: async () => useFetch(`${BASE_PREFIX}/api/legal-forms`).get().json(),
  iban: async () => useFetch(`${BASE_PREFIX}/api/iban-countries`).get().json(),
  ibanOthers: async () => useFetch(`${BASE_PREFIX}/api/iban-us-ca-others-countries`).get().json(),
}

export default globalApi
