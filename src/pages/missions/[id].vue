<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'

import adminApi from '~/api/modules/admin'
import companyApi from '~/api/modules/company'
import globalApi from '~/api/modules/global'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const props = defineProps<{ id: string }>()
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

const onFinish = async(values: any) => {
  console.log('finished')
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
  await companyApi.findOneMission(props.id).then(({ data }) => {
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
                {{ formStateMission?.name }}
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li>
                    <a href="index.html">Accueil</a>
                  </li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Mission</li>
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
        <a-skeleton v-if="!formStateMission" avatar active :paragraph="{ rows: 15 }" />
        <div v-else class>
          <div class="pt-0">
            <div class>
              <a-card title="Détails de la Mission" :bordered="false" class="rounded-sm font-bold">
                <a-form
                  :model="formStateMission"
                  v-bind="formItemLayout"
                  @finish-failed="onFinishFailed"
                  @finish="onFinish"
                >
                  <a-form-item class="font-bold" name="name" label="Nom de la mission :">
                    <label class="font-normal">{{ formStateMission.name }}</label>
                  </a-form-item>
                  <a-form-item class="font-bold" name="objectif" label="Objectif :">
                    <label class="font-normal">{{ formStateMission.objectif }}</label>
                  </a-form-item>
                  <a-form-item class="font-bold" name="description" label="Description">
                    <label class="font-normal">{{ formStateMission.description }}</label>
                  </a-form-item>
                </a-form>
              </a-card>
            </div>
            <div class>
              <a-card title="Profil recherché" :bordered="false" class="rounded-sm font-bold">
                <div v-if="formStateMission">
                  <a-form
                    :model="formStateMission"
                    v-bind="formItemLayout"
                    @finish-failed="onFinishFailed"
                    @finish="onFinish"
                  >
                    <a-form-item class="font-bold" name="name" label="profile :">
                      <label class="font-normal">{{ formStateMission.title_profile }}</label>
                    </a-form-item>
                    <a-form-item class="font-bold" name="jobCat" label="Catégorie de métier :">
                      <label class="font-normal">{{ jobsName?.[jobsId?.indexOf(formStateMission?.jobCat)] }}</label>
                    </a-form-item>
                    <a-form-item class="font-bold" name="level" label="Niveau du freelance">
                      <label class="font-normal">{{ formStateMission.level }}</label>
                    </a-form-item>
                    <a-form-item class="font-bold" name="skillsNeeded" label="Compétences requises :">
                      <a-list
                        size="small"
                        item-layout="horizontal"
                        :data-source="formStateMission.skillsNeeded.filter(s => s).map(s => ({ title: s }))"
                      >
                        <template #renderItem="{ item: skill }">
                          <a-list-item>
                            <div class="flex items-center">
                              <span
                                class="i-carbon-ai-status-complete inline-block text-green-400 text-lg mr-2.5"
                              />
                              <span class="text-dark-100 text-sm">{{ skill.title }}</span>
                            </div>
                          </a-list-item>
                        </template>
                      </a-list>
                    </a-form-item>
                    <a-form-item class="font-bold" name="skillsAppreciated" label="Compétences appréciées :">
                      <a-list
                        size="small"
                        item-layout="horizontal"
                        :data-source="formStateMission.skillsAppreciated.filter(s => s).map(s => ({ title: s }))"
                      >
                        <template #renderItem="{ item: skill }">
                          <a-list-item>
                            <div class="flex items-center">
                              <span
                                class="i-carbon-ai-status inline-block text-green-400 text-lg mr-2.5"
                              />
                              <span class="text-dark-100 text-sm">{{ skill.title }}</span>
                            </div>
                          </a-list-item>
                        </template>
                      </a-list>
                    </a-form-item>
                    <a-form-item class="font-bold" name="languages" label="Langues :">
                      <a-list
                        size="small"
                        item-layout="horizontal"
                        :data-source="formStateMission.languages.filter(s => s).map(s => ({ title: s }))"
                      >
                        <template #renderItem="{ item: lang }">
                          <a-list-item>
                            <div class="flex items-center">
                              <span
                                class="i-carbon-user-speaker inline-block text-green-400 text-lg mr-2.5"
                              />
                              <span class="text-dark-100 text-sm">{{ lang.title }}</span>
                            </div>
                          </a-list-item>
                        </template>
                      </a-list>
                    </a-form-item>
                  </a-form>
                </div>
              </a-card>
            </div>
            <div class>
              <a-card title="Condition" :bordered="false" class="rounded-sm font-bold">
                <div v-if="formStateMission">
                  <a-form
                    :model="formStateMission"
                    v-bind="formItemLayout"
                    @finish-failed="onFinishFailed"
                    @finish="onFinish"
                  >
                    <div v-if="formStateMission.supp_month">
                      <a-form-item class="font-bold" name="supp_month" label="Durée de la mission :">
                        <label class="font-normal">plus d'un mois</label>
                      </a-form-item>
                      <a-form-item class="font-bold" name="period_per_month" label="Nombre de mois estimé :">
                        <label class="font-normal">{{ formStateMission.period_per_month }}</label>
                      </a-form-item>
                      <a-form-item class="font-bold" name="pricer_per_day" label="Le tarif du freelance €/Jour :">
                        <label class="font-normal">{{ formStateMission.price_per_day }}</label>
                      </a-form-item>
                      <a-form-item name="work_frequence" class="font-bold" label="Fréquence / semaine">
                        <a-slider
                          v-model:value="formStateMission.work_frequence"
                          :step="null"
                          disabled="true"
                          :tip-formatter="null"
                          :marks="{
                            0: '1 jour',
                            25: '2 jours',
                            50: '3 jours',
                            75: '4 jours',
                            100: '5 jours'
                          }"
                        />
                      </a-form-item>
                    </div>
                    <div v-else>
                      <a-form-item class="font-bold" name="supp_month" label="Durée de la mission :">
                        <label class="font-normal">moins d'un mois</label>
                      </a-form-item>
                      <a-form-item class="font-bold" name="budget" label="Budget :">
                        <label class="font-normal">{{ formStateMission.budget }}</label>
                      </a-form-item>
                    </div>
                    <a-form-item class="font-bold" name="dateBegin" label="Date de début :">
                      <label class="font-normal">
                        <span
                          class="i-carbon-time inline-block text-gray-700 text-xs mr-0.5"
                        />
                        <span>
                          {{
                            dayjs(formStateMission.dateBegin).format("DD-MM-YYYY")
                          }}
                        </span>
                      </label>
                    </a-form-item>
                    <div v-if="formStateMission.telework">
                      <a-form-item class="font-bold" name="telework" label="Télétravail :">
                        <label class="font-normal"><a-tag
                          class="text-xs ml-2 leading-5"
                          color="#080"
                        >
                          Oui
                        </a-tag></label>
                      </a-form-item>
                      <a-form-item name="nb_days_telework" class="font-bold" label="Fréquence télétravail / semaine">
                        <a-slider
                          v-model:value="formStateMission.nb_days_telework"
                          :step="null"
                          disabled="true"
                          :tip-formatter="null"
                          :marks="{
                            0: '1 jour',
                            25: '2 jours',
                            50: '3 jours',
                            75: '4 jours',
                            100: '5 jours'
                          }"
                        />
                      </a-form-item>
                    </div>
                    <div v-else>
                      <a-form-item class="font-bold" name="telework" label="Télétravail :">
                        <label class="font-normal"><a-tag
                          class="text-xs ml-2 leading-5"
                          color="#D00"
                        >
                          Non
                        </a-tag></label>
                      </a-form-item>
                    </div>
                    <a-form-item class="font-bold" name="local_city" label="Emplacement de la mission :">
                      <label class="font-normal">{{ formStateMission.local_city }}</label>
                    </a-form-item>
                  </a-form>
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
  roles: [Freelance, Agence]
</route>
