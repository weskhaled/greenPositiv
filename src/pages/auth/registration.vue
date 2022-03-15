<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import { currentUser, token } from '~/stores'
import jobsApi from '~/api/modules/jobs'
import authApi from '~/api/modules/auth'
import logoLight from '~/assets/img/logo-light.png'
import logoLightTheme from '~/assets/img/logo-light-theme.png'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const params = useUrlSearchParams('history')

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

const formRegisterRef: any = ref(null)
const activeTabKey = ref('1')
const currentStep = ref(0)
const jobs = ref([])

const validaterePassword = async(_rule: RuleObject, value: string) => {
  if (value === '')
    return Promise.reject(new Error('Please input the password again'))

  else if (value !== formRegisterState.password)
    return Promise.reject(new Error('two inputs don\'t match!'))

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
        const { data } = await authApi.register({ ...formRegisterState, role: 'Freelancer' })

        if (data) {
          message.success('compte créé')
          await router.push('/')
        }
      }
      catch (error: any) {
        message.destroy()
        message.error(`${error.message}`)
      }
    }
  }
}

onMounted(async() => {
  if (route.query.agence === 'true')
    activeTabKey.value = '2'
  const { data } = await jobsApi.jobs()

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
                              :rules="[{ required: true, min: 8, trigger: 'change' }]"
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
                            <a-button type="primary" block @click="nextStep">
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
                          Agence
                        </span>
                      </template>
                      Content of Tab Pane 2
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
