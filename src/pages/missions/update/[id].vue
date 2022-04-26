<script setup lang="ts">
import { Form, message } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import dayjs, { Dayjs } from 'dayjs'

import adminApi from '~/api/modules/admin'
import missionApi from '~/api/modules/mission'
import globalApi from '~/api/modules/global'
import { currentUser } from '~/stores'

const props = defineProps<{ id: string }>()
const router = useRouter()
const route = useRoute()
const useForm = Form.useForm
const currentStep = ref(0)
const profileEntrepriseLoading = ref(false)
const jobs = ref([])
const jobsName = ref([])
const jobsId = ref([])
const languages = ref([])
const levels = ref([])
const skills = ref([])
const freqTexts = ref([])
const showPriceArray = ref([])
const showSuppMonthArray = ref([])
const mission = ref(null)
const profile = ref(null)

const formStateMission = reactive<Record<string, any>>({
  title_profile: '',
  level: '',
  jobCat: undefined,
  skillsNeeded: [],
  skillsAppreciated: [],
  languages: [],
  name: '',
  description: '',
  skills: [],
  dateBegin: null,
  objectif: '',
  price_per_day: 0,
  period_per_month: 1,
  show_price: true,
  work_frequence: 0,
  telework: false,
  nb_days_telework: 0,
  local_city: '',
  comments: '',
  document: null,
  supp_month: true,
  budget: 0,
})
levels.value = [{
  value: 'Junior',
  label: 'Junior',
}, {
  value: 'Intermédiaire',
  label: 'Intermédiaire',
}, {
  value: 'Senior',
  label: 'Senior',
}]

showPriceArray.value = [{
  value: true,
  label: 'Oui',
}, {
  value: false,
  label: 'Non',
}]
showSuppMonthArray.value = [{
  value: true,
  label: 'plus d\'un mois',
}, {
  value: false,
  label: 'moins d\'un mois',
}]
freqTexts.value = ['1 jour/semaine', '2 jours/semaine', '3 jours/semaine', '4 jours/semaine', '5 jours/semaine']

const rulesMission = reactive({
  title_profile: [
    {
      required: true,
      message: 'Saisir l\'intitulé de poste ',
    },
  ],
  level: [
    {
      required: true,
      validator: async(_rule: RuleObject, value: string) => {
        if (currentStep.value == 0) {
          if (!value || !levels.value.map(l => l.value).includes(value))
            return Promise.reject(new Error('Veuillez saisir votre niveau'))
          else
            return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
      trigger: 'blur',
    },
  ],
  jobCat: [
    {
      required: true,
      message: 'choisir la catégorie de métier du profil recherché',
    },
  ],
  skillsNeeded: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 0) {
          if (value.length < 2) return Promise.reject(new Error('Veuillez saisir au minimum 2 compétences'))
          else
            return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
    },
  ],
  skillsAppreciated: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 0) {
          if (value.length < 3) return Promise.reject(new Error('Veuillez saisir au minimum 3 compétences'))
          else if (value.length > 12)
            return Promise.reject(new Error('Veuillez saisir au maximum 12 compétences'))

          else
            return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
    },
  ],
  period_per_month: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 1 && formStateMission.supp_month) {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir le nombre de mois'))
          if (!Number.isInteger(+value))
            return Promise.reject(new Error('Veuillez saisir que des chiffres'))
          if (value < 0)
            return Promise.reject(new Error('Veuillez saisir un nombre positif supérieur à 0'))
        }
        else { return Promise.resolve() }
      },
    },
  ],
  price_per_day: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 1 && formStateMission.supp_month) {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir le prix'))
          if (!Number.isInteger(+value))
            return Promise.reject(new Error('Veuillez saisir que des chiffres'))
          if (value < 0)
            return Promise.reject(new Error('Veuillez saisir un prix positif supérieur à 0'))
        }
        else { return Promise.resolve() }
      },
    },
  ],
  budget: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 1 && !formStateMission.supp_month) {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir le budget'))
          if (!Number.isInteger(+value))
            return Promise.reject(new Error('Veuillez saisir que des chiffres'))
          if (value < 0)
            return Promise.reject(new Error('Veuillez saisir un budget positif supérieur à 0'))
        }
        else { return Promise.resolve() }
      },
    },
  ],
  local_city: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 1) {
          if (!value)
            return Promise.reject(new Error('choisir l\'emplacement de la mission'))
          else return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
    },
  ],
  name: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 2) {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir le nom de la mission'))
          else return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
    },
  ],
  objectif: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 2) {
          if (!value)
            return Promise.reject(new Error('Veuillez saisir l\'objectif de la mission'))
          else return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
    },
  ],
  dateBegin: [
    {
      validator: async(_rule: RuleObject, value: any) => {
        if (currentStep.value == 1) {
          if (!value)
            return Promise.reject(new Error('Choissiez une date'))
          else return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
    },
  ],
})
const { resetFields, validate, validateInfos: missionValidateInfos } = useForm(formStateMission, rulesMission)

const calcWorkFreq = (params: number, toSlide = true) => {
  if (toSlide) {
    if (params === 0)
      return 0
    else if (params === 1)
      return 25
    else if (params === 2)
      return 50
    else if (params === 3)
      return 75
    else if (params === 4)
      return 100
  }
  else {
    if (params === 0)
      return 0
    else if (params === 25)
      return 1
    else if (params === 50)
      return 2
    else if (params === 75)
      return 3
    else if (params === 100)
      return 4
  }
}

const updateMission = async() => {
  try {
    const formData = new FormData()
    formData.append('title_profile', formStateMission.title_profile)
    formData.append('level', formStateMission.level)
    formData.append('jobCat', formStateMission.jobCat)
    formData.append('skillsNeeded', formStateMission.skillsNeeded.join())
    formData.append('skillsAppreciated', formStateMission.skillsAppreciated.join())
    formData.append('languages', formStateMission.languages.join())
    formData.append('name', formStateMission.name)
    formData.append('description', formStateMission.description)
    formData.append('skills', formStateMission.skills.join())
    formData.append('city', formStateMission.city)
    formData.append('objectif', formStateMission.objectif)
    formData.append('dateBegin', formStateMission.dateBegin)
    formData.append('period_per_month', formStateMission.period_per_month)
    formData.append('price_per_day', formStateMission.price_per_day)
    formData.append('show_price', formStateMission.show_price)
    formData.append('work_frequence', formStateMission.work_frequence)
    formData.append('telework', formStateMission.telework)
    formData.append('nb_days_telework', formStateMission.nb_days_telework)
    formData.append('local_city', formStateMission.local_city)
    formData.append('comments', formStateMission.comments)
    formData.append('document', formStateMission.document)
    formData.append('supp_month', formStateMission.supp_month)
    formData.append('budget', formStateMission.budget)

    const { data } = await missionApi.updateMission(props.id, formData)
    if (data) {
      message.info(data.message)
      router.push(`/profile/company/${currentUser.value.idUser}`)
    }
    else {
      message.error(data.message)
      profileEntrepriseLoading.value = false
    }
  }

  catch (error: any) {
    profileEntrepriseLoading.value = false
    message.destroy()
    message.error(`${error.message}`)
  }
}
const onFinish = async(values: any) => {
  console.log('finished')
}
const nextStep = async() => {
  await validate()
    .then(async() => {
      if (currentStep.value === 1) {
        formStateMission.work_frequence = calcWorkFreq(+formStateMission.work_frequence, false)
        if (formStateMission.nb_days_telework)
          formStateMission.nb_days_telework = calcWorkFreq(+formStateMission.nb_days_telework, false)

        currentStep.value = ++currentStep.value
      }
      else if (currentStep.value === 3) {
        profileEntrepriseLoading.value = true
        try {
          await updateMission()
        }
        catch (error: any) {
          profileEntrepriseLoading.value = false
          message.destroy()
          message.error(`${error.message}`)
        }
      }
      else { currentStep.value = ++currentStep.value }
    }).catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}

const getFormData = async() => {
  adminApi.jobs().then(({ data }) => {
    data.value && (jobs.value = data.value.filter(j => j._id && j.name).map(j => ({
      value: j._id,
      label: j.name,
    })))
    jobsName.value = jobs.value.map(j => j.label)
    jobsId.value = jobs.value.map(j => j.value)
  })

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
  missionApi.findOneMission(props.id).then(({ data }) => {
    if (data) {
      mission.value = data.value.mission
      profile.value = data.value.profile
      formStateMission.title_profile = profile.value?.title_profile
      formStateMission.jobCat = profile.value?.jobCat
      formStateMission.level = profile.value?.level
      formStateMission.skillsNeeded = profile.value?.skillsNeeded
      formStateMission.skillsAppreciated = profile.value?.skillsAppreciated
      formStateMission.languages = profile.value?.languages
      formStateMission.name = mission.value?.name
      formStateMission.objectif = mission.value?.objectif
      formStateMission.description = mission.value?.description
      formStateMission.supp_month = mission.value?.supp_month
      formStateMission.dateBegin = mission.value?.dateBegin
      formStateMission.budget = mission.value?.budget
      formStateMission.price_per_day = mission.value?.price_per_day
      formStateMission.show_price = mission.value?.show_price

      formStateMission.work_frequence = calcWorkFreq(mission.value?.work_frequence)
      formStateMission.nb_days_telework = calcWorkFreq(mission.value?.nb_days_telework)
      formStateMission.telework = mission.value?.telework

      formStateMission.period_per_month = mission.value?.period_per_month
      formStateMission.local_city = mission.value?.local_city
      formStateMission.document = mission.value?.document
    }
  })
}

const beforeUploadDocument = async(file: any) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M)
    message.error('Image must smaller than 2MB!')
  else
    formStateMission.document = file
  return false
}

onMounted(async() => {
  getFormData()
})

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
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
                Ajouter une mission
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li>
                    <a href="index.html">Accueil</a>
                  </li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>ajouter une mission</li>
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
        <a-skeleton v-if="false" avatar active :paragraph="{ rows: 15 }" />
        <div v-else class>
          <div class="pt-0">
            <div class>
              <a-card title="Ajouter une mission" :bordered="false" class="rounded-sm">
                <div>
                  <div>
                    <a-steps
                      v-model:current="currentStep"
                      type="navigation"
                      size="small"
                      :style="{
                        marginBottom: '60px',
                        boxShadow: '0px -1px 0 0 #e8e8e8 inset',
                      }"
                    >
                      <a-step
                        :status="(formStateMission.title_profile && formStateMission.level) ? 'finish' : (currentStep === 0 ? 'process' : 'wait')"
                        title="Freelance"
                      />
                      <a-step
                        :disabled="!(formStateMission.title_profile && formStateMission.level)"
                        :status="(formStateMission.dateBegin && formStateMission.local_city) ? 'finish' : (currentStep === 1 ? 'process' : 'wait')"
                        title="Condition"
                      />
                      <a-step
                        :disabled="!(formStateMission.local_city && formStateMission.dateBegin)"
                        :status="(formStateMission.objectif.length > 20 && formStateMission.description.length > 20) ? 'finish' : (currentStep === 2 ? 'process' : 'wait')"
                        title="Mission"
                      />
                      <a-step
                        :disabled="!(formStateMission.objectif.length > 0 && formStateMission.description.length>0)"
                        :status="(formStateMission.objectif.length > 0 && formStateMission.description.length > 0 ) ? 'finish' : (currentStep === 3 ? 'process' : 'wait')"
                        title="Aperçu"
                      />
                    </a-steps>
                    <div class="p-4">
                      <div class="max-w-md mx-auto">
                        <a-form
                          v-if="currentStep === 0"
                          layout="vertical"
                          :label-col="{ span: 24 }"
                          :wrapper-col="{ span: 24 }"
                          :model="formStateMission"
                          @finish-failed="onFinishFailed"
                          @finish="onFinish"
                        >
                          <a-form-item
                            name="title_profile"
                            label="Titre de profil"
                            v-bind="missionValidateInfos.title_profile"
                          >
                            <a-input v-model:value="formStateMission.title_profile" />
                          </a-form-item>
                          <a-form-item
                            name="jobCat" label="Choisir une catégorie de métier"
                            v-bind="missionValidateInfos.jobCat"
                          >
                            <a-select
                              v-model:value="formStateMission.jobCat"
                              placeholder="Choisir une catégorie de métier"
                              :options="jobs"
                            />
                          </a-form-item>
                          <a-form-item
                            name="level" label="Choisir un niveau"
                            v-bind="missionValidateInfos.level"
                          >
                            <a-select
                              v-model:value="formStateMission.level"
                              placeholder="Choisir un niveau"
                              :options="levels"
                            />
                          </a-form-item>
                          <a-form-item
                            name="Coméptence" label="Séléctionner les compétences requises"
                            v-bind="missionValidateInfos.skillsNeeded"
                          >
                            <a-select
                              v-model:value="formStateMission.skillsNeeded"
                              mode="tags"
                              style="width: 100%"
                              :token-separators="[',']"
                              placeholder="Séléctionner les compétences requises"
                              :options="skills"
                            />
                          </a-form-item>
                          <a-form-item
                            name="Coméptence" label="Séléctionner les compétences appréciées "
                            v-bind="missionValidateInfos.skillsAppreciated"
                          >
                            <a-select
                              v-model:value="formStateMission.skillsAppreciated"
                              mode="tags"
                              style="width: 100%"
                              :token-separators="[',']"
                              placeholder="Séléctionner les compétences requises"
                              :options="skills"
                            />
                          </a-form-item>
                          <a-form-item name="languages" label="Langues maîtrisées">
                            <a-select
                              v-model:value="formStateMission.languages"
                              mode="tags"
                              style="width: 100%"
                              :token-separators="[',']"
                              placeholder="Séléctionner les langues maitrisés"
                              :options="languages"
                            />
                          </a-form-item>
                          <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                            <a-button type="primary" block @click="nextStep">
                              Continuez
                            </a-button>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div class="max-w-md mx-auto">
                        <a-form
                          v-if="currentStep === 1"
                          layout="vertical"
                          :label-col="{ span: 24 }"
                          :wrapper-col="{ span: 24 }"
                          :model="formStateMission"
                          @finish-failed="onFinishFailed"
                        >
                          <a-form-item name="supp_month" label="J'estime la durée de la mission à">
                            <a-select
                              v-model:value="formStateMission.supp_month"
                              :options="showSuppMonthArray"
                            />
                          </a-form-item>

                          <a-form-item
                            v-if="formStateMission.supp_month" name="period_per_month" label="veuillez saisir le nombre de mois de travail estimé"
                            v-bind="missionValidateInfos.period_per_month"
                          >
                            <a-input v-if="formStateMission.supp_month" v-model:value="formStateMission.period_per_month" />
                          </a-form-item>
                          <a-form-item name="date-picker" label="Date de début prévue le">
                            <a-form-item
                              name="date-picker"
                              :wrapper-col="{ span: 24, offset: 0 }"
                              :label-col="{ sm: { span: 24 } }"
                              v-bind="missionValidateInfos.dateBegin"
                            >
                              <a-date-picker
                                v-model:value="formStateMission.dateBegin"
                                style="width: 100%"
                                value-format="YYYY-MM-DD"
                                :disabled-date="(current: Dayjs) => current && current <= dayjs().endOf('day')"
                              />
                            </a-form-item>
                          </a-form-item>
                          <a-form-item
                            v-if="formStateMission.supp_month" name="work_frequence" label="Fréquence optimale de la mission / Semaine"
                          >
                            <a-slider
                              v-model:value="formStateMission.work_frequence"
                              :step="null"
                              :tip-formatter="null"
                              :marks="{
                                0: '1 jour',
                                25: '2 jours',
                                50: '3 jours',
                                75: '4 jours',
                                100: '5 jours',
                              }"
                            />
                          </a-form-item>
                          <a-form-item
                            v-if="formStateMission.supp_month" name="price_per_day" label="Le tarif du freelance €/Jour"
                            v-bind="missionValidateInfos.price_per_day"
                          >
                            <a-input v-model:value="formStateMission.price_per_day" />
                          </a-form-item>
                          <a-form-item
                            v-else name="budget" label="Le budget alloué est estimé à"
                            v-bind="missionValidateInfos.budget"
                          >
                            <a-input v-model:value="formStateMission.budget" />
                          </a-form-item>
                          <a-form-item
                            v-if="formStateMission.supp_month" name="show_price" label="Afficher le prix aux freelance"
                          >
                            <a-select
                              v-model:value="formStateMission.show_price"
                              :options="showPriceArray"
                            />
                          </a-form-item>
                          <a-form-item name="telework" label="La mission peut comporter du télétravail ?">
                            <a-select
                              v-model:value="formStateMission.telework"
                              :options="showPriceArray"
                            />
                          </a-form-item>
                          <a-form-item v-if="formStateMission.telework" name="nb_days_telework" label="A la hauteur de">
                            <a-slider
                              v-model:value="formStateMission.nb_days_telework"
                              :step="null"
                              :tip-formatter="null"
                              :marks="{
                                0: '1 jour',
                                25: '2 jours',
                                50: '3 jours',
                                75: '4 jours',
                                100: '5 jours',
                              }"
                            />
                          </a-form-item>
                          <a-form-item
                            name="local_city" label="Les locaux de la mission sont situés à"
                            v-bind="missionValidateInfos.local_city"
                          >
                            <a-input v-model:value="formStateMission.local_city" />
                          </a-form-item>
                          <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                            <a-button type="primary" block @click="nextStep">
                              Continuez
                            </a-button>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div class="max-w-md mx-auto">
                        <a-form
                          v-if="currentStep === 2"
                          layout="vertical"
                          :label-col="{ span: 24 }"
                          :wrapper-col="{ span: 24 }"
                          :model="formStateMission"
                          @finish-failed="onFinishFailed"
                        >
                          <a-form-item
                            label="Quel est le nom de votre mission"
                            v-bind="missionValidateInfos.name"
                          >
                            <a-input v-model:value="formStateMission.name" />
                          </a-form-item>
                          <a-form-item
                            name="objectif" label="Quel est l'objet de votre mission ?"
                            v-bind="missionValidateInfos.objectif"
                          >
                            <a-input v-model:value="formStateMission.objectif" />
                          </a-form-item>

                          <a-form-item
                            name="description" label="Pourriez-vous décrire la mission ?"
                          >
                            <a-textarea
                              v-model:value="formStateMission.description"
                              show-count
                              placeholder="description"
                              auto-size
                            />
                          </a-form-item>

                          <a-form-item
                            name="comments" label="Ajouter plus de détails (facultatif)"
                          >
                            <a-textarea
                              v-model:value="formStateMission.comments"
                              show-count
                              placeholder="commentaires"
                              auto-size
                            />
                          </a-form-item>
                          <a-form-item label="Document">
                            <a-form-item name="document" no-style>
                              <a-upload-dragger
                                v-model:file="formStateMission.document"
                                :multiple="false"
                                :before-upload="beforeUploadDocument"
                                name="doc"
                              >
                                <div v-if="formStateMission?.document">
                                  <template>
                                    <p>{{ formStateMission?.document }}</p>
                                  </template>
                                </div>
                                <div v-else class="py-3">
                                  <p class="ant-upload-drag-icon">
                                    <span
                                      class="i-carbon-cloud-upload inline-block text-3xl"
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

                          <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                            <a-button type="primary" block @click="nextStep">
                              Continuez
                            </a-button>
                          </a-form-item>
                        </a-form>
                      </div>
                      <div v-if="currentStep === 3" class="max-w-md mx-auto">
                        <a-card title="Résumé de la mission" :bordered="false" class="rounded-sm">
                          <h1 class="text-green-500">
                            <b>Freelance</b>
                          </h1>
                          <br>
                          <span><b>Métier recherché :</b>  {{ formStateMission?.title_profile }}</span>
                          <br><br>
                          <span><b>Catégorie de métier :</b>  {{ jobsName?.[jobsId?.indexOf(formStateMission?.jobCat)] }}</span>
                          <br><br>
                          <span><b>Compétence(s) obligatoire(s) : </b></span>
                          <br>
                          <br>
                          <div v-for="(skill,index) in formStateMission?.skillsNeeded" :key="index">
                            <span>{{ skill }}</span><br>
                          </div>
                          <br>
                          <span><b>Compétence(s) appréciée(s) : </b></span>
                          <br>
                          <div v-for="(skill,index) in formStateMission?.skillsAppreciated" :key="index">
                            <span>{{ skill }}</span><br>
                          </div>
                          <br>
                          <h1 class="text-green-500">
                            <b>Condition</b>
                          </h1>
                          <span v-if="formStateMission?.supp_month"><b>Durée :</b>    {{ freqTexts[formStateMission?.work_frequence] }} x {{ formStateMission?.period_per_month }} mois</span>
                          <span v-if="!formStateMission?.supp_month"><b>Durée :</b>  moins d'un mois</span>
                          <br>
                          <span v-if="formStateMission?.supp_month"><b>prix par jour :</b> {{ formStateMission.price_per_day }} €</span>
                          <span v-if="!formStateMission?.supp_month"><b>Budget :</b> {{ formStateMission.budget }} €</span>
                          <h1 v-if="formStateMission?.telework" class="text-green-500">
                            <b>Télétravail</b>
                            <br>
                          </h1>
                          <span v-if="formStateMission?.telework" class="py-5"><b>Fréquence :</b> {{ freqTexts[formStateMission?.nb_days_telework] }} <br></span>

                          <h1 class="pt-10 text-green-500 ">
                            <b>Informations</b>
                          </h1>
                          <span class="text-justify"><b>Objet :</b>  {{ formStateMission?.objectif }}</span>
                          <br>
                          <span class="text-justify"><b>Mission :</b>  {{ formStateMission?.description }}</span>
                          <br>
                          <span class="text-justify"><b>Commentaires :</b>  {{ formStateMission?.comments }}</span>
                          <br>
                        </a-card>
                        <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                          <a-button type="primary" block :loading="profileEntrepriseLoading" @click="nextStep">
                            Continuez
                          </a-button>
                        </a-form-item>
                      </div>
                    </div>
                  </div>
                </div>
              </a-card>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Login Area Wrapper ==-->
  </main>
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
  requiresAuth: true
  roles: [Company]
</route>
