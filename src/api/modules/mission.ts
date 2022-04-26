import { useFetch } from '@vueuse/core'
import ServerError from 'ant-design-vue/lib/result/serverError'
import service from '~/api/httpMission'

const BASE_PREFIX = `${import.meta.env.VITE_API_MISSION}`

const missionApi = {

  getMissions: async() => service.get(`${BASE_PREFIX}/missions/all`),
  getDevis: async() => service.post(`${BASE_PREFIX}/missions/devis`),
  addMission: async(params: FormData) => service.post(`${BASE_PREFIX}/missions/`, params),
  updateMission: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/${id}`, params),
  deleteMission: async(id: string) => service.delete(`${BASE_PREFIX}/missions/${id}`),
  findOneMission: async(id: string) => useFetch(`${BASE_PREFIX}/missions/get/${id}`).get().json(),
  getProfiles: async(id: string) => service.get(`${BASE_PREFIX}/missions/profiles/${id}`),
  getDevisFromMission: async(params: object) => service.post(`${BASE_PREFIX}/missions/devis`, params),

  acceptFreelance: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/freelance/accept/${id}`, params),
  refuseFreelance: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/freelance/refuse/${id}`, params),
  removeFreelance: async(id: string, params: object) => service.post(`${BASE_PREFIX}/missions/freelance/remove/${id}`, params),

  acceptAgence: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/agence/accept/${id}`, params),
  refuseAgence: async(id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/agence/refuse/${id}`, params),
  removeAgence: async(id: string, params: object) => service.post(`${BASE_PREFIX}/missions/agence/remove/${id}`, params),

  sendDevisFreelance: async(params: object) => service.post(`${BASE_PREFIX}/freelancer/send-devis`, params),
  getDevisFreelance: async() => service.get(`${BASE_PREFIX}/freelancer/devis`),

  sendDevisAgence: async(params: object) => service.post(`${BASE_PREFIX}/agence/send-devis`, params),
  getDevisAgence: async() => service.get(`${BASE_PREFIX}/agence/devis`),

}

export default missionApi
