<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import SwiperCore, { Controller, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import dayjs from 'dayjs'
import { Form, Modal, message } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import adminApi from '~/api/modules/admin'
import globalApi from '~/api/modules/global'
import agenceApi from '~/api/modules/agence'
import profileEntrepriseApi from '~/api/modules/profil-entreprise'
import { currentUser } from '~/stores'
import 'swiper/css/pagination'

const BASE_PREFIX = `${import.meta.env.VITE_API_AGENCE}`

SwiperCore.use([Controller, Pagination])

const useForm = Form.useForm
const props = defineProps<{ id: string }>()
const router = useRouter()
const { t } = useI18n()
const activeKey = ref('1')
const typesAccount = ref([])
const loadingDocuments = ref(false)
const activeKeyProfileEtprs = ref('1')
const currentStepProfileEtprs = ref(0)
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const socials = reactive({
  facebook: {
    icon: 'i-mdi-facebook-box',
    link: '',
    classes: 'text-green-600',
  },
  twitter: {
    icon: 'i-mdi-twitter-box',
    link: '',
    classes: 'text-green-600',
  },
  linkedin: {
    icon: 'i-mdi-linkedin',
    link: '',
    classes: 'text-green-600',
  },
  github: {
    icon: 'i-mdi-github-box',
    link: '',
    classes: 'text-green-600',
  },
})
const profile = ref(null)
const references: Ref<any[]> = ref([])
const offers: Ref<any[]> = ref([])
const profileAvatar = ref('')
const userDocument = ref(null)
const profileEntreprise = ref(null)
const profileEntrepriseLoading = ref(false)
const legalForms = ref([])
const countries = ref([])
const countriesIban = ref([])
const countriesIbanOthers = ref([])
const jobs = ref([])
const typesIban = ref([])
const activities = ref([])
const activitiesCode = ref([])
const visibleModalAddReference = ref(false)
const visibleModalAddOffer = ref(false)
const visibleModalInformationEmailVerification = ref(false)
const visibleModalInformationDocumentVal = ref(false)
const visibleModalInformationSignatureCharte = ref(false)
const visibleModalGreenQuestion = ref(false)
const visibleModalInformationValidated = ref(false)
const controlledSwiper = ref(null)
const setControlledSwiper = (swiper) => {
  controlledSwiper.value = swiper
}
typesAccount.value = [{
  value: 'epargne',
  label: 'epargne',
}, {
  value: 'Compte courant',
  label: 'Compte courant',
}]
const formStateProfile = reactive<Record<string, any>>({
  avatar: null,
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  jobCat: undefined,
  localisation: '',
  phone: '',
  visibility: false,
  greenQuestion: '',
  url_fb: '',
  url_github: '',
  url_twitter: '',
  url_linkedin: '',
})
const formStateContactDetails = reactive<any>({
  address: '',
  address_plus: '',
  legal_form: '',
  name: '',
})
const formStateTaxe = reactive<any>({
  taxe: undefined,
})
const formStateTypeIban = reactive<any>({
  type_iban: '',
})
const formStateLegalRepresentative = reactive<any>({
  lastname: '',
  firstname: '',
  birthday: undefined,
  postal: undefined,
  city_of_birth: '',
  country_of_birth: '',
  nationality: '',
})
const formStateLegalMention = reactive<any>({
  sas: '',
  siret: '',
  rcs: '',
  naf: '',
  tva_intracom: '',
  days: undefined,
})
const formStateIbanModule = reactive<any>({
  cb_iban_address_holder: '',
  cb_iban_name_lastname: '',
  cb_iban_postal: '',
  cb_iban_city: '',
  cb_iban_country: '',
  cb_iban_iban: '',
  cb_iban_region: '',
  cb_iban_account_number: '',
  cb_iban_aba_transit_number: '',
  cb_iban_account_type: '',
  cb_iban_branch_code: '',
  cb_iban_number_institution: '',
  cb_iban_bank_name: '',
  cb_iban_bic_swift: '',
  cb_iban_account_country: '',
})
const modelRefReference = reactive({
  id: undefined,
  title: '',
  client: '',
  place: '',
  image: undefined,
  domain: undefined,
  dateBegin: undefined,
  dateEnd: undefined,
  confidential: false,
})
const modelRefOffer = reactive({
  id: undefined,
  name: '',
  domain: undefined,
  price: undefined,
  show_price: false,
  description: '',
})

const rulesIban = reactive({
  cb_iban_name_lastname: [
    {
      required: true,
      message: 'Saisir le nom et prénom',
    },
  ],
  cb_iban_address_holder: [
    {
      required: true,
      message: 'Saisir l\'adresse du titulaire',
    },
  ],
  cb_iban_postal: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (!value)
          return Promise.reject(new Error('Veuillez saisir un code postal'))
        if (!Number.isInteger(+value)) {
          return Promise.reject(new Error('Veuillez saisir que des chiffres'))
        }
        else {
          if (value.length !== 5)
            return Promise.reject(`${'le numéro doit contenir 5 chiffres'}`)
          else
            return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_city: [
    {
      required: true,
      message: 'Saisissez la Ville',
    },
  ],
  cb_iban_country: [
    {
      required: true,
      message: 'Saisir le Pays',
    },
  ],
  cb_iban_iban: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        const tva_numbers = value.slice(2, value.length)
        if (!value)
          return Promise.reject(new Error('Saisir la tva intracom'))
        if (!value[0].match('F') || !value[1].match('R') || !/^\d+$/.test(tva_numbers))
          return Promise.reject(new Error('Veuillez saisir ce champ correctement (FR***********)'))
        else
          return Promise.resolve()
      },
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateIbanModule.type_iban === 'iban') {
          const numbers = value.slice(2, value.length)
          if (!value) { return Promise.reject(new Error('Veuillez saisir votre iban')) }
          else if (!value[0].match('F') || !value[1].match('R') || !/^\d+$/.test(numbers)) {
            return Promise.reject(new Error('Veuillez saisir ce champ correctement (FR***********)'))
          }
          else {
            if (value.length < 27)
              return Promise.reject(`${'l\iban doit contenir au minimu 27 caractéres'}`)
            else
              return Promise.resolve()
          }
        }
        else { return Promise.resolve() }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_region: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'iban-us' || formStateTypeIban.type_iban === 'iban-ca' || formStateTypeIban.type_iban === 'others') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir la région'))
          else
            return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_account_number: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'iban-us' || formStateTypeIban.type_iban === 'iban-ca' || formStateTypeIban.type_iban === 'others') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir votre numéro de compte'))
          if (!Number.isInteger(+value)) {
            return Promise.reject(new Error('Veuillez saisir que des chiffres'))
          }
          else {
            if (value.length !== 8)
              return Promise.reject(`${'l\iban doit contenir 8 chiffres'}`)
            else
              return Promise.resolve()
          }
        }
        else {
          return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_aba_transit_number: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'iban-us') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir votre ABA Transit number'))
          if (!Number.isInteger(+value)) {
            return Promise.reject(new Error('Veuillez saisir que des chiffres'))
          }
          else {
            if (value.length !== 9)
              return Promise.reject(`${'l\iban doit contenir 9 chiffres'}`)
            else
              return Promise.resolve()
          }
        }
        else {
          return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_account_type: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'iban-us') {
          if (!value)
            return Promise.reject(new Error('Choisir le type de compte'))
          else return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_branch_code: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'iban-ca') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir votre numéro de compte'))
          if (!Number.isInteger(+value)) {
            return Promise.reject(new Error('Veuillez saisir que des chiffres'))
          }
          else {
            if (value.length !== 5)
              return Promise.reject(`${'iban doit contenir 5 chiffres'}`)
            else
              return Promise.resolve()
          }
        }
        else {
          return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_number_institution: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'iban-ca') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir le numéro de votre institution '))
          if (!Number.isInteger(+value)) {
            return Promise.reject(new Error('Veuillez saisir que des chiffres'))
          }
          else {
            if (value.length !== 3)
              return Promise.reject(`${'le numéro d\institution doit contenir 3 chiffres'}`)
            else
              return Promise.resolve()
          }
        }
        else {
          return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_bank_name: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'iban-ca') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir le nom de votre banque '))

          else
            return Promise.resolve()
        }
        else {
          return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_bic_swift: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'others') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir le BIC/SWIFT'))
          if (!value.match('^[A-Z]+$')) {
            return Promise.reject(new Error('Veuillez saisir que des caractères'))
          }
          else {
            if (value.length !== 8)
              return Promise.reject(`${'le BIC/SWIFT doit contenir 8 chiffres'}`)
            else
              return Promise.resolve()
          }
        }
        else {
          return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
  cb_iban_account_country: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        if (formStateTypeIban.type_iban === 'others') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir le pays du compte'))
        }
        else {
          return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
})
const rulesRef = reactive({
  client: [
    {
      required: true,
      message: 'Saisir le nom du client',
    },
    {
      min: 3,
      message: 'la longueur minimale est de 3',
      trigger: 'blur',
    },
  ],
  title: [
    {
      required: true,
      message: 'Saisir le titre',
    },
    {
      min: 3,
      message: 'la longueur minimale est de 3',
      trigger: 'blur',
    },
  ],
  place: [
    {
      required: true,
      message: 'Saisir la localisation',
    },
  ],
  domain: [
    {
      required: true,
      message: 'Choisissez un domaine',
    },
  ],
  image: [
    {
      required: true,
      message: 'Choisissez un image',
    },
  ],
  dateBegin: [
    {
      required: true,
      message: 'Choisissez la date de début',
    },
  ],
  dateEnd: [
    {
      required: true,
      message: 'Choisissez la date de fin',
    },
  ],
})
const rulesOffer = reactive({
  name: [
    {
      required: true,
      message: 'Saisir un nom',
    },
  ],
  domain: [
    {
      required: true,
      message: 'Choisissez un domaine',
    },
  ],
  price: [
    {
      required: true,
      message: 'Veuillez choisir un prix',
    },
  ],
  description: [
    {
      required: true,
      message: 'Rédigez la description',
    },
  ],
})
const rulesContactDetails = reactive({
  name: [
    {
      required: true,
      message: 'Saisir un nom',
    },
  ],
  address: [
    {
      required: true,
      message: 'Saisir l\'adresse',
    },
  ],
  legal_form: [
    {
      required: true,
    },
  ],
})
const rulesLegaleRepresentative = reactive({
  lastname: [
    {
      required: true,
      message: 'Saisir votre nom',
    },
  ],
  firstname: [
    {
      required: true,
      message: 'Saisir votre prénom',
    },
  ],
  birthday: [
    {
      required: true,
      message: 'choisissez une Date de naissance',
    },
  ],
  city_of_birth: [
    {
      required: true,
      message: 'choisissez une Ville de naissance',
    },
  ],
  country_of_birth: [
    {
      required: true,
      message: 'choisissez un pays de naissance',
    },
  ],
  nationality: [
    {
      required: true,
      message: 'choisissez une nationalité',
    },
  ],
  postal: [
    {
      required: true,
      message: 'Saisir un code postal',
    },
    {
      validator: async (_rule: RuleObject, value: string) => {
        if (!value)
          return Promise.reject(new Error('Veuillez saisir un code postal'))
        if (!Number.isInteger(+value)) {
          return Promise.reject(new Error('Veuillez saisir que des chiffres'))
        }
        else {
          if (value.length !== 5)
            return Promise.reject(`${'le numéro doit contenir 5 chiffres'}`)
          else
            return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
})
const rulesTaxe = reactive({
  taxe: [
    {
      required: true,
      message: 'Saisir un nombre entre 0 et 100',
    },
    {
      validator: async (_rule: RuleObject, value: string) => {
        if (!value)
          return Promise.reject(new Error('Veuillez saisir un numéro de taxe'))
        if (!Number.isInteger(+value)) {
          return Promise.reject(new Error('Veuillez saisir que des chiffres'))
        }
        else {
          if (value > 100 || value < 0)
            return Promise.reject(`${'le numéro doit être entre 0 et 100'}`)
          else
            return Promise.resolve()
        }
      },
    },
  ],
})
const rulesLegaleMention = reactive({
  sas: [
    {
      required: true,
      message: 'Saisir votre capitale',
    },
    {
      validator: async (_rule: RuleObject, value: string) => {
        if (!/^\d+$/.test(value) || Number(value) < 0)
          return Promise.reject(new Error('Veuillez saisir que des chiffres'))
        else
          return Promise.resolve()
      },
    },
  ],
  siret: [
    {
      required: true,
      message: 'Saisir le numéro SIRET',
    },
    {
      validator: async (_rule: RuleObject, value: string) => {
        if (value.length !== 14 || !/^\d+$/.test(value))
          return Promise.reject(new Error('Veuillez saisir que des chiffres'))
        else
          return Promise.resolve()
      },
    },
  ],
  rcs: [
    {
      required: true,
      message: 'Saisir le champ RCS',
    },
    {
      validator: async (_rule: RuleObject, value: string) => {
        if (!/^[a-zA-Z]+$/.test(value))
          return Promise.reject(new Error('Veuillez saisir que des lettres'))
        else
          return Promise.resolve()
      },
    },
  ],
  naf: [
    {
      required: true,
      message: 'Saisir le champ NAF',
    },
    {
      validator: async (_rule: RuleObject, value: string) => {
        const nafNumbers = value.slice(0, value.length - 1)
        if (value.length !== 5 || !value.match('^[A-Z0-9]+$') || !/^\d+$/.test(nafNumbers) || !value[value.length - 1].match('^[A-Z]+$'))
          return Promise.reject(new Error('Veuillez saisir ce champ correctement (1234A)'))
        else
          return Promise.resolve()
      },
    },
  ],
  tva_intracom: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
        const tva_numbers = value.slice(2, value.length)
        if (!value)
          return Promise.reject(new Error('Saisir la tva intracom'))
        if (!value[0].match('F') || !value[1].match('R') || !/^\d+$/.test(tva_numbers))
          return Promise.reject(new Error('Veuillez saisir ce champ correctement (FR***********)'))
        else
          return Promise.resolve()
      },
    },
  ],
  days: [
    {
      required: true,
      message: 'Saisir le nombre de jours (max 60)',
    },
    {
      validator: async (_rule: RuleObject, value: number) => {
        if (value < 0 || value > 60)
          return Promise.reject(new Error('Saisir le nombre de jours (max 60)'))
        else
          return Promise.resolve()
      },
    },
  ],
})

const getFormData = async () => {
  globalApi.countries().then(({ data }) => {
    data.value && (countries.value = data.value.map(l => ({
      value: l,
      label: l,
    })))
  })
  globalApi.iban().then(({ data }) => {
    data.value && (countriesIban.value = data.value.map(l => ({
      value: l.name,
      label: l.name,
    })))
  })
  globalApi.ibanOthers().then(({ data }) => {
    data.value && (countriesIbanOthers.value = data.value.map(l => ({
      value: l.name,
      label: l.name,
    })))
  })
  adminApi.jobs().then(({ data }) => {
    data.value && (jobs.value = data.value.filter(j => j._id && j.name).map(j => ({
      value: j._id,
      label: j.name,
    })))
  })
  globalApi.activities().then(({ data }) => {
    data.value && (activities.value = data.value.filter(a => a.code && a.name).map(a => ({
      value: a.code,
      label: a.name,
    })))
  })
  globalApi.legalForms().then(({ data }) => {
    data.value && (legalForms.value = data.value.filter(a => a.index && a.name).map(a => ({
      value: a.name,
      label: a.name,
    })))
  })
  profile.value = null
  await agenceApi.profile(props.id).then(({ data }) => {
    if (data.value) {
      profile.value = data.value
      references.value = data.value.references
      offers.value = data.value.offers
      activitiesCode.value = activities.value.map(a => a.value)
      const agence = profile.value?.agence
      profileAvatar.value = agence.image || ''
      formStateProfile.description = agence.description
      formStateProfile.email = agence.email
      formStateProfile.username = agence.username
      formStateProfile.nameAgence = agence.nameAgence
      formStateProfile.firstName = agence.firstName
      formStateProfile.lastName = agence.lastName
      formStateProfile.confidentiality = agence.confidentiality
      formStateProfile.jobCat = agence.jobCat
      formStateProfile.localisation = agence.localisation
      formStateProfile.phone = agence.phone
      formStateProfile.price_per_day = agence.price_per_day
      formStateProfile.visibility = !!agence.visibility
      formStateProfile.greenQuestion = agence.greenQuestion
      formStateProfile.url_fb = agence.url_fb
      formStateProfile.url_github = agence.url_github
      formStateProfile.url_twitter = agence.url_twitter
      formStateProfile.url_linkedin = agence.url_linkedin
      socials.facebook.link = agence.url_fb
      socials.twitter.link = agence.url_twitter
      socials.linkedin.link = agence.url_linkedin
      socials.github.link = agence.url_github
    }
  })
  profileEntreprise.value = null
  await profileEntrepriseApi.profileEntrepriseAgence(props.id).then(async ({ data }) => {
    if (data) {
      profileEntreprise.value = data
      const contactDetails = profileEntreprise.value?.contactDetails
      const legalRepresentative = profileEntreprise.value?.legalRepresentative
      const legalMention = profileEntreprise.value?.legalMention
      const ibanModule = profileEntreprise.value?.ibanModule
      const ibanUsModule = profileEntreprise.value?.ibanUsModule
      const ibanCaModule = profileEntreprise.value?.ibanCaModule
      const ibanOthers = profileEntreprise.value?.ibanOthers
      formStateContactDetails.address = contactDetails.address
      formStateContactDetails.address_plus = contactDetails.address_plus
      formStateContactDetails.legal_form = contactDetails.legal_form
      formStateContactDetails.name = contactDetails.name
      formStateLegalRepresentative.lastname = legalRepresentative.lastname
      formStateLegalRepresentative.firstname = legalRepresentative.firstname
      formStateLegalRepresentative.birthday = legalRepresentative.birthday
      formStateLegalRepresentative.postal = legalRepresentative.postal
      formStateLegalRepresentative.city_of_birth = legalRepresentative.city_of_birth
      formStateLegalRepresentative.country_of_birth = legalRepresentative.country_of_birth
      formStateLegalRepresentative.nationality = legalRepresentative.nationality
      formStateTaxe.taxe = profileEntreprise.value.taxe
      formStateTypeIban.type_iban = profileEntreprise.value.type_iban
      formStateLegalMention.sas = legalMention.sas
      formStateLegalMention.siret = legalMention.siret
      formStateLegalMention.rcs = legalMention.rcs
      formStateLegalMention.naf = legalMention.naf
      formStateLegalMention.tva_intracom = legalMention.tva_intracom
      formStateLegalMention.days = legalMention.days
      switch (formStateTypeIban.type_iban) {
        case 'iban': {
          formStateIbanModule.cb_iban_address_holder = ibanModule.cb_iban_address_holder
          formStateIbanModule.cb_iban_city = ibanModule.cb_iban_city
          formStateIbanModule.cb_iban_country = ibanModule.cb_iban_country
          formStateIbanModule.cb_iban_iban = ibanModule.cb_iban_iban
          formStateIbanModule.cb_iban_name_lastname = ibanModule.cb_iban_name_lastname
          formStateIbanModule.cb_iban_postal = ibanModule.cb_iban_postal
          break
        }
        case 'iban-us': {
          formStateIbanModule.cb_iban_address_holder = ibanUsModule.cb_iban_address_holder
          formStateIbanModule.cb_iban_city = ibanUsModule.cb_iban_city
          formStateIbanModule.cb_iban_country = ibanUsModule.cb_iban_country
          formStateIbanModule.cb_iban_name_lastname = ibanUsModule.cb_iban_name_lastname
          formStateIbanModule.cb_iban_postal = ibanUsModule.cb_iban_postal
          formStateIbanModule.cb_iban_region = ibanUsModule.cb_iban_region
          formStateIbanModule.cb_iban_account_number = ibanUsModule.cb_iban_account_number
          formStateIbanModule.cb_iban_aba_transit_number = ibanUsModule.cb_iban_aba_transit_number
          formStateIbanModule.cb_iban_account_type = ibanUsModule.cb_iban_account_type

          break
        }
        case 'iban-ca': {
          formStateIbanModule.cb_iban_address_holder = ibanCaModule.cb_iban_address_holder
          formStateIbanModule.cb_iban_city = ibanCaModule.cb_iban_city
          formStateIbanModule.cb_iban_country = ibanCaModule.cb_iban_country
          formStateIbanModule.cb_iban_name_lastname = ibanCaModule.cb_iban_name_lastname
          formStateIbanModule.cb_iban_postal = ibanCaModule.cb_iban_postal
          formStateIbanModule.cb_iban_region = ibanCaModule.cb_iban_region
          formStateIbanModule.cb_iban_account_number = ibanCaModule.cb_iban_account_number
          formStateIbanModule.cb_iban_branch_code = ibanCaModule.cb_iban_branch_code
          formStateIbanModule.cb_iban_number_institution = ibanCaModule.cb_iban_number_institution
          formStateIbanModule.cb_iban_bank_name = ibanCaModule.cb_iban_bank_name
          break
        }
        case 'others': {
          formStateIbanModule.cb_iban_address_holder = ibanOthers.cb_iban_address_holder
          formStateIbanModule.cb_iban_city = ibanOthers.cb_iban_city
          formStateIbanModule.cb_iban_country = ibanOthers.cb_iban_country
          formStateIbanModule.cb_iban_name_lastname = ibanOthers.cb_iban_name_lastname
          formStateIbanModule.cb_iban_postal = ibanOthers.cb_iban_postal
          formStateIbanModule.cb_iban_region = ibanOthers.cb_iban_region
          formStateIbanModule.cb_iban_account_number = ibanOthers.cb_iban_account_number
          formStateIbanModule.cb_iban_aba_transit_number = ibanOthers.cb_iban_bic_swift
          formStateIbanModule.cb_iban_account_type = ibanOthers.cb_iban_account_country
          break
        }
        default: {
          break
        }
      }
    }
    else {
      message.error('profil entreprise non chargé')
    }
  })
  typesIban.value = [{
    value: 'iban',
    label: 'IBAN',
  }, {
    value: 'iban-us',
    label: 'Compte bancaire US',
  },
  {
    value: 'iban-ca',
    label: 'Compte bancaire CA',
  },
  {
    value: 'others',
    label: 'BIC/SWIFT',
  },
  {
    value: 'empty',
    label: 'pas encore choisi',
  }]
}
const getScore = () => {
  if (!profile.value?.agence)
    return 0
  let value = 0
  profile.value.agence?.email_verification && (value += 10)
  profile.value.agence?.documents_val && (value += 30)
  profile.value.agence?.validated && (value += 10)
  profile.value.agence?.signed_client && (value += 10)
  profile.value.agence.description?.length !== 0 && (value += 10)
  profile.value.agence?.references?.length >= 1 && (value += 10)
  profile.value.agence?.offers?.length >= 1 && (value += 10)
  profile.value.agence?.greenQuestion?.length >= 1 && (value += 10)
  return value
}
const resetModuleIban = () => {
  formStateIbanModule.cb_iban_country = ''
  formStateIbanModule.cb_iban_region = ''
  formStateIbanModule.cb_iban_account_number = ''
  formStateIbanModule.cb_iban_aba_transit_number = ''
  formStateIbanModule.cb_iban_account_type = ''
  formStateIbanModule.cb_iban_branch_code = ''
  formStateIbanModule.cb_iban_number_institution = ''
  formStateIbanModule.cb_iban_bank_name = ''
  formStateIbanModule.cb_iban_bic_swift = ''
  formStateIbanModule.cb_iban_account_country = ''
}
const updateProfile = async (profileData: any) => {
  const { data } = await agenceApi.updateProfile(profileData)
  data && message.info(data.message)
  getFormData()
  profileEntrepriseLoading.value = false
}
const onLoad = () => {
  profileEntrepriseLoading.value = true
}
const useFormIbanModule = useForm(formStateIbanModule, rulesIban)
const validateIbanModule = useFormIbanModule.validate
const validateInfosIbanModule = useFormIbanModule.validateInfos
const onSubmitIbanModule = async () => {
  validateIbanModule()
    .then(async () => {
      const params = toRaw(formStateIbanModule)
      params.id_agence = props.id
      params.type_iban = formStateTypeIban.type_iban
      const { data } = await profileEntrepriseApi.updatePaymentModuleAgence(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
const useFormContactDetails = useForm(formStateContactDetails, rulesContactDetails)
const validateContactDetails = useFormContactDetails.validate
const validateInfosContactDetails = useFormContactDetails.validateInfos
const onSubmitContactDetails = async () => {
  validateContactDetails()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateContactDetails)
      params.id_agence = props.id
      const { data } = await profileEntrepriseApi.updateContactDetailsAgence(params)
      if (data) {
        message.info(data.message)
        currentStepProfileEtprs.value < 4 && (currentStepProfileEtprs.value += 1)
      }
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
const useFormLegalRepresentative = useForm(formStateLegalRepresentative, rulesLegaleRepresentative)
const validateLegalRepresentative = useFormLegalRepresentative.validate
const validateInfosLegalRepresentative = useFormLegalRepresentative.validateInfos
const onSubmitLegalRepresentative = async () => {
  if (userDocument.value) {
    const formData = new FormData()
    formData.append('documents', userDocument.value)
    profile.value?.agence?.documents?.length && formData.append('old_documents', profile.value?.agence?.documents[0])
    agenceApi.uploadDocuments(formData).catch(err => message.error(`${err}`))
  }
  validateLegalRepresentative()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateLegalRepresentative)
      params.id_agence = props.id
      const { data } = await profileEntrepriseApi.updateLegalRepresentativeAgence(params)
      if (data) {
        message.info(data.message)
        currentStepProfileEtprs.value < 4 && (currentStepProfileEtprs.value += 1)
      }
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
const useFormTaxe = useForm(formStateTaxe, rulesTaxe)
const validateTaxe = useFormTaxe.validate
const validateInfosTaxe = useFormTaxe.validateInfos
const onSubmitTaxe = async () => {
  validateTaxe()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateTaxe)
      params.id_agence = props.id
      const { data } = await profileEntrepriseApi.updateTaxeAgence(params)
      if (data) {
        message.info(data.message)
        currentStepProfileEtprs.value < 4 && (currentStepProfileEtprs.value += 1)
      }
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
      message.error(err.message)
    }).finally(() => profileEntrepriseLoading.value = false)
}
const useFormLegalMention = useForm(formStateLegalMention, rulesLegaleMention)
const validateLegalMention = useFormLegalMention.validate
const validateInfosLegalMention = useFormLegalMention.validateInfos
const onSubmitLegalMentions = async () => {
  validateLegalMention()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateLegalMention)
      params.id_agence = props.id
      const { data } = await profileEntrepriseApi.updateLegalMentionAgence(params)
      if (data) {
        message.info(data.message)
        currentStepProfileEtprs.value < 4 && (currentStepProfileEtprs.value += 1)
      }
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
      message.error(err.message)
    }).finally(() => profileEntrepriseLoading.value = false)
}
const { resetFields, validate, validateInfos: referenceValidateInfos } = useForm(modelRefReference, rulesRef)
const onSubmit = async () => {
  validate()
    .then(async () => {
      const params: any = toRaw(modelRefReference)

      if (params.id) {
        const id = params.id
        delete params.id
        params.image && (params.old_image = 'test')
        const form_data = new FormData()

        for (const key in params)
          form_data.append(key, params[key])

        console.log(form_data)
        const { data } = await agenceApi.updateReference(id, form_data)
        message.info(data.message)
        visibleModalAddReference.value = false
        modelRefReference.id = undefined
        modelRefReference.title = ''
        modelRefReference.image = undefined
        modelRefReference.client = ''
        modelRefReference.place = ''
        modelRefReference.domain = undefined
        modelRefReference.dateBegin = undefined
        modelRefReference.dateEnd = undefined
        modelRefReference.confidential = false
        resetFields()
      }
      else {
        delete params.id

        params.old_image = 'test'
        const form_data = new FormData()

        for (const key in params)
          form_data.append(key, params[key])
        const { data } = await agenceApi.addReference(form_data)
        message.info(data.message)
        visibleModalAddReference.value = false
      }
      profile.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
const updateReference = (item) => {
  modelRefReference.id = item._id
  modelRefReference.client = item.client
  modelRefReference.title = item.title
  modelRefReference.place = item.place
  modelRefReference.domain = item.domain
  modelRefReference.dateBegin = item.dateBegin
  modelRefReference.dateEnd = item.dateEnd
  modelRefReference.confidential = item.confidential
  visibleModalAddReference.value = true
}

const deleteReference = (id: string) => {
  Modal.confirm({
    content: 'Supprimer la référence client',
    icon: h(ExclamationCircleOutlined),
    onOk() {
      return agenceApi.deleteReference(id).then(({ data }) => {
        message.info(data.message)
        profile.value = null
        getFormData()
      }).catch(err => message.error(`Oops errors! ${err}`))
    },
    cancelText: 'Retour',
    onCancel() {
      Modal.destroyAll()
    },
  })
}
const useFormOffer = useForm(modelRefOffer, rulesOffer)
const resetFieldsOffer = useFormOffer.resetFields
const validateOffer = useFormOffer.validate
const validateInfosOffer = useFormOffer.validateInfos
const onSubmitOffer = async () => {
  validateOffer()
    .then(async () => {
      const params = toRaw(modelRefOffer)

      if (params.id) {
        const id = params.id
        delete params.id
        const { data } = await agenceApi.updateOffer(id, params)
        message.info(data.message)
        visibleModalAddOffer.value = false
      }
      else {
        const { data } = await agenceApi.addOffer(params)
        message.info(data.message)
        visibleModalAddOffer.value = false
      }
      modelRefOffer.id = undefined
      modelRefOffer.name = ''
      modelRefOffer.price = undefined
      modelRefOffer.show_price = false
      modelRefOffer.domain = undefined
      modelRefOffer.description = ''
      profile.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
const updateOffer = (item) => {
  modelRefOffer.id = item._id
  modelRefOffer.name = item.name
  modelRefOffer.price = item.price
  modelRefOffer.show_price = item.show_price
  modelRefOffer.domain = item.domain
  modelRefOffer.description = item.description
  visibleModalAddOffer.value = true
}
const deleteOffer = (id: string) => {
  Modal.confirm({
    content: 'Supprimer l\'offre',
    icon: h(ExclamationCircleOutlined),
    onOk() {
      return agenceApi.deleteOffer(id).then(({ data }) => {
        message.info(data.message)
        profile.value = null
        getFormData()
      }).catch(err => message.error(`Oops errors! ${err}`))
    },
    cancelText: 'Retour',
    onCancel() {
      Modal.destroyAll()
    },
  })
}
const handleChangeUpload = async (event, offer) => {
  if (event.file.type === 'application/pdf') {
    const formData = new FormData()
    formData.append('documents', event.file)
    if (offer.documents?.length)
      formData.append('old_documents', offer.documents)

    message.loading('téléchargement en cours', 0)
    const { data } = await agenceApi.uploadDocumentsOffer(offer._id, formData)
    message.destroy()
    if (data)
      message.info(data.message)
  }
}
const beforeUploadProfileAvatar = async (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng)
    message.error('You can only upload JPG file!')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M)
    message.error('Image must smaller than 2MB!')
  if (isJpgOrPng && isLt2M) {
    formStateProfile.avatar = [file]
    const base64 = await useBase64(file).execute()
    profileAvatar.value = base64
  }
  return false
}
const onFinish = async (values: any) => {
  if (values.avatar) {
    const formData = new FormData()
    formData.append('image', values.avatar[0].originFileObj)
    if (profile.value.agence?.image)
      formData.append('old_image', 'test')
    await agenceApi.uploadProfile(formData)
  }
  updateProfile({ ...profile, ...values })
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
onMounted(async () => {
  console.log('props id ', props.id)
  getFormData()
})
</script>

<template>
  <main class="main-content">
    <!--== Start Page Header Area Wrapper ==-->
    <div class="page-header-area sec-overlay sec-overlay-black" data-bg-img="../assets/img/photos/bg2.jpg">
      <div class="container pt-0 pb-0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                {{ profile?.agence?.nameAgence }}
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li>
                    <a href="index.html">Accueil</a>
                  </li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Profil</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Page Header Area Wrapper ==-->

    <!--== Start Login Area Wrapper ==-->
    <section class="account-login-area bg-gray-100">
      <div class="container pt-5">
        <a-skeleton v-if="!profile" avatar active :paragraph="{ rows: 15 }" />
        <div v-else class>
          <div class="p-2 flex bg-white rounded-sm">
            <div class="mr-5 flex-none">
              <a-avatar
                :src="profile?.agence?.image" shape="square"
                :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 220, xxl: 260 }"
              />
            </div>
            <div class="flex-grow justify-between flex">
              <div>
                <div class="flex flex-col">
                  <!--begin::Name-->
                  <div class="flex items-center mb-2">
                    <a href="#" class="text-gray-900 text-hover-primary fs-4">{{ `${profile?.agence?.lastName}
                                          ${profile?.agence?.firstName}`
                    }}</a>
                    <a href="#" class="flex items-center mr-3 ml-1">
                      <span v-if="profile?.agence?.validated" class="i-carbon-checkmark-filled text-xl inline-block" />
                      <span v-else class="i-carbon-close-filled text-red-600 text-xl inline-block" />
                    </a>
                    <a-rate class="h-[42px]" :value="0" allow-half />
                  </div>
                  <!--end::Name-->
                  <!--begin::Info-->
                  <div class="flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    <a href="#" class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2">
                      <span class="i-carbon-user-avatar-filled-alt text-xl inline-block mr-1" />
                      {{ profile?.agence?.nameAgence }}
                    </a>
                    <a href="#" class="flex items-center text-gray-400 text-hover-primary me-5 mb-2">
                      <span class="i-carbon-location-filled text-xl inline-block mr-1" />
                      {{ profile?.agence?.localisation }}
                    </a>
                    <a href="#" class="flex items-center text-gray-400 text-hover-primary mb-2">
                      <span class="i-carbon-email text-xl inline-block mr-1" />
                      {{ currentUser?.email }}
                    </a>
                  </div>
                  <!--end::Info-->
                </div>
                <div class>
                  <social-media :socials="socials" />
                </div>
              </div>
            </div>
          </div>
          <div class="pt-0">
            <div class>
              <a-card title="Profile Details" :bordered="false" class="rounded-sm">
                <div class="flex w-full">
                  <div class="w-[60%]">
                    <a-form
                      :model="formStateProfile" v-bind="formItemLayout" @finish-failed="onFinishFailed"
                      @finish="onFinish"
                    >
                      <a-form-item class="font-bold" name="greenQuestion" label="Question GREEN">
                        <label class="font-normal">{{ formStateProfile.greenQuestion }}</label>
                      </a-form-item>
                      <a-form-item class="font-bold" name="description" label="Description">
                        <label class="font-normal">{{ formStateProfile.description }}</label>
                      </a-form-item>
                      <a-form-item class="font-bold" name="jobCat" label="Catégorie de métier">
                        <label class="font-normal">{{ profile?.jobCat }}</label>
                      </a-form-item>
                      <a-form-item class="font-bold" name="localisation" label="Localisation">
                        <label class="font-normal">{{ formStateProfile.localisation }}</label>
                      </a-form-item>
                    </a-form>
                  </div>
                  <div class="w-[40%]">
                    <h3 class="text-xl mb-4">
                      Informations
                    </h3>
                    <div>
                      <div class="flex mb-4">
                        <div class="w-[60%]">
                          Signature Charte
                        </div>
                        <div class="w-[40%]">
                          <span
                            :class="`px-3 py-1 bg-${profile?.agence?.signed_client ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                          >{{ profile?.agence?.signed_client ? 'Oui' : 'Non' }}</span>
                        </div>
                      </div>
                    </div>
                    <span class="hidden bg-green w-full h-full block border-2 border-sky-500" />
                  </div>
                </div>
              </a-card>
            </div>
            <div class>
              <a-card title="Référence" :bordered="false" class="rounded-sm">
                <div v-if="profile && references.length" class="">
                  <swiper
                    :modules="[Controller]" :slides-per-view="4" class="p-3" :pagination="{
                      clickable: true,
                    }" :grab-cursor="true" @swiper="setControlledSwiper"
                  >
                    <swiper-slide v-for="(item, index) in references" :key="index">
                      <a-card class="mr-2" hoverable>
                        <a-card-meta :title="item.title">
                          <template #description>
                            <div class="flex items-center justify-center">
                              <a-avatar
                                :src="item?.image"
                                shape="square"
                                :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 120, xxl: 160 }"
                              />
                            </div>
                            <br>
                            <div class="flex items-center">
                              <span class="text-dark-300 mr-1.5">
                                Client:
                              </span>
                              {{ item.client }} <span
                                v-if="item.confidential"
                                class="i-ant-design-check-circle-twotone ml-1 inline-block text-sm text-green-300"
                              />
                            </div>
                            <div class="flex items-center">
                              <span class="text-dark-300 mr-1.5">
                                Domaine:
                              </span>
                              <span class="inline-block bg-green-400 text-xs rounded-sm p-1 text-light-50 ml-1">
                                {{ activities[activitiesCode.indexOf(item.domain)].label }}
                              </span>
                            </div>
                            <div class="flex items-center">
                              <span class="text-dark-300 mr-1.5">
                                Localisation:
                              </span>
                              <span>
                                {{ item.place }}
                              </span>
                            </div>
                            <div class="flex items-center">
                              <span class="text-dark-300 mr-1.5">
                                Date:
                              </span>
                              {{ dayjs(item.dateBegin).format("DD-MM-YYYY") }} / {{
                                dayjs(item.dateEnd).format("DD-MM-YYYY")
                              }}
                            </div>
                          </template>
                        </a-card-meta>
                      </a-card>
                    </swiper-slide>
                  </swiper>
                </div>
                <a-result
                  v-else status="404" title="aucune référence trouvée"
                />
              </a-card>
            </div>

            <div class>
              <a-card title="Offres" :bordered="false" class="rounded-sm">
                <div v-if="profile && offers?.length">
                  <swiper
                    :modules="[Controller]" :slides-per-view="4" class="p-3" :pagination="{
                      clickable: true,
                    }" :grab-cursor="true" @swiper="setControlledSwiper"
                  >
                    <swiper-slide v-for="(item, index) in offers" :key="index">
                      <a-card class="mr-2" hoverable>
                        <a-card-meta :title="item.title">
                          <template #description>
                            <div class="flex items-center mb-1">
                              <span class="text-dark-300 mr-1.5">
                                Nom:
                              </span>
                              {{ item.name }}
                            </div>
                            <div class="flex items-center  mb-1">
                              <span class="text-dark-300 mr-1.5">
                                Domaine:
                              </span>
                              {{ activities[activitiesCode.indexOf(item.domain)].label }}
                            </div>
                            <div class="flex items-center mb-1">
                              <span class="text-dark-300 mr-1.5">
                                price:
                              </span>
                              <span>
                                {{ item.price }}
                              </span>
                              <span
                                class="inline-block text-xs rounded-sm p-1 text-light-50 ml-1"
                                :class="item.show_price ? 'bg-green-400' : 'bg-red-400'"
                              >
                                {{ item.show_price ? 'Affiché' : 'caché' }}
                              </span>
                            </div>
                            <div class="flex items-center  mb-1">
                              <span class="text-dark-300 mr-1.5">
                                Documents:
                              </span>
                              <span
                                class="inline-block text-xs rounded-sm p-1 text-light-50 ml-1"
                                :class="item.show_price ? 'bg-green-400' : 'bg-red-400'"
                              >
                                {{ item.documents ? 'téléchargé' : 'non téléchargé' }}
                              </span>
                            </div>
                          </template>
                        </a-card-meta>
                      </a-card>
                    </swiper-slide>
                  </swiper>
                </div>
                <a-result
                  v-else status="404" title="aucune offre n'a été trouvée"
                />
              </a-card>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Login Area Wrapper ==-->
  </main>
  <a-modal
    v-model:visible="visibleModalAddReference" width="40%"
    :title="modelRefReference.id ? 'Modifier référence client' : 'Ajouter une référence'" @ok="() => { }"
  >
    <div>
      <a-form layout="vertical" :wrapper-col="{ span: 24 }">
        <a-form-item label="Nom Client :" v-bind="referenceValidateInfos.client">
          <a-input
            v-model:value="modelRefReference.client"
            @blur="validate('client', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Choisir un domaine :" v-bind="referenceValidateInfos.domain">
          <a-select
            v-model:value="modelRefReference.domain" placeholder="Choisir un domaine" :options="activities"
            @blur="validate('domain', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Titre :" v-bind="referenceValidateInfos.title">
          <a-input
            v-model:value="modelRefReference.title"
            @blur="validate('title', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Localisation :" v-bind="referenceValidateInfos.place">
          <a-input
            v-model:value="modelRefReference.place"
            @blur="validate('place', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <div class="grid grid-cols-2 gap-3 w-full">
          <div>
            <a-form-item name="switch" label="référence confidentielle ?">
              <a-switch v-model:checked="modelRefReference.confidential" />
            </a-form-item>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 w-full">
          <div>
            <a-form-item name="image" label="Logo" v-bind="referenceValidateInfos.image">
              <a-upload
                name="file"
                :before-upload="(file) => {
                  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                  if (!isJpgOrPng) {
                    message.error('You can only upload JPG file!');
                  }
                  if(isJpgOrPng) {
                    modelRefReference.image = file
                  }
                  return false;
                }"
              >
                <a-button class="flex items-center">
                  <span class="i-ant-design-upload-outlined block text-md mr-1" />
                  Upload
                </a-button>
              </a-upload>
            </a-form-item>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 w-full">
          <div class>
            <a-form-item
              name="month-picker" label="Date Début" :wrapper-col="{ span: 24, offset: 0 }" :label-col="{
                sm: { span: 24 }
              }" v-bind="referenceValidateInfos.dateBegin"
            >
              <a-date-picker
                v-model:value="modelRefReference.dateBegin" style="width: 100%" value-format="YYYY-MM-DD"
                :disabled-date="(current: Dayjs) => current && current > dayjs().endOf('day')"
                @blur="validate('dateBegin', { trigger: 'blur' }).catch(() => { })"
              />
            </a-form-item>
          </div>
          <div class>
            <a-form-item
              :label-col="{
                sm: { span: 24 }
              }" :wrapper-col="{ span: 24, offset: 0 }" name="month-picker" label="Date de fin"
              v-bind="referenceValidateInfos.dateEnd"
            >
              <a-date-picker
                v-model:value="modelRefReference.dateEnd" style="width: 100%" value-format="YYYY-MM-DD"
                :disabled-date="(current: Dayjs) => current && current > dayjs().endOf('day') || current < dayjs(modelRefReference.dateBegin)"
                @blur="validate('dateEnd', { trigger: 'blur' }).catch(() => { })"
              />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </div>
    <template #footer>
      <a-button type="primary" @click.prevent="onSubmit">
        {{ modelRefReference.id ? 'Modifier' : 'Ajouter' }}
      </a-button>
      <a-button
        style="margin-left: 10px"
        @click="() => !modelRefReference.id ? resetFields() : (visibleModalAddReference = false)"
      >
        {{ modelRefReference.id ? 'Fermer' : 'Réinitialiser' }}
      </a-button>
    </template>
  </a-modal>
  <!-- modale offer creation and update -->
  <a-modal
    v-model:visible="visibleModalAddOffer" width="40%"
    :title="modelRefOffer.id ? 'Modifier une offre' : 'Ajouter une offre'" @ok="() => { }"
  >
    <div>
      <a-form layout="vertical" :wrapper-col="{ span: 24 }">
        <a-form-item label="Nom :" v-bind="validateInfosOffer.name">
          <a-input v-model:value="modelRefOffer.name" @blur="validate('name', { trigger: 'blur' }).catch(() => { })" />
        </a-form-item>
        <a-form-item label="Choisir un domaine :" v-bind="validateInfosOffer.domain">
          <a-select
            v-model:value="modelRefOffer.domain" placeholder="Choisir un domaine" :options="activities"
            @blur="validate('domain', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <div class="grid grid-cols-2 gap-3 w-full">
          <div>
            <a-form-item label="prix :" v-bind="validateInfosOffer.price">
              <a-input-number
                v-model:value="modelRefOffer.price" addon-after="€"
                @blur="validate('price', { trigger: 'blur' }).catch(() => { })"
              />
            </a-form-item>
          </div>
          <div>
            <a-form-item label="afficher le prix ?">
              <a-switch v-model:checked="modelRefOffer.show_price" checked-value="1" un-checked-value="0" />
            </a-form-item>
          </div>
        </div>
        <a-form-item label="Description :">
          <a-textarea v-model:value="modelRefOffer.description" placeholder="description" auto-size />
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <a-button type="primary" @click.prevent="onSubmitOffer">
        {{ modelRefReference.id ? 'Modifier' : 'Ajouter' }}
      </a-button>
      <a-button
        style="margin-left: 10px"
        @click="() => !modelRefReference.id ? resetFieldsOffer() : (visibleModalAddOffer = false)"
      >
        {{ modelRefReference.id ? 'Fermer' : 'Réinitialiser' }}
      </a-button>
    </template>
  </a-modal>
  <!-- end modale offer creation and update -->
  <a-modal v-model:visible="visibleModalInformationEmailVerification" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          <h3> Vérification email</h3>
        </div>
        <div>
          Lors de votre inscription sur Green-positiv, nous vous avons fait parvenir un email de vérification avec un
          lien de validation.
          Merci de bien vouloir cliquer sur le lien pour confirmer votre adresse. Si vous ne l'avez pas reçu, cliquer
          sur ce
          <a class="link-info">lien</a> pour le recevoir.
        </div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="visibleModalInformationEmailVerification = false">
        Retour
      </a-button>
    </template>
  </a-modal>
  <a-modal v-model:visible="visibleModalInformationDocumentVal" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          <h3>Validation des documents</h3>
        </div>
        <div>
          Merci de bien vouloir télécharger l'ensemble des documents demandés pour que nous puissions procéder à la
          validation de votre profil.
        </div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="visibleModalInformationDocumentVal = false">
        Retour
      </a-button>
    </template>
  </a-modal>
  <a-modal v-model:visible="visibleModalGreenQuestion" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          <h3>Répondre à la question Green Positiv</h3>
        </div>
        <div>
          Veuillez compléter ce champ afin de valider votre profil.
        </div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="visibleModalGreenQuestion = false">
        Retour
      </a-button>
    </template>
  </a-modal>
  <a-modal v-model:visible="visibleModalInformationSignatureCharte" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          <h3>Signature de la charte</h3>
        </div>
        <div>
          Merci de bien vouloir lire et accepter la charte afin de valider votre profil via <div
            class="green"
            @click="router.push(`/charte/agence/${$props.id}`)"
          >
            <span>ce lien</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="visibleModalInformationSignatureCharte = false">
        Retour
      </a-button>
    </template>
  </a-modal>
  <a-modal v-model:visible="visibleModalInformationValidated" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          <h3>Compte validé</h3>
        </div>
        <div>
          Afin de procéder à la validation de votre compte, tous les champs doivent être renseignés. Si ce n'est pas le
          cas, votre profil restera non valide jusqu'à ce que vous remplissiez toutes les étapes.
        </div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="visibleModalInformationValidated = false">
        Retour
      </a-button>
    </template>
  </a-modal>
</template>
<style lang="scss">
.ant-tabs-tab {
  @apply px-4;
}

.ant-tabs-top>.ant-tabs-nav {
  @apply mb-7;
}

.ant-tabs-nav .ant-tabs-nav-wrap {
  @apply bg-white;
}

.ant-tabs-content-holder {
  @apply rounded-sm;
}

.steps-content {
  margin-top: 12px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
}

.ant-tabs-tab {
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
}

.swiper-wrapper {
  @apply items-center;
}
</style>
<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
</route>
