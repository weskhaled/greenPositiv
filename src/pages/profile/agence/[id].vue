<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import { Form, Modal, message } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import adminApi from '~/api/modules/admin'
import globalApi from '~/api/modules/global'
import agenceApi from '~/api/modules/agence'
import profileEntrepriseApi from '~/api/modules/profil-entreprise'
import { currentUser } from '~/stores'
const useForm = Form.useForm
const props = defineProps<{ id: string }>()
const router = useRouter()
const { t } = useI18n()
const activeKey = ref('1')
const typesAccount = ref([])
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
const profileAvatar = ref('')
const userDocument = ref(null)
const profileEntreprise = ref(null)
const legalForms = ref([])
const countries = ref([])
const countriesIban = ref([])
const countriesIbanOthers = ref([])
const jobs = ref([])
const typesIban = ref([])
const activities = ref([])
const visibleModalAddReference = ref(false)
const visibleModalAddOffer = ref(false)
const visibleModalInformationEmailVerification = ref(false)
const visibleModalInformationDocumentVal = ref(false)
const visibleModalInformationSignatureCharte = ref(false)
const visibleModalGreenQuestion = ref(false)
const visibleModalInformationValidated = ref(false)
// const formState = reactive<Record<string, any>>({
//   'input-number': 3,
//   'checkbox-group': ['A', 'B'],
//   'rate': 3.5,
// })
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
  show_price: undefined,
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
        if (formStateIbanModule.type_iban === 'iban') {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir votre iban'))
          if (!Number.isInteger(+value)) {
            return Promise.reject(new Error('Veuillez saisir que des chiffres'))
          }
          else {
            if (value.length !== 14)
            // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject(`${'l\iban doit contenir 14 chiffres'}`)
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
/**/
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      message: 'Saisir votre SAS',
    },
    {
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
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
      validator: async(_rule: RuleObject, value: string) => {
        const tva_numbers = value.slice(2, value.length)
        if (!value) return Promise.reject(new Error('Saisir la tva intracom'))
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
      validator: async(_rule: RuleObject, value: number) => {
        if (value < 0 || value > 60)
          return Promise.reject(new Error('Saisir le nombre de jours (max 60)'))
        else
          return Promise.resolve()
      },
    },
  ],
})

const getFormData = async() => {
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
  /**/
  profileEntreprise.value = null
  await profileEntrepriseApi.profileEntrepriseAgence(props.id).then(async({ data }) => {
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
const updateProfile = async(profileData: any) => {
  const { data } = await agenceApi.updateProfile(profileData)
  data && message.info(data.message)
  getFormData()
}

/* bloc iban modules */
const useFormIbanModule = useForm(formStateIbanModule, rulesIban)
const validateIbanModule = useFormIbanModule.validate
const validateInfosIbanModule = useFormIbanModule.validateInfos
const onSubmitIbanModule = async() => {
  validateIbanModule()
    .then(async() => {
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
/* bloc end iban modules */
/* bloc contact details */
const useFormContactDetails = useForm(formStateContactDetails, rulesContactDetails)
const validateContactDetails = useFormContactDetails.validate
const validateInfosContactDetails = useFormContactDetails.validateInfos
const onSubmitContactDetails = async() => {
  validateContactDetails()
    .then(async() => {
      const params = toRaw(formStateContactDetails)
      params.id_agence = props.id
      const { data } = await profileEntrepriseApi.updateContactDetailsAgence(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
/* end bloc contact details */
/* bloc legal representative */
const useFormLegalRepresentative = useForm(formStateLegalRepresentative, rulesLegaleRepresentative)
const validateLegalRepresentative = useFormLegalRepresentative.validate
const validateInfosLegalRepresentative = useFormLegalRepresentative.validateInfos
const onSubmitLegalRepresentative = async() => {
  if (userDocument.value) {
    const formData = new FormData()
    formData.append('documents', userDocument.value)
    profile.value?.agence?.documents?.length && formData.append('old_documents', profile.value?.agence?.documents[0])
    agenceApi.uploadDocuments(formData).catch(err => message.error(`${err}`))
  }
  validateLegalRepresentative()
    .then(async() => {
      const params = toRaw(formStateLegalRepresentative)
      params.id_agence = props.id
      const { data } = await profileEntrepriseApi.updateLegalRepresentativeAgence(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
/* end bloc legal representative */
/* bloc taxe */
const useFormTaxe = useForm(formStateTaxe, rulesTaxe)
const validateTaxe = useFormTaxe.validate
const validateInfosTaxe = useFormTaxe.validateInfos
const onSubmitTaxe = async() => {
  validateTaxe()
    .then(async() => {
      const params = toRaw(formStateTaxe)
      params.id_agence = props.id
      const { data } = await profileEntrepriseApi.updateTaxeAgence(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
      message.error(err.message)
    })
}
/* end bloc taxe */
/* bloc legal mention */
const useFormLegalMention = useForm(formStateLegalMention, rulesLegaleMention)
const validateLegalMention = useFormLegalMention.validate
const validateInfosLegalMention = useFormLegalMention.validateInfos
const onSubmitLegalMentions = async() => {
  validateLegalMention()
    .then(async() => {
      const params = toRaw(formStateLegalMention)
      params.id_agence = props.id
      const { data } = await profileEntrepriseApi.updateLegalMentionAgence(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
      message.error(err.message)
    })
}
/* end bloc legal mention */
/* bloc reference */
const { resetFields, validate, validateInfos: referenceValidateInfos } = useForm(modelRefReference, rulesRef)
const onSubmit = async() => {
  validate()
    .then(async() => {
      const params = toRaw(modelRefReference)
      console.log('reference ', params)
      if (params.id) {
        const id = params.id
        delete params.id
        const { data } = await agenceApi.updateReference(id, params)
        message.info(data.message)
        visibleModalAddReference.value = false
      }
      else {
        const { data } = await agenceApi.addReference(params)
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
  modelRefReference.client = item.title
  modelRefReference.title = item.society
  modelRefReference.place = item.place
  modelRefReference.domain = item.domain
  modelRefReference.dateBegin = item.dateBegin
  modelRefReference.dateEnd = item.dateEnd
  modelRefReference.confidential = item.confidential
  visibleModalAddReference.value = true
}
const deleteReference = (id: string) => {
  setTimeout(() => {
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
      cancelText: 'Click to destroy all',
      onCancel() {
        Modal.destroyAll()
      },
    })
  })
}
/* end bloc reference */

/* bloc offer */
const useFormOffer = useForm(modelRefOffer, rulesOffer)
const resetFieldsOffer = useFormOffer.resetFields
const validateOffer = useFormOffer.validate
const validateInfosOffer = useFormOffer.validateInfos
const onSubmitOffer = async() => {
  validateOffer()
    .then(async() => {
      const params = toRaw(modelRefOffer)
      console.log('offer ', params)
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
  setTimeout(() => {
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
      cancelText: 'Click to destroy all',
      onCancel() {
        Modal.destroyAll()
      },
    })
  })
}
/* end bloc offer */
const beforeUploadProfileAvatar = async(file: any) => {
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
const onFinish = async(values: any) => {
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
onMounted(async() => {
  console.log('props id ', props.id)
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
                :src="profile?.agence?.image"
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
                    >{{ `${profile?.agence?.lastName} ${profile?.agence?.firstName}` }}</a>
                    <a href="#" class="flex items-center mr-3 ml-1">
                      <span
                        v-if="profile?.agence?.validated"
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
                      {{ profile?.agence?.nameAgence }}
                    </a>
                    <a
                      href="#"
                      class="flex items-center text-gray-400 text-hover-primary me-5 mb-2"
                    >
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
                <div class="flex">
                  <a-card :bordered="false" class="bg-white" body-style="padding: 5px">
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
              <a-tab-pane key="1" tab="Profile">
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
                          <h4>Comment le Green fait parti de votre de vie et comment est-il présent dans votre vie ?</h4>
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
                          <a-form-item name="description" label="Nom Agence">
                            <a-input v-model:value="formStateProfile.nameAgence" />
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
                            <a-button size="large" type="primary" html-type="submit">
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
                                :class="`px-3 py-1 bg-${profile?.agence?.visibility ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.visibility ? 'Visible' : 'Invisible' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Réponse Question Green
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.agence?.greenQuestion.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.greenQuestion ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${profile?.agence?.description?.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.description?.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Au minimum une références
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.agence?.references.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.references.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Au minimum une offre ajoutée
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.agence?.offers.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.offers.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Vérification email
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.agence?.email_verification ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.email_verification ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${profile?.agence?.confidentiality ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.confidentiality ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Documents validés
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.agence?.documents_val ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.documents_val ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${profile?.agence?.signed_client ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.signed_client ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${profile?.agence?.validated ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.agence?.validated ? 'Oui' : 'Non' }}</span>
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
              <a-tab-pane key="2" tab="Références" force-render>
                <div class>
                  <a-card title="Référence" :bordered="false" class="rounded-sm">
                    <div v-if="profile && profile?.references?.length">
                      Références
                    </div>
                    <a-result
                      v-else
                      status="404"
                      title="aucune référence trouvée"
                      sub-title="veuillez ajouter vos références"
                    >
                      <template #extra>
                        <a-button type="primary" @click="visibleModalAddReference = true">
                          Ajouter
                        </a-button>
                      </template>
                    </a-result>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="Offres" force-render>
                <div class>
                  <a-card title="Offres" :bordered="false" class="rounded-sm">
                    <div v-if="profile && profile?.offers?.length">
                      Offres
                    </div>
                    <a-result
                      v-else
                      status="404"
                      title="aucune offre n'a été trouvée"
                      sub-title="veuillez ajouter vos offres"
                    >
                      <template #extra>
                        <a-button type="primary" @click="visibleModalAddOffer = true">
                          Ajouter
                        </a-button>
                      </template>
                    </a-result>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="7" tab="Ma micro entreprise" force-render>
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
                                          :file-list="profile?.agence?.documents.map(f => ({
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
                                    <a-form-item label="Sas" v-bind="validateInfosLegalMention.sas">
                                      <a-input
                                        v-model:value="formStateLegalMention.sas"
                                        @blur="validate('sas', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="siret"
                                      v-bind="validateInfosLegalMention.siret"
                                    >
                                      <a-input
                                        v-model:value="formStateLegalMention.siret"
                                        @blur="validate('siret', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item label="rcs" v-bind="validateInfosLegalMention.rcs">
                                      <a-input
                                        v-model:value="formStateLegalMention.rcs"
                                        @blur="validate('rcs', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item label="naf" v-bind="validateInfosLegalMention.naf">
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
            </a-tabs>
          </div>
        </div>
      </div>
    </section>
    <!--== End Login Area Wrapper ==-->
  </main>
  <a-modal
    v-model:visible="visibleModalAddReference"
    width="40%"
    :title="modelRefReference.id ? 'Modifier Référence client' : 'Ajouter Référence client'"
    @ok="() => { }"
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
            v-model:value="modelRefReference.domain"
            placeholder="please select your domain"
            :options="activities"
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
          <div class>
            <a-form-item
              name="month-picker"
              label="Date Début"
              :wrapper-col="{ span: 24, offset: 0 }"
              :label-col="{
                sm: { span: 24 }
              }"
              v-bind="referenceValidateInfos.dateBegin"
            >
              <a-date-picker
                v-model:value="modelRefReference.dateBegin"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :disabled-date="(current: Dayjs) => current && current > dayjs().endOf('day')"
                @blur="validate('dateBegin', { trigger: 'blur' }).catch(() => { })"
              />
            </a-form-item>
          </div>
          <div class>
            <a-form-item
              :label-col="{
                sm: { span: 24 }
              }"
              :wrapper-col="{ span: 24, offset: 0 }"
              name="month-picker"
              label="Date de fin"
              v-bind="referenceValidateInfos.dateEnd"
            >
              <a-date-picker
                v-model:value="modelRefReference.dateEnd"
                style="width: 100%"
                value-format="YYYY-MM-DD"
                :disabled-date="(current: Dayjs) => current && current > dayjs().endOf('day') || current < dayjs(modelRefReference.dateBegin)"
                @blur="validate('dateEnd', { trigger: 'blur' }).catch(() => { })"
              />
            </a-form-item>
          </div>
        </div>
      </a-form>
    </div>
    <template #footer>
      <a-button
        type="primary"
        @click.prevent="onSubmit"
      >
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

  <!-- end modale offer creation and update -->
  <a-modal v-model:visible="visibleModalInformationEmailVerification" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          Vérification email
        </div>
        <div>
          Lors de votre inscription sur Green-positiv, nous vous avons envoyé un emai lde
          vérification. il faut ouvrir cette email. si vous ne l'avez pas reçu, cliquer sur ce
          <a
            class="link-info"
          >lien</a> pour le reenvoyer.
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
          Validation des documents
        </div>
        <div>
          Vous devez nous envoyé vos documents tel que ....
          nous procéderons à une iscpection et les valideront si tout va bien.
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
          <h3>Répondre à la question Green</h3>
        </div>
        <div>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
          Signature de la charte
        </div>
        <div>
          Vous devez signer la charte de green_positive selon votre rôle.
          Veuillez l'accepter via <router-link class="green" :to="`/charte/agence/${$props.id}`">
            <span>ce lien</span>
          </router-link> pour continuez la validation de votre compte.
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
          Signature de la charte
        </div>
        <div>
          Si votre compte est non valide, plusieurs cas peuvent causer cette invalidité tel que les
          documents non validés ,une plainte d'une entreprise , des informations saisites non
          adéquates, etc...
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
</style>
<route lang="yaml">
meta:
  layout: home
</route>
