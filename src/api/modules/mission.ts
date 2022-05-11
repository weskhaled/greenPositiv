import { useFetch } from '@vueuse/core'
import ServerError from 'ant-design-vue/lib/result/serverError'
import service from '~/api/httpMission'

const BASE_PREFIX = `${import.meta.env.VITE_API_MISSION}`

const missionApi = {

  getMissions: async () => service.get(`${BASE_PREFIX}/missions/all`),
  getDevisByMissionId: async (id: string) => service.get(`${BASE_PREFIX}/missions/devis/${id}`),
  getDevisById: async (id: string) => service.get(`${BASE_PREFIX}/missions/get-devis/${id}`),
  getDevis: async () => service.get(`${BASE_PREFIX}/missions/devis`),
  addMission: async (params: FormData) => service.post(`${BASE_PREFIX}/missions/`, params),
  updateMission: async (id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/${id}`, params),
  deleteMission: async (id: string) => service.delete(`${BASE_PREFIX}/missions/${id}`),
  findOneMission: async (id: string) => useFetch(`${BASE_PREFIX}/missions/get/${id}`).get().json(),
  getProfiles: async (id: string) => service.get(`${BASE_PREFIX}/missions/profiles/${id}`),
  getProfilesAgence: async (id: string, params: object) => service.post(`${BASE_PREFIX}/missions/profiles-agences/${id}`, params),
  getDevisFromMission: async (params: object) => service.post(`${BASE_PREFIX}/missions/devis`, params),

  acceptFreelance: async (id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/freelance/accept/${id}`, params),
  refuseFreelance: async (id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/freelance/refuse/${id}`, params),
  removeFreelance: async (id: string, params: object) => service.post(`${BASE_PREFIX}/missions/freelance/remove/${id}`, params),

  acceptAgence: async (id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/agence/accept/${id}`, params),
  refuseAgence: async (id: string, params: object) => service.patch(`${BASE_PREFIX}/missions/agence/refuse/${id}`, params),
  removeAgence: async (id: string, params: object) => service.post(`${BASE_PREFIX}/missions/agence/remove/${id}`, params),

  sendDevisFreelance: async (params: object) => service.post(`${BASE_PREFIX}/freelancer/send-devis`, params),
  getDevisFreelance: async () => service.get(`${BASE_PREFIX}/freelancer/devis`),

  sendDevisAgence: async (params: object) => service.post(`${BASE_PREFIX}/agence/send-devis`, params),
  getDevisAgence: async () => service.get(`${BASE_PREFIX}/agence/devis`),
  getOffers: async () => service.get(`${BASE_PREFIX}/agence/offers`),

  sendDemand: async (id: string) => service.post(`${BASE_PREFIX}/demands/${id}`),
  getDemands: async () => service.get(`${BASE_PREFIX}/demands/`),
  getDemandById: async (id: string) => service.get(`${BASE_PREFIX}/demands/${id}`),
  validateDemand: async (id: string) => service.patch(`${BASE_PREFIX}/demands/validate/${id}`),
  unvalidateDemand: async (id: string) => service.patch(`${BASE_PREFIX}/demands/unvalidate/${id}`),

  pay: async (id: string) => service.post(`${BASE_PREFIX}/payment/${id}`),
}

export default missionApi
