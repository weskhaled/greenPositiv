import service from '~/api/http'

const authApi = {
  // Authenticate login instance
  login: (params: object) => service.post('/auth/login', params),
  register: (params: object) => service.post('/freelancer', params),
  currentUser: () => service.post('/auth/current-user'),
}

export default authApi
