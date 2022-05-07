<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import { Form, Modal, message } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import SwiperCore, { Controller, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import adminApi from '~/api/modules/admin'
import globalApi from '~/api/modules/global'
import freelancerApi from '~/api/modules/freelancer'
import profileEntrepriseApi from '~/api/modules/profil-entreprise'
import missionApi from '~/api/modules/mission'
import { currentUser } from '~/stores'
import 'swiper/css/pagination'
SwiperCore.use([Controller, Pagination])
const controlledSwiper = ref(null)

const setDevisSwiper = (swiper) => {
  controlledSwiper.value = swiper
}

const useForm = Form.useForm
const props = defineProps<{ id: string }>()
const router = useRouter()
const { t } = useI18n()
const activeKey = ref('1')
const activeKeyProfileEtprs = ref('1')
const currentStepProfileEtprs = ref(0)
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
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
const profileAvatar = ref('')
const userDocument = ref(null)
const profileEntreprise = ref(null)
const skills = ref([])
const skillsValue = ref([])
const passionValue = ref('')
const interestValue = ref([])
const legalForms = ref([])
const languages = ref([])
const countries = ref([])
const countriesIban = ref([])
const countriesIbanOthers = ref([])
const jobs = ref([])
const types = ref([])
const typesAccount = ref([])
const typesIban = ref([])
const activities = ref([])
const devis = ref([])
const visibleModalAddExperience = ref(false)
const visibleModalAddFormation = ref(false)
const visibleModalAddCertification = ref(false)
const visibleModalInformationEmailVerification = ref(false)
const visibleModalInformationDocumentVal = ref(false)
const visibleModalInformationSignatureCharte = ref(false)
const visibleModalGreenQuestion = ref(false)
const visibleModalInformationValidated = ref(false)
const profileEntrepriseLoading = ref(false)
const visibleModalUpdateDevis = ref(false)
const showUpdateBloc = ref(false)
let indexBloc = null

/* module devis */
const modelRefDevis = reactive({
  _id: null,
  id_freelance: undefined,
  id_company: undefined,
  id_mission: undefined,
  dateBegin: null,
  dateEnd: null,
  tasks: [],
  total: 0,
  tva: 20,
  totalTva: 0,
  totalGreen: 0,
  totalGreenTva: 0,
  totalUser: 0,
  confirmed: undefined,
})
const rulesDevis = reactive({
  dateBegin: [
    {
      required: true,
      message: 'Choisissez la date de début',
    },
  ],
  dateEnd: [
    {
      validator: async (_rule: RuleObject, value: string) => {
        if (!value)
          return Promise.reject('Choisissez la date de fin')
        else if (modelRefDevis.dateBegin != null && value < modelRefDevis.dateBegin)
          return Promise.reject('La date de fin doit être supérieur à la date de début')
        else
          return Promise.resolve()
      },
      trigger: 'blur',
    },
  ],
})
const useFormDevis = useForm(modelRefDevis, rulesDevis)
const resetFieldsDevis = useFormDevis.resetFields
const validateDevis = useFormDevis.validate
const devisValidateInfos = useFormDevis.validateInfos

const sendDevis = async (index) => {
  profileEntrepriseLoading.value = true
  validateDevis()
    .then(async () => {
      if (currentUser.value.role === 'Freelancer') {
        const { data } = await missionApi.sendDevisFreelance(modelRefDevis)
        if (data) {
          visibleModalUpdateDevis.value = false
          message.info(data.message)
          profileEntrepriseLoading.value = false
        }
        else { message.error(data.message) }
      }
      else if (currentUser.value.role === 'Agence') {
        const { data } = await missionApi.sendDevisAgence(modelRefDevis)
        if (data) {
          visibleModalUpdateDevis.value = false
          message.info(data.message)
          profileEntrepriseLoading.value = false
        }
        else { message.error(data.message) }
      }
      else { console.log('problem in send Devis') }
    })
    .catch((err) => {
    }).finally(() => profileEntrepriseLoading.value = false)
}

/* end module devis */
const formStateProfile = reactive<Record<string, any>>({
  avatar: null,
  passion: '',
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  jobCat: undefined,
  localisation: '',
  phone: '',
  price_per_day: undefined,
  show_price: false,
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
const modelRefExperience = reactive({
  id: undefined,
  title: '',
  society: '',
  place: '',
  domain: undefined,
  isFreelancer: false,
  actuallyPost: false,
  dateBegin: undefined,
  dateEnd: undefined,
  skills: [],
  description: '',
})
const modelRefCertification = reactive({
  id: undefined,
  name: '',
  organism: '',
  type: '',
  year: undefined,
  description: '',
  place: '',
})
/**/
const modelRefFormation = reactive({
  id: undefined,
  name: '',
  institute: '',
  type: '',
  year: undefined,
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
        if (formStateIbanModule.type_iban === 'iban') {
          const numbers = value.slice(2, value.length)
          if (!value) { return Promise.reject(new Error('Veuillez saisir votre iban')) }
          else if (!value[0].match('F') || !value[1].match('R') || !/^\d+$/.test(numbers)) {
            return Promise.reject(new Error('Veuillez saisir ce champ correctement (FR***********)'))
          }
          else {
            if (value.length < 27)
            // eslint-disable-next-line prefer-promise-reject-errors
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
  society: [
    {
      required: true,
      message: 'Saisir la société',
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
  dateBegin: [
    {
      required: true,
      message: 'Choisissez la date de début',
    },
  ],
  dateEnd: [
    {
      validator: async (_rule: RuleObject, value: string) => {
        if (modelRefExperience.actuallyPost)
          return Promise.resolve()
        else if (!value)
          return Promise.reject('Choisissez la date de fin')
        else
          return Promise.resolve()
      },
      trigger: 'blur',
      message: 'S',
    },
  ],
})
/**/
const rulesForm = reactive({
  name: [
    {
      required: true,
      message: 'Saisir un nom',
    },
  ],
  institute: [
    {
      required: true,
      message: 'Saisir une institution',
    },
  ],
  type: [
    {
      required: true,
      message: 'choisir un type',
    },
  ],
  year: [
    {
      required: true,
      message: 'Saisissez l\'année d\'obtention',
    },
  ],
  description: [
    {
      required: true,
      message: 'Rédigez une description',
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
            // eslint-disable-next-line prefer-promise-reject-errors
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
const rulesCert = reactive({
  name: [
    {
      required: true,
      message: 'Saisir un nom',
    },
  ],
  organism: [
    {
      required: true,
      message: 'Saisir l\'organisme',
    },
  ],
  type: [
    {
      required: true,
      message: 'choisir un type',
    },
  ],
  year: [
    {
      required: true,
      message: 'Saisissez l\'année d\'obtention',
    },
  ],
  description: [
    {
      required: true,
      message: 'Rédigez une description',
    },
  ],
  place: [
    {
      required: true,
      message: 'Saisir le lieu',
    },
  ],
})
const calcDisponibilityFreq = (params: number, toSlide = true) => {
  if (toSlide) {
    if (params === 0)
      return 0
    else if (params === 1)
      return 15
    else if (params === 2)
      return 30
    else if (params === 3)
      return 50
    else if (params === 4)
      return 70
    else
      return 100
  }
  else {
    if (params === 0)
      return 0
    else if (params === 15)
      return 1
    else if (params === 30)
      return 2
    else if (params === 50)
      return 3
    else if (params === 70)
      return 4
    else
      return 5
  }
}

const getFormData = async () => {
  globalApi.languages().then(({ data }) => {
    data.value && (languages.value = data.value.map(l => ({
      value: l.name,
      label: l.name,
    })))
  })
  adminApi.skills().then(({ data }) => {
    data.value && (skills.value = data.value.map(l => ({
      value: l.name,
      label: l.name,
    })))
  })
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
  missionApi.getDevisFreelance().then(({ data }) => {
    if (data)
      devis.value = data
  })
  profile.value = null
  await freelancerApi.profile(props.id).then(({ data }) => {
    if (data.value) {
      profile.value = data.value
      const skills = profile.value?.freelancer?.skills.map(s => ({
        value: s,
        label: s,
      }))
      skillsValue.value = skills
      passionValue.value = profile.value.freelancer?.passion
      const freelancer = profile.value?.freelancer
      profileAvatar.value = freelancer.image || ''
      formStateProfile.description = freelancer.description
      formStateProfile.email = freelancer.email
      formStateProfile.username = freelancer.username
      formStateProfile.firstName = freelancer.firstName
      formStateProfile.lastName = freelancer.lastName
      formStateProfile.jobCat = freelancer.jobCat
      formStateProfile.localisation = freelancer.localisation
      formStateProfile.phone = freelancer.phone
      formStateProfile.price_per_day = freelancer.price_per_day
      formStateProfile.show_price = !!freelancer.show_price
      formStateProfile.disponibility = !!freelancer.disponibility
      formStateProfile.greenQuestion = freelancer.greenQuestion
      formStateProfile.url_fb = freelancer.url_fb
      formStateProfile.url_github = freelancer.url_github
      formStateProfile.url_twitter = freelancer.url_twitter
      formStateProfile.url_linkedin = freelancer.url_linkedin
      formStateProfile.disponibility_freq = calcDisponibilityFreq(+freelancer.disponibility_freq)
      socials.facebook.link = freelancer.url_fb
      socials.twitter.link = freelancer.url_twitter
      socials.linkedin.link = freelancer.url_linkedin
      socials.github.link = freelancer.url_github
    }
  })
  /**/
  profileEntreprise.value = null
  await profileEntrepriseApi.profileEntreprise(props.id).then(async ({ data }) => {
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
  types.value = [{
    value: 'en cours',
    label: 'en cours',
  }, {
    value: 'terminé',
    label: 'terminé',
  }]
  typesAccount.value = [{
    value: 'epargne',
    label: 'epargne',
  }, {
    value: 'Compte courant',
    label: 'Compte courant',
  }]
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
const onLoad = () => {
  profileEntrepriseLoading.value = true
}
const getScore = () => {
  if (!profile.value?.freelancer)
    return 0
  let value = 0
  profile.value.freelancer?.email_verification && (value += 10)
  profile.value.freelancer?.documents_val && (value += 30)
  profile.value.freelancer?.validated && (value += 10)
  profile.value.freelancer?.signed_client && (value += 10)
  profile.value.freelancer.description?.length !== 0 && (value += 10)
  profile.value.freelancer?.skills?.length >= 7 && (value += 10)
  profile.value.freelancer?.languages?.length >= 1 && (value += 10)
  profile.value.freelancer?.greenQuestion?.length >= 1 && (value += 10)
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
  profileData.disponibility_freq = calcDisponibilityFreq(+formStateProfile.disponibility_freq, false)
  const { data } = await freelancerApi.updateProfile(profileData)
  data && message.info(data.message)
  getFormData()
  profileEntrepriseLoading.value = false
}

/* bloc iban modules */
const useFormIbanModule = useForm(formStateIbanModule, rulesIban)
const validateIbanModule = useFormIbanModule.validate
const validateInfosIbanModule = useFormIbanModule.validateInfos
const onSubmitIbanModule = async () => {
  validateIbanModule()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateIbanModule)
      params.id_freelancer = props.id
      params.type_iban = formStateTypeIban.type_iban
      const { data } = await profileEntrepriseApi.updatePaymentModule(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
    }).finally(() => profileEntrepriseLoading.value = false)
}
/* bloc end iban modules */
/* bloc contact details */
const useFormContactDetails = useForm(formStateContactDetails, rulesContactDetails)
const validateContactDetails = useFormContactDetails.validate
const validateInfosContactDetails = useFormContactDetails.validateInfos
const onSubmitContactDetails = async () => {
  validateContactDetails()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateContactDetails)
      params.id_freelancer = props.id
      const { data } = await profileEntrepriseApi.updateContactDetails(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
/* end bloc contact details */
/* bloc legal representative */
const useFormLegalRepresentative = useForm(formStateLegalRepresentative, rulesLegaleRepresentative)
const validateLegalRepresentative = useFormLegalRepresentative.validate
const validateInfosLegalRepresentative = useFormLegalRepresentative.validateInfos
const onSubmitLegalRepresentative = async () => {
  if (userDocument.value) {
    const formData = new FormData()
    formData.append('documents', userDocument.value)
    profile.value?.freelancer?.documents?.length && formData.append('old_documents', profile.value?.freelancer?.documents[0])
    freelancerApi.uploadDocuments(formData).catch(err => message.error(`${err}`))
  }
  validateLegalRepresentative()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateLegalRepresentative)
      params.id_freelancer = props.id
      const { data } = await profileEntrepriseApi.updateLegalRepresentative(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
/* end bloc legal representative */
/* bloc taxe */
const useFormTaxe = useForm(formStateTaxe, rulesTaxe)
const validateTaxe = useFormTaxe.validate
const validateInfosTaxe = useFormTaxe.validateInfos
const onSubmitTaxe = async () => {
  validateTaxe()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateTaxe)
      params.id_freelancer = props.id
      const { data } = await profileEntrepriseApi.updateTaxe(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
      message.error(err.message)
    }).finally(() => profileEntrepriseLoading.value = false)
}
/* end bloc taxe */
/* bloc legal mention */
const useFormLegalMention = useForm(formStateLegalMention, rulesLegaleMention)
const validateLegalMention = useFormLegalMention.validate
const validateInfosLegalMention = useFormLegalMention.validateInfos
const onSubmitLegalMentions = async () => {
  validateLegalMention()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateLegalMention)
      params.id_freelancer = props.id
      const { data } = await profileEntrepriseApi.updateLegalMention(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
      message.error(err.message)
    }).finally(() => profileEntrepriseLoading.value = false)
}
/* end bloc legal mention */
/* bloc experience */
const { resetFields, validate, validateInfos: experienceValidateInfos } = useForm(modelRefExperience, rulesRef)
const onSubmit = async () => {
  validate()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(modelRefExperience)
      if (params.id) {
        const id = params.id
        delete params.id
        modelRefExperience.actuallyPost && (modelRefExperience.dateEnd = undefined)
        const { data } = await freelancerApi.updateExperience(id, params)
        message.info(data.message)
        visibleModalAddExperience.value = false
      }
      else {
        const { data } = await freelancerApi.addExperience(params)
        message.info(data.message)
        visibleModalAddExperience.value = false
      }
      profile.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
const updateExperience = (item) => {
  modelRefExperience.id = item._id
  modelRefExperience.title = item.title
  modelRefExperience.society = item.society
  modelRefExperience.place = item.place
  modelRefExperience.domain = item.domain
  modelRefExperience.isFreelancer = item.isFreelancer
  modelRefExperience.actuallyPost = item.actuallyPost
  modelRefExperience.dateBegin = item.dateBegin
  modelRefExperience.dateEnd = item.dateEnd
  modelRefExperience.skills = item.skills
  modelRefExperience.description = item.description
  visibleModalAddExperience.value = true
}
const deleteExperience = (id: string) => {
  setTimeout(() => {
    Modal.confirm({
      content: 'Supprimer l\'expérience ',
      icon: h(ExclamationCircleOutlined),
      onOk() {
        return freelancerApi.deleteExperience(id).then(({ data }) => {
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
  })
}
/* end bloc experience */
/* bloc formation */
const useFormFormation = useForm(modelRefFormation, rulesForm)
const resetFieldsFormation = useFormFormation.resetFields
const validateFormation = useFormFormation.validate
const validateInfosFormation = useFormFormation.validateInfos
const onSubmitForm = async () => {
  validateFormation()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(modelRefFormation)
      if (params.id) {
        const id = params.id
        delete params.id
        const { data } = await freelancerApi.updateFormation(id, params)
        message.info(data.message)
        visibleModalAddFormation.value = false
      }
      else {
        const { data } = await freelancerApi.addFormation(params)
        message.info(data.message)
        visibleModalAddFormation.value = false
      }
      profile.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
const updateFormation = (item) => {
  modelRefFormation.id = item._id
  modelRefFormation.name = item.name
  modelRefFormation.institute = item.institute
  modelRefFormation.type = item.type
  modelRefFormation.year = item.year
  modelRefFormation.description = item.description
  visibleModalAddFormation.value = true
}
const updateDevis = (item, idCompany) => {
  if (item.state === 'terminé' && item.confirmed === false) {
    modelRefDevis._id = item._id
    modelRefDevis.id_freelance = item.id_freelance
    modelRefDevis.id_mission = item.id_mission
    modelRefDevis.id_company = idCompany
    modelRefDevis.dateBegin = item.dateBegin
    modelRefDevis.dateEnd = item.dateEnd
    modelRefDevis.state = item.state
    modelRefDevis.tasks = item.tasks
    modelRefDevis.total = item.total
    modelRefDevis.tva = item.tva
    modelRefDevis.totalTva = item.totalTva
    modelRefDevis.totalGreen = item.totalGreen
    modelRefDevis.totalGreenTva = item.totalGreenTva
    modelRefDevis.totalUser = item.totalUser

    visibleModalUpdateDevis.value = true
  }
  else { message.warning('vous ne pouvez pas modifier ce devis') }
}
const formStateBloc = reactive<Record<string, any>>({
  description: '',
  cost_per_hour: 50,
  nb_hours: 1,
})
const updateBloc = (index: number) => {
  indexBloc = index
  formStateBloc.description = modelRefDevis.tasks[indexBloc].description
  formStateBloc.cost_per_hour = modelRefDevis.tasks[indexBloc].cost_per_hour
  formStateBloc.nb_hours = modelRefDevis.tasks[indexBloc].nb_hours
  showUpdateBloc.value = true
}

const updateTask = () => {
  modelRefDevis.tasks[indexBloc].description = formStateBloc.description
  modelRefDevis.tasks[indexBloc].cost_per_hour = formStateBloc.cost_per_hour
  modelRefDevis.tasks[indexBloc].nb_hours = formStateBloc.nb_hours
  showUpdateBloc.value = false
  indexBloc = null
}
const deleteFormation = (id: string) => {
  setTimeout(() => {
    Modal.confirm({
      content: 'Supprimer une formation',
      icon: h(ExclamationCircleOutlined),
      onOk() {
        return freelancerApi.deleteFormation(id).then(({ data }) => {
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
  })
}
/* end bloc formation */
/* bloc certification */
const useFormCertification = useForm(modelRefCertification, rulesCert)
const resetFieldsCertification = useFormCertification.resetFields
const validateCertification = useFormCertification.validate
const validateInfosCertification = useFormCertification.validateInfos
const onSubmitCert = async () => {
  validateCertification()
    .then(async () => {
      profileEntrepriseLoading.value = true
      const params = toRaw(modelRefCertification)
      if (params.id) {
        const id = params.id
        delete params.id
        const { data } = await freelancerApi.updateCertification(id, params)
        message.info(data.message)
        visibleModalAddCertification.value = false
      }
      else {
        const { data } = await freelancerApi.addCertification(params)
        message.info(data.message)
        visibleModalAddCertification.value = false
      }
      profile.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
const updateCertification = (item) => {
  modelRefCertification.id = item._id
  modelRefCertification.name = item.name
  modelRefCertification.organism = item.organism
  modelRefCertification.type = item.type
  modelRefCertification.year = item.year
  modelRefCertification.description = item.description
  modelRefCertification.place = item.place
  visibleModalAddCertification.value = true
}
const deleteCertification = (id: string) => {
  setTimeout(() => {
    Modal.confirm({
      content: 'Supprimer une certification',
      icon: h(ExclamationCircleOutlined),
      onOk() {
        return freelancerApi.deleteCertification(id).then(({ data }) => {
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
  })
}
/* end bloc certification */
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
    if (profile.value.freelancer?.image)
      formData.append('old_image', 'test')
    await freelancerApi.uploadProfile(formData)
  }
  updateProfile({ ...profile, ...values })
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const removeLanguage = async (lang: any) => {
  const { data } = await freelancerApi.deleteLanguage(lang).catch(err => message.error(err.message))
  if (data) {
    message.info(data.message)
    getFormData()
  }
}
const updateLanguage = async (lang: any) => {
  const { data } = await freelancerApi.updateLanguage(lang).catch(err => message.error(err.message))
  if (data) {
    message.info(data.message)
    getFormData()
  }
}
const addLanguage = async (lang: any) => {
  const { data } = await freelancerApi.addLanguage(lang).catch(err => message.error(err.message))
  if (data) {
    message.info(data.message)
    getFormData()
  }
}
onMounted(async () => {
  getFormData()
})
</script>

<template>
  <main class="main-content">
    <!--== Start Page Header Area Wrapper ==-->
    <div
      class="page-header-area sec-overlay sec-overlay-black"
      data-bg-img="../assets/img/photos/bg2.jpg"
    >
      <div class="container pt-0 pb-0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                Mon Profil
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
                :src="profile?.freelancer?.image"
                shape="square"
                :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 220, xxl: 260 }"
              />
            </div>
            <div class="flex-grow justify-between flex">
              <div>
                <div class="flex flex-col">
                  <!--begin::Name-->
                  <div class="flex items-center mb-2">
                    <a
                      href="#"
                      class="text-gray-900 text-hover-primary fs-4"
                    >{{ `${profile?.freelancer?.lastName} ${profile?.freelancer?.firstName}` }}</a>
                    <a href="#" class="flex items-center mr-3 ml-1">
                      <span
                        v-if="profile?.freelancer?.validated"
                        class="i-carbon-checkmark-filled text-xl inline-block"
                      />
                      <span v-else class="i-carbon-close-filled text-red-600 text-xl inline-block" />
                    </a>
                    <a-rate class="h-[42px]" :value="0" allow-half />
                  </div>
                  <!--end::Name-->
                  <!--begin::Info-->
                  <div class="flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    <a
                      href="#"
                      class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                    >
                      <span class="i-carbon-user-avatar-filled-alt text-xl inline-block mr-1" />
                      {{ profile?.freelancer?.title_profile }}
                    </a>
                    <a
                      href="#"
                      class="flex items-center text-gray-400 text-hover-primary me-5 mb-2"
                    >
                      <span class="i-carbon-location-filled text-xl inline-block mr-1" />
                      {{ profile?.freelancer?.localisation }}
                    </a>
                    <a href="#" class="flex items-center text-gray-400 text-hover-primary mb-2">
                      <span class="i-carbon-email text-xl inline-block mr-1" />
                      {{ currentUser?.email }}
                    </a>
                  </div>
                  <!--end::Info-->
                </div>
                <div class="flex">
                  <a-card :bordered="false" class="bg-white" :body-style="{padding: '5px'}">
                    <a-progress
                      type="circle" :stroke-color="{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }" :percent="getScore()" :width="80"
                    />
                  </a-card>
                </div>
                <div class>
                  <social-media :socials="socials" />
                </div>
              </div>
            </div>
          </div>
          <div class="pt-0">
            <a-tabs v-model:activeKey="activeKey" class="mt-0">
              <a-tab-pane key="1" tab="Profil">
                <div class>
                  <a-card title="Profile Details" :bordered="false" class="rounded-sm">
                    <div class="flex w-full">
                      <div class="w-[60%]">
                        <a-form
                          :model="formStateProfile"
                          v-bind="formItemLayout"
                          @finish-failed="onFinishFailed"
                          @finish="onFinish"
                        >
                          <h4>Qu'est ce qui fait de vous un profil "Green" et comment cela se traduit dans votre travail ? </h4>
                          <a-form-item name="greenQuestion" label="Question GREEN">
                            <a-input v-model:value="formStateProfile.greenQuestion" />
                          </a-form-item>
                          <a-form-item label="Avatar">
                            <a-form-item name="avatar" no-style>
                              <a-upload-dragger
                                v-model:fileList="formStateProfile.avatar"
                                :multiple="false"
                                :before-upload="beforeUploadProfileAvatar"
                                name="avtar"
                              >
                                <div v-if="profileAvatar.length">
                                  <img ref="image" class="w-30 mx-auto" :src="profileAvatar">
                                </div>
                                <div v-else class="py-3">
                                  <p class="ant-upload-drag-icon">
                                    <span
                                      class="i-ant-design-inbox-outlined inline-block text-3xl"
                                    />
                                  </p>
                                  <p
                                    class="ant-upload-text"
                                  >
                                    Click or drag file to this area to upload
                                  </p>
                                  <p class="ant-upload-hint">
                                    Support for a single or bulk upload.
                                  </p>
                                </div>
                              </a-upload-dragger>
                            </a-form-item>
                          </a-form-item>
                          <a-form-item name="description" label="Description">
                            <a-input v-model:value="formStateProfile.description" />
                          </a-form-item>
                          <a-form-item name="firstName" label="Prénom">
                            <a-input v-model:value="formStateProfile.firstName" />
                          </a-form-item>
                          <a-form-item name="lastName" label="Nom">
                            <a-input v-model:value="formStateProfile.lastName" />
                          </a-form-item>
                          <a-form-item name="email" label="Email">
                            <a-input v-model:value="formStateProfile.email" />
                          </a-form-item>
                          <a-form-item name="localisation" label="Localisation">
                            <a-input v-model:value="formStateProfile.localisation" />
                          </a-form-item>
                          <a-form-item name="phone" label="Téléphone">
                            <a-input v-model:value="formStateProfile.phone" />
                          </a-form-item>
                          <a-form-item name="jobCat" label="Choisir une catégorie de métier">
                            <a-select
                              v-model:value="formStateProfile.jobCat"
                              placeholder="Choisir une catégorie de métier"
                              :options="jobs"
                            />
                          </a-form-item>
                          <a-form-item name="disponibility" label="Disponibilité">
                            <a-switch v-model:checked="formStateProfile.disponibility" />
                          </a-form-item>
                          <a-form-item name="disponibility_freq" label="Fréquence / semaine">
                            <a-slider
                              v-model:value="formStateProfile.disponibility_freq"
                              :step="null"
                              :tip-formatter="null"
                              :marks="{
                                0: '1 jour',
                                15: '2 jours',
                                30: '3 jours',
                                50: '4 jours',
                                70: 'Soirs & week-ends',
                                100: 'Temps plein',
                              }"
                            />
                          </a-form-item>
                          <a-form-item
                            name="price_per_day"
                            label="Définissez votre tarif"
                            :rules="[{ required: true, message: 'Veuillez saisir votre tarif' }]"
                          >
                            <a-input-number
                              v-model:value="formStateProfile.price_per_day" addon-after="€"
                              step="50" :min="50"
                              :max="9999"
                              @blur="validate('price_per_day', { trigger: 'blur' }).catch(() => { })"
                            />
                          </a-form-item>
                          <a-form-item name="show_price" label="Afficher le tarif">
                            <a-switch v-model:checked="formStateProfile.show_price" />
                          </a-form-item>
                          <a-form-item name="url_fb" label="lien facebook">
                            <a-input v-model:value="formStateProfile.url_fb" />
                          </a-form-item>
                          <a-form-item name="url_github" label="lien github">
                            <a-input v-model:value="formStateProfile.url_github" />
                          </a-form-item>
                          <a-form-item name="url_twitter" label="lien twitter">
                            <a-input v-model:value="formStateProfile.url_twitter" />
                          </a-form-item>
                          <a-form-item name="url_linkedin" label="lien linkedin">
                            <a-input v-model:value="formStateProfile.url_linkedin" />
                          </a-form-item>
                          <a-form-item class="mb-0" :wrapper-col="{ span: 2, offset: 20 }">
                            <a-button size="large" type="primary" html-type="submit" :loading="profileEntrepriseLoading" @click="onLoad()">
                              Enregistrer
                            </a-button>
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
                              Visibilité
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.visibility ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.visibility ? 'Visible' : 'Invisible' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Réponse Question Green
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.greenQuestion.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.greenQuestion ? 'Oui' : 'Non' }}</span>
                              <span
                                class="i-carbon-help-filled inline-block text-green-600 leading-2 text-sm ml-2 mr-0.5"
                                @click="visibleModalGreenQuestion = true"
                              />
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Description rédigé
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.description?.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.description?.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Au minimum sept compétences ajoutées
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.skills.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.skills.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Au minimum une langue ajoutée
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.languages.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.languages.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Vérification email
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.email_verification ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.email_verification ? 'Oui' : 'Non' }}</span>
                              <span
                                class="i-carbon-help-filled inline-block text-green-600 leading-2 text-sm ml-2 mr-0.5"
                                @click="visibleModalInformationEmailVerification = true"
                              />
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Confidentialité
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.confidentiality ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.confidentiality ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Documents validés
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.documents_val ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.documents_val ? 'Oui' : 'Non' }}</span>
                              <span
                                class="i-carbon-help-filled inline-block text-green-600 leading-2 text-sm ml-2 mr-0.5"
                                @click="visibleModalInformationDocumentVal = true"
                              />
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Signature Charte
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.signed_client ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.signed_client ? 'Oui' : 'Non' }}</span>
                              <span
                                class="i-carbon-help-filled inline-block text-green-600 leading-2 text-sm ml-2 mr-0.5"
                                @click="visibleModalInformationSignatureCharte = true"
                              />
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Compte validé
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.freelancer?.validated ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.freelancer?.validated ? 'Oui' : 'Non' }}</span>
                              <span
                                class="i-carbon-help-filled inline-block text-green-600 leading-2 text-sm ml-2 mr-0.5"
                                @click="visibleModalInformationValidated = true"
                              />
                            </div>
                          </div>
                        </div>
                        <span class="hidden bg-green w-full h-full block border-2 border-sky-500" />
                      </div>
                    </div>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="Experience" force-render>
                <div class>
                  <a-card title="Experience" :bordered="false" class="rounded-sm">
                    <div v-if="profile && profile?.experiences?.length">
                      <a-timeline mode="alternate">
                        <a-timeline-item>
                          <template #dot>
                            <a-tooltip>
                              <template #title>
                                Ajouter une expérience
                              </template>
                              <a
                                href="javascript:;"
                                @click="() => { resetFields(); modelRefExperience.id = undefined; visibleModalAddExperience = true }"
                              >
                                <span class="i-carbon-add-filled inline-block text-green-300" />
                              </a>
                            </a-tooltip>
                          </template>
                          <div class="leading-10">
                            <span class="invisible">Ajouter</span>
                          </div>
                        </a-timeline-item>
                        <a-timeline-item v-for="item in profile?.experiences" :key="item._id">
                          <template #dot>
                            <a-dropdown :trigger="['click', 'hover']">
                              <a class="ant-dropdown-link" @click.prevent>
                                <a href="javascript:;">
                                  <span
                                    class="i-carbon-recording-filled-alt inline-block text-green-300"
                                  />
                                </a>
                              </a>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item key="0" @click="updateExperience(item)">
                                    <span class="flex items-center">
                                      <span class="i-carbon-edit inline-block text-md mr-2" /> Modifier
                                    </span>
                                  </a-menu-item>
                                  <a-menu-divider />
                                  <a-menu-item key="1" @click="deleteExperience(item._id)">
                                    <span class="flex items-center">
                                      <span class="i-carbon-delete inline-block text-md mr-2" /> Supprimer
                                    </span>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
                          </template>
                          <div class="text-left">
                            <h3 class="text-gray-900 text-2xl flex items-center mb-0.5">
                              <span
                                class="i-carbon-enterprise inline-block text-gray-600 text-4xl mr-1 mb-1"
                              />
                              <span class="font-mono uppercase" />
                              {{ item.society }}
                            </h3>
                            <div class="text-lg text-gray-600">
                              {{ item.title }}
                            </div>
                            <div class="text-gray-500 text-sm flex items-center mb-1">
                              <span
                                class="i-carbon-time inline-block text-gray-700 text-xs mr-0.5"
                              />
                              <span>
                                {{
                                  dayjs(item.dateBegin).format("DD-MM-YYYY")
                                }}{{ item.dateEnd && ` - ${dayjs(item.dateEnd).format("DD-MM-YYYY")}` }}
                              </span>
                              <span v-if="!item.dateEnd && item.actuallyPost" class="ml-1">
                                <a-tag class="mr-0.5" color="#05f">Poste actuelle</a-tag>
                              </span>
                              <span v-if="item.isFreelancer" class="ml-1">
                                <a-tag class="mr-0.5" color="#f50">Freelance</a-tag>
                              </span>
                            </div>
                            <h4 class="text-gray-500 flex items-center mb-2">
                              <span
                                class="i-carbon-location-filled inline-block text-gray-700 leading-2 text-xs mr-0.5"
                              />
                              {{ item.place }}
                            </h4>
                            <h4 class="text-gray-500 flex items-center mb-2">
                              <span
                                class="i-carbon-idea inline-block text-gray-700 leading-2 text-xs mr-0.5"
                              />
                              {{ item.domain }}
                            </h4>
                            <a-typography-paragraph
                              :ellipsis="{ rows: 2 }"
                              :content="item.description"
                            />
                            <div>
                              <a-list
                                size="small"
                                item-layout="horizontal"
                                :data-source="item.skills.filter(s => s).map(s => ({ title: s }))"
                              >
                                <template #renderItem="{ item: skill }">
                                  <a-list-item>
                                    <div class="flex items-center">
                                      <span
                                        class="i-carbon-checkmark inline-block text-green-400 text-lg mr-2.5"
                                      />
                                      <span class="text-dark-100 text-sm">{{ skill.title }}</span>
                                    </div>
                                  </a-list-item>
                                </template>
                              </a-list>
                            </div>
                          </div>
                        </a-timeline-item>
                      </a-timeline>
                    </div>
                    <a-result
                      v-else
                      status="404"
                      title="Expériences non trouvées"
                      sub-title="veuillez ajouter vos expériences"
                    >
                      <template #extra>
                        <a-button type="primary" @click="visibleModalAddExperience = true">
                          Ajouter
                        </a-button>
                      </template>
                    </a-result>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="Formations" force-render>
                <div class>
                  <a-card title="Formations" :bordered="false" class="rounded-sm">
                    <div v-if="profile && profile?.formations?.length">
                      <a-timeline mode="alternate">
                        <a-timeline-item>
                          <template #dot>
                            <a-tooltip>
                              <template #title>
                                Ajouter une formation
                              </template>
                              <a
                                href="javascript:;"
                                @click="() => { resetFieldsFormation(); modelRefFormation.id = undefined; visibleModalAddFormation = true }"
                              >
                                <span class="i-carbon-add-filled inline-block text-green-300" />
                              </a>
                            </a-tooltip>
                          </template>
                          <div class="leading-10">
                            <span class="invisible">Ajouter</span>
                          </div>
                        </a-timeline-item>
                        <a-timeline-item v-for="item in profile?.formations" :key="item._id">
                          <template #dot>
                            <a-dropdown :trigger="['click', 'hover']">
                              <a class="ant-dropdown-link" @click.prevent>
                                <a href="javascript:;">
                                  <span
                                    class="i-carbon-recording-filled-alt inline-block text-green-300"
                                  />
                                </a>
                              </a>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item key="0" @click="updateFormation(item)">
                                    <span class="flex items-center">
                                      <span class="i-carbon-edit inline-block text-md mr-2" /> Modifier
                                    </span>
                                  </a-menu-item>
                                  <a-menu-divider />
                                  <a-menu-item key="1" @click="deleteFormation(item._id)">
                                    <span class="flex items-center">
                                      <span class="i-carbon-delete inline-block text-md mr-2" /> Supprimer
                                    </span>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
                          </template>
                          <div class="text-left">
                            <h3 class="text-gray-900 text-2xl flex items-center mb-0.5">
                              <span
                                class="i-carbon-enterprise inline-block text-gray-600 text-4xl mr-1 mb-1"
                              />
                              <span class="font-mono uppercase" />
                              {{ item.name }}
                              <a-tag
                                v-if="item.type === 'en cours'"
                                class="text-xs ml-2 leading-5"
                                color="#05f"
                              >
                                {{ item.type }}
                              </a-tag>
                              <a-tag
                                v-else
                                class="text-xs ml-2 leading-5"
                                color="#080"
                              >
                                {{ item.type }}
                              </a-tag>
                              <a-tag class="text-xs ml-2 leading-5" color="#f50">
                                {{ item.year }}
                              </a-tag>
                            </h3>
                            <a-typography-paragraph
                              :ellipsis="{ rows: 2 }"
                              :content="item.description"
                            />
                          </div>
                        </a-timeline-item>
                      </a-timeline>
                    </div>
                    <a-result
                      v-else
                      status="404"
                      title="Formations non trouvées"
                      sub-title="veuillez ajouter vos formations"
                    >
                      <template #extra>
                        <a-button type="primary" @click="visibleModalAddFormation = true">
                          Ajouter
                        </a-button>
                      </template>
                    </a-result>
                    <div>
                      <h3 class="text-dark-50 mb-1 text-lg">
                        Compétences:
                      </h3>
                      <a-select
                        v-model:value="skillsValue"
                        mode="tags"
                        style="width: 100%"
                        :token-separators="[',']"
                        placeholder="Choisissez les compétences proposés ou rédigez ceux propre à vous"
                        :options="skills"
                      />
                      <a-button
                        class="mt-3"
                        type="primary"
                        block
                        @click="onLoad();updateProfile({ ...profile.freelancer, skills: skillsValue })"
                      >
                        Ajouter vos compétences
                      </a-button>
                    </div>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="4" tab="Certifications" force-render>
                <div class>
                  <a-card title="Certifications" :bordered="false" class="rounded-sm">
                    <div v-if="profile && profile?.certifications?.length">
                      <a-timeline mode="alternate">
                        <a-timeline-item>
                          <template #dot>
                            <a-tooltip>
                              <template #title>
                                Ajouter une certification
                              </template>
                              <a
                                href="javascript:;"
                                @click="() => { resetFieldsCertification(); modelRefCertification.id = undefined; visibleModalAddCertification = true }"
                              >
                                <span class="i-carbon-add-filled inline-block text-green-300" />
                              </a>
                            </a-tooltip>
                          </template>
                          <div class="leading-10">
                            <span class="invisible">Ajouter</span>
                          </div>
                        </a-timeline-item>
                        <a-timeline-item v-for="item in profile?.certifications" :key="item._id">
                          <template #dot>
                            <a-dropdown :trigger="['click', 'hover']">
                              <a class="ant-dropdown-link" @click.prevent>
                                <a href="javascript:;">
                                  <span
                                    class="i-carbon-recording-filled-alt inline-block text-green-300"
                                  />
                                </a>
                              </a>
                              <template #overlay>
                                <a-menu>
                                  <a-menu-item key="0" @click="updateCertification(item)">
                                    <span class="flex items-center">
                                      <span class="i-carbon-edit inline-block text-md mr-2" /> Modifier
                                    </span>
                                  </a-menu-item>
                                  <a-menu-divider />
                                  <a-menu-item key="1" @click="deleteCertification(item._id)">
                                    <span class="flex items-center">
                                      <span class="i-carbon-delete inline-block text-md mr-2" /> Supprimer
                                    </span>
                                  </a-menu-item>
                                </a-menu>
                              </template>
                            </a-dropdown>
                          </template>
                          <div class="text-left">
                            <h3 class="text-gray-900 text-2xl flex items-center mb-0.5">
                              <span
                                class="i-carbon-enterprise inline-block text-gray-600 text-4xl mr-1 mb-1"
                              />
                              <span class="font-mono uppercase" />
                              {{ item.name }}
                              <a-tag
                                v-if="item.type === 'en cours'"
                                class="text-xs ml-2 leading-5"
                                color="#05f"
                              >
                                {{ item.type }}
                              </a-tag>
                              <a-tag
                                v-else
                                class="text-xs ml-2 leading-5"
                                color="#080"
                              >
                                {{ item.type }}
                              </a-tag>
                              <a-tag class="text-xs ml-2 leading-5" color="#f50">
                                {{ item.year }}
                              </a-tag>
                            </h3>
                            <h4 class="text-gray-500 flex items-center mb-2">
                              <span
                                class="i-carbon-location-filled inline-block text-gray-700 leading-2 text-xs mr-0.5"
                              />
                              {{ item.place }}
                            </h4>
                            <a-typography-paragraph
                              :ellipsis="{ rows: 2 }"
                              :content="item.description"
                            />
                          </div>
                        </a-timeline-item>
                      </a-timeline>
                    </div>
                    <a-result
                      v-else
                      status="404"
                      title="Certifications non trouvées"
                      sub-title="veuillez ajouter vos certifications"
                    >
                      <template #extra>
                        <a-button
                          type="primary"
                          @click="visibleModalAddCertification = true"
                        >
                          Ajouter
                        </a-button>
                      </template>
                    </a-result>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="5" tab="Centres d'intérets" force-render>
                <div class>
                  <a-card title="Centre d'interet" :bordered="false" class="rounded-sm">
                    <div>
                      <div class="mb-3">
                        <div class="text-dark-50 mb-1 text-lg">
                          Passion
                        </div>
                        <div>
                          <a-textarea
                            v-model:value="passionValue"
                            placeholder="Passion"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                          />
                        </div>
                      </div>
                      <div class="mb-1">
                        <div class="text-dark-50 mb-1 text-lg">
                          Centre d'intéréts
                        </div>
                        <a-select
                          v-model:value="interestValue"
                          mode="tags"
                          style="width: 100%"
                          placeholder="Choisissez les compétences proposés ou rédigez ceux propre à vous"
                          :options="profile.freelancer?.interest?.map(i => ({label: i, value: i})) || []"
                        />
                      </div>
                      <a-button
                        class="mt-3"
                        type="primary"
                        :loading="profileEntrepriseLoading"
                        @click="onLoad();updateProfile({ passion: passionValue, interest: interestValue})"
                      >
                        Modifier
                      </a-button>
                      <div class="mb-3 mt-4">
                        <div class="text-dark-50 mb-1 text-lg">
                          Langues
                        </div>
                        <LanguagesLevel
                          v-model="profile.freelancer.languages"
                          :languages="languages"
                          @remove-language="removeLanguage"
                          @add-language="addLanguage"
                          @update-language="updateLanguage"
                        />
                        <a-select
                          mode="multiple"
                          class="hidden"
                          placeholder="Choisir une langue"
                          :options="languages"
                          style="width: 100%"
                        >
                          <template #option="{ value: val, label, icon }">
                            <span role="img" :aria-label="val">{{ icon }}</span>
                            {{ label }}
                          </template>
                          <template #tagRender="{ value: val, label, closable, onClose, option }">
                            <a-tag :closable="closable" style="margin-right: 3px" @close="onClose">
                              {{ label }}&nbsp;&nbsp;
                              <span
                                role="img"
                                :aria-label="val"
                              >{{ option.icon }}</span>
                            </a-tag>
                          </template>
                        </a-select>
                      </div>
                    </div>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="6" tab="Ma micro entreprise" force-render>
                <div class>
                  <a-card title="Profile entreprise" :bordered="false" class="rounded-sm">
                    <div>
                      <a-tabs v-model:activeKey="activeKeyProfileEtprs" tab-position="left">
                        <a-tab-pane key="1" tab="Mon Entreprise">
                          <div>
                            <a-steps
                              v-model:current="currentStepProfileEtprs"
                              type="navigation"
                              size="small"
                              :style="{
                                marginBottom: '60px',
                                boxShadow: '0px -1px 0 0 #e8e8e8 inset',
                              }"
                            >
                              <a-step
                                :status="(profileEntreprise?.contactDetails?.name && profileEntreprise?.contactDetails?.address) ? 'finish' : (currentStepProfileEtprs === 0 ? 'process' : 'wait')"
                                title="Coordonnées"
                              />
                              <a-step
                                :disabled="!(profileEntreprise?.contactDetails?.name && profileEntreprise?.contactDetails?.address)"
                                :status="profileEntreprise?.legalRepresentative?.firstname ? 'finish' : (currentStepProfileEtprs === 1 ? 'process' : 'wait')"
                                title="Représentant"
                              />
                              <a-step
                                :disabled="!(profileEntreprise?.legalRepresentative?.firstname && profileEntreprise?.legalRepresentative?.lastname)"
                                :status="(profileEntreprise?.taxe) ? 'finish' : (currentStepProfileEtprs === 2 ? 'process' : 'wait')"
                                title="Taxes"
                              />
                              <a-step
                                :disabled="!(profileEntreprise?.taxe)"
                                :status="(profileEntreprise?.legalMention?.sas && profileEntreprise?.legalMention?.siret) ? 'finish' : (currentStepProfileEtprs === 3 ? 'process' : 'wait')"
                                title="Mentions"
                              />
                              <a-step :disabled="true" status="wait" title="Documents légaux" />
                            </a-steps>
                            <div class="p-4">
                              <div class="max-w-md mx-auto">
                                <a-form
                                  v-if="currentStepProfileEtprs === 0"
                                  layout="vertical"
                                  :label-col="{ span: 24 }"
                                  :wrapper-col="{ span: 24 }"
                                  :model="formStateContactDetails"
                                  @finish-failed="onFinishFailed"
                                  @finish="onFinish"
                                >
                                  <a-form-item
                                    label="Nom de votre entreprise (raison sociale)"
                                    v-bind="validateInfosContactDetails.name"
                                  >
                                    <a-input
                                      v-model:value="formStateContactDetails.name"
                                      @blur="validate('name', { trigger: 'blur' }).catch(() => { })"
                                    />
                                  </a-form-item>
                                  <a-form-item
                                    label="Adresse"
                                    v-bind="validateInfosContactDetails.address"
                                  >
                                    <a-input
                                      v-model:value="formStateContactDetails.address"
                                      @blur="validate('address', { trigger: 'blur' }).catch(() => { })"
                                    />
                                  </a-form-item>
                                  <a-form-item
                                    label="Complément d'adresse (facultatif)"
                                    v-bind="validateInfosContactDetails.address_plus"
                                  >
                                    <a-input
                                      v-model:value="formStateContactDetails.address_plus"
                                      @blur="validate('address_plus', { trigger: 'blur' }).catch(() => { })"
                                    />
                                  </a-form-item>
                                  <a-form-item label="Forme juridique">
                                    <a-select
                                      v-bind="validateInfosContactDetails.legal_form"
                                      v-model:value="formStateContactDetails.legal_form"
                                      placeholder="Forme juridique"
                                      :options="legalForms"
                                    />
                                  </a-form-item>
                                  <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                    <a-button
                                      :loading="profileEntrepriseLoading"
                                      block
                                      type="primary"
                                      @click.prevent="onSubmitContactDetails"
                                    >
                                      Enregistrer
                                    </a-button>
                                  </a-form-item>
                                </a-form>
                                <div v-else-if="currentStepProfileEtprs === 1">
                                  <p>
                                    Lorem ipsum dolor sit amet. Qui nulla quas et consequatur odit ea dolore alias. Ut
                                    natus corporis in consectetur sunt est accusamus galisum et impedit nobis eos
                                    consequuntur provident aut alias adipisci ut illum sapiente. Ut quam velit hic
                                    architecto autem est libero sunt ut eaque consequuntur qui voluptatibus accusamus.
                                    Eum vero sequi rem nisi natus ut repellendus aliquam et labore laboriosam sit itaque
                                    rerum. Est rerum dolore eos nihil sint a veniam earum aut consequatur
                                    cupiditate..
                                  </p>
                                  <a-form
                                    layout="vertical"
                                    :label-col="{ span: 24 }"
                                    :wrapper-col="{ span: 24 }"
                                    :model="formStateLegalRepresentative"
                                    @finish-failed="onFinishFailed"
                                    @finish="onFinish"
                                  >
                                    <a-form-item
                                      label="Nom"
                                      v-bind="validateInfosLegalRepresentative.lastname"
                                    >
                                      <a-input
                                        v-model:value="formStateLegalRepresentative.lastname"
                                        @blur="validate('lastname', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Prénom"
                                      v-bind="validateInfosLegalRepresentative.firstname"
                                    >
                                      <a-input
                                        v-model:value="formStateLegalRepresentative.firstname"
                                        @blur="validate('firstname', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item name="date-picker" label="Date de naissance">
                                      <a-form-item
                                        name="date-picker"
                                        label="Date de naissance"
                                        :wrapper-col="{ span: 24, offset: 0 }"
                                        :label-col="{ sm: { span: 24 } }"
                                        v-bind="validateInfosLegalRepresentative.birthday"
                                      >
                                        <a-date-picker
                                          v-model:value="formStateLegalRepresentative.birthday"
                                          style="width: 100%"
                                          value-format="YYYY-MM-DD"
                                          :disabled-date="(current: Dayjs) => current && current > dayjs().endOf('day')"
                                          @blur="validate('dateBegin', { trigger: 'blur' }).catch(() => { })"
                                        />
                                      </a-form-item>
                                    </a-form-item>
                                    <div class="grid grid-cols-2 gap-3 w-full">
                                      <div>
                                        <a-form-item
                                          name="switch"
                                          label="Ville de naissance"
                                          v-bind="validateInfosLegalRepresentative.city_of_birth"
                                        >
                                          <a-input
                                            v-model:value="formStateLegalRepresentative.city_of_birth"
                                            @blur="validate('city_of_birth', { trigger: 'blur' }).catch(() => { })"
                                          />
                                        </a-form-item>
                                      </div>
                                      <div>
                                        <a-form-item
                                          name="postal"
                                          label="Code postal"
                                          v-bind="validateInfosLegalRepresentative.postal"
                                        >
                                          <a-input
                                            v-model:value="formStateLegalRepresentative.postal"
                                            placeholder="code postal"
                                          />
                                        </a-form-item>
                                      </div>
                                    </div>
                                    <a-form-item
                                      label="Pays de naissance"
                                      v-bind="validateInfosLegalRepresentative.country_of_birth"
                                    >
                                      <a-select
                                        v-model:value="formStateLegalRepresentative.country_of_birth"
                                        placeholder="Pays de naissance"
                                        :options="countries"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Nationalité"
                                      v-bind="validateInfosLegalRepresentative.nationality"
                                    >
                                      <a-select
                                        v-model:value="formStateLegalRepresentative.nationality"
                                        placeholder="Nationalité"
                                        :options="countries"
                                      />
                                    </a-form-item>
                                    <p>
                                      Les informations que vous aurez saisies doivent correspondre exactement avec
                                      celles présentes sur le justificatif d'identité déposé. Il ne doit pas s'agir d'un
                                      pseudo ni d'un nom d'usage.
                                      <b>
                                        Une fois les documents validés, si vous êtes amené à modifier l'une des
                                        informations précédentes (nom, prénom, date de naissance ou nationalité), vous
                                        devrez soumettre à nouveau ces documents légaux pour validation, correspondants
                                        à votre nouvelle situation.
                                      </b>
                                    </p>
                                    <a-form-item label="Pièce d'identité (recto/verso)">
                                      <a-form-item name="dragger" no-style>
                                        <a-upload-dragger
                                          name="files"
                                          :file-list="profile?.freelancer?.documents.map(f => ({
                                            uid: f.uid || f,
                                            name: f.name || f,
                                            status: f.status || 'done',
                                            url: f,
                                          })) || []"
                                          :before-upload="(file: any) => {
                                            if (file.type === 'application/pdf') {
                                              userDocument = file;
                                            }
                                            else {
                                              message.error('type should be pdf')
                                            }
                                            return false;
                                          }"
                                        >
                                          <template v-if="!userDocument">
                                            <p class="ant-upload-drag-icon">
                                              <span
                                                class="i-carbon-cloud-upload inline-block text-xl"
                                              />
                                            </p>
                                            <p
                                              class="ant-upload-text"
                                            >
                                              Click or drag file to this area to upload
                                            </p>
                                            <p
                                              class="ant-upload-hint"
                                            >
                                              Support for a single or bulk upload.
                                            </p>
                                          </template>
                                          <template v-else>
                                            <p>{{ userDocument?.name }}</p>
                                          </template>
                                        </a-upload-dragger>
                                      </a-form-item>
                                    </a-form-item>
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        :loading="profileEntrepriseLoading"
                                        @click.prevent="onSubmitLegalRepresentative"
                                      >
                                        Enregistrer
                                      </a-button>
                                    </a-form-item>
                                  </a-form>
                                </div>
                                <div v-else-if="currentStepProfileEtprs === 2">
                                  <a-form
                                    layout="vertical"
                                    :label-col="{ span: 24 }"
                                    :wrapper-col="{ span: 24 }"
                                  >
                                    <a-form-item label="Taxe" v-bind="validateInfosTaxe.taxe">
                                      <a-input
                                        v-model:value="formStateTaxe.taxe"
                                        placeholder="Taxe"
                                      >
                                        <template #suffix>
                                          <a-tooltip title="Extra information">
                                            <span
                                              class="i-carbon-percentage inline-block text-lg"
                                              style="color: rgba(0, 0, 0, 0.45)"
                                            />
                                          </a-tooltip>
                                        </template>
                                      </a-input>
                                    </a-form-item>
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        :loading="profileEntrepriseLoading"
                                        @click.prevent="onSubmitTaxe"
                                      >
                                        Enregistrer
                                      </a-button>
                                    </a-form-item>
                                  </a-form>
                                </div>
                                <div v-else-if="currentStepProfileEtprs === 3">
                                  <a-form
                                    layout="vertical"
                                    :label-col="{ span: 24 }"
                                    :wrapper-col="{ span: 24 }"
                                    :model="formStateLegalMention"
                                    @finish-failed="onFinishFailed"
                                    @finish="onFinish"
                                  >
                                    <a-form-item label="Capitale" v-bind="validateInfosLegalMention.sas">
                                      <a-input
                                        v-model:value="formStateLegalMention.sas"
                                        @blur="validate('sas', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="SIRET"
                                      v-bind="validateInfosLegalMention.siret"
                                    >
                                      <a-input
                                        v-model:value="formStateLegalMention.siret"
                                        @blur="validate('siret', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item label="RCS" v-bind="validateInfosLegalMention.rcs">
                                      <a-input
                                        v-model:value="formStateLegalMention.rcs"
                                        @blur="validate('rcs', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item label="NAF" v-bind="validateInfosLegalMention.naf">
                                      <a-input
                                        v-model:value="formStateLegalMention.naf"
                                        @blur="validate('naf', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="TVA"
                                      v-bind="validateInfosLegalMention.tva_intracom"
                                    >
                                      <a-input
                                        v-model:value="formStateLegalMention.tva_intracom"
                                        @blur="validate('tva_intracom', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      v-bind="validateInfosLegalMention.days"
                                      name="Jours"
                                      label="Définissez le nombre de jours"
                                      :rules="[{ required: true, message: 'Définissez le nombre de jours' }]"
                                    >
                                      <a-input-number
                                        v-bind="validateInfosLegalMention.days"
                                        v-model:value="formStateLegalMention.days"
                                      />
                                    </a-form-item>
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        :loading="profileEntrepriseLoading"
                                        @click.prevent="onSubmitLegalMentions"
                                      >
                                        Enregistrer
                                      </a-button>
                                    </a-form-item>
                                  </a-form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="Coordonnées bancaires" force-render>
                          <div>
                            <div class="p-4">
                              <h3>Saisissez les champs selon le type de votre compte IBAN</h3>
                              <div class="max-w-md mx-auto">
                                <a-form
                                  layout="vertical"
                                  :label-col="{ span: 24 }"
                                  :wrapper-col="{ span: 24 }"
                                  :model="formStateIbanModule"
                                  @finish-failed="onFinishFailed"
                                  @finish="onFinish"
                                >
                                  <a-form-item
                                    label="Nom et prénom"
                                    v-bind="validateInfosIbanModule.cb_iban_name_lastname"
                                  >
                                    <a-input
                                      v-model:value="formStateIbanModule.cb_iban_name_lastname"
                                      @blur="validate('cb_iban_name_lastname', { trigger: 'blur' }).catch(() => { })"
                                    />
                                  </a-form-item>
                                  <a-form-item
                                    label="Adresse du titulaire"
                                    v-bind="validateInfosIbanModule.cb_iban_address_holder"
                                  >
                                    <a-input
                                      v-model:value="formStateIbanModule.cb_iban_address_holder"
                                      @blur="validate('cb_iban_address_holder', { trigger: 'blur' }).catch(() => { })"
                                    />
                                  </a-form-item>
                                  <a-form-item
                                    label="Code postal"
                                    v-bind="validateInfosIbanModule.cb_iban_postal"
                                  >
                                    <a-input
                                      v-model:value="formStateIbanModule.cb_iban_postal"
                                      @blur="validate('cb_iban_postal', { trigger: 'blur' }).catch(() => { })"
                                    />
                                  </a-form-item>
                                  <a-form-item
                                    label="Ville"
                                    v-bind="validateInfosIbanModule.cb_iban_city"
                                  >
                                    <a-input
                                      v-model:value="formStateIbanModule.cb_iban_city"
                                      @blur="validate('cb_iban_city', { trigger: 'blur' }).catch(() => { })"
                                    />
                                  </a-form-item>
                                  <a-form-item
                                    label="Type de compte"
                                  >
                                    <a-select
                                      v-model:value="formStateTypeIban.type_iban"
                                      :options="typesIban" @change="resetModuleIban()"
                                    />
                                  </a-form-item>
                                  <!-- form items iban -->
                                  <div v-if="formStateTypeIban.type_iban === 'iban'">
                                    <a-form-item
                                      label="Pays"
                                      v-bind="validateInfosIbanModule.cb_iban_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanModule.cb_iban_country"
                                        placeholder="Pays"
                                        :options="countriesIban"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="IBAN"
                                      v-bind="validateInfosIbanModule.cb_iban_iban"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_iban"
                                        @blur="validate('cb_iban_iban', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                  </div>
                                  <!-- end form items iban -->
                                  <!-- form items iban US -->
                                  <div v-if="formStateTypeIban.type_iban === 'iban-us'">
                                    <a-form-item
                                      label="Pays"
                                      v-bind="validateInfosIbanModule.cb_iban_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanModule.cb_iban_country"
                                        placeholder="Pays"
                                        :options="countriesIbanOthers"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Région"
                                      v-bind="validateInfosIbanModule.cb_iban_region"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_region"
                                        @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro de compte"
                                      v-bind="validateInfosIbanModule.cb_iban_account_number"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_account_number"
                                        @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="ABA Transit number"
                                      v-bind="validateInfosIbanModule.cb_iban_aba_transit_number"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_aba_transit_number"
                                        @blur="validate('cb_iban_aba_transit_number', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Type de compte"
                                      v-bind="validateInfosIbanModule.cb_iban_account_type"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanModule.cb_iban_account_type"
                                        :options="typesAccount"
                                      />
                                    </a-form-item>
                                  </div>
                                  <!-- end form items iban us-->
                                  <!-- form items iban ca  -->
                                  <div v-if="formStateTypeIban.type_iban === 'iban-ca'">
                                    <a-form-item
                                      label="Pays"
                                      v-bind="validateInfosIbanModule.cb_iban_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanModule.cb_iban_country"
                                        placeholder="Pays"
                                        :options="countriesIbanOthers"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Région"
                                      v-bind="validateInfosIbanModule.cb_iban_region"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_region"
                                        @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Nom de la banque"
                                      v-bind="validateInfosIbanModule.cb_iban_bank_name"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_bank_name"
                                        @blur="validate('cb_iban_bank_name', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro de compte"
                                      v-bind="validateInfosIbanModule.cb_iban_account_number"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_account_number"
                                        @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Code guichet"
                                      v-bind="validateInfosIbanModule.cb_iban_branch_code"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_branch_code"
                                        @blur="validate('cb_iban_branch_code', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro institution"
                                      v-bind="validateInfosIbanModule.cb_iban_number_institution"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_number_institution"
                                        @blur="validate('cb_iban_number_institution', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                  </div>
                                  <!-- end form items iban ca -->
                                  <!-- form items iban BIC SWIFT -->
                                  <div v-if="formStateTypeIban.type_iban === 'others'">
                                    <a-form-item
                                      label="Pays"
                                      v-bind="validateInfosIbanModule.cb_iban_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanModule.cb_iban_country"
                                        :options="countriesIbanOthers"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Région"
                                      v-bind="validateInfosIbanModule.cb_iban_region"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_region"
                                        @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro de compte"
                                      v-bind="validateInfosIbanModule.cb_iban_account_number"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_account_number"
                                        @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro BIC/SWIFT"
                                      v-bind="validateInfosIbanModule.cb_iban_bic_swift"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanModule.cb_iban_bic_swift"
                                        @blur="validate('cb_iban_bic_swift', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Pays du compte:"
                                      v-bind="validateInfosIbanModule.cb_iban_account_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanModule.cb_iban_account_country"
                                        :options="countriesIbanOthers"
                                      />
                                    </a-form-item>
                                  </div>
                                  <!-- end form items BIC SWIFT -->
                                  <div v-if="formStateTypeIban.type_iban != 'empty'">
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        v-if="formStateTypeIban.type_iban !== 'empty'"
                                        block
                                        type="primary"
                                        :loading="profileEntrepriseLoading"
                                        @click.prevent="onSubmitIbanModule"
                                      >
                                        Enregistrer
                                      </a-button>
                                    </a-form-item>
                                  </div>
                                  <div v-else>
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        disabled
                                        @click.prevent="onSubmitIbanModule"
                                      >
                                        Choisir un type de compte
                                      </a-button>
                                    </a-form-item>
                                  </div>
                                </a-form>
                              </div>
                            </div>
                          </div>
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="Historique des virements">
                          Content of Tab Pane 3
                        </a-tab-pane>
                      </a-tabs>
                    </div>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="7" tab="Devis" force-render>
                <div class>
                  <swiper
                    :modules="[Controller]"
                    :slides-per-view="4" class="p-3"
                    :pagination="{
                      clickable: true,
                    }"
                    :grab-cursor="true"
                    @swiper="setDevisSwiper"
                  >
                    <swiper-slide
                      v-for="(item, index) in devis.devises"
                      :key="index"
                    >
                      <div v-if="item.id_freelance">
                        <a-badge-ribbon v-if="item.confirmed == true" class="mr-2" color="green" text="accepté">
                          <a-card class="mr-2" hoverable>
                            <template #actions>
                              <span key="update" class="i-carbon-edit inline-block" @click="updateDevis(item,devis?.missions[index].id_company)" />
                            </template>
                            <a-card-meta :title="Devis">
                              <template #description>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Mission :</b>
                                  </span>
                                  {{ devis?.missions[index].name }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Date de début :</b>
                                  </span>
                                  {{ dayjs(item.dateBegin).format("DD-MM-YYYY") }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Date de fin :</b>
                                  </span>
                                  {{ dayjs(item.dateEnd).format("DD-MM-YYYY") }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Total :</b>
                                  </span>
                                  {{ item.total }} €
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>TVA :</b>
                                  </span>
                                  {{ item.tva }} %
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Total TTC :</b>
                                  </span>
                                  {{ item.totalTva }} €
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>VOUS RECEVEREZ (TTC) :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#080"
                                  >
                                    {{ item.totalUser }} €
                                  </a-tag>
                                </div>
                                <div v-if="item.state == 'terminé'">
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#080"
                                    >
                                      Répondu
                                    </a-tag>
                                  </div>
                                </div>
                                <div v-else-if="item.state == 'en cours'">
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#05f"
                                    >
                                      En cours
                                    </a-tag>
                                  </div>
                                </div>
                                <div v-else>
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#D00"
                                    >
                                      Répondu
                                    </a-tag>
                                  </div>
                                </div>
                              </template>
                            </a-card-meta>
                          </a-card>
                        </a-badge-ribbon>
                        <a-badge-ribbon v-else-if="!item.confirmed" class="mr-2" color="red" text="refusé">
                          <a-card class="mr-2" hoverable>
                            <template #actions>
                              <span key="update" class="i-carbon-edit inline-block" @click="updateDevis(item,devis?.missions[index].id_company)" />
                            </template>
                            <a-card-meta :title="Devis">
                              <template #description>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Mission :</b>
                                  </span>
                                  {{ devis?.missions[index].name }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Date de début :</b>
                                  </span>
                                  {{ dayjs(item.dateBegin).format("DD-MM-YYYY") }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Date de fin :</b>
                                  </span>
                                  {{ dayjs(item.dateEnd).format("DD-MM-YYYY") }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Total :</b>
                                  </span>
                                  {{ item.total }} €
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>TVA :</b>
                                  </span>
                                  {{ item.tva }} %
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Total TTC :</b>
                                  </span>
                                  {{ item.totalTva }} €
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>VOUS RECEVEREZ (TTC) :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#080"
                                  >
                                    {{ item.totalUser }} €
                                  </a-tag>
                                </div>
                                <div v-if="item.state == 'terminé'">
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#080"
                                    >
                                      Répondu
                                    </a-tag>
                                  </div>
                                </div>
                                <div v-else-if="item.state == 'en cours'">
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#05f"
                                    >
                                      En cours
                                    </a-tag>
                                  </div>
                                </div>
                                <div v-else>
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#D00"
                                    >
                                      Répondu
                                    </a-tag>
                                  </div>
                                </div>
                              </template>
                            </a-card-meta>
                          </a-card>
                        </a-badge-ribbon>
                        <a-card v-else class="mr-2" hoverable>
                          <template #actions>
                            <span key="update" class="i-carbon-edit inline-block" @click="updateDevis(item,devis?.missions[index].id_company)" />
                          </template>
                          <a-card-meta :title="Devis">
                            <template #description>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Mission :</b>
                                </span>
                                {{ devis?.missions[index].name }}
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Date de début :</b>
                                </span>
                                {{ dayjs(item.dateBegin).format("DD-MM-YYYY") }}
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Date de fin :</b>
                                </span>
                                {{ dayjs(item.dateEnd).format("DD-MM-YYYY") }}
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Total :</b>
                                </span>
                                {{ item.total }} €
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>TVA :</b>
                                </span>
                                {{ item.tva }} %
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Total TTC :</b>
                                </span>
                                {{ item.totalTva }} €
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>VOUS RECEVEREZ (TTC) :</b>
                                </span>
                                <a-tag
                                  class="text-xs ml-2 leading-5"
                                  color="#080"
                                >
                                  {{ item.totalUser }} €
                                </a-tag>
                              </div>
                              <div v-if="item.state == 'terminé'">
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Etat :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#080"
                                  >
                                    Répondu
                                  </a-tag>
                                </div>
                              </div>
                              <div v-else-if="item.state == 'en cours'">
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Etat :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#05f"
                                  >
                                    En cours
                                  </a-tag>
                                </div>
                              </div>
                              <div v-else>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Etat :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#D00"
                                  >
                                    Répondu
                                  </a-tag>
                                </div>
                              </div>
                            </template>
                          </a-card-meta>
                        </a-card>
                      </div>
                      <div v-else-if="item.id_agence">
                        <a-badge-ribbon v-if="item.confirmed == true " class="mr-2" color="green" text="accepté">
                          <a-card class="mr-2" hoverable>
                            <template #actions />
                            <a-card-meta :title="Devis">
                              <template #description>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Mission :</b>
                                  </span>
                                  {{ devis?.missions[index].name }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Date de début :</b>
                                  </span>
                                  {{ dayjs(item.dateBegin).format("DD-MM-YYYY") }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Date de fin :</b>
                                  </span>
                                  {{ dayjs(item.dateEnd).format("DD-MM-YYYY") }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Total :</b>
                                  </span>
                                  {{ item.total }} €
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>TVA :</b>
                                  </span>
                                  {{ item.tva }} %
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Total TTC :</b>
                                  </span>
                                  {{ item.totalTva }} €
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>VOUS RECEVEREZ (TTC) :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#080"
                                  >
                                    {{ item.totalUser }} €
                                  </a-tag>
                                </div>
                                <div v-if="item.state == 'terminé'">
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#080"
                                    >
                                      Répondu
                                    </a-tag>
                                  </div>
                                </div>
                                <div v-else-if="item.state == 'en cours'">
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#05f"
                                    >
                                      En cours
                                    </a-tag>
                                  </div>
                                </div>
                                <div v-else>
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#D00"
                                    >
                                      Répondu
                                    </a-tag>
                                  </div>
                                </div>
                              </template>
                            </a-card-meta>
                          </a-card>
                        </a-badge-ribbon>
                        <a-badge-ribbon v-else-if="!item.confirmed" class="mr-2" color="red" text="refusé">
                          <a-card class="mr-2" hoverable>
                            <template #actions>
                              <span key="update" class="i-carbon-edit inline-block" @click="updateDevis(item,devis?.missions[index].id_company)" />
                            </template>
                            <a-card-meta :title="Devis">
                              <template #description>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Mission :</b>
                                  </span>
                                  {{ devis?.missions[index].name }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Date de début :</b>
                                  </span>
                                  {{ dayjs(item.dateBegin).format("DD-MM-YYYY") }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Date de fin :</b>
                                  </span>
                                  {{ dayjs(item.dateEnd).format("DD-MM-YYYY") }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Total :</b>
                                  </span>
                                  {{ item.total }} €
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>TVA :</b>
                                  </span>
                                  {{ item.tva }} %
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Total TTC :</b>
                                  </span>
                                  {{ item.totalTva }} €
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>VOUS RECEVEREZ (TTC) :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#080"
                                  >
                                    {{ item.totalUser }} €
                                  </a-tag>
                                </div>
                                <div v-if="item.state == 'terminé'">
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#080"
                                    >
                                      Répondu
                                    </a-tag>
                                  </div>
                                </div>
                                <div v-else-if="item.state == 'en cours'">
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#05f"
                                    >
                                      En cours
                                    </a-tag>
                                  </div>
                                </div>
                                <div v-else>
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      <b>Etat :</b>
                                    </span>
                                    <a-tag
                                      class="text-xs ml-2 leading-5"
                                      color="#D00"
                                    >
                                      Répondu
                                    </a-tag>
                                  </div>
                                </div>
                              </template>
                            </a-card-meta>
                          </a-card>
                        </a-badge-ribbon>
                        <a-card v-else class="mr-2" hoverable>
                          <template #actions>
                            <span key="update" class="i-carbon-edit inline-block" @click="updateDevis(item,devis?.missions[index].id_company)" />
                          </template>
                          <a-card-meta :title="Devis">
                            <template #description>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Mission :</b>
                                </span>
                                {{ devis?.missions[index].name }}
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Date de début :</b>
                                </span>
                                {{ dayjs(item.dateBegin).format("DD-MM-YYYY") }}
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Date de fin :</b>
                                </span>
                                {{ dayjs(item.dateEnd).format("DD-MM-YYYY") }}
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Total :</b>
                                </span>
                                {{ item.total }} €
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>TVA :</b>
                                </span>
                                {{ item.tva }} %
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Total TTC :</b>
                                </span>
                                {{ item.totalTva }} €
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>VOUS RECEVEREZ (TTC) :</b>
                                </span>
                                <a-tag
                                  class="text-xs ml-2 leading-5"
                                  color="#080"
                                >
                                  {{ item.totalUser }} €
                                </a-tag>
                              </div>
                              <div v-if="item.state == 'terminé'">
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Etat :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#080"
                                  >
                                    Répondu
                                  </a-tag>
                                </div>
                              </div>
                              <div v-else-if="item.state == 'en cours'">
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Etat :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#05f"
                                  >
                                    En cours
                                  </a-tag>
                                </div>
                              </div>
                              <div v-else>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    <b>Etat :</b>
                                  </span>
                                  <a-tag
                                    class="text-xs ml-2 leading-5"
                                    color="#D00"
                                  >
                                    Répondu
                                  </a-tag>
                                </div>
                              </div>
                            </template>
                          </a-card-meta>
                        </a-card>
                      </div>
                    </swiper-slide>
                  </swiper>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
      </div>
    </section>
    <!--== End Login Area Wrapper ==-->
  </main>
  <a-modal
    v-model:visible="visibleModalAddExperience"
    width="40%"
    :title="modelRefExperience.id ? 'Modifier Experience' : 'Ajouter Experience'"
    @ok="() => { }"
  >
    <div>
      <a-form layout="vertical" :wrapper-col="{ span: 24 }">
        <a-form-item label="Nom Expérience :" v-bind="experienceValidateInfos.title">
          <a-input
            v-model:value="modelRefExperience.title"
            @blur="validate('title', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Société :" v-bind="experienceValidateInfos.society">
          <a-input
            v-model:value="modelRefExperience.society"
            @blur="validate('society', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Localisation :" v-bind="experienceValidateInfos.place">
          <a-input
            v-model:value="modelRefExperience.place"
            @blur="validate('place', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Choisir un domaine :" v-bind="experienceValidateInfos.domain">
          <a-select
            v-model:value="modelRefExperience.domain"
            placeholder="please select your domain"
            :options="activities"
            @blur="validate('domain', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <div class="grid grid-cols-2 gap-3 w-full">
          <div>
            <a-form-item name="switch" label="en freelance ?">
              <a-switch v-model:checked="modelRefExperience.isFreelancer" />
            </a-form-item>
          </div>
          <div>
            <a-form-item name="switch" label="poste actuelle ?">
              <a-switch v-model:checked="modelRefExperience.actuallyPost" />
            </a-form-item>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 w-full">
          <div class>
            <a-form-item
              name="month-picker"
              label="Date Début"
              :wrapper-col="{ span: 24, offset: 0 }"
              :label-col="{
                sm: { span: 24 }
              }"
              v-bind="experienceValidateInfos.dateBegin"
            >
              <a-date-picker
                v-model:value="modelRefExperience.dateBegin"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :disabled-date="(current: Dayjs) => current && current > dayjs().endOf('day')"
                @blur="validate('dateBegin', { trigger: 'blur' }).catch(() => { })"
              />
            </a-form-item>
          </div>
          <div v-if="!modelRefExperience.actuallyPost" class>
            <a-form-item
              :label-col="{
                sm: { span: 24 }
              }"
              :wrapper-col="{ span: 24, offset: 0 }"
              name="month-picker"
              label="Date de fin"
              v-bind="experienceValidateInfos.dateEnd"
            >
              <a-date-picker
                v-model:value="modelRefExperience.dateEnd"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :disabled-date="(current: Dayjs) => current && current > dayjs().endOf('day') || current < dayjs(modelRefExperience.dateBegin)"
                @blur="validate('dateEnd', { trigger: 'blur' }).catch(() => { })"
              />
            </a-form-item>
          </div>
        </div>
        <a-form-item name="switch" label="Compétences :">
          <a-select
            v-model:value="modelRefExperience.skills"
            mode="tags"
            style="width: 100%"
            :token-separators="[',']"
            placeholder="Compétences"
            :options="skills"
          />
        </a-form-item>
        <a-form-item label="Description :">
          <a-textarea
            v-model:value="modelRefExperience.description"
            placeholder="description"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <a-button
        type="primary"
        :loading="profileEntrepriseLoading"
        @click.prevent="onSubmit"
      >
        {{ modelRefExperience.id ? 'Modifier' : 'Ajouter' }}
      </a-button>
      <a-button
        style="margin-left: 10px"
        @click="() => !modelRefExperience.id ? resetFields() : (visibleModalAddExperience = false)"
      >
        {{ modelRefExperience.id ? 'Fermer' : 'Réinitialiser' }}
      </a-button>
    </template>
  </a-modal>
  <a-modal
    v-model:visible="visibleModalAddFormation"
    width="40%"
    :title="modelRefFormation.id ? 'Modifier Formation' : 'Ajouter Formation'"
    @ok="() => { }"
  >
    <div>
      <a-form layout="vertical" :wrapper-col="{ span: 24 }">
        <a-form-item label="Nom formation :" v-bind="validateInfosFormation.name">
          <a-input
            v-model:value="modelRefFormation.name"
            @blur="validate('name', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Institution :" v-bind="validateInfosFormation.institute">
          <a-input
            v-model:value="modelRefFormation.institute"
            @blur="validate('institute', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Choisir l'état de la formation :" v-bind="validateInfosFormation.type">
          <a-select
            v-model:value="modelRefFormation.type"
            placeholder="Choisissez l'état de la formation"
            :options="types"
          />
        </a-form-item>
        <div class="grid grid-cols-2 gap-3 w-full">
          <div class>
            <a-form-item
              v-bind="validateInfosFormation.year"
              name="year-picker"
              label="Année d'obtention"
              :wrapper-col="{ span: 24, offset: 0 }"
              :label-col="{
                sm: { span: 24 }
              }"
            >
              <a-month-picker
                v-model:value="modelRefFormation.year"
                style="width: 100%"
                value-format="YYYY"
              />
            </a-form-item>
          </div>
        </div>
        <a-form-item label="Description :" v-bind="validateInfosFormation.description">
          <a-textarea
            v-model:value="modelRefFormation.description"
            placeholder="description"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
        <a-form-item class="hidden" :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click.prevent="onSubmitForm">
            Créer
          </a-button>
          <a-button style="margin-left: 10px" @click="resetFieldsFormation">
            Réinitialiser
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <a-button type="primary" @click.prevent="onSubmitForm">
        Ajouter
      </a-button>
      <a-button style="margin-left: 10px" @click="resetFieldsFormation">
        Réinitialiser
      </a-button>
    </template>
  </a-modal>
  <a-modal
    v-model:visible="visibleModalAddCertification"
    width="40%"
    :title="modelRefCertification.id ? 'Modifier Certification' : 'Ajouter Certification'"
    @ok="() => { }"
  >
    <div>
      <a-form layout="vertical" :wrapper-col="{ span: 24 }">
        <a-form-item label="Nom certification :" v-bind="validateInfosCertification.name">
          <a-input
            v-model:value="modelRefCertification.name"
            @blur="validate('name', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Organisme :" v-bind="validateInfosCertification.organism">
          <a-input
            v-model:value="modelRefCertification.organism"
            @blur="validate('institute', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item
          label="Choisir l'état de la certification :"
          v-bind="validateInfosCertification.type"
        >
          <a-select
            v-model:value="modelRefCertification.type"
            placeholder="Choisissez l'état de la certification"
            :options="types"
          />
        </a-form-item>
        <a-form-item label="Localisation :">
          <a-input v-model:value="modelRefCertification.place" />
        </a-form-item>
        <div class="grid grid-cols-2 gap-3 w-full">
          <div class>
            <a-form-item
              v-bind="validateInfosCertification.year"
              name="year-picker"
              label="Année d'obtention"
              :wrapper-col="{ span: 24, offset: 0 }"
              :label-col="{
                sm: { span: 24 }
              }"
            >
              <a-month-picker
                v-model:value="modelRefCertification.year"
                style="width: 100%"
                value-format="YYYY"
              />
            </a-form-item>
          </div>
        </div>
        <a-form-item label="Description :" v-bind="validateInfosCertification.description">
          <a-textarea
            v-model:value="modelRefCertification.description"
            placeholder="description"
            :auto-size="{ minRows: 2, maxRows: 5 }"
          />
        </a-form-item>
        <a-form-item class="hidden" :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click.prevent="onSubmitCert">
            Créer
          </a-button>
          <a-button style="margin-left: 10px" @click="resetFieldsCertification">
            Réinitialiser
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <a-button type="primary" @click.prevent="onSubmitCert">
        Ajouter
      </a-button>
      <a-button style="margin-left: 10px" @click="resetFieldsCertification">
        Réinitialiser
      </a-button>
    </template>
  </a-modal>
  <a-modal v-model:visible="visibleModalInformationEmailVerification" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          <h3> Vérification email</h3>
        </div>
        <div>
          Lors de votre inscription sur Green-positiv, nous vous avons fait parvenir un email de vérification avec un lien de validation.
          Merci de bien vouloir cliquer sur le lien pour confirmer votre adresse. Si vous ne l'avez pas reçu, cliquer sur ce
          <a
            class="link-info"
          >lien</a> pour le recevoir.
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
          Merci de bien vouloir télécharger l'ensemble des documents demandés pour que nous puissions procéder à la validation de votre profil.
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
          Merci de bien vouloir lire et accepter la charte afin de valider votre profil via <router-link class="green" :to="`/charte/freelancer/${$props.id}`">
            <span>ce lien</span>
          </router-link>
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
          <h3> Compte validé</h3>
        </div>
        <div>
          Afin de procéder à la validation de votre compte, tous les champs doivent être renseignés. Si ce n'est pas le cas, votre profil restera non valide jusqu'à ce que vous remplissiez toutes les étapes.
        </div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="visibleModalInformationValidated = false">
        Retour
      </a-button>
    </template>
  </a-modal>
  <a-modal
    v-model:visible="visibleModalUpdateDevis"
    width="40%"
    :title="modelRefDevis._id ? 'Modifier le devis' : 'Ajouter un devis'"
    @ok="() => { }"
  >
    <div>
      <a-form layout="vertical" :wrapper-col="{ span: 24 }">
        <div v-if="modelRefDevis.tasks.length > 0">
          <swiper
            :modules="[Controller]"
            :slides-per-view="2" class="p-3"
            :pagination="{
              clickable: true,
            }"
            :grab-cursor="true"
            @swiper="setBlocSwiper"
          >
            <swiper-slide
              v-for="(item2, index2) in modelRefDevis.tasks"
              :key="index2"
            >
              <div>
                <a-card class="mr-2" hoverable>
                  <template #actions>
                    <span key="accept" class="i-carbon-edit inline-block" @click="updateBloc(index2)" />
                  </template>
                  <a-card-meta :title="`Tâche : ${index2}`">
                    <template #description>
                      Tâche {{ index2 }}
                      <div class="flex items-center">
                        <span class="text-dark-300 mr-1.5">
                          <b>Nombre d'heures :</b>
                        </span>
                        {{ item2.nb_hours }} heures
                      </div>
                      <div class="flex items-center">
                        <span class="text-dark-300 mr-1.5">
                          <b>Coût / heure :</b>
                        </span>
                        {{ item2.cost_per_hour }} €
                      </div>
                    </template>
                  </a-card-meta>
                </a-card>
              </div>
            </swiper-slide>
          </swiper>
          <br>
        </div>
        <div v-if="showUpdateBloc">
          <a-form-item name="nb_hours">
            <span class="ant-form-text">nombre d'heures : </span>
            <a-input-number
              v-model:value="formStateBloc.nb_hours" step="1" :min="1" :max="9999"
            />
          </a-form-item>
          <a-form-item name="cost_per_hour">
            <span class="ant-form-text">Coût / heure : </span>
            <a-input-number
              v-model:value="formStateBloc.cost_per_hour" addon-after="€" step="50" :min="50" :max="9999"
            />
          </a-form-item>
          <a-form-item name="description" label="Description">
            <a-input v-model:value="formStateBloc.description" />
          </a-form-item>
          <a-form-item>
            <a-button
              v-if="currentUser?.role === 'Freelancer' || currentUser?.role === 'Agence'"
              class="btn-theme m-2"
              @click="updateTask()"
            >
              modifier ce bloc
            </a-button>
          </a-form-item>
        </div>
        <a-form-item
          name="month-picker"
          label="Date Début"
          :wrapper-col="{ span: 24, offset: 0 }"
          :label-col="{
            sm: { span: 24 }
          }"
          v-bind="devisValidateInfos.dateBegin"
        >
          <a-date-picker
            v-model:value="modelRefDevis.dateBegin"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            :disabled-date="(current: Dayjs) => current && current <= dayjs().endOf('day')"
            @blur="validate('dateBegin', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item
          :label-col="{
            sm: { span: 24 }
          }"
          :wrapper-col="{ span: 24, offset: 0 }"
          name="month-picker"
          label="Date de fin"
          v-bind="devisValidateInfos.dateEnd"
        >
          <a-date-picker
            v-model:value="modelRefDevis.dateEnd"
            style="width: 100%"
            value-format="YYYY-MM-DD"
            :disabled-date="(current: Dayjs) => current && current <= dayjs().endOf('day') || current < dayjs(modelRefDevis.dateBegin)"
            @blur="validate('dateEnd', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <a-button type="primary" :loading="profileEntrepriseLoading" @click="sendDevis">
        Créer
      </a-button>
      <a-button style="margin-left: 10px" @click="resetFieldsDevis">
        Réinitialiser
      </a-button>
    </template>
  </a-modal>
</template>
<style lang="scss">
.ant-tabs-tab {
  @apply px-4;
}
.ant-tabs-top > .ant-tabs-nav {
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
.ant-tabs-tab{
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
}
</style>
<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
  roles: [Freelancer]
</route>
