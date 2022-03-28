import { useFetch } from '@vueuse/core'
import service from '~/api/httpFreelancer'

const BASE_PREFIX = `${import.meta.env.VITE_API_FREELANCER}`

const freelancerApi = {
  register: async(params: object) => service.post(`${BASE_PREFIX}/freelancer/`, params),
  profile: async(id: string) => useFetch(`${BASE_PREFIX}/freelancer/get/${id}`).get().json(),
  updateProfile: async(params: object) => service.patch(`${BASE_PREFIX}/freelancer/`, params),
  uploadProfile: async(file: FormData) => service.upload(`${BASE_PREFIX}/freelancer/upload-profile`, file),
  uploadDocuments: async(file: FormData) => service.upload(`${BASE_PREFIX}/freelancer/documents`, file),
  addExperience: async(params: object) => service.post(`${BASE_PREFIX}/freelancer/add-experience`, params),
  updateExperience: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/freelancer/update-experience/${id}`, params),
  deleteExperience: async(id: string) => service.patch(`${BASE_PREFIX}/freelancer/delete-experience/${id}`),
  addFormation: async(params: object) => service.post(`${BASE_PREFIX}/freelancer/add-formation`, params),
  updateFormation: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/freelancer/update-formation/${id}`, params),
  deleteFormation: async(id: string) => service.patch(`${BASE_PREFIX}/freelancer/delete-formation/${id}`),
  addLanguage: async(params: object) => service.post(`${BASE_PREFIX}/freelancer/add-language`, params),
  updateLanguage: async(params: object) => service.patch(`${BASE_PREFIX}/freelancer/update-language`, params),
  deleteLanguage: async(params: object) => service.patch(`${BASE_PREFIX}/freelancer/delete-language`, params),
  addCertification: async(params: object) => service.post(`${BASE_PREFIX}/freelancer/add-certification`, params),
  updateCertification: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/freelancer/update-certification/${id}`, params),
  deleteCertification: async(id: string) => service.patch(`${BASE_PREFIX}/freelancer/delete-certification/${id}`),
  getAllVisibleAndValidated: async() => useFetch(`${BASE_PREFIX}/freelancer/`).get().json(),
}

export default freelancerApi
