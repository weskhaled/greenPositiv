import { useFetch } from '@vueuse/core'
import service from '~/api/httpAgence'

const BASE_PREFIX = `${import.meta.env.VITE_API_AGENCE}`

const agenceApi = {
  register: async (params: object) => service.post(`${BASE_PREFIX}/agence/`, params),
  profile: async (id: string) => useFetch(`${BASE_PREFIX}/agence/get/${id}`).get().json(),
  updateProfile: async (params: object) => service.patch(`${BASE_PREFIX}/agence/`, params),
  uploadProfile: async (file: FormData) => service.upload(`${BASE_PREFIX}/agence/upload-profile`, file),
  uploadDocuments: async (file: FormData) => service.upload(`${BASE_PREFIX}/agence/documents`, file),

  /* formData (add champ image, old_image) */
  addReference: async (params: object) => service.post(`${BASE_PREFIX}/agence/add-reference`, params, true),
  updateReference: async (id: string, params: object) => service.patch(`${BASE_PREFIX}/agence/update-reference/${id}`, params, true),
  /* end formData (add champ image, old_image) */

  deleteReference: async (id: string) => service.patch(`${BASE_PREFIX}/agence/delete-reference/${id}`),
  addOffer: async (params: object) => service.post(`${BASE_PREFIX}/agence/add-offer`, params),
  updateOffer: async (id: string, params: object) => service.patch(`${BASE_PREFIX}/agence/update-offer/${id}`, params),
  deleteOffer: async (id: string) => service.patch(`${BASE_PREFIX}/agence/delete-offer/${id}`),
  uploadDocumentsOffer: async (id: string, file: FormData) => service.upload(`${BASE_PREFIX}/agence/documents-offer/${id}`, file),

  // upload others documents (kabis/vigilance/sasu)
  uploadKabisDocuments: async (file: FormData) => service.upload(`${BASE_PREFIX}/agence/kabis-documents`, file),
  uploadVigilanceDocuments: async (file: FormData) => service.upload(`${BASE_PREFIX}/agence/vigilance-documents`, file),
  uploadSasuDocuments: async (file: FormData) => service.upload(`${BASE_PREFIX}/agence/sasu-documents`, file),

  // required profiles
  requiredProfiles: async (params: object) => useFetch(`${BASE_PREFIX}/agence/required-profile`).post(params).json(),
}

export default agenceApi
