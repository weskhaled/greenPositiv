<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Form, Modal, message } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import SwiperCore, { Controller, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import globalApi from '~/api/modules/global'
import companyApi from '~/api/modules/company'
import profileEntrepriseApi from '~/api/modules/profil-entreprise'
import { currentUser } from '~/stores'
import 'swiper/css/pagination'

SwiperCore.use([Controller, Pagination])

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
const profile = ref(null)
const profileAvatar = ref('')
const logoProfile = ref('')
const userDocument = ref(null)
const profileEntreprise = ref(null)
const activities = ref([])
const departements = ref([])
const sizeCompanies = ref([])
const typeSearchable = ref([])

const visibleModalInformationEmailVerification = ref(false)
const visibleModalInformationDocumentVal = ref(false)
const visibleModalInformationSignatureCharte = ref(false)
const visibleModalGreenQuestion = ref(false)
const visibleModalInformationValidated = ref(false)
const visibleModalAddCollaborator = ref(false)
const profileEntrepriseLoading = ref(false)

const controlledSwiper = ref(null)
const setControlledSwiper = (swiper) => {
  controlledSwiper.value = swiper
}

typeSearchable.value = [{
  value: 'alone',
  label: 'chercher des freelancers tout seul',
},
{
  value: 'green',
  label: 'greenPositiv cherchera pour vous les profils',
}]
sizeCompanies.value = [{
  value: '0',
  label: '1 personne',
},
{
  value: '1',
  label: 'Entre 1 et 10',
},
{
  value: '2',
  label: 'Entre 11 et 49',
},
{
  value: '3',
  label: 'Entre 50 et 249',
},
{
  value: '4',
  label: 'Entre 250 et 999',
},
{
  value: '5',
  label: 'Entre 1000 et 4999',
},
{
  value: '6',
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
const modelRefCollaborator = reactive({
  id: undefined,
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  departement: undefined,
  validated: undefined,
})
const formStateProfile = reactive<Record<string, any>>({
  avatar: null,
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  departement: undefined,
  phone: '',
  visibility: false,
  greenQuestion: '',
  searchable: undefined,
  worked_with: [],
  favorites: [],
  worked_in: [],
  active_collab: false,
})
const formStateProfileEntreprise = reactive<any>({
  logo: null,
  name: '',
  size: 0,
  sector_activity: '',
})
const formStateFacturation = reactive<any>({
  social_reason: '',
  siret: '',
  tva_intracom: '',
  address: '',
  address_plus: '',
})
const formStateContact = reactive<any>({
  lastname: '',
  firstname: '',
  email: '',
  send_compta: false,
})
const rulesProfileEntreprise = reactive({
  name: [
    {
      required: true,
      message: 'Saisir le nom',
    },
    {
      min: 3,
      message: 'la longueur minimale est de 3',
      trigger: 'blur',
    },
  ],
  size: [
    {
      required: true,
    },
    {
      validator: async(_rule: RuleObject, value: string) => {
        if (!value)
          return Promise.reject(new Error('Veuillez saisir la taille de votre entreprise'))
        if (!Number.isInteger(+value)) {
          return Promise.reject(new Error('Veuillez saisir que des chiffres'))
        }
        else {
          if (Number(value) < 0 || Number(value) > 6)
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject(`${'Choisir une taille autorisé'}`)
          else
            return Promise.resolve()
        }
      },
      trigger: 'blur',
    },
  ],
  sector_activity: [
    {
      required: true,
      message: 'Veuillez choisir un domaine',
    },
  ],
})
/**/
const rulesFacturation = reactive({
  social_reason: [
    {
      required: true,
      message: 'Saisir la raison sociale',
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
  address: [
    {
      required: true,
      message: 'Saisir l\'adresse',
    },
  ],
})
const rulesContact = reactive({
  lastName: [
    {
      required: true,
      message: 'Saisir votre nom',
    },
  ],
  firstName: [
    {
      required: true,
      message: 'Saisir votre prénom',
    },
  ],
  email: [
    {
      required: true,
      message: 'Saisir l\adresse email',
    },
  ],
})
const rulesCollab = reactive({
  username: [
    {
      required: true,
      message: 'Saisir un identifiant',
    },
    {
      min: 3,
      message: 'la longueur minimale est de 3',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: 'Saisir une adresse email',
    },
    {
      min: 3,
      message: 'la longueur minimale est de 3',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
        if (!value) return Promise.reject(new Error('Saisir un mot de passe '))
        if (value.length < 8)
          return Promise.reject(new Error('la longueur minimal du mot de passe est 8 caractéres'))
        else
          return Promise.resolve()
      },
    },
  ],
  departement: [
    {
      required: true,
      message: 'Choisissez un département',
    },
  ],
})
/* bloc collaborator */
const { resetFields, validate, validateInfos: collaboratorValidateInfos } = useForm(modelRefCollaborator, rulesCollab)
const onSubmitCollab = async() => {
  validate()
    .then(async() => {
      profileEntrepriseLoading.value = true
      const params = toRaw(modelRefCollaborator)
      const { data } = await companyApi.createCollaborator(params)
      message.info(data.message)
      visibleModalAddCollaborator.value = false
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}

const deleteCollab = (id: string) => {
  setTimeout(() => {
    Modal.confirm({
      content: 'Supprimer le collaborateur',
      icon: h(ExclamationCircleOutlined),
      onOk() {
        return companyApi.removeCollaborator(currentUser?.value.idUser, id).then(({ data }) => {
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

const deleteFavoris = (id: string) => {
  setTimeout(() => {
    Modal.confirm({
      content: 'Supprimer le Retirer ce freelance de la liste des favoris ?',
      icon: h(ExclamationCircleOutlined),
      onOk() {
        return companyApi.removeFavoris(id).then(({ data }) => {
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

/* end bloc reference */
const getFormData = async() => {
  globalApi.activities().then(({ data }) => {
    data.value && (activities.value = data.value.filter(a => a.code && a.name).map(a => ({
      value: a.code,
      label: a.name,
    })))
  })
  profile.value = null
  await companyApi.profile(props.id).then(({ data }) => {
    if (data.value) {
      profile.value = data.value
      const company = profile.value?.company
      profileAvatar.value = company.image || ''
      formStateProfile.email = company.email
      formStateProfile.confidentiality = company.confidentiality
      formStateProfile.username = company.username
      formStateProfile.firstName = company.firstName
      formStateProfile.lastName = company.lastName
      formStateProfile.departement = company.departement
      formStateProfile.searchable = company.searchable
      formStateProfile.phone = company.phone
      formStateProfile.worked_with = company.worked_with
      formStateProfile.favorites = company.favorites
      formStateProfile.worked_in = company.worked_in
      formStateProfile.name = company.name
      formStateProfile.size = !!company.size
      formStateProfile.greenQuestion = company.greenQuestion
      formStateProfile.active_collab = company.active_collab
    }
  })
  /**/
  profileEntreprise.value = null
  await profileEntrepriseApi.profileEntrepriseCompany(props.id).then(async({ data }) => {
    if (data) {
      profileEntreprise.value = data
      formStateProfileEntreprise.name = profileEntreprise.value?.profile?.name
      formStateProfileEntreprise.size = profileEntreprise.value?.profile?.size
      formStateProfileEntreprise.sector_activity = profileEntreprise.value?.profile?.sector_activity
      logoProfile.value = profileEntreprise.value?.profile.logo || ''

      formStateFacturation.social_reason = profileEntreprise.value?.facturation?.social_reason
      formStateFacturation.siret = profileEntreprise.value?.facturation?.siret
      formStateFacturation.tva_intracom = profileEntreprise.value?.facturation?.tva_intracom
      formStateFacturation.address = profileEntreprise.value?.facturation?.address
      formStateFacturation.address_plus = profileEntreprise.value?.facturation?.address_plus

      formStateContact.lastName = profileEntreprise.value?.contact?.lastName
      formStateContact.firstName = profileEntreprise.value?.contact?.firstName
      formStateContact.email = profileEntreprise.value?.contact?.email
      formStateContact.send_compta = profileEntreprise.value?.contact?.send_compta
    }
    else {
      message.error('profil entreprise non chargé')
    }
  })
}
const onLoad = () => {
  profileEntrepriseLoading.value = true
}
const getScore = () => {
  if (!profile.value?.company)
    return 0
  let value = 0
  profile.value.company?.email_verification && (value += 20)
  profile.value.company?.documents_val && (value += 30)
  profile.value.company?.validated && (value += 10)
  profile.value.company?.signed_company && (value += 20)
  profile.value.company?.greenQuestion?.length >= 1 && (value += 20)
  return value
}

const updateProfile = async(profileData: any) => {
  const { data } = await companyApi.updateProfile(profileData)
  data && message.info(data.message)
  getFormData()
  profileEntrepriseLoading.value = false
}

/* bloc contact */
const useFormContact = useForm(formStateContact, rulesContact)
const validateContact = useFormContact.validate
const validateInfosContact = useFormContact.validateInfos
const onSubmitContact = async() => {
  validateContact()
    .then(async() => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateContact)
      params.id_company = props.id
      const { data } = await profileEntrepriseApi.updateContactComptabilityCompany(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
/* bloc end contact */
/* bloc facturation */
const useFormFacturation = useForm(formStateFacturation, rulesFacturation)
const validateFacturation = useFormFacturation.validate
const validateInfosFacturation = useFormFacturation.validateInfos
const onSubmitFacturation = async() => {
  validateFacturation()
    .then(async() => {
      profileEntrepriseLoading.value = true
      const params = toRaw(formStateFacturation)
      params.id_company = props.id
      const { data } = await profileEntrepriseApi.updateFacturationCompany(params)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
/* end bloc facturation */
/* bloc profil Entreprise */
const useFormProfileEntreprise = useForm(formStateProfileEntreprise, rulesProfileEntreprise)
const validateProfileEntreprise = useFormProfileEntreprise.validate
const validateInfosProfileEntreprise = useFormProfileEntreprise.validateInfos
const onSubmitProfileEntreprise = async() => {
  validateProfileEntreprise()
    .then(async() => {
      profileEntrepriseLoading.value = true
      const formData = new FormData()
      formData.append('name', formStateProfileEntreprise.name)
      formData.append('size', formStateProfileEntreprise.size)
      formData.append('sector_activity', formStateProfileEntreprise.sector_activity)
      if (formStateProfileEntreprise.logo)
        formData.append('logo', formStateProfileEntreprise.logo[0].originFileObj)
      const { data } = await profileEntrepriseApi.updateProfileEntrepriseCompany(formData)
      message.info(data.message)
      profileEntreprise.value = null
      getFormData()
    })
    .catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
/* end bloc profil Entreprise */
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
const beforeUploadProfileLogo = async(file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng)
    message.error('You can only upload JPG file!')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M)
    message.error('Image must smaller than 2MB!')
  if (isJpgOrPng && isLt2M) {
    formStateProfileEntreprise.logo = [file]
    const base64 = await useBase64(file).execute()
    logoProfile.value = base64
  }
  return false
}
const onFinish = async(values: any) => {
  if (values.avatar) {
    const formData = new FormData()
    formData.append('image', values.avatar[0].originFileObj)

    if (profile.value.company?.image)
      formData.append('old_image', 'test')
    await companyApi.uploadProfile(formData)
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
                :src="profile?.company?.image"
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
                    >{{ `${profile?.company?.lastName} ${profile?.company?.firstName}` }}</a>
                    <a href="#" class="flex items-center mr-3 ml-1">
                      <span
                        v-if="profile?.company?.validated"
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
                      {{ profileEntreprise?.profile?.name }}
                    </a>
                    <a
                      href="#"
                      class="flex items-center text-gray-400 text-hover-primary me-5 mb-2"
                    >
                      <span class="i-carbon-user-multiple text-xl inline-block mr-1" />
                      {{ sizeCompanies[profileEntreprise?.profile?.size].label }}
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
                          <a-form-item name="firstName" label="Prénom">
                            <a-input v-model:value="formStateProfile.firstName" />
                          </a-form-item>
                          <a-form-item name="lastName" label="Nom">
                            <a-input v-model:value="formStateProfile.lastName" />
                          </a-form-item>
                          <a-form-item name="email" label="Email">
                            <a-input v-model:value="formStateProfile.email" />
                          </a-form-item>
                          <a-form-item name="phone" label="Téléphone">
                            <a-input v-model:value="formStateProfile.phone" />
                          </a-form-item>
                          <a-form-item name="departement" label="Département">
                            <a-select
                              v-model:value="formStateProfile.departement"
                              placeholder="Départements"
                              :options="departements"
                            />
                          </a-form-item>
                          <a-form-item
                            name="searchable"
                            has-feedback
                            label="type de recherche"
                            :rules="[{ required: true, message: 'Veuillez choisir le type de recherche' }]"
                          >
                            <a-select
                              v-model:value="formStateProfile.searchable" :options="typeSearchable" placeholder="Choisissez le type de recherche"
                            />
                          </a-form-item>
                          <a-form-item name="active_collab" label="Accés aux collaborateurs">
                            <a-switch v-model:checked="formStateProfile.active_collab" />
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
                                :class="`px-3 py-1 bg-${profile?.company?.visibility ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.company?.visibility ? 'Visible' : 'Invisible' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Réponse Question Green
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.company?.greenQuestion?.length ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.company?.greenQuestion ? 'Oui' : 'Non' }}</span>
                              <span
                                class="i-carbon-help-filled inline-block text-green-600 leading-2 text-sm ml-2 mr-0.5"
                                @click="visibleModalGreenQuestion = true"
                              />
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Vérification email
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.company?.email_verification ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.company?.email_verification ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${profile?.company?.confidentiality ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.company?.confidentiality ? 'Oui' : 'Non' }}</span>
                            </div>
                          </div>
                          <div class="flex mb-4">
                            <div class="w-[60%]">
                              Documents validés
                            </div>
                            <div class="w-[40%]">
                              <span
                                :class="`px-3 py-1 bg-${profile?.company?.documents_val ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.company?.documents_val ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${profile?.company?.signed_company ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.company?.signed_company ? 'Oui' : 'Non' }}</span>
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
                                :class="`px-3 py-1 bg-${profile?.company?.validated ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                              >{{ profile?.company?.validated ? 'Oui' : 'Non' }}</span>
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
              <a-tab-pane key="2" tab="Collaborateurs" force-render>
                <div class>
                  <a-card title="Collaborateurs" :bordered="false" class="rounded-sm">
                    <div v-if="profile && profile?.worked_with?.length">
                      <swiper
                        :modules="[Controller]"
                        :slides-per-view="4" class="p-3"
                        :pagination="{
                          clickable: true,
                        }"
                        :grab-cursor="true"
                        @swiper="setControlledSwiper"
                      >
                        <swiper-slide
                          v-for="(item, index) in profile?.worked_with"
                          :key="index"
                        >
                          <a-card class="mr-2" hoverable>
                            <template #actions>
                              <span key="edit" class="i-ant-design-delete-twotone inline-block" @click="deleteCollab(item._id)" />
                            </template>
                            <a-card-meta :title="item.username">
                              <template #description>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    Nom :
                                  </span>
                                  {{ item.firstName }} {{ item.firstName }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    Email:
                                  </span>
                                  {{ item.email }}
                                </div>
                                <div class="flex items-center">
                                  <span class="text-dark-300 mr-1.5">
                                    Département:
                                  </span>
                                  {{ item.departement }}
                                </div>
                                <div class="flex items-center">
                                  <div class="rating-box">
                                    <i class="icofont-star" />
                                    <i class="icofont-star" />
                                    <i class="icofont-star" />
                                    <i class="icofont-star" />
                                    <i class="icofont-star" />
                                  </div>
                                </div>
                              </template>
                            </a-card-meta>
                          </a-card>
                        </swiper-slide>
                        <swiper-slide>
                          <a-card class="m-auto" hoverable style="width: 150px;" body-style="height: 100%;" @click="visibleModalAddCollaborator = true">
                            <div class="w-full h-full flex items-center justify-center">
                              <span class="i-ant-design-plus-square-twotone ml-1 inline-block text-4xl text-green-300" />
                            </div>
                          </a-card>
                        </swiper-slide>
                      </swiper>
                    </div>
                    <a-result
                      v-else
                      status="404"
                      title="aucun collaborateur trouvé"
                      sub-title="veuillez ajouter vos collaborateurs"
                    >
                      <template #extra>
                        <a-button type="primary" @click="visibleModalAddCollaborator = true">
                          Ajouter
                        </a-button>
                      </template>
                    </a-result>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="3" tab="Freelance Favoris" force-render>
                <div class>
                  <a-card title="Freelance Favoris" :bordered="false" class="rounded-sm">
                    <div v-if="profile && profile?.favorites?.length">
                      <div class="row row-gutter-70">
                        <swiper
                          :modules="[Controller]"
                          :slides-per-view="4" class="p-3"
                          :pagination="{
                            clickable: true,
                          }"
                          :grab-cursor="true"
                          @swiper="setControlledSwiper"
                        >
                          <swiper-slide
                            v-for="(item, index) in profile?.favorites"
                            :key="index"
                          >
                            <a-card class="mr-2" hoverable>
                              <template #actions>
                                <span key="edit" class="i-ant-design-delete-twotone inline-block" @click="deleteFavoris(item._id)" />
                                <router-link key="show" class="i-ant-design-user-outlined inline-block" :to="`/freelancers/${item._id}`" />
                              </template>
                              <a-card-meta :title="item.title_profile">
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
                                      Nom et prénom:
                                    </span>
                                    {{ item.firstName }} {{ item.lastName }}
                                  </div>
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      Email:
                                    </span>
                                    <span class="i-carbon-email text-xl inline-block mr-1" />
                                    {{ item.email }}
                                  </div>
                                  <div class="flex items-center">
                                    <span class="text-dark-300 mr-1.5">
                                      Téléphone:
                                    </span>
                                    <span class="i-carbon-phone text-xl inline-block mr-1" />
                                    {{ item?.phone }}
                                  </div>
                                </template>
                              </a-card-meta>
                            </a-card>
                          </swiper-slide>
                        </swiper>
                      </div>
                    </div>
                    <a-result
                      v-else
                      status="404"
                      title="aucun freelance n'est dans votre liste de favoris"
                      sub-title="veuillez ajouter vos freelancers favoris"
                    />
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
                                :status="(profileEntreprise?.profile?.name && profileEntreprise?.profile?.size) ? 'finish' : (currentStepProfileEtprs === 0 ? 'process' : 'wait')"
                                title="profil"
                              />
                              <a-step
                                :disabled="!(profileEntreprise?.profile?.name && profileEntreprise?.profile?.size)"
                                :status="profileEntreprise?.facturation?.social_reason ? 'finish' : (currentStepProfileEtprs === 1 ? 'process' : 'wait')"
                                title="Facturation"
                              />
                              <a-step
                                :disabled="!(profileEntreprise?.facturation?.social_reason && profileEntreprise?.facturation?.siret)"
                                :status="(profileEntreprise?.contact) ? 'finish' : (currentStepProfileEtprs === 2 ? 'process' : 'wait')"
                                title="Contact Comptabilité"
                              />
                            </a-steps>
                            <div class="p-4">
                              <div class="max-w-md mx-auto">
                                <a-form
                                  v-if="currentStepProfileEtprs === 0"
                                  layout="vertical"
                                  :label-col="{ span: 24 }"
                                  :wrapper-col="{ span: 24 }"
                                  :model="formStateProfileEntreprise"
                                  @finish-failed="onFinishFailed"
                                  @finish="onFinish"
                                >
                                  <a-form-item
                                    label="Nom de l'entreprise"
                                    v-bind="validateInfosProfileEntreprise.name"
                                  >
                                    <a-input
                                      v-model:value="formStateProfileEntreprise.name"
                                      @blur="validateProfileEntreprise('name', { trigger: 'blur' }).catch(() => { })"
                                    />
                                  </a-form-item>
                                  <a-form-item
                                    name="size"
                                    has-feedback
                                    label="Taille de l'entreprise"
                                    :rules="[{ required: true, message: 'Veuillez choisir la taille de votre entreprise' }]"
                                  >
                                    <a-select
                                      v-model:value="formStateProfileEntreprise.size" :options="sizeCompanies" placeholder="Choisissez le secteur d'activité"
                                    />
                                  </a-form-item>
                                  <a-form-item
                                    name="sector_activity"
                                    has-feedback
                                    label="Secteur d'activité"
                                    :rules="[{ required: true, message: 'Veuillez choisir le type de recherche' }]"
                                  >
                                    <a-select
                                      v-model:value="formStateProfileEntreprise.sector_activity" :options="activities" placeholder="Choisissez le secteur d'activité"
                                    />
                                  </a-form-item>
                                  <a-form-item label="Logo">
                                    <a-form-item name="logo" no-style>
                                      <a-upload-dragger
                                        v-model:fileList="formStateProfileEntreprise.logo"
                                        :multiple="false"
                                        :before-upload="beforeUploadProfileLogo" name="logo"
                                      >
                                        <div v-if="logoProfile.length">
                                          <img ref="image" class="w-30 mx-auto" :src="logoProfile">
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
                                  <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                    <a-button
                                      block
                                      type="primary"
                                      :loading="profileEntrepriseLoading"
                                      @click.prevent="onSubmitProfileEntreprise"
                                    >
                                      Enregistrer
                                    </a-button>
                                  </a-form-item>
                                </a-form>
                                <div v-else-if="currentStepProfileEtprs === 1">
                                  <a-form
                                    layout="vertical"
                                    :label-col="{ span: 24 }"
                                    :wrapper-col="{ span: 24 }"
                                    :model="formStateFacturation"
                                    @finish-failed="onFinishFailed"
                                    @finish="onFinish"
                                  >
                                    <a-form-item
                                      label="Raison Sociale"
                                      v-bind="validateInfosFacturation.name"
                                    >
                                      <a-input
                                        v-model:value="formStateFacturation.social_reason"
                                        @blur="validateFacturation('social_reason', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="SIRET"
                                      v-bind="validateInfosFacturation.siret"
                                    >
                                      <a-input
                                        v-model:value="formStateFacturation.siret"
                                        @blur="validateFacturation('siret', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="TVA"
                                      v-bind="validateInfosFacturation.tva_intracom"
                                    >
                                      <a-input
                                        v-model:value="formStateFacturation.tva_intracom"
                                        @blur="validateFacturation('tva_intracom', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="adresse"
                                      v-bind="validateInfosFacturation.address"
                                    >
                                      <a-input
                                        v-model:value="formStateFacturation.address"
                                        @blur="validateFacturation('address', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item
                                      label="adresse (facultative)"
                                      v-bind="validateInfosFacturation.address_plus"
                                    >
                                      <a-input
                                        v-model:value="formStateFacturation.address_plus"
                                        @blur="validateFacturation('address_plus', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        :loading="profileEntrepriseLoading"
                                        @click.prevent="onSubmitFacturation"
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
                                    :model="formStateContact"
                                    @finish-failed="onFinishFailed"
                                    @finish="onFinish"
                                  >
                                    <a-form-item label="Nom" v-bind="validateInfosContact.lastName">
                                      <a-input
                                        v-model:value="formStateContact.lastName"
                                        @blur="validateContact('lastName', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item label="Prénom" v-bind="validateInfosContact.firstName">
                                      <a-input
                                        v-model:value="formStateContact.firstName"
                                        @blur="validateContact('firstName', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item label="email" v-bind="validateInfosContact.email">
                                      <a-input
                                        v-model:value="formStateContact.email"
                                        @blur="validateContact('email', { trigger: 'blur' }).catch(() => { })"
                                      />
                                    </a-form-item>
                                    <a-form-item name="switch" label="envoie de la comptabilité">
                                      <a-switch v-model:checked="formStateContact.send_compta" />
                                    </a-form-item>
                                    <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                      <a-button
                                        block
                                        type="primary"
                                        :loading="profileEntrepriseLoading"
                                        @click.prevent="onSubmitContact"
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
    v-model:visible="visibleModalAddCollaborator"
    width="40%"
    title="Ajouter un Collaborateur"
    @ok="() => { }"
  >
    <div>
      <a-form layout="vertical" :wrapper-col="{ span: 24 }">
        <a-form-item label="Identifiant :" v-bind="collaboratorValidateInfos.username">
          <a-input
            v-model:value="modelRefCollaborator.username"
            @blur="validate('username', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Nom :" v-bind="collaboratorValidateInfos.lastName">
          <a-input
            v-model:value="modelRefCollaborator.lastName"
            @blur="validate('lastName', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Prénom :" v-bind="collaboratorValidateInfos.lastName">
          <a-input
            v-model:value="modelRefCollaborator.firstName"
            @blur="validate('firstName', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="email :" v-bind="collaboratorValidateInfos.email">
          <a-input
            v-model:value="modelRefCollaborator.email"
            @blur="validate('email', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="mot de passe  :" v-bind="collaboratorValidateInfos.password">
          <a-input
            v-model:value="modelRefCollaborator.password"
            type="password"
            @blur="validate('password', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
        <a-form-item label="Choisir un domaine :" v-bind="collaboratorValidateInfos.departement">
          <a-select
            v-model:value="modelRefCollaborator.departement"
            placeholder="Département"
            :options="departements"
            @blur="validate('departement', { trigger: 'blur' }).catch(() => { })"
          />
        </a-form-item>
      </a-form>
    </div>
    <template #footer>
      <a-button
        type="primary"
        :loading="profileEntrepriseLoading"
        @click.prevent="onSubmitCollab"
      >
        Ajouter
      </a-button>
      <a-button
        style="margin-left: 10px"
        @click="() => !modelRefCollab.id ? resetFields() : (visibleModalAddCollaborator = false)"
      >
        {{ modelRefCollaborator.id ? 'Fermer' : 'Réinitialiser' }}
      </a-button>
    </template>
  </a-modal>
  <a-modal v-model:visible="visibleModalInformationEmailVerification" width="40%">
    <div>
      <div>
        <div class="text-h5 grey lighten-2">
          <h3>Vérification email</h3>
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
          Merci de bien vouloir lire et accepter la charte afin de valider votre profil via <router-link class="green" :to="`/charte/company/${$props.id}`">
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
          <h3>Compte validé</h3>
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
.ant-card-meta-title {
    text-align: center !important;
}
</style>
<route lang="yaml">
meta:
  layout: home
</route>
