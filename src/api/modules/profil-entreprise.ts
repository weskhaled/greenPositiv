import service from '~/api/httpProfilEntreprise'

const BASE_PREFIX = `${import.meta.env.VITE_API_PROFIL_ENTREPRISE}`

const profilEntrepriseApi = {

  profileEntreprise: async(id: string) => service.get(`${BASE_PREFIX}/profil-entreprise/${id}`),
  updateContactDetails: async(params: object) => service.patch('/profil-entreprise/', params),
  updateLegalRepresentative: async(params: object) => service.patch('/profil-entreprise/legal-representative', params),
  updateTaxe: async(params: object) => service.patch('/profil-entreprise/taxes', params),
  updateLegalMention: async(params: object) => service.patch('/profil-entreprise/legal-mention', params),
  updatePaymentModule: async(params: object) => service.patch('/profil-entreprise/payment/iban', params),
}

export default profilEntrepriseApi
