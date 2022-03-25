import service from '~/api/httpProfilEntreprise'

const BASE_PREFIX = `${import.meta.env.VITE_API_PROFIL_ENTREPRISE}`

const profilEntrepriseApi = {

  profileEntreprise: async(id: string) => service.get(`${BASE_PREFIX}/profil-entreprise/${id}`),
  updateContactDetails: async(params: object) => service.patch('/profil-entreprise/', params),
  updateLegalRepresentative: async(params: object) => service.patch('/profil-entreprise/legal-representative', params),
  updateTaxe: async(params: object) => service.patch('/profil-entreprise/taxes', params),
  updateLegalMention: async(params: object) => service.patch('/profil-entreprise/legal-mention', params),
  updatePaymentModule: async(params: object) => service.patch('/profil-entreprise/payment/iban', params),

  profileEntrepriseAgence: async(id: string) => service.get(`${BASE_PREFIX}/profil-entreprise-agence/${id}`),
  updateContactDetailsAgence: async(params: object) => service.patch('/profil-entreprise-agence/', params),
  updateLegalRepresentativeAgence: async(params: object) => service.patch('/profil-entreprise-agence/legal-representative', params),
  updateTaxeAgence: async(params: object) => service.patch('/profil-entreprise-agence/taxes', params),
  updateLegalMentionAgence: async(params: object) => service.patch('/profil-entreprise-agence/legal-mention', params),
  updatePaymentModuleAgence: async(params: object) => service.patch('/profil-entreprise-agence/payment/iban', params),

  profileEntrepriseCompany: async(id: string) => service.get(`${BASE_PREFIX}/profil-entreprise-company/${id}`),
  updateProfileEntrepriseCompany: async(file: FormData) => service.upload('/profil-entreprise-company/', file),
  updateFacturationCompany: async(params: object) => service.patch('/profil-entreprise-company/facturation', params),
  updateContactComptabilityCompany: async(params: object) => service.patch('/profil-entreprise-company/contact', params),
}

export default profilEntrepriseApi
