import { useFetch } from '@vueuse/core'
import service from '~/api/httpAgence'

const BASE_PREFIX = `${import.meta.env.VITE_API_AGENCE}`

const agenceApi = {
  register: async(params: object) => service.post(`${BASE_PREFIX}/agence/`, params),
  profile: async(id: string) => useFetch(`${BASE_PREFIX}/agence/get/${id}`).get().json(),
  updateProfile: async(params: object) => service.patch(`${BASE_PREFIX}/agence/`, params),
  uploadProfile: async(file: FormData) => service.upload(`${BASE_PREFIX}/agence/upload-profile`, file),
  uploadDocuments: async(file: FormData) => service.upload(`${BASE_PREFIX}/agence/documents`, file),

  addReference: async(params: object) => service.post(`${BASE_PREFIX}/agence/add-reference`, params),
  updateReference: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/agence/update-reference/${id}`, params),
  deleteReference: async(id: string) => service.patch(`${BASE_PREFIX}/agence/delete-reference/${id}`),
  addOffer: async(params: object) => service.post(`${BASE_PREFIX}/agence/add-offer`, params),
  updateOffer: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/agence/update-offer/${id}`, params),
  deleteOffer: async(id: string) => service.patch(`${BASE_PREFIX}/agence/delete-offer/${id}`),
  uploadDocumentsOffer: async(id: string, file: FormData) => service.upload(`${BASE_PREFIX}/agence/documents-offer/${id}`, file),
}

export default agenceApi