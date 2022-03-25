<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'
import companyApi from '~/api/modules/company'

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

  name: '',
  size: 0,
  departement: undefined,
  searchable: false,
})

const formRegisterRef: any = ref(null)
const activeTabKey = ref('1')
const currentStep = ref(0)
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
        const { data } = await companyApi.register({ ...formRegisterState, role: 'Company' })

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
                Création De Compte Entreprise
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
                          name="name"
                          has-feedback
                          :rules="[{ required: true, message: 'Veuillez saisir le nom de votre entreprise' }]"
                        >
                          <a-input v-model:value="formRegisterState.name" placeholder="Nom de votre entreprise" />
                        </a-form-item>
                        <a-form-item
                          name="size"
                          has-feedback
                          :rules="[{ required: true, message: 'Veuillez saisir la taille de votre entreprise' }]"
                        >
                          <label for="level">Choisissez la taille de votre entreprise :</label>
                          <a-select
                            v-model:value="formRegisterState.size" :options="sizeCompanies" placeholder="Choisissez la taille de votre entreprise"
                          />
                        </a-form-item>
                        <a-form-item
                          name="departement"
                          has-feedback
                          :rules="[{ required: true, message: 'Veuillez saisir votre département' }]"
                        >
                          <label for="departement">Choisissez le département :</label>
                          <a-select
                            v-model:value="formRegisterState.departement" :options="departements" placeholder="Choisissez votre département"
                          />
                        </a-form-item>
                        <a-form-item
                          name="searchable"
                          has-feedback
                          :rules="[{ required: true, message: 'Veuillez choisir le type de recherche' }]"
                        >
                          <label for="searchable">type de recherche :</label>
                          <a-select
                            v-model:value="formRegisterState.searchable" :options="typeSearchable" placeholder="Choisissez le type de recherche"
                          />
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
                        <a-descriptions-item :span="2">
                          <template #label>
                            <span class="text-md">Nom</span>
                          </template>
                          {{ formRegisterState.name }}
                        </a-descriptions-item>
                        <a-descriptions-item>
                          <template #label>
                            <span class="text-md">Taille</span>
                          </template>
                          {{ sizeCompanies[formRegisterState.size].label }}
                        </a-descriptions-item>
                        <a-descriptions-item>
                          <template #label>
                            <span class="text-md">Département</span>
                          </template>
                          {{ formRegisterState.departement }}
                        </a-descriptions-item>
                        <a-descriptions-item>
                          <template #label>
                            <span class="text-md">Type de recherche</span>
                          </template>
                          <div v-if="formRegisterState.searchable == 'alone'">
                            {{ typeSearchable[0].label }}
                          </div>
                          <div v-else>
                            {{ typeSearchable[1].label }}
                          </div>
                        </a-descriptions-item>
                      </a-descriptions>
                      <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                        <a-button type="primary" block @click="nextStep">
                          Continuez
                        </a-button>
                      </a-form-item>
                    </div>
                  </div>
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
