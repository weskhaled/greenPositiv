import service from '~/api/httpAuth'

const authApi = {
  login: (params: object) => service.post('/auth/login', params),
  currentUser: () => service.post('/auth/current-user'),
}

export default authApi
