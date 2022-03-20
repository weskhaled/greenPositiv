<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import { Form, Modal, message } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import Api from '~/api/modules/jobs'
import freelancerApi from '~/api/modules/freelancer'
import { currentUser } from '~/stores'

const useForm = Form.useForm
const props = defineProps<{ id: string }>()
const router = useRouter()
const { t } = useI18n()
const activeKey = ref('1')
const activeKeyProfileEtprs = ref('1')
const currentStepProfileEtprs = ref(0)
const currentStepProfileEtBank = ref(0)

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const socials = reactive([{
  name: 'facebook',
  icon: 'i-mdi-facebook-box',
  link: 'www.facebook.com',
  classes: 'text-green-600',
}, {
  name: 'twitter',
  icon: 'i-mdi-twitter-box',
  link: 'www.twitter.com',
  classes: 'text-green-600',
}, {
  name: 'linkedin',
  icon: 'i-mdi-linkedin',
  link: 'www.linkedin.com',
  classes: 'text-green-600',
}, {
  name: 'github',
  icon: 'i-mdi-github-box',
  link: 'www.github.com',
  classes: 'text-green-600',
}])

const profile = ref(null)
const profileAvatar = ref('')
const profileEntreprise = ref(null)
const skillsValue = ref([])
const skills = ref([])
const legalForms = ref([])
const languages = ref([])
const countries = ref([])
const countriesIban = ref([])
const countriesIbanOthers = ref([])
const jobs = ref([])
const types = ref([])
const typesAccount = ref([])
const activities = ref([])
const visibleModalAddExperience = ref(false)
const visibleModalAddFormation = ref(false)
const visibleModalAddCertification = ref(false)
const visibleModalInformationEmailVerification = ref(false)
const visibleModalInformationDocumentVal = ref(false)
const visibleModalInformationSignatureCharte = ref(false)
const visibleModalInformationValidated = ref(false)

// const formState = reactive<Record<string, any>>({
//   'input-number': 3,
//   'checkbox-group': ['A', 'B'],
//   'rate': 3.5,
// })

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
const formStateIbanOthers = reactive<any>({
  cb_iban_address_holder: '',
  cb_iban_city: '',
  cb_iban_country: '',
  cb_iban_name_lastname: '',
  cb_iban_postal: '',
  type_iban: 'others',
  cb_iban_region: '',
  cb_iban_account_number: '',
  cb_iban_bic_swift: '',
  cb_iban_account_country: '',
})
const formStateIbanCaModule = reactive<any>({
  cb_iban_address_holder: '',
  cb_iban_city: '',
  cb_iban_country: '',
  cb_iban_name_lastname: '',
  cb_iban_postal: '',
  type_iban: 'iban-ca',
  cb_iban_region: '',
  cb_iban_account_number: '',
  cb_iban_branch_code: '',
  cb_iban_number_institution: '',
  cb_iban_bank_name: '',
})
const formStateIbanUsModule = reactive<any>({
  cb_iban_address_holder: '',
  cb_iban_city: '',
  cb_iban_country: '',
  cb_iban_name_lastname: '',
  cb_iban_postal: '',
  type_iban: 'iban-us',
  cb_iban_region: '',
  cb_iban_account_number: '',
  cb_iban_aba_transit_number: '',
  cb_iban_account_type: '',
})
const formStateIbanModule = reactive<any>({
  cb_iban_address_holder: '',
  cb_iban_city: '',
  cb_iban_country: '',
  cb_iban_iban: '',
  cb_iban_name_lastname: '',
  cb_iban_postal: '',
  type_iban: 'iban',
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
const rulesIbanCa = reactive({
  cb_iban_name_lastname: [
    {
      required: true,
      message: 'Saisir le nom et prénom',
    },
  ],
  cb_iban_address_holder: [
    {
      required: true,
      message: 'Saisir \'adresse du titulaire',
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
  cb_iban_region: [
    {
      required: true,
      message: 'Saisir la région',
    },
  ],
  cb_iban_account_number: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
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
      },
      trigger: 'blur',
    },
  ],
  cb_iban_branch_code: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
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
      },
      trigger: 'blur',
    },
  ],
  cb_iban_number_institution: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
        if (!value)
          return Promise.reject(new Error('Veuillez saisir votre numéro d\institution '))

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
      },
      trigger: 'blur',
    },
  ],
  cb_iban_bank_name: [
    {
      required: true,
      message: 'Saisir le no mde votre banque',
    },
  ],
})
const rulesIbanOthers = reactive({
  cb_iban_name_lastname: [
    {
      required: true,
      message: 'Saisir le nom et prénom',
    },
  ],
  cb_iban_address_holder: [
    {
      required: true,
      message: 'Saisir \'adresse du titulaire',
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
  cb_iban_region: [
    {
      required: true,
      message: 'Saisir la région',
    },
  ],
  cb_iban_account_number: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
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
      },
      trigger: 'blur',
    },
  ],
  cb_iban_bic_swift: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
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
      },
      trigger: 'blur',
    },
  ],
  cb_iban_account_country: [
    {
      required: true,
      message: 'Saisir la pays du compte',
    },
  ],
})
const rulesIbanUs = reactive({
  cb_iban_name_lastname: [
    {
      required: true,
      message: 'Saisir le nom et prénom',
    },
  ],
  cb_iban_address_holder: [
    {
      required: true,
      message: 'Saisir \'adresse du titulaire',
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
  cb_iban_region: [
    {
      required: true,
      message: 'Saisir la région',
    },
  ],
  cb_iban_account_number: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
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
      },
      trigger: 'blur',
    },
  ],
  cb_iban_aba_transit_number: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
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
      },
      trigger: 'blur',
    },
  ],
  cb_iban_account_type: [
    {
      required: true,
      message: 'Choisir le type de compte',
    },
  ],

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
      message: 'Saisir \'adresse du titulaire',
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
      validator: async(_rule: RuleObject, value: string) => {
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
const getFormData = async() => {
  Api.languages().then(({ data }) => {
    data.value && (languages.value = data.value.map(l => ({
      value: l.code,
      label: l.name,
    })))
  })
  Api.skills().then(({ data }) => {
    data.value && (skills.value = data.value.map(l => ({
      value: l.name,
      label: l.name,
    })))
  })
  Api.countries().then(({ data }) => {
    data.value && (countries.value = data.value.map(l => ({
      value: l,
      label: l,
    })))
  })
  Api.iban().then(({ data }) => {
    data.value && (countriesIban.value = data.value.map(l => ({
      value: l.name,
      label: l.name,
    })))
  })
  Api.ibanOthers().then(({ data }) => {
    data.value && (countriesIbanOthers.value = data.value.map(l => ({
      value: l.name,
      label: l.name,
    })))
  })
  Api.jobs().then(({ data }) => {
    data.value && (jobs.value = data.value.filter(j => j._id && j.name).map(j => ({
      value: j._id,
      label: j.name,
    })))
  })
  Api.activities().then(({ data }) => {
    data.value && (activities.value = data.value.filter(a => a.code && a.name).map(a => ({
      value: a.code,
      label: a.name,
    })))
  })
  Api.legalForms().then(({ data }) => {
    data.value && (legalForms.value = data.value.filter(a => a.index && a.name).map(a => ({
      value: a.name,
      label: a.name,
    })))
  })
  Api.profile(props.id).then(({ data }) => {
    if (data.value)
      profile.value = data.value
    console.log('freelancer ', data.value)

    const skills = profile.value?.freelancer?.skills.map(s => ({
      value: s,
      label: s,
    }))
    // skills.value = skills
    skillsValue.value = skills
    const freelancer = profile.value?.freelancer
    profileAvatar.value = freelancer.image || ''
    formStateProfile.passion = freelancer.passion
    formStateProfile.email = freelancer.email
    formStateProfile.username = freelancer.username
    formStateProfile.firstName = freelancer.firstName
    formStateProfile.lastName = freelancer.lastName
    formStateProfile.jobCat = freelancer.jobCat
    formStateProfile.localisation = freelancer.localisation
    formStateProfile.phone = freelancer.phone
    formStateProfile.price_per_day = freelancer.price_per_day
    formStateProfile.show_price = !!freelancer.show_price
    formStateProfile.visibility = !!freelancer.visibility
    formStateProfile.greenQuestion = freelancer.greenQuestion
    formStateProfile.url_fb = freelancer.url_fb
    formStateProfile.url_github = freelancer.url_github
    formStateProfile.url_twitter = freelancer.url_twitter
    formStateProfile.url_linkedin = freelancer.url_linkedin
  })
  /**/
  Api.profileEntreprise(props.id).then(({ data }) => {
    if (data.value) {
      profileEntreprise.value = data.value
      console.log('profile ', data.value)
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

      formStateIbanModule.cb_iban_address_holder = ibanModule.cb_iban_address_holder
      formStateIbanModule.cb_iban_city = ibanModule.cb_iban_city
      formStateIbanModule.cb_iban_country = ibanModule.cb_iban_country
      formStateIbanModule.cb_iban_iban = ibanModule.cb_iban_iban
      formStateIbanModule.cb_iban_name_lastname = ibanModule.cb_iban_name_lastname
      formStateIbanModule.cb_iban_postal = ibanModule.cb_iban_postal

      formStateIbanUsModule.cb_iban_address_holder = ibanUsModule.cb_iban_address_holder
      formStateIbanUsModule.cb_iban_city = ibanUsModule.cb_iban_city
      formStateIbanUsModule.cb_iban_country = ibanUsModule.cb_iban_country
      formStateIbanUsModule.cb_iban_name_lastname = ibanUsModule.cb_iban_name_lastname
      formStateIbanUsModule.cb_iban_postal = ibanUsModule.cb_iban_postal
      formStateIbanUsModule.cb_iban_region = ibanUsModule.cb_iban_region
      formStateIbanUsModule.cb_iban_account_number = ibanUsModule.cb_iban_account_number
      formStateIbanUsModule.cb_iban_aba_transit_number = ibanUsModule.cb_iban_aba_transit_number
      formStateIbanUsModule.cb_iban_account_type = ibanUsModule.cb_iban_account_type

      formStateIbanCaModule.cb_iban_address_holder = ibanCaModule.cb_iban_address_holder
      formStateIbanCaModule.cb_iban_city = ibanCaModule.cb_iban_city
      formStateIbanCaModule.cb_iban_country = ibanCaModule.cb_iban_country
      formStateIbanCaModule.cb_iban_name_lastname = ibanCaModule.cb_iban_name_lastname
      formStateIbanCaModule.cb_iban_postal = ibanCaModule.cb_iban_postal
      formStateIbanCaModule.cb_iban_region = ibanCaModule.cb_iban_region
      formStateIbanCaModule.cb_iban_branch_code = ibanCaModule.cb_iban_branch_code
      formStateIbanCaModule.cb_iban_number_institution = ibanCaModule.cb_iban_number_institution
      formStateIbanCaModule.cb_iban_bank_name = ibanCaModule.cb_iban_bank_name

      formStateIbanOthers.cb_iban_address_holder = ibanOthers.cb_iban_address_holder
      formStateIbanOthers.cb_iban_city = ibanOthers.cb_iban_city
      formStateIbanOthers.cb_iban_country = ibanOthers.cb_iban_country
      formStateIbanOthers.cb_iban_name_lastname = ibanOthers.cb_iban_name_lastname
      formStateIbanOthers.cb_iban_postal = ibanOthers.cb_iban_postal
      formStateIbanOthers.cb_iban_region = ibanOthers.cb_iban_region
      formStateIbanOthers.cb_iban_account_number = ibanOthers.cb_iban_account_number
      formStateIbanOthers.cb_iban_bic_swift = ibanOthers.cb_iban_bic_swift
      formStateIbanOthers.cb_iban_account_country = ibanOthers.cb_iban_account_country
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
}

const updateProfile = async(profileData: any) => {
  const { data } = await freelancerApi.updateProfile(profileData)
  data && message.info(data.message)
  profile.value = null
  getFormData()
}
/* bloc iban others modules */
const useFormIbanOthersModule = useForm(formStateIbanOthers, rulesIbanOthers)
const validateIbanOthersModule = useFormIbanOthersModule.validate
const validateInfosIbanOthersModule = useFormIbanOthersModule.validateInfos

const onSubmitIbanOthersModule = async() => {
  validateIbanOthersModule()
    .then(async() => {
      const params = toRaw(formStateIbanOthers)
      const { data } = await freelancerApi.updatePaymentModule(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
/* bloc end iban others modules */

/* bloc iban ca modules */
const useFormIbanCaModule = useForm(formStateIbanCaModule, rulesIbanCa)
const validateIbanCaModule = useFormIbanCaModule.validate
const validateInfosIbanCaModule = useFormIbanCaModule.validateInfos

const onSubmitIbanCaModule = async() => {
  validateIbanCaModule()
    .then(async() => {
      const params = toRaw(formStateIbanCaModule)
      const { data } = await freelancerApi.updatePaymentModule(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
/* bloc end iban ca modules */

/* bloc iban us modules */
const useFormIbanUsModule = useForm(formStateIbanUsModule, rulesIbanUs)
const validateIbanUsModule = useFormIbanUsModule.validate
const validateInfosIbanUsModule = useFormIbanUsModule.validateInfos

const onSubmitIbanUsModule = async() => {
  validateIbanUsModule()
    .then(async() => {
      const params = toRaw(formStateIbanUsModule)
      const { data } = await freelancerApi.updatePaymentModule(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
/* bloc end iban us modules */

/* bloc iban modules */
const useFormIbanModule = useForm(formStateIbanModule, rulesIban)
const validateIbanModule = useFormIbanModule.validate
const validateInfosIbanModule = useFormIbanModule.validateInfos

const onSubmitIbanModule = async() => {
  validateIbanModule()
    .then(async() => {
      const params = toRaw(formStateIbanModule)
      const { data } = await freelancerApi.updatePaymentModule(params)
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
      const { data } = await freelancerApi.updateContactDetails(params)
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
  validateLegalRepresentative()
    .then(async() => {
      const params = toRaw(formStateLegalRepresentative)
      const { data } = await freelancerApi.updateLegalRepresentative(params)
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
      const { data } = await freelancerApi.updateTaxe(params)
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
      const { data } = await freelancerApi.updateLegalMention(params)
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

/* bloc experience */
const { resetFields, validate, validateInfos: experienceValidateInfos } = useForm(modelRefExperience, rulesRef)
const onSubmit = async() => {
  validate()
    .then(async() => {
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
    })
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
      content: 'Delete Experience',
      icon: h(ExclamationCircleOutlined),
      onOk() {
        return freelancerApi.deleteExperience(id).then(({ data }) => {
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
/* end bloc experience */
/* bloc formation */
const useFormFormation = useForm(modelRefFormation, rulesForm)
const resetFieldsFormation = useFormFormation.resetFields
const validateFormation = useFormFormation.validate
const validateInfosFormation = useFormFormation.validateInfos
const onSubmitForm = async() => {
  validateFormation()
    .then(async() => {
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
    })
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
const onSubmitCert = async() => {
  validateCertification()
    .then(async() => {
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
    })
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
  console.log(values)
  if (values.avatar) {
    console.log(values.avatar)
    const formData = new FormData()
    formData.append('image', values.avatar[0].originFileObj)
    if (profile.value.freelancer?.image)
      formData.append('old_image', 'test')

    const { data } = await freelancerApi.uploadProfile(formData)
    console.log(data)
  }

  updateProfile({ ...profile, ...values })
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

onMounted(async() => {
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
                    <a href="index.html">Home</a>
                  </li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Pages</li>
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
                :src="currentUser?.freelancer?.image"
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
                    >{{ `${currentUser?.freelancer?.lastName} ${currentUser?.freelancer?.firstName}` }}</a>
                    <a href="#" class="flex items-center mr-3 ml-1">
                      <span
                        v-if="currentUser?.freelancer?.validated"
                        class="i-carbon-checkmark-filled text-xl inline-block"
                      />
                      <span v-else class="i-carbon-close-filled text-red-600 text-xl inline-block" />
                    </a>
                    <a-rate class="h-[42px]" :value="3.5" allow-half />
                  </div>
                  <!--end::Name-->
                  <!--begin::Info-->
                  <div class="flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    <a
                      href="#"
                      class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                    >
                      <span class="i-carbon-user-avatar-filled-alt text-xl inline-block mr-1" />
                      {{ currentUser?.freelancer?.title_profile }}
                    </a>
                    <a
                      href="#"
                      class="flex items-center text-gray-400 text-hover-primary me-5 mb-2"
                    >
                      <span class="i-carbon-location-filled text-xl inline-block mr-1" />
                      {{ currentUser?.freelancer?.localisation }}
                    </a>
                    <a href="#" class="flex items-center text-gray-400 text-hover-primary mb-2">
                      <span class="i-carbon-email text-xl inline-block mr-1" />
                      {{ currentUser?.freelancer?.email }}
                    </a>
                  </div>
                  <!--end::Info-->
                </div>
                <div class="flex">
                  <a-card class="bg-gray-50/50 mr-4" body-style="padding: 5px 15px">
                    <a-statistic
                      title="Feedback"
                      :value="11.28"
                      :precision="2"
                      suffix="%"
                      :value-style="{ color: '#3f8600' }"
                    >
                      <template #prefix>
                        <span class="i-ant-design-arrow-up-outlined inline-block text-xl" />
                      </template>
                    </a-statistic>
                  </a-card>
                  <a-card :bordered="false" class="bg-white" body-style="padding: 5px">
                    <a-progress type="circle" :percent="30" :width="80" />
                  </a-card>
                </div>
                <div class>
                  <social-media :in-edit="true" :socials="socials" />
                </div>
              </div>
              <div class="mt-2">
                <a-button type="primary" class="mr-2">
                  Primary
                </a-button>
                <a-button class="mr-2">
                  secondary
                </a-button>
                <a-dropdown class="mr-2">
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="1">
                        1st item
                      </a-menu-item>
                      <a-menu-item key="2">
                        2nd item
                      </a-menu-item>
                      <a-menu-item key="3">
                        3rd item
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button>
                    <span class="flex items-center">
                      Actions
                      <div class="i-carbon-chevron-down inline-block" />
                    </span>
                  </a-button>
                </a-dropdown>
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
                          <a-form-item name="Question GREEN" label="Question GREEN">
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
                          <a-form-item name="passion" label="Passion">
                            <a-input v-model:value="formStateProfile.passion" />
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
                          <a-form-item name="jobCat" label="Choisir un Métier">
                            <a-select
                              v-model:value="formStateProfile.jobCat"
                              placeholder="Please select Métier"
                              :options="jobs"
                            />
                          </a-form-item>

                          <a-form-item name="visibility" label="Disponibilité">
                            <a-switch v-model:checked="formStateProfile.visibility" />
                          </a-form-item>

                          <a-form-item name="price_per_day" label="Fréquence / semaine">
                            <a-slider
                              v-model:value="formStateProfile.price_per_day"
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
                            :rules="[{ required: true, message: 'Please select your price_per_day!' }]"
                          >
                            <a-input-number
                              v-model:value="formStateProfile.price_per_day"
                              step="50"
                              :min="50"
                              :max="9999"
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
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.visibility ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.visibility ? 'Visible' : 'Invisible' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Description rédigé
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.description?.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.description?.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Au minimum sept compétences ajoutées
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.skills.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.skills.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Au minimum une langue ajoutée
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.languages.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.languages.length ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Vérification email
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.email_verification ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.email_verification ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.confidentiality ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.confidentiality ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Documents validés
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.documents_val ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.documents_val ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.signed_client ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.signed_client ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${currentUser?.freelancer?.validated ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ currentUser?.freelancer?.validated ? 'Oui' : 'Non' }}</span>
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
                      title="No experience found"
                      sub-title="Sorry, the page you visited does not exist."
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
              <a-tab-pane key="5" tab="Competences Professionelle" force-render>
                <div class>
                  <a-card title="Competences" :bordered="false" class="rounded-sm">
                    <div>
                      <a-select
                        v-model:value="skillsValue"
                        mode="tags"
                        style="width: 100%"
                        :token-separators="[',']"
                        placeholder="Automatic tokenization"
                        :options="skills"
                      />
                      <a-button
                        class="mt-3"
                        type="primary"
                        block
                        @click="updateProfile({ ...profile.freelancer, skills: skillsValue })"
                      >
                        Primary
                      </a-button>
                    </div>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="6" tab="Centre d'interet + passions + langues" force-render>
                <div class>
                  <a-card title="Centre d'interet" :bordered="false" class="rounded-sm">
                    <div>
                      <div class="mb-3">
                        <div class="text-dark-50 mb-1 text-lg">
                          Passion
                        </div>
                        <div>
                          <a-textarea
                            placeholder="Passion"
                            :auto-size="{ minRows: 3, maxRows: 5 }"
                          />
                        </div>
                      </div>
                      <div class="mb-3">
                        <div class="text-dark-50 mb-1 text-lg">
                          Centre d'intéréts
                        </div>
                        <a-select
                          v-model:value="skillsValue"
                          mode="tags"
                          style="width: 100%"
                          :token-separators="[',']"
                          placeholder="Automatic tokenization"
                          :options="skills"
                        />
                      </div>
                      <div class="mb-3">
                        <div class="text-dark-50 mb-1 text-lg">
                          Langues
                        </div>
                        <a-select
                          mode="multiple"
                          placeholder="Please select a langues"
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
                              <a-step status="finish" title="Coordonnées" />
                              <a-step status="finish" title="Représentant" />
                              <a-step status="process" title="Taxes" />
                              <a-step status="wait" title="Mentions" />
                              <a-step status="process" title="Documents légaux" />
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
                                        label="Start date"
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
                                      label="Pays de naissance"
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
                                        <a-upload-dragger name="files" action="/upload.do">
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
                            <a-steps
                              v-model:current="currentStepProfileEtBank"
                              type="navigation"
                              size="small"
                              :style="{
                                marginBottom: '60px',
                                boxShadow: '0px -1px 0 0 #e8e8e8 inset',
                              }"
                            >
                              <a-step
                                v-if="formStateTypeIban.type_iban == 'iban' ? 'status : finish' : 'status : process'"
                                title="IBAN"
                              />
                              <a-step
                                v-if="formStateTypeIban.type_iban == 'iban-us' ? 'status : finish' : 'status : process'"
                                title="Compte bancaire US"
                              />
                              <a-step
                                v-if="formStateTypeIban.type_iban == 'iban-ca' ? 'status : finish' : 'status : process'"
                                title="Compte bancaire Canadien"
                              />
                              <a-step
                                v-if="formStateTypeIban.type_iban == 'others' ? 'status : finish' : 'status : process'"
                                title="Autre"
                              />
                            </a-steps>
                            <div class="p-4">
                              <div class="max-w-md mx-auto">
                                <a-form
                                  v-if="currentStepProfileEtBank === 0"
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
                                  <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                    <a-button
                                      block
                                      type="primary"
                                      @click.prevent="onSubmitIbanModule"
                                    >
                                      Enregistrer
                                    </a-button>
                                  </a-form-item>
                                </a-form>
                                <div v-else-if="currentStepProfileEtBank === 1">
                                  <a-form
                                    v-if="currentStepProfileEtBank === 1"
                                    layout="vertical"
                                    :label-col="{ span: 24 }"
                                    :wrapper-col="{ span: 24 }"
                                    :model="formStateIbanUsModule"
                                    @finish-failed="onFinishFailed"
                                    @finish="onFinish"
                                  >
                                    <a-form-item
                                      label="Nom et prénom"
                                      v-bind="validateInfosIbanUsModule.cb_iban_name_lastname"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanUsModule.cb_iban_name_lastname"
                                        @blur="validate('cb_iban_name_lastname', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Adresse du titulaire"
                                      v-bind="validateInfosIbanUsModule.cb_iban_address_holder"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanUsModule.cb_iban_address_holder"
                                        @blur="validate('cb_iban_address_holder', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Code postal"
                                      v-bind="validateInfosIbanUsModule.cb_iban_postal"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanUsModule.cb_iban_postal"
                                        @blur="validate('cb_iban_postal', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Pays"
                                      v-bind="validateInfosIbanUsModule.cb_iban_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanUsModule.cb_iban_country"
                                        placeholder="Pays"
                                        :options="countriesIbanOthers"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Région"
                                      v-bind="validateInfosIbanUsModule.cb_iban_region"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanUsModule.cb_iban_region"
                                        @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Ville"
                                      v-bind="validateInfosIbanUsModule.cb_iban_city"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanUsModule.cb_iban_city"
                                        @blur="validate('cb_iban_city', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro de compte"
                                      v-bind="validateInfosIbanUsModule.cb_iban_account_number"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanUsModule.cb_iban_account_number"
                                        @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="ABA Transit number"
                                      v-bind="validateInfosIbanUsModule.cb_iban_aba_transit_number"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanUsModule.cb_iban_aba_transit_number"
                                        @blur="validate('cb_iban_aba_transit_number', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Type de compte"
                                      v-bind="validateInfosIbanUsModule.cb_iban_account_type"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanUsModule.cb_iban_account_type"
                                        :options="typesAccount"
                                      />
                                    </a-form-item>
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        @click.prevent="onSubmitIbanUsModule"
                                      >
                                        enregistrer
                                      </a-button>
                                    </a-form-item>
                                  </a-form>
                                </div>
                                <div v-else-if="currentStepProfileEtBank === 2">
                                  <a-form
                                    v-if="currentStepProfileEtBank === 2"
                                    layout="vertical"
                                    :label-col="{ span: 24 }"
                                    :wrapper-col="{ span: 24 }"
                                    :model="formStateIbanCaModule"
                                    @finish-failed="onFinishFailed"
                                    @finish="onFinish"
                                  >
                                    <a-form-item
                                      label="Nom et prénom"
                                      v-bind="validateInfosIbanCaModule.cb_iban_name_lastname"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_name_lastname"
                                        @blur="validate('cb_iban_name_lastname', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Adresse du titulaire"
                                      v-bind="validateInfosIbanCaModule.cb_iban_address_holder"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_address_holder"
                                        @blur="validate('cb_iban_address_holder', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Code postal"
                                      v-bind="validateInfosIbanCaModule.cb_iban_postal"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_postal"
                                        @blur="validate('cb_iban_postal', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Pays"
                                      v-bind="validateInfosIbanCaModule.cb_iban_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanCaModule.cb_iban_country"
                                        placeholder="Pays"
                                        :options="countriesIbanOthers"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Région"
                                      v-bind="validateInfosIbanCaModule.cb_iban_region"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_region"
                                        @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Ville"
                                      v-bind="validateInfosIbanCaModule.cb_iban_city"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_city"
                                        @blur="validate('cb_iban_city', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Nom de la banque"
                                      v-bind="validateInfosIbanCaModule.cb_iban_bank_name"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_bank_name"
                                        @blur="validate('cb_iban_bank_name', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro de compte"
                                      v-bind="validateInfosIbanCaModule.cb_iban_account_number"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_account_number"
                                        @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Code guichet"
                                      v-bind="validateInfosIbanCaModule.cb_iban_branch_code"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_branch_code"
                                        @blur="validate('cb_iban_branch_code', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro d\'institution"
                                      v-bind="validateInfosIbanCaModule.cb_iban_number_institution"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanCaModule.cb_iban_number_institution"
                                        @blur="validate('cb_iban_number_institution', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        @click.prevent="onSubmitIbanCaModule"
                                      >
                                        enregistrer
                                      </a-button>
                                    </a-form-item>
                                  </a-form>
                                </div>
                                <div v-else-if="currentStepProfileEtBank === 3">
                                  <a-form
                                    v-if="currentStepProfileEtBank === 3"
                                    layout="vertical"
                                    :label-col="{ span: 24 }"
                                    :wrapper-col="{ span: 24 }"
                                    :model="formStateIbanOthers"
                                    @finish-failed="onFinishFailed"
                                    @finish="onFinish"
                                  >
                                    <a-form-item
                                      label="Nom et prénom"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_name_lastname"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanOthers.cb_iban_name_lastname"
                                        @blur="validate('cb_iban_name_lastname', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Adresse du titulaire"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_address_holder"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanOthers.cb_iban_address_holder"
                                        @blur="validate('cb_iban_address_holder', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Code postal"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_postal"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanOthers.cb_iban_postal"
                                        @blur="validate('cb_iban_postal', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Pays"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanOthers.cb_iban_country"
                                        :options="countriesIbanOthers"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Région"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_region"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanOthers.cb_iban_region"
                                        @blur="validate('cb_iban_region', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Ville"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_city"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanOthers.cb_iban_city"
                                        @blur="validate('cb_iban_city', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro de compte"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_account_number"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanOthers.cb_iban_account_number"
                                        @blur="validate('cb_iban_account_number', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Numéro BIC/SWIFT"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_bic_swift"
                                    >
                                      <a-input
                                        v-model:value="formStateIbanOthers.cb_iban_bic_swift"
                                        @blur="validate('cb_iban_bic_swift', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="Pays du compte:"
                                      v-bind="validateInfosIbanOthersModule.cb_iban_account_country"
                                    >
                                      <a-select
                                        v-model:value="formStateIbanOthers.cb_iban_account_country"
                                        :options="countriesIbanOthers"
                                      />
                                    </a-form-item>

                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        @click.prevent="onSubmitIbanOthersModule"
                                      >
                                        enregistrer
                                      </a-button>
                                    </a-form-item>
                                  </a-form>
                                </div>
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
              label="Start date"
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
              label="End date"
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
        @click.prevent="onSubmit"
      >
        {{ modelRefExperience.id ? 'Modifier' : 'Ajouter' }}
      </a-button>
      <a-button
        style="margin-left: 10px"
        @click="() => !modelRefExperience.id ? resetFields() : (visibleModalAddExperience = false)"
      >
        {{ modelRefExperience.id ? 'Close' : 'Reset' }}
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
  <a-modal v-model:visible="visibleModalInformationSignatureCharte" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          Signature de la charte
        </div>
        <div>
          Vous devez signer la charte de green_positive selon votre rôle.
          Veuillez l'accepter via
          <router-link to="/charter">
            ce lien
          </router-link>pour continuez la validation de votre compte.
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
