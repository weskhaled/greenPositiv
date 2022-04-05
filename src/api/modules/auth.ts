import { useFetch } from '@vueuse/core'
import service from '~/api/httpAuth'
const BASE_PREFIX = `${import.meta.env.VITE_API_AUTH}`

const authApi = {
  login: (params: object) => service.post('/auth/login', params),
  currentUser: () => service.post('/auth/current-user'),
  refresh: async() => useFetch(`${BASE_PREFIX}/auth/refresh`).post().json(),
}

export default authApi
