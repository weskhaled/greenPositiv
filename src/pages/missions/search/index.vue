<script setup lang="ts">
import { Form, message } from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'
import SwiperCore, { Controller, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import globalApi from '~/api/modules/global'
import adminApi from '~/api/modules/admin'
import freelancerApi from '~/api/modules/freelancer'
import 'swiper/css/pagination'
import agenceApi from '~/api/modules/agence'
const controlledSwiper = ref(null)
const offerSwiper = ref(null)
const setControlledSwiper = (swiper) => {
  controlledSwiper.value = swiper
}
const setOfferSwiper = (swiper) => {
  offerSwiper.value = swiper
}
const router = useRouter()

SwiperCore.use([Controller, Pagination])
const useForm = Form.useForm
const currentStep = ref(0)
const profileEntrepriseLoading = ref(false)
const jobs = ref([])
const jobsName = ref([])
const jobsId = ref([])
const languages = ref([])
const levels = ref([])
const skills = ref([])
const freelancers = ref([])
const agences = ref([])
const offers = ref([])
const freelancersNeeded = ref([])
const freelancersAppreciated = ref([])
const freelancersLoading = ref(false)
const agencesLoading = ref(false)
const activeKey = ref('1')
const priceRange = ref([50, 99999])
const offersUnfiltred = ref([])

const formStateRequiredProfile = reactive<Record<string, any>>({
  title_profile: '',
  level: '',
  jobCat: undefined,
  skillsNeeded: [],
  skillsAppreciated: [],
  languages: [],
  name: '',
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
const formStateFilter = reactive<Record<string, any>>({
  min: 50,
  max: 99999,
})
const rulesRequiredProfile = reactive({
  title_profile: [
    {
      required: true,
      message: 'Saisir l\'intitulé de poste ',
    },
  ],
  level: [
    {
      required: true,
      validator: async (_rule: RuleObject, value: string) => {
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
      validator: async (_rule: RuleObject, value: any) => {
        if (currentStep.value == 0) {
          if (value.length < 2)
            return Promise.reject(new Error('Veuillez saisir au minimum 2 compétences'))
          else
            return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
    },
  ],
  skillsAppreciated: [
    {
      validator: async (_rule: RuleObject, value: any) => {
        if (currentStep.value == 0) {
          if (value.length < 3)
            return Promise.reject(new Error('Veuillez saisir au minimum 3 compétences'))
          else if (value.length > 12)
            return Promise.reject(new Error('Veuillez saisir au maximum 12 compétences'))

          else
            return Promise.resolve()
        }
        else { return Promise.resolve() }
      },
    },
  ],
})
const { resetFields, validate, validateInfos: requiredProfileValidateInfos } = useForm(formStateRequiredProfile, rulesRequiredProfile)

const searchProfile = async () => {
  await validate()
    .then(async () => {
      profileEntrepriseLoading.value = true
      try {
        await freelancerApi.requiredProfiles(formStateRequiredProfile).then(({ data }) => {
          freelancers.value = data.value.freelancers
          freelancersNeeded.value = data.value.freelancersNeeded
          freelancersAppreciated.value = data.value.freelancersAppreciated
        })
      }
      catch (error: any) {
        profileEntrepriseLoading.value = false
        message.destroy()
        message.error(`${error.message}`)
      }
    }).catch((err) => {
      console.log('error', err)
    }).finally(() => profileEntrepriseLoading.value = false)
}
const filterAll = async () => {
  offers.value = offersUnfiltred.value
  console.log('before offers ', offers.value)

  if (priceRange.value[1] === formStateFilter.max) {
    offers.value = await offers.value.filter(j => j.price >= priceRange.value[0])
    console.log('offers', offers)
  }
  else {
    offers.value = await offers.value.filter(j => j.price >= priceRange.value[0] && j.price <= priceRange.value[1])
    console.log('offers else', offers)
  }
}

const onFinish = async (values: any) => {
  console.log('finished')
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const getFormData = async () => {
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
}
const searchProfileAgence = async () => {
  profileEntrepriseLoading.value = true
  try {
    await agenceApi.requiredProfiles({ jobCat: formStateRequiredProfile.jobCat, minPrice: 50, maxPrice: 99999 }).then(({ data }) => {
      agences.value = data.value.agences
      offers.value = data.value.offers
      offersUnfiltred.value = data.offers
      formStateFilter.min = 50
      formStateFilter.max = 99999
      priceRange.value = [50, 99999]
      profileEntrepriseLoading.value = false
    })
  }
  catch (error: any) {
    profileEntrepriseLoading.value = false
    message.destroy()
    message.error(`${error.message}`)
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
                Recherche De Profil
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li>
                    <a href="index.html">Accueil</a>
                  </li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Recherche de profil</li>
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
        <a-skeleton v-if="!jobs" active :paragraph="{ rows: 15 }" />
        <div v-else class>
          <div class="pt-0">
            <a-tabs v-model:activeKey="activeKey" class="mt-0">
              <a-tab-pane key="1" tab="Recherche Freelance">
                <div class>
                  <a-card title="Freelance correspondants" :bordered="false" class="rounded-sm">
                    <a-spin v-if="freelancersLoading" class="mx-auto" />
                    <div v-else>
                      <h3>Profils Correspondants</h3>
                      <div v-if="freelancers && freelancers?.length">
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
                            v-for="(item, index) in freelancers"
                            :key="index"
                          >
                            <a-card class="mr-2" hoverable>
                              <template #actions>
                                <div
                                  key="show" class="i-ant-design-user-outlined inline-block"
                                  @click="router.push(`/freelancers/${item._id}`)"
                                />
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
                      <a-result
                        v-else
                        status="404"
                        title="aucun freelance ne corresponds. veuillez effectuer vos recherches"
                      />
                      <h3>Profils ayant les compétences souhaitées</h3>
                      <div v-if="freelancersNeeded && freelancersNeeded?.length">
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
                            v-for="(item, index) in freelancersNeeded"
                            :key="index"
                          >
                            <a-card class="mr-2" hoverable>
                              <template #actions>
                                <div
                                  key="show" class="i-ant-design-user-outlined inline-block"
                                  @click="router.push(`/freelancers/${item._id}`)"
                                />
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
                      <a-result
                        v-else
                        status="404"
                        title="aucun freelance ne corresponds. veuillez effectuer vos recherches"
                      />
                      <h3>Profils ayant les compétences aprréciées</h3>

                      <div v-if="freelancersAppreciated && freelancersAppreciated?.length">
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
                            v-for="(item, index) in freelancersAppreciated"
                            :key="index"
                          >
                            <a-card class="mr-2" hoverable>
                              <template #actions>
                                <div
                                  key="show" class="i-ant-design-user-outlined inline-block"
                                  @click="router.push(`/freelancers/${item._id}`)"
                                />
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
                      <a-result
                        v-else
                        status="404"
                        title="aucun freelance ne corresponds. veuillez effectuer vos recherches"
                      />
                    </div>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="Recherche de solution innovante">
                <div class>
                  <a-card title="Solution innovante correspondantes" :bordered="false" class="rounded-sm">
                    <a-spin v-if="agencesLoading" class="mx-auto" />
                    <div v-else>
                      <div v-if="agences && agences.length > 0" class="row justify-content-between">
                        <a-skeleton v-if="!agences" avatar active :paragraph="{ rows: 15 }" />
                        <div class="min-h-70 flex items-center justify-center">
                          <a-spin v-if="agencesLoading" class="mx-auto" />
                          <div v-else>
                            <h1>Solutions innovantes :</h1>
                            <br>
                            <div class="grid gap-4 grid-cols-4 items-stretch">
                              <div v-for="(item, index) in agences" :key="index" class="">
                                <!--== Start Team Item ==-->
                                <div class="team-item">
                                  <div class="thumb">
                                    <a-avatar
                                      :src="item?.image"
                                      shape="square"
                                      :size="{ xs: 160, sm: 160, md: 160, lg: 160, xl: 160, xxl: 160 }"
                                    />
                                  </div>
                                  <div class="content">
                                    <h4 class="title">
                                      <routrer-link :to="`/profile/${item._id}`">
                                        {{ item.firstName }} {{ item.lastName }}
                                      </routrer-link>
                                    </h4>
                                    <h5 class="sub-title">
                                      {{ item.nameAgence }}
                                    </h5>
                                    <a-tag class="sub-title" color="green">
                                      + {{ item.phone }}
                                    </a-tag>
                                    <br>
                                    <div
                                      class="btn-theme mt-2 btn-white btn-sm"
                                      @click="router.push(`/agences/${item._id}`)"
                                    >
                                      Voir profile
                                    </div>
                                  </div>
                                  <!--== End Team Item ==-->
                                </div>
                              </div>
                            </div>
                            <h1>Offres :</h1>
                            <br>
                            <div v-if="offers && offers.length > 0">
                              <div class="row justify-content-between">
                                <div class="col-xl-2">
                                  <div class="blog-sidebar blog-sidebar-right">
                                    <div class="widget-item">
                                      <div class="widget-title">
                                        <h3 class="title">
                                          Filtres
                                        </h3>
                                      </div>
                                      <div class="widget-body">
                                        <div>
                                          <h3><b>Prix</b></h3>
                                          <a-slider v-model:value="priceRange" max="99999" range @change="filterAll($event)" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-xl-10">
                                  <br>
                                  <swiper
                                    :modules="[Controller]"
                                    :slides-per-view="2" class="p-3"
                                    :pagination="{
                                      clickable: true,
                                    }"
                                    :grab-cursor="true"
                                    @swiper="setOfferSwiper"
                                  >
                                    <swiper-slide
                                      v-for="(item, index) in offers"
                                      :key="index"
                                    >
                                      <a-card class="mr-2" hoverable>
                                        <template #actions>
                                          <div
                                            key="show" class="i-ant-design-user-outlined inline-block"
                                            @click="router.push(`/agence/${item.id_agence}`)"
                                          />
                                        </template>
                                        <a-card-meta :title="item.title_profile">
                                          <template #description>
                                            <br>
                                            <div class="flex items-center">
                                              <span class="text-dark-300 mr-1.5">
                                                Nom :
                                              </span>
                                              {{ item.name }}
                                            </div>
                                            <div v-if="item.show_price" class="flex items-center">
                                              <span class="text-dark-300 mr-1.5">
                                                Prix :
                                              </span>
                                              <a-tag
                                                class="text-xs ml-2 leading-5"
                                                color="#080"
                                              >
                                                {{ item.price }}
                                              </a-tag>
                                            </div>
                                            <div v-else class="flex items-center">
                                              <span class="text-dark-300 mr-1.5">
                                                <a-tag
                                                  class="text-xs ml-2 leading-5"
                                                  color="#D00"
                                                >
                                                  Prix non affiché
                                                </a-tag>
                                              </span>
                                              {{ item.price }}
                                            </div>
                                            <br>
                                            <div class="flex items-center bloc">
                                              <a-card-meta title="Description:">
                                                <template #description>
                                                  {{ item.description }}
                                                </template>
                                              </a-card-meta>
                                            </div>
                                          </template>
                                        </a-card-meta>
                                      </a-card>
                                    </swiper-slide>
                                  </swiper>
                                </div>
                              </div>
                            </div>
                            <a-result
                              v-else
                              status="404"
                              title="aucune solution innovante ne corresponds"
                            />
                          </div>
                        </div>
                      </div>
                      <a-result
                        v-else
                        status="404"
                        title="aucun freelance ne corresponds. veuillez effectuer vos recherches"
                      />
                    </div>
                  </a-card>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
          <div class="pt-0">
            <div class>
              <a-card title="Recherche d'une solution Innovante :" :bordered="false" class="rounded-sm">
                <div class="p-4">
                  <div class="max-w-md mx-auto">
                    <a-form
                      layout="vertical"
                      :label-col="{ span: 24 }"
                      :wrapper-col="{ span: 24 }"
                      :model="formStateRequiredProfile"
                      @finish-failed="onFinishFailed"
                      @finish="onFinish"
                    >
                      <a-form-item
                        name="jobCat" label="Choisir une catégorie de métier"
                        v-bind="requiredProfileValidateInfos.jobCat"
                      >
                        <a-select
                          v-model:value="formStateRequiredProfile.jobCat"
                          placeholder="Choisir une catégorie de métier"
                          :options="jobs"
                        />
                      </a-form-item>
                      <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                        <a-button type="primary" block :loading="profileEntrepriseLoading" @click="searchProfileAgence">
                          Rechercher
                        </a-button>
                      </a-form-item>
                    </a-form>
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
    font-weight: bold;
}
.ant-card {
  word-break: break-word;
  text-align: justify;
}
</style>
<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
  roles: [Company]
</route>
