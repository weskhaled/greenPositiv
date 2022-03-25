import { useFetch } from '@vueuse/core'
import service from '~/api/httpCompany'

const BASE_PREFIX = `${import.meta.env.VITE_API_COMPANY}`

const companyApi = {
  register: async(params: object) => service.post(`${BASE_PREFIX}/company/`, params),
  profile: async(id: string) => useFetch(`${BASE_PREFIX}/company/get/${id}`).get().json(),
  updateProfile: async(params: object) => service.patch(`${BASE_PREFIX}/company/`, params),
  uploadProfile: async(file: FormData) => service.upload(`${BASE_PREFIX}/company/upload-profile`, file),
  uploadDocuments: async(file: FormData) => service.upload(`${BASE_PREFIX}/company/documents`, file),

  addFavoris: async(id: string) => service.patch(`${BASE_PREFIX}/company/add-favoris-freelance/${id}`),
  removeFavoris: async(id: string) => service.patch(`${BASE_PREFIX}/company/remove-favoris-freelance/${id}`),

  createCollaborator: async(params: object) => service.post(`${BASE_PREFIX}/company/create-collab`, params),
  removeCollaborator: async(id: string, idCollab: string) => service.patch(`${BASE_PREFIX}/company/remove-collab/${id}/${idCollab}`),
}

export default companyApi
