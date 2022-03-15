<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import dayjs, { Dayjs } from 'dayjs'
import { Form, Modal, message } from 'ant-design-vue'
import Api from '~/api/modules/jobs'
import freelancerApi from '~/api/modules/freelancer'
import { currentUser } from '~/stores'

const useForm = Form.useForm
const props = defineProps<{ id: string }>()
const router = useRouter()
const { t } = useI18n()
const activeKey = ref('1')
const activeKeyPrifileEtprs = ref('1')
const currentStepProfileEtprs = ref(0)

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
const skillsValue = ref([])
const skills = ref([])
const legalForms = ref([])
const languages = ref([])
const countries = ref([])
const jobs = ref([])
const types = ref([])
const activities = ref([])
const visibleModalAddExperience = ref(false)
const visibleModalAddFormation = ref(false)
const visibleModalAddCertification = ref(false)

// const formState = reactive<Record<string, any>>({
//   'input-number': 3,
//   'checkbox-group': ['A', 'B'],
//   'rate': 3.5,
// })

const formStateProfile = reactive<Record<string, any>>({
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
const rulesRef = reactive({
  title: [
    {
      required: true,
      message: 'Please input title',
    },
    {
      min: 3,
      message: 'Length should be 3',
      trigger: 'blur',
    },
  ],
  society: [
    {
      required: true,
      message: 'Please input society',
    },
  ],
  place: [
    {
      required: true,
      message: 'Please input place',
    },
  ],
  domain: [
    {
      required: true,
      message: 'Please input domain',
    },
  ],
  dateBegin: [
    {
      required: true,
      message: 'Please input dateBegin',
    },
  ],
  dateEnd: [
    {
      validator: async(_rule: RuleObject, value: string) => {
        if (modelRefExperience.actuallyPost)
          return Promise.resolve()

        else if (!value)
          return Promise.reject('Please input dateEnd')

        else
          return Promise.resolve()
      },
      trigger: 'blur',
      message: 'Please input Activity title',
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

    const skills = profile.value?.freelancer?.skills.map(s => ({
      value: s,
      label: s,
    }))
    // skills.value = skills
    skillsValue.value = skills
    const freelancer = profile.value?.freelancer
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
  })
  types.value = [{
    value: 'en cours',
    label: 'en cours',
  }, {
    value: 'terminé',
    label: 'terminé',
  }]
}
const updateProfile = async(profileData: any) => {
  const { data } = await freelancerApi.updateProfile(profileData)
  data && message.info(data.message)
  profile.value = null
  getFormData()
}
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

const onFinish = (values: any) => {
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
                src="https://preview.keenthemes.com/metronic8/demo1/assets/media/avatars/300-1.jpg"
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
                          <a-form-item label="Avatar">
                            <a-form-item name="avatar" no-style>
                              <a-upload-dragger
                                v-model:fileList="formStateProfile.dragger"
                                name="files"
                                action="/upload.do"
                              >
                                <p class="ant-upload-drag-icon">
                                  <span class="i-ant-design-inbox-outlined inline-block text-3xl" />
                                </p>
                                <p class="ant-upload-text">
                                  Click or drag file to this area to upload
                                </p>
                                <p class="ant-upload-hint">
                                  Support for a single or bulk upload.
                                </p>
                              </a-upload-dragger>
                            </a-form-item>
                          </a-form-item>
                          <a-form-item name="descriptiont" label="Descriptiont">
                            <a-input v-model:value="formStateProfile.descriptiont" />
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
                          <a-form-item
                            name="jobCat"
                            label="Choisir un Métier"
                          >
                            <a-select v-model:value="formStateProfile.jobCat" placeholder="Please select Métier" :options="jobs" />
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

                          <a-form-item class="mb-0" :wrapper-col="{ span: 2, offset: 20 }">
                            <a-button size="large" type="primary" html-type="submit">
                              Submit
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
              <a-tab-pane key="7" tab="Profile entreprise" force-render>
                <div class>
                  <a-card title="Profile entreprise" :bordered="false" class="rounded-sm">
                    <div>
                      <a-tabs v-model:activeKey="activeKeyPrifileEtprs" tab-position="left">
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
                              <a-step status="wait" title="Mentions" disabled />
                              <a-step status="process" title="Documents légaux" />
                            </a-steps>
                            <div class="p-4">
                              <div class="max-w-md mx-auto">
                                <a-form
                                  v-if="currentStepProfileEtprs === 0"
                                  layout="vertical"
                                  :label-col="{ span: 24 }"
                                  :wrapper-col="{ span: 24 }"
                                >
                                  <a-form-item label="Nom de votre entreprise (raison sociale)">
                                    <a-input />
                                  </a-form-item>
                                  <a-form-item label="Adresse">
                                    <a-input />
                                  </a-form-item>
                                  <a-form-item label="Complément d'adresse (facultatif)">
                                    <a-input />
                                  </a-form-item>
                                  <a-form-item label="Forme juridique">
                                    <a-select placeholder="Forme juridique" :options="legalForms" />
                                  </a-form-item>
                                  <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
                                    <a-button block type="primary">
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
                                  >
                                    <a-form-item label="Nom">
                                      <a-input />
                                    </a-form-item>
                                    <a-form-item label="Prénom">
                                      <a-input />
                                    </a-form-item>
                                    <a-form-item name="date-picker" label="Date de naissance">
                                      <a-date-picker class="w-full" value-format="YYYY-MM-DD" />
                                    </a-form-item>
                                    <div class="grid grid-cols-2 gap-3 w-full">
                                      <div>
                                        <a-form-item name="switch" label="Ville de naissance">
                                          <a-input />
                                        </a-form-item>
                                      </div>
                                      <div>
                                        <a-form-item name="switch" label="Code postal">
                                          <a-input />
                                        </a-form-item>
                                      </div>
                                    </div>
                                    <a-form-item label="Pays de naissance">
                                      <a-select placeholder="Forme juridique" :options="countries" />
                                    </a-form-item>
                                    <a-form-item label="Nationalité">
                                      <a-select placeholder="Nationalité" :options="countries" />
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
                                          action="/upload.do"
                                        >
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
                                      <a-button block type="primary">
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
                                    <a-form-item label="Tax">
                                      <a-input placeholder="Basic usage">
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
                                      <a-button block type="primary">
                                        Enregistrer
                                      </a-button>
                                    </a-form-item>
                                  </a-form>
                                </div>
                                <div v-else-if="currentStepProfileEtprs === 3">
                                  <h3 class="text-xl">
                                    Mentions Légales
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </a-tab-pane>
                        <a-tab-pane
                          key="2"
                          tab="Coordonnées bancaires"
                          force-render
                        >
                          Content of Tab Pane 2
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
      <a-button type="primary" @click.prevent="onSubmit">
        {{ modelRefExperience.id ? 'Modifier': 'Ajouter' }}
      </a-button>
      <a-button style="margin-left: 10px" @click="() => !modelRefExperience.id ? resetFields() : (visibleModalAddExperience = false)">
        {{ modelRefExperience.id ? 'Close': 'Reset' }}
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
