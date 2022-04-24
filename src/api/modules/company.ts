import { useFetch } from '@vueuse/core'
import ServerError from 'ant-design-vue/lib/result/serverError'
import service from '~/api/httpCompany'

const BASE_PREFIX = `${import.meta.env.VITE_API_COMPANY}`

const companyApi = {
  register: async(params: object) => service.post(`${BASE_PREFIX}/company/`, params),
  profile: async(id: string) => useFetch(`${BASE_PREFIX}/company/get/${id}`).get().json(),
  profileCollab: async(id: string) => service.get(`${BASE_PREFIX}/company/get-collab/${id}`),
  updateProfile: async(params: object) => service.patch(`${BASE_PREFIX}/company/`, params),
  uploadProfile: async(file: FormData) => service.upload(`${BASE_PREFIX}/company/upload-profile`, file),
  uploadDocuments: async(file: FormData) => service.upload(`${BASE_PREFIX}/company/documents`, file),

  addFavoris: async(id: string) => service.patch(`${BASE_PREFIX}/company/add-favoris-freelance/${id}`),
  removeFavoris: async(id: string) => service.patch(`${BASE_PREFIX}/company/remove-favoris-freelance/${id}`),

  createCollaborator: async(params: object) => service.post(`${BASE_PREFIX}/company/create-collab`, params),
  addCollab: async(id: string, idCollab: string) => useFetch(`${BASE_PREFIX}/company/add-collab/${id}/${idCollab}`).get().json(),
  removeCollaborator: async(id: string, idCollab: string) => service.patch(`${BASE_PREFIX}/company/remove-collab/${id}/${idCollab}`),
  getCollabFavoriteList: async() => service.get(`${BASE_PREFIX}/company/favorite-collab`),

  getMissions: async() => service.get(`${BASE_PREFIX}/company/missions`),
  addMission: async(params: FormData) => service.post(`${BASE_PREFIX}/missions/`, params),
  updateMission: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/${id}`, params),
  deleteMission: async(id: string) => service.delete(`${BASE_PREFIX}/missions/${id}`),
  findOneMission: async(id: string) => useFetch(`${BASE_PREFIX}/missions/get/${id}`).get().json(),
  getProfiles: async(id: string) => service.get(`${BASE_PREFIX}/missions/profiles/${id}`),
  getDevisFromMission: async(params: object) => service.post(`${BASE_PREFIX}/missions/devis`, params),
  verifDevis: async(params: object) => service.post(`${BASE_PREFIX}/missions/verif-devis`, params),

  acceptFreelance: async(id: string) => service.patch(`${BASE_PREFIX}/missions/freelance/accept/${id}`),
  refuseFreelance: async(id: string) => service.patch(`${BASE_PREFIX}/missions/freelance/refuse/${id}`),
  removeFreelance: async(id: string) => service.post(`${BASE_PREFIX}/missions/freelance/remove/${id}`),

  acceptAgence: async(id: string) => service.patch(`${BASE_PREFIX}/missions/agence/accept/${id}`),
  refuseAgence: async(id: string) => service.patch(`${BASE_PREFIX}/missions/agence/refuse/${id}`),
  removeAgence: async(id: string) => service.post(`${BASE_PREFIX}/missions/agence/remove/${id}`),

}

export default companyApi
