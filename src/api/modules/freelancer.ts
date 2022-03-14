import service from '~/api/http'

const freelancerApi = {
  updateProfile: async(params: object) => service.patch('/freelancer', params),
  addExperience: async(params: object) => service.post('/freelancer/add-experience', params),
  updateExperience: async(id: string, params: object) => service.patch(`/freelancer/update-experience/${id}`, params),
  deleteExperience: async(id: string) => service.patch(`/freelancer/delete-experience/${id}`),
}

export default freelancerApi
