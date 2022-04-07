<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import adminApi from '~/api/modules/admin'
import freelancerApi from '~/api/modules/freelancer'
import agenceApi from '~/api/modules/agence'
import companyApi from '~/api/modules/company'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const params = useUrlSearchParams('history')
const profileEntrepriseLoading = ref(false)

const formRegisterState = reactive<any>({
  username: '',
  lastName: '',
  firstName: '',
  email: '',
  phone: undefined,
  password: '',
  repeatPassword: '',

  jobCat: undefined,
  title_profile: '',
  localisation: '',
  level: undefined,
  price_per_day: 50,
  show_price: false,
  confidentiality: false,
})
const formRegisterAgenceState = reactive<any>({
  username: '',
  nameAgence: '',
  lastName: '',
  firstName: '',
  email: '',
  phone: undefined,
  password: '',
  repeatPassword: '',

  jobCat: undefined,
  localisation: '',
  confidentiality: false,
})

const formRegisterCompanyState = reactive<any>({
  username: '',
  lastName: '',
  firstName: '',
  email: '',
  phone: undefined,
  password: '',
  repeatPassword: '',

  name: '',
  size: 0,
  departement: undefined,
  searchable: false,
})

const formRegisterRef: any = ref(null)
const formRegisterAgenceRef: any = ref(null)
const formRegisterCompanyRef: any = ref(null)
const activeTabKey = ref('1')
const currentStep = ref(0)
const currentAgenceStep = ref(0)
const currentCompanyStep = ref(0)
const jobs = ref([])
const departements = ref([])
const sizeCompanies = ref([])

sizeCompanies.value = [{
  value: 0,
  label: '1 personne',
},
{
  value: 1,
  label: 'Entre 1 et 10',
},
{
  value: 2,
  label: 'Entre 11 et 49',
},
{
  value: 3,
  label: 'Entre 50 et 249',
},
{
  value: 4,
  label: 'Entre 250 et 999',
},
{
  value: 5,
  label: 'Entre 1000 et 4999',
},
{
  value: 6,
  label: 'Plus de 5000',
}]
departements.value = [{
  value: 'IT',
  label: 'IT',
},
{
  value: 'MARKETING',
  label: 'MARKETING',
},
{
  value: 'ADMINISTRATION',
  label: 'ADMINISTRATION',
},
{
  value: 'PURCHASING',
  label: 'PURCHASING',
},
{
  value: 'ACCOUNTING',
  label: 'ACCOUNTING',
},
{
  value: 'RH',
  label: 'RH',
},
{
  value: 'OPERATION',
  label: 'OPERATION',
},
{
  value: 'SALES',
  label: 'SALES',
},
{
  value: 'MANAGEMENT',
  label: 'MANAGEMENT',
},
{
  value: 'PRODUCT',
  label: 'PRODUCT',
},
{
  value: 'COMMUNICATION',
  label: 'COMMUNICATION',
}]

const typeSearchable = [{
  value: 'alone',
  label: 'chercher des freelancers tout seul',
},
{
  value: 'green',
  label: 'greenPositiv cherchera pour vous les profils',
}]

const validaterePassword = async(_rule: RuleObject, value: string) => {
  if (value === '')
    return Promise.reject(new Error('veuillez resaisir votre mot de passe'))

  else if (value !== formRegisterState.password)
    return Promise.reject(new Error('les mots de passes ne sont pas les mêmes'))

  else
    return Promise.resolve()
}
const validaterePasswordAgence = async(_rule: RuleObject, value: string) => {
  if (value === '')
    return Promise.reject(new Error('veuillez resaisir votre mot de passe'))

  else if (value !== formRegisterAgenceState.password)
    return Promise.reject(new Error('les mots de passes ne sont pas les mêmes'))

  else
    return Promise.resolve()
}
const validaterePasswordCompany = async(_rule: RuleObject, value: string) => {
  if (value === '')
    return Promise.reject(new Error('veuillez resaisir votre mot de passe'))

  else if (value !== formRegisterCompanyState.password)
    return Promise.reject(new Error('les mots de passes ne sont pas les mêmes'))

  else
    return Promise.resolve()
}
/*
const validateConfidentiality = async(_rules, value) => {
  if (value === true)
    return Promise.resolve()
  return Promise.reject(new Error('Please input the Confidentiality'))
}
*/
const validatePhone = async(_rule: RuleObject, value: any) => {
  if (!value)
    return Promise.reject(new Error('Veuillez saisir un numéro de téléphone valide'))

  if (!Number.isInteger(+value)) {
    return Promise.reject(new Error('Veuillez saisir que des chiffres'))
  }
  else {
    if (value.length < 10)
    // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject(`${'le numéro doit contenir 10 chiffres'}`)
    else
      return Promise.resolve()
  }
}
const nextStep = async() => {
  if (formRegisterRef.value) {
    try {
      const values = await formRegisterRef.value.validateFields()
      if (values)
        currentStep.value = ++currentStep.value
    }
    catch (errorInfo: any) {
      console.error(errorInfo.errorFields)
    }
  }
  else {
    if (currentStep.value > 1) {
      try {
        profileEntrepriseLoading.value = true
        const { data } = await freelancerApi.register({ ...formRegisterState, role: 'Freelancer' })

        if (data) {
          message.success('compte créé')
          await router.push('/')
        }
      }
      catch (error: any) {
        profileEntrepriseLoading.value = false
        message.destroy()
        message.error(`${error.message}`)
      }
    }
  }
}
const nextAgenceStep = async() => {
  if (formRegisterAgenceRef.value) {
    try {
      const values = await formRegisterAgenceRef.value.validateFields()
      if (values)
        currentAgenceStep.value = ++currentAgenceStep.value
    }
    catch (errorInfo: any) {
      console.error(errorInfo.errorFields)
    }
  }
  else {
    if (currentAgenceStep.value > 1) {
      try {
        profileEntrepriseLoading.value = true
        const { data } = await agenceApi.register({ ...formRegisterAgenceState, role: 'Agence' })

        if (data) {
          message.success('compte créé')
          await router.push('/')
        }
      }
      catch (error: any) {
        profileEntrepriseLoading.value = false
        message.destroy()
        message.error(`${error.message}`)
      }
    }
  }
}
const nextCompanyStep = async() => {
  if (formRegisterCompanyRef.value) {
    try {
      const values = await formRegisterCompanyRef.value.validateFields()
      if (values)
        currentCompanyStep.value = ++currentCompanyStep.value
    }
    catch (errorInfo: any) {
      console.error(errorInfo.errorFields)
    }
  }
  else {
    if (currentCompanyStep.value > 1) {
      try {
        profileEntrepriseLoading.value = true
        const { data } = await companyApi.register({ ...formRegisterCompanyState, role: 'Company' })

        if (data) {
          message.success('compte créé')
          await router.push('/')
        }
      }
      catch (error: any) {
        profileEntrepriseLoading.value = false
        message.destroy()
        message.error(`${error.message}`)
      }
    }
  }
}

onMounted(async() => {
  if (route.query.agence === 'true')
    activeTabKey.value = '2'
  const { data } = await adminApi.jobs()

  data && (jobs.value = data.value.filter(j => j._id && j.name).map(j => ({
    value: j._id,
    label: j.name,
  })))
})
</script>

<template>
  <main class="main-content">
    <!--== Start Page Header Area Wrapper ==-->
    <div class="page-header-area sec-overlay sec-overlay-black" data-bg-img="../assets/img/photos/bg2.jpg">
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                Création De Compte
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Accueil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Création de compte</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Page Header Area Wrapper ==-->

    <!--== Start Login Area Wrapper ==-->
    <section class="account-login-area">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-7 col-xl-6">
            <div class="login-register-form-wrap">
              <div class="login-register-form">
                <div class="form-title">
                  <h4 class="title mb-2">
                    Création de compte
                  </h4>
                </div>
                <div class="mb-4">
                  <a-tabs v-model:activeKey="activeTabKey" centered @change="params.agence = (activeTabKey === '2' ? 'true' : 'false')">
                    <a-tab-pane key="1">
                      <template #tab>
                        <span class="px-2 px-2 flex items-center">
                          <span class="i-uim-bag text-md inline-block mr-1" />
                          Freelance
                        </span>
                      </template>
                      <div class="px-2">
                        <a-steps size="small" :current="currentStep">
                          <a-step title="premiére étape" @click="currentStep > 0 && (currentStep= 0)" />
                          <a-step title="deuxiéme étape" @click="currentStep > 0 && (currentStep= 1)" />
                          <a-step title="Validation" @click="currentStep > 1 && (currentStep= 2)" />
                        </a-steps>
                        <div v-if="currentStep === 0" class="mt-4">
                          <a-form
                            ref="formRegisterRef"
                            :model="formRegisterState"
                            name="basic"
                            :label-col="{ span: 0 }"
                            :wrapper-col="{ span: 24 }"
                            autocomplete="on"
                          >
                            <a-form-item
                              name="username"
                              :rules="[{ required: true, message: 'Veuillez saisir votre identifiant', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterState.username" placeholder="Identifant" />
                            </a-form-item>

                            <a-form-item
                              name="firstName"
                              :rules="[{ required: true, message: 'Veuillez saisir votre prénom', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterState.firstName" placeholder="Nom" />
                            </a-form-item>

                            <a-form-item
                              name="lastName"
                              :rules="[{ required: true, message: 'Veuillez saisir votre nom', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterState.lastName" placeholder="Prénom" />
                            </a-form-item>

                            <a-form-item
                              name="email"
                              :rules="[{ required: true, message: 'Veuillez saisir votre adresse mail', type: 'email', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterState.email" placeholder="Email" />
                            </a-form-item>

                            <a-form-item
                              name="phone"
                              :rules="[{ required: true, validator: validatePhone, trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterState.phone" placeholder="votre numéro de téléphone" />
                            </a-form-item>

                            <a-form-item
                              name="password"
                              :rules="[{ required: true, min: 8,message:'la longueur minimale est de 8', trigger: 'change' }]"
                            >
                              <a-input-password v-model:value="formRegisterState.password" placeholder="mot de passe" />
                            </a-form-item>

                            <a-form-item
                              name="repeatPassword"
                              :rules="[{ required: true, validator: validaterePassword, trigger: 'change' }]"
                            >
                              <a-input-password v-model:value="formRegisterState.repeatPassword" autocomplete="off" placeholder="répéter votre mot de passe" />
                            </a-form-item>

                            <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                              <a-button type="primary" block @click="nextStep">
                                Continuez
                              </a-button>
                            </a-form-item>
                          </a-form>
                        </div>
                        <div v-else-if="currentStep === 1" class="mt-4">
                          <a-form
                            ref="formRegisterRef"
                            :model="formRegisterState"
                            name="basic"
                            :label-col="{ span: 0 }"
                            :wrapper-col="{ span: 24 }"
                            autocomplete="on"
                          >
                            <a-form-item
                              name="jobCat"
                              has-feedback
                              :rules="[{ required: true, message: 'Veuillez choisir une catégorie de métier' }]"
                            >
                              <label for="level">Choisissez votre métier :</label>
                              <a-select
                                v-model:value="formRegisterState.jobCat" :options="jobs" placeholder="Veuillez choisir une catégorie de métier"
                              />
                            </a-form-item>
                            <a-form-item
                              name="title_profile"
                              :rules="[{ required: true, message: 'Veuillez saisir votre poste', trigger: 'change' }]"
                            >
                              <label for="level">Choisissez votre métier :</label>
                              <a-input v-model:value="formRegisterState.title_profile" placeholder="Développeur Backend, Auditeur..." />
                            </a-form-item>
                            <a-form-item
                              name="localisation"
                              :rules="[{ required: true, message: 'Veuillez saisir votre localisation', trigger: 'change' }]"
                            >
                              <label for="level">Votre localisation :</label>
                              <a-input v-model:value="formRegisterState.localisation" placeholder="Paris, 13éme arrondissement, ..." />
                            </a-form-item>
                            <a-form-item
                              name="level"
                              has-feedback
                              :rules="[{ required: true, message: 'Veuillez choisir votre pays' }]"
                            >
                              <label for="level">Votre niveau d'éxpérience :</label>
                              <div class="text-center">
                                <a-radio-group v-model:value="formRegisterState.level" class="mx-auto flex" button-style="solid">
                                  <a-radio-button value="Junior" class="!h-auto flex-auto">
                                    0 à 2 ans Junior
                                  </a-radio-button>
                                  <a-radio-button value="Intermédiaire" class="!h-auto flex-auto">
                                    2 à 7 ans Intermediaire
                                  </a-radio-button>
                                  <a-radio-button value="Senior" class="!h-auto flex-auto">
                                    7 ans et + Senior
                                  </a-radio-button>
                                </a-radio-group>
                              </div>
                            </a-form-item>

                            <a-form-item name="price_per_day" :rules="[{ required: true, message: 'Veuillez saisir votre tarif' }]">
                              <span class="ant-form-text">Définissez votre tarif </span>
                              <a-input-number v-model:value="formRegisterState.price_per_day" step="50" :min="50" :max="9999" />
                            </a-form-item>

                            <a-form-item name="show_price" no-style :rules="[{ required: true, message: 'Afficher votre prix' }]">
                              <a-checkbox v-model:checked="formRegisterState.show_price">
                                Masquer mon tarif.
                              </a-checkbox>
                              <p class="my-1.5">
                                En cochant cette case, vous n'apparaîtrez plus dans les résultats de recherche mais
                                votre profil reste accessible et vous pourrez recevoir des opportunités de
                                missions.
                              </p>
                            </a-form-item>

                            <a-form-item name="confidentiality" :rules="[{ required: true, message: 'Recevez des notifications par emails' }]">
                              <a-checkbox v-model:checked="formRegisterState.confidentiality">
                                Acceptez de recevoir des notifications de Green-positiv.
                              </a-checkbox>
                            </a-form-item>

                            <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                              <a-button type="primary" block @click="nextStep">
                                Continuez
                              </a-button>
                            </a-form-item>
                          </a-form>
                        </div>
                        <div v-else-if="currentStep === 2">
                          <a-descriptions title="Vos informations" layout="vertical">
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Identifiant</span>
                              </template>
                              {{ formRegisterState.username }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Téléphone</span>
                              </template>
                              {{ formRegisterState.phone }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">localisation</span>
                              </template>
                              {{ formRegisterState.localisation }}
                            </a-descriptions-item>
                            <a-descriptions-item :span="2">
                              <template #label>
                                <span class="text-md">localisation</span>
                              </template>
                              {{ formRegisterState.localisation }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">prix par jour</span>
                              </template>
                              {{ formRegisterState.price_per_day }}
                            </a-descriptions-item>
                          </a-descriptions>
                          <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                            <a-button type="primary" block :loading="profileEntrepriseLoading" @click="nextStep">
                              Continuez
                            </a-button>
                          </a-form-item>
                        </div>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" force-render>
                      <template #tab>
                        <span class="px-2 flex items-center">
                          <span class="i-uim-user-nurse text-md inline-block mr-1" />
                          Solution innovante
                        </span>
                      </template>
                      <div class="px-2">
                        <a-steps size="small" :current="currentAgenceStep">
                          <a-step title="premiére étape" @click="currentAgenceStep > 0 && (currentAgenceStep= 0)" />
                          <a-step title="deuxiéme étape" @click="currentAgenceStep > 0 && (currentAgenceStep= 1)" />
                          <a-step title="Validation" @click="currentAgenceStep > 1 && (currentAgenceStep= 2)" />
                        </a-steps>
                        <div v-if="currentAgenceStep === 0" class="mt-4">
                          <a-form
                            ref="formRegisterAgenceRef"
                            :model="formRegisterAgenceState"
                            name="basic"
                            :label-col="{ span: 0 }"
                            :wrapper-col="{ span: 24 }"
                            autocomplete="on"
                          >
                            <a-form-item
                              name="username"
                              :rules="[{ required: true, message: 'Veuillez saisir votre identifiant', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterAgenceState.username" placeholder="Identifant" />
                            </a-form-item>
                            <a-form-item
                              name="nameAgence"
                              :rules="[{ required: true, message: 'Veuillez saisir le nom de votre solution innovante', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterAgenceState.nameAgence" placeholder="Nom de votre solution innovante" />
                            </a-form-item>

                            <a-form-item
                              name="firstName"
                              :rules="[{ required: true, message: 'Veuillez saisir votre prénom', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterAgenceState.firstName" placeholder="Nom" />
                            </a-form-item>

                            <a-form-item
                              name="lastName"
                              :rules="[{ required: true, message: 'Veuillez saisir votre nom', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterAgenceState.lastName" placeholder="Prénom" />
                            </a-form-item>

                            <a-form-item
                              name="email"
                              :rules="[{ required: true, message: 'Veuillez saisir votre adresse mail', type: 'email', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterAgenceState.email" placeholder="Email" />
                            </a-form-item>

                            <a-form-item
                              name="phone"
                              :rules="[{ required: true, validator: validatePhone, trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterAgenceState.phone" placeholder="votre numéro de téléphone" />
                            </a-form-item>

                            <a-form-item
                              name="password"
                              :rules="[{ required: true, min: 8, trigger: 'change' }]"
                            >
                              <a-input-password v-model:value="formRegisterAgenceState.password" placeholder="mot de passe" />
                            </a-form-item>

                            <a-form-item
                              name="repeatPassword"
                              :rules="[{ required: true, validator: validaterePasswordAgence, trigger: 'change' }]"
                            >
                              <a-input-password v-model:value="formRegisterAgenceState.repeatPassword" autocomplete="off" placeholder="répéter votre mot de passe" />
                            </a-form-item>

                            <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                              <a-button type="primary" block @click="nextAgenceStep">
                                Continuez
                              </a-button>
                            </a-form-item>
                          </a-form>
                        </div>
                        <div v-else-if="currentAgenceStep === 1" class="mt-4">
                          <a-form
                            ref="formRegisterAgenceRef"
                            :model="formRegisterAgenceState"
                            name="basic"
                            :label-col="{ span: 0 }"
                            :wrapper-col="{ span: 24 }"
                            autocomplete="on"
                          >
                            <a-form-item
                              name="jobCat"
                              has-feedback
                              :rules="[{ required: true, message: 'Veuillez choisir une catégorie de métier' }]"
                            >
                              <label for="level">Choisissez votre catégorie de métier :</label>
                              <a-select
                                v-model:value="formRegisterAgenceState.jobCat" :options="jobs" placeholder="Veuillez choisir une catégorie de métier"
                              />
                            </a-form-item>
                            <a-form-item
                              name="localisation"
                              :rules="[{ required: true, message: 'Veuillez saisir votre localisation', trigger: 'change' }]"
                            >
                              <label for="level">Votre localisation :</label>
                              <a-input v-model:value="formRegisterAgenceState.localisation" placeholder="Paris, 13éme arrondissement, ..." />
                            </a-form-item>

                            <a-form-item name="confidentiality" :rules="[{ required: true, message: 'Recevez des notifications par emails' }]">
                              <a-checkbox v-model:checked="formRegisterAgenceState.confidentiality">
                                Acceptez de recevoir des notifications de Green-positiv.
                              </a-checkbox>
                            </a-form-item>

                            <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                              <a-button type="primary" block @click="nextAgenceStep">
                                Continuez
                              </a-button>
                            </a-form-item>
                          </a-form>
                        </div>
                        <div v-else-if="currentAgenceStep === 2">
                          <a-descriptions title="Vos informations" layout="vertical">
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Identifiant</span>
                              </template>
                              {{ formRegisterAgenceState.username }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Nom de la solution innovante</span>
                              </template>
                              {{ formRegisterAgenceState.nameAgence }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Téléphone</span>
                              </template>
                              {{ formRegisterAgenceState.phone }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">localisation</span>
                              </template>
                              {{ formRegisterAgenceState.localisation }}
                            </a-descriptions-item>
                          </a-descriptions>
                          <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                            <a-button type="primary" block :loading="profileEntrepriseLoading" @click="nextAgenceStep">
                              Continuez
                            </a-button>
                          </a-form-item>
                        </div>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane key="3" force-render>
                      <template #tab>
                        <span class="px-2 flex items-center">
                          <span class="i-carbon:enterprise text-md inline-block mr-1" />
                          Entreprise
                        </span>
                      </template>
                      <div class="px-2">
                        <a-steps size="small" :current="currentCompanyStep">
                          <a-step title="premiére étape" @click="currentCompanyStep > 0 && (currentCompanyStep= 0)" />
                          <a-step title="deuxiéme étape" @click="currentCompanyStep > 0 && (currentCompanyStep= 1)" />
                          <a-step title="Validation" @click="currentCompanyStep > 1 && (currentCompanyStep= 2)" />
                        </a-steps>
                        <div v-if="currentCompanyStep === 0" class="mt-4">
                          <a-form
                            ref="formRegisterCompanyRef"
                            :model="formRegisterCompanyState"
                            name="basic"
                            :label-col="{ span: 0 }"
                            :wrapper-col="{ span: 24 }"
                            autocomplete="on"
                          >
                            <a-form-item
                              name="username"
                              :rules="[{ required: true, message: 'Veuillez saisir votre identifiant', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterCompanyState.username" placeholder="Identifant" />
                            </a-form-item>

                            <a-form-item
                              name="firstName"
                              :rules="[{ required: true, message: 'Veuillez saisir votre prénom', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterCompanyState.firstName" placeholder="Nom" />
                            </a-form-item>

                            <a-form-item
                              name="lastName"
                              :rules="[{ required: true, message: 'Veuillez saisir votre nom', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterCompanyState.lastName" placeholder="Prénom" />
                            </a-form-item>

                            <a-form-item
                              name="email"
                              :rules="[{ required: true, message: 'Veuillez saisir votre adresse mail', type: 'email', trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterCompanyState.email" placeholder="Email" />
                            </a-form-item>

                            <a-form-item
                              name="phone"
                              :rules="[{ required: true, validator: validatePhone, trigger: 'change' }]"
                            >
                              <a-input v-model:value="formRegisterCompanyState.phone" placeholder="votre numéro de téléphone" />
                            </a-form-item>

                            <a-form-item
                              name="password"
                              :rules="[{ required: true, min: 8,message: 'la longueur minimal du mot de passe est 8', trigger: 'change' }]"
                            >
                              <a-input-password v-model:value="formRegisterCompanyState.password" placeholder="mot de passe" />
                            </a-form-item>

                            <a-form-item
                              name="repeatPassword"
                              :rules="[{ required: true, validator: validaterePasswordCompany, trigger: 'change' }]"
                            >
                              <a-input-password v-model:value="formRegisterCompanyState.repeatPassword" autocomplete="off" placeholder="répéter votre mot de passe" />
                            </a-form-item>

                            <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                              <a-button type="primary" block @click="nextCompanyStep">
                                Continuez
                              </a-button>
                            </a-form-item>
                          </a-form>
                        </div>
                        <div v-else-if="currentCompanyStep === 1" class="mt-4">
                          <a-form
                            ref="formRegisterCompanyRef"
                            :model="formRegisterCompanyState"
                            name="basic"
                            :label-col="{ span: 0 }"
                            :wrapper-col="{ span: 24 }"
                            autocomplete="on"
                          >
                            <a-form-item
                              name="name"
                              has-feedback
                              :rules="[{ required: true, message: 'Veuillez saisir le nom de votre entreprise' }]"
                            >
                              <a-input v-model:value="formRegisterCompanyState.name" placeholder="Nom de votre entreprise" />
                            </a-form-item>
                            <a-form-item
                              name="size"
                              has-feedback
                              :rules="[{ required: true, message: 'Veuillez saisir la taille de votre entreprise' }]"
                            >
                              <label for="level">Choisissez la taille de votre entreprise :</label>
                              <a-select
                                v-model:value="formRegisterCompanyState.size" :options="sizeCompanies" placeholder="Choisissez la taille de votre entreprise"
                              />
                            </a-form-item>
                            <a-form-item
                              name="departement"
                              has-feedback
                              :rules="[{ required: true, message: 'Veuillez saisir votre département' }]"
                            >
                              <label for="departement">Choisissez le département :</label>
                              <a-select
                                v-model:value="formRegisterCompanyState.departement" :options="departements" placeholder="Choisissez votre département"
                              />
                            </a-form-item>
                            <a-form-item
                              name="searchable"
                              has-feedback
                              :rules="[{ required: true, message: 'Veuillez choisir le type de recherche' }]"
                            >
                              <label for="searchable">type de recherche :</label>
                              <a-select
                                v-model:value="formRegisterCompanyState.searchable" :options="typeSearchable" placeholder="Choisissez le type de recherche"
                              />
                            </a-form-item>
                            <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                              <a-button type="primary" block @click="nextCompanyStep">
                                Continuez
                              </a-button>
                            </a-form-item>
                          </a-form>
                        </div>
                        <div v-else-if="currentCompanyStep === 2">
                          <a-descriptions title="Vos informations" layout="vertical">
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Identifiant</span>
                              </template>
                              {{ formRegisterCompanyState.username }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Téléphone</span>
                              </template>
                              {{ formRegisterCompanyState.phone }}
                            </a-descriptions-item>
                            <a-descriptions-item :span="2">
                              <template #label>
                                <span class="text-md">Nom</span>
                              </template>
                              {{ formRegisterCompanyState.name }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Taille</span>
                              </template>
                              {{ sizeCompanies[formRegisterCompanyState.size].label }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Département</span>
                              </template>
                              {{ formRegisterCompanyState.departement }}
                            </a-descriptions-item>
                            <a-descriptions-item>
                              <template #label>
                                <span class="text-md">Type de recherche</span>
                              </template>
                              <div v-if="formRegisterCompanyState.searchable == 'alone'">
                                {{ typeSearchable[0].label }}
                              </div>
                              <div v-else>
                                {{ typeSearchable[1].label }}
                              </div>
                            </a-descriptions-item>
                          </a-descriptions>
                          <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                            <a-button type="primary" block :loading="profileEntrepriseLoading" @click="nextCompanyStep">
                              Continuez
                            </a-button>
                          </a-form-item>
                        </div>
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Login Area Wrapper ==-->
  </main>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
