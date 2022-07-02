<script setup lang="ts">
import dayjs from 'dayjs'
import adminApi from '~/api/modules/admin'
import globalApi from '~/api/modules/global'
import freelancerApi from '~/api/modules/freelancer'
import authApi from '~/api/modules/auth'

const BASE_PREFIX = `${import.meta.env.VITE_API_CHAT}`

const router = useRouter()
const props = defineProps<{ id: string }>()
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
const profileEntreprise = ref(null)
const skills = ref([])
const skillsValue = ref([])
const passionValue = ref('')
const languages = ref([])

const current = ref(null)
const receiver = ref(null)

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

const calcDisponibilityFreq = (params: number, toSlide = true) => {
  if (toSlide) {
    if (params === 0)
      return 0
    else if (params === 1)
      return 15
    else if (params === 2)
      return 30
    else if (params === 3)
      return 50
    else if (params === 4)
      return 70
    else
      return 100
  }
  else {
    if (params === 0)
      return 0
    else if (params === 15)
      return 1
    else if (params === 30)
      return 2
    else if (params === 50)
      return 3
    else if (params === 70)
      return 4
    else
      return 5
  }
}
const getFormData = async () => {
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
  profile.value = null
  await freelancerApi.profile(props.id).then(({ data }) => {
    if (data.value) {
      profile.value = data.value
      const skills = profile.value?.freelancer?.skills.map(s => ({
        value: s,
        label: s,
      }))
      skillsValue.value = skills
      passionValue.value = profile.value.freelancer?.passion
      const freelancer = profile.value?.freelancer
      profileAvatar.value = freelancer.image || ''
      formStateProfile.description = freelancer.description
      formStateProfile.email = freelancer.email
      formStateProfile.username = freelancer.username
      formStateProfile.firstName = freelancer.firstName
      formStateProfile.lastName = freelancer.lastName
      formStateProfile.jobCat = freelancer.jobCat
      formStateProfile.localisation = freelancer.localisation
      formStateProfile.phone = freelancer.phone
      formStateProfile.price_per_day = freelancer.price_per_day
      formStateProfile.show_price = !!freelancer.show_price
      formStateProfile.disponibility = !!freelancer.disponibility
      formStateProfile.greenQuestion = freelancer.greenQuestion
      formStateProfile.url_fb = freelancer.url_fb
      formStateProfile.url_github = freelancer.url_github
      formStateProfile.url_twitter = freelancer.url_twitter
      formStateProfile.url_linkedin = freelancer.url_linkedin
      formStateProfile.disponibility_freq = calcDisponibilityFreq(+freelancer.disponibility_freq)
      socials.facebook.link = freelancer.url_fb
      socials.twitter.link = freelancer.url_twitter
      socials.linkedin.link = freelancer.url_linkedin
      socials.github.link = freelancer.url_github
    }
  })
  profileEntreprise.value = null
}
const onFinish = async (values: any) => {
  if (values.avatar) {
    const formData = new FormData()
    formData.append('image', values.avatar[0].originFileObj)
    if (profile.value.freelancer?.image)
      formData.append('old_image', 'test')
    await freelancerApi.uploadProfile(formData)
  }
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
onMounted(async () => {
  console.log('props id ', props.id)
  getFormData()
})

const sendMessage = async () => {
  await authApi.currentUser().then(({ data }) => {
    data && (current.value = data)
  })

  const { data: dataAddRoom, error: errorAddRoom } = await useFetch(`${BASE_PREFIX}/pusher/connect/${current.value.idUser}`).post().json()
  if (dataAddRoom.value && !errorAddRoom.value) {
    const { data: dataConnectRoom, error: errorConnectRoom } = await useFetch(`${BASE_PREFIX}/pusher/connect-room`).post({
      idSender: current.value.idUser,
      idReceiver: props.id,
      usernameSender: current.value.username,
      usernameReceiver: formStateProfile.username,
    }).json()
    if (dataConnectRoom.value && !errorConnectRoom.value)
      await router.push({ path: '/chat' })
  }
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
                {{ profile?.freelancer?.firstName }} {{ profile?.freelancer?.lastName }}
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
                :src="profile?.freelancer?.image"
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
                    >{{ `${profile?.freelancer?.lastName} ${profile?.freelancer?.firstName}` }}</a>
                    <a href="#" class="flex items-center mr-3 ml-1">
                      <span
                        v-if="profile?.freelancer?.validated"
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
                      {{ profile?.freelancer?.title_profile }}
                    </a>
                    <a
                      href="#"
                      class="flex items-center text-gray-400 text-hover-primary me-5 mb-2"
                    >
                      <span class="i-carbon-location-filled text-xl inline-block mr-1" />
                      {{ profile?.freelancer?.localisation }}
                    </a>
                    <a href="#" class="flex items-center text-gray-400 text-hover-primary mb-2">
                      <span class="i-carbon-phone text-xl inline-block mr-1" />
                      {{ profile?.freelancer?.phone }}
                    </a>
                    <a href="#" class="flex items-center text-gray-400 text-hover-primary mb-2 ml-5">
                      <span class="i-carbon-email text-xl inline-block mr-1" />
                      {{ profile?.freelancer?.email }}
                    </a>
                  </div>
                  <!--end::Info-->
                </div>
                <div class>
                  <social-media :socials="socials" />
                  <br>
                  <button type="button" class="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-green-600 focus:outline-none" @click="sendMessage()">
                    <span class="font-bold">Contactez</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-6 w-6 ml-2 transform rotate-90">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="pt-0">
            <div class>
              <a-card title="Profile Details" :bordered="false" class="rounded-sm font-bold">
                <div class="flex w-full">
                  <div class="w-[60%]">
                    <a-form
                      :model="formStateProfile"
                      v-bind="formItemLayout"
                      @finish-failed="onFinishFailed"
                      @finish="onFinish"
                    >
                      <a-form-item class="font-bold" name="greenQuestion" label="Question GREEN">
                        <label class="font-normal">{{ formStateProfile.greenQuestion }}</label>
                      </a-form-item>
                      <a-form-item class="font-bold" name="description" label="Description">
                        <label class="font-normal">{{ formStateProfile.description }}</label>
                      </a-form-item>
                      <a-form-item class="font-bold" name="jobCat" label="Catégorie de métier">
                        <label class="font-normal">{{ profile?.jobCat }}</label>
                      </a-form-item>
                      <a-form-item name="disponibility_freq" class="font-bold" label="Fréquence / semaine">
                        <a-slider
                          v-model:value="formStateProfile.disponibility_freq"
                          :step="null"
                          :disabled="true"
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
                        label="Tarif/jour"
                        class="font-bold"
                      >
                        <label class="font-normal">{{ formStateProfile?.price_per_day }} Euro</label>
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
                          Disponibilité
                        </div>
                        <div class="w-[40%]">
                          <span
                            :class="`px-3 py-1 bg-${profile?.freelancer?.disponibility ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                          >{{ profile?.freelancer?.disponibility ? 'OUI' : 'NON' }}</span>
                        </div>
                      </div>
                      <div class="flex mb-4">
                        <div class="w-[60%]">
                          Signature Charte
                        </div>
                        <div class="w-[40%]">
                          <span
                            :class="`px-3 py-1 bg-${profile?.freelancer?.signed_client ? 'green' : 'red'}-600 rounded-lg text-light-50`"
                          >{{ profile?.freelancer?.signed_client ? 'Oui' : 'Non' }}</span>
                        </div>
                      </div>
                    </div>
                    <span class="hidden bg-green w-full h-full block border-2 border-sky-500" />
                  </div>
                </div>
              </a-card>
            </div>
            <div class>
              <a-card title="Experience" :bordered="false" class="rounded-sm font-bold">
                <div v-if="profile && profile?.experiences?.length">
                  <a-timeline mode="alternate">
                    <a-timeline-item>
                      <template #dot>
                        <a-tooltip />
                      </template>
                      <div class="leading-10">
                        <span class="invisible">Ajouter</span>
                      </div>
                    </a-timeline-item>
                    <a-timeline-item v-for="item in profile?.experiences" :key="item._id">
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
                  title="Expériences non trouvées"
                />
              </a-card>
            </div>
            <div class>
              <a-card title="Formations" :bordered="false" class="rounded-sm font-bold">
                <div v-if="profile && profile?.formations?.length">
                  <a-timeline mode="alternate">
                    <a-timeline-item>
                      <template #dot>
                        <a-tooltip />
                      </template>
                      <div class="leading-10">
                        <span class="invisible">Ajouter</span>
                      </div>
                    </a-timeline-item>
                    <a-timeline-item v-for="item in profile?.formations" :key="item._id">
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
                />
                <div>
                  <h3 class="text-dark-50 mb-1 text-lg">
                    Compétences:
                  </h3>
                  <div v-for="skill in skillsValue">
                    <span class="i-carbon-checkmark-filled inline-block text-green-600 text-4lg mr-1" /> {{ skill.value }}
                  </div>
                </div>
              </a-card>
            </div>
            <div class>
              <a-card title="Certifications" :bordered="false" class="rounded-sm font-bold">
                <div v-if="profile && profile?.certifications?.length">
                  <a-timeline mode="alternate">
                    <a-timeline-item>
                      <template #dot>
                        <a-tooltip />
                      </template>
                      <div class="leading-10">
                        <span class="invisible">Ajouter</span>
                      </div>
                    </a-timeline-item>
                    <a-timeline-item v-for="item in profile?.certifications" :key="item._id">
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
                />
              </a-card>
            </div>
            <div class>
              <a-card title="Centre d'interet" :bordered="false" class="rounded-sm font-bold">
                <div>
                  <div class="mb-3">
                    <div class="text-dark-50 mb-1 text-lg font-bold">
                      Passion :
                    </div>
                    <div>
                      <label>
                        {{ passionValue }}
                      </label>
                    </div>
                  </div>
                  <div class="mb-1">
                    <div>
                      <h3 class="text-dark-50 mb-1 text-lg">
                        Centre d'intéréts :
                      </h3>
                      <div v-for="interest in profile.freelancer?.interest">
                        <span class="i-carbon-checkmark-filled inline-block text-green-600 text-4lg mr-1" /> {{ interest }}
                      </div>
                    </div>
                  </div>
                  <div class="mb-3 mt-4">
                    <div class="text-dark-50 mb-1 text-lg font-bold">
                      Langues :
                    </div>
                    <div v-for="langue in profile?.freelancer?.languages" class="font-bold">
                      <label v-if="langue.level == 'BASIC'">
                        <span class="i-carbon-checkmark-filled inline-block text-green-600 text-4lg mr-1" /> {{ langue.name }} // Notions
                      </label>
                      <label v-else-if="langue.level == 'CONVERSATIONAL'">
                        <span class="i-carbon-checkmark-filled inline-block text-green-600 text-4lg mr-1" /> {{ langue.name }} // Capacité professionnelle limitée
                      </label>
                      <label v-else-if="langue.level == 'FLUENT'">
                        <span class="i-carbon-checkmark-filled inline-block text-green-600 text-4lg mr-1" /> {{ langue.name }} // Capacité professionnelle complète
                      </label>
                      <label v-else-if="langue.level == 'NATIVE'">
                        <span class="i-carbon-checkmark-filled inline-block text-green-600 text-4lg mr-1" />  {{ langue.name }} // Bilingue ou natif
                      </label>
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
</style>
<route lang="yaml">
meta:
  layout: home
</route>
