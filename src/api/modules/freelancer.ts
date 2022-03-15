import service from '~/api/http'

const freelancerApi = {
  updateProfile: async(params: object) => service.patch('/freelancer', params),
  addExperience: async(params: object) => service.post('/freelancer/add-experience', params),
  updateExperience: async(id: string, params: object) => service.patch(`/freelancer/update-experience/${id}`, params),
  deleteExperience: async(id: string) => service.patch(`/freelancer/delete-experience/${id}`),
  addFormation: async(params: object) => service.post('/freelancer/add-formation', params),
  updateFormation: async(id: string, params: object) => service.patch(`/freelancer/update-formation/${id}`, params),
  deleteFormation: async(id: string) => service.patch(`/freelancer/delete-formation/${id}`),
  addCertification: async(params: object) => service.post('/freelancer/add-certification', params),
  updateCertification: async(id: string, params: object) => service.patch(`/freelancer/update-certification/${id}`, params),
  deleteCertification: async(id: string) => service.patch(`/freelancer/delete-certification/${id}`),
}

export default freelancerApi
