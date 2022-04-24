import { useFetch } from '@vueuse/core'
import service from '~/api/httpAuth'
const BASE_PREFIX = `${import.meta.env.VITE_API_AUTH}`

const authApi = {
  login: (params: object) => service.post('/auth/login', params),
  currentUser: () => service.post('/auth/current-user'),
  refresh: async() => useFetch(`${BASE_PREFIX}/auth/refresh`).post().json(),
  forgotPassword: (params: object) => useFetch(`${BASE_PREFIX}/auth/forgot-password`).post(params).json(),
  updatePassword: async(params: object) => service.patch('/auth/update-password', params),
}
export default authApi
