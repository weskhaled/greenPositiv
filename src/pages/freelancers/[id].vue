<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import freelancerApi from '~/api/modules/freelancer'

const profile = ref(null)
const profileAvatar = ref('')
const skills = ref([])
const skillsValue = ref([])
const passionValue = ref('')
const props = defineProps<{ id: string }>()

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
const getFormData = async() => {
  profile.value = null
  await freelancerApi.profile(props.id).then(({ data }) => {
    if (data.value) {
      profile.value = data.value
      skillsValue.value = skills
      passionValue.value = profile.value.freelancer?.passion
      const freelancer = profile.value?.freelancer
      profileAvatar.value = freelancer.image || ''
      formStateProfile.description = freelancer.description
      formStateProfile.skills = freelancer.skills
      formStateProfile.price_per_day = freelancer.price_per_day
      formStateProfile.languages = freelancer.languages
      formStateProfile.interest = freelancer.interest
      formStateProfile.show_price = freelancer.show_price
      formStateProfile.email = freelancer.email
      formStateProfile.username = freelancer.username
      formStateProfile.firstName = freelancer.firstName
      formStateProfile.lastName = freelancer.lastName
      formStateProfile.title_profile = freelancer.title_profile
      formStateProfile.jobCat = profile.value.jobCat
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
      formStateProfile.passion = freelancer.passion
      socials.facebook.link = freelancer.url_fb
      socials.twitter.link = freelancer.url_twitter
      socials.linkedin.link = freelancer.url_linkedin
      socials.github.link = freelancer.url_github
    }
  })
}
onMounted(async() => {
  console.log('props id ', props.id)
  getFormData()
})

</script>
<template>
  <main class="main-content" data-app>
    <!--== Start Page Header Area Wrapper ==-->
    <div class="page-header-area sec-overlay sec-overlay-black" data-bg-img="assets/img/photos/bg2.jpg">
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                Profil {{ formStateProfile?.firstName }} {{ formStateProfile?.lastName }}
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <router-link to="/">
                    <span>Accueil</span>
                  </router-link>
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
    <!--== Start Team Details Area Wrapper ==-->
    <section class="team-details-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="team-details-wrap backgroundColorTheme">
              <div class="team-details-info">
                <div class="thumb">
                  <a-avatar
                    :src="profile?.freelancer?.image"
                    shape="square"
                    :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 220, xxl: 260 }"
                  />
                </div>
                <div class="content">
                  <h4 class="title">
                    {{ formStateProfile?.firstName + " " + formStateProfile?.lastName }} :
                    {{ formStateProfile?.title_profile }}
                  </h4>
                  <h5 class="sub-title">
                    catégorie : {{ formStateProfile?.jobCat }}
                  </h5>
                  <ul class="info-list">
                    <li>
                      <a
                        href="#"
                        class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                      >
                        <span
                          class="i-carbon-email text-xl inline-block pr-8"
                        />
                        {{ formStateProfile?.email }}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                      >
                        <span
                          class="i-carbon-location-filled text-xl inline-block pr-8"
                        />
                        {{ formStateProfile?.localisation }}
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                      >
                        <span
                          class="i-carbon-phone text-xl inline-block pr-8"
                        />
                        {{ formStateProfile?.phone }}
                      </a>
                    </li>
                  </ul>
                  <div class>
                    <social-media :socials="socials" />
                  </div>
                </div>
              </div>
              <div class="content">
                <h5 class="team-details-info sub-title">
                  Disponibilité :
                  <a-tag v-if="formStateProfile?.disponibility" class="ml-5" color="green">
                    OUI
                  </a-tag>
                  <a-tag v-else color="red" class="ml-5">
                    NON
                  </a-tag>
                </h5>

                <h5 v-if="formStateProfile?.disponibility_freq == 0" class="team-details-info sub-title">
                  Fréquence :
                  <a-tag color="orange" class="ml-5">
                    1
                    jour par
                    semaine
                  </a-tag>
                </h5>
                <h5 v-else-if="formStateProfile?.disponibility_freq == 1" class="team-details-info sub-title">
                  Fréquence :
                  <a-tag color="orange" class="ml-5">
                    2 jours par
                    semaine
                  </a-tag>
                </h5>
                <h5 v-else-if="formStateProfile?.disponibility_freq == 2" class="team-details-info sub-title">
                  Fréquence :
                  <a-tag color="orange" class="ml-5">
                    3 jours par
                    semaine
                  </a-tag>
                </h5>
                <h5 v-else-if="formStateProfile?.disponibility_freq == 3" class="team-details-info sub-title">
                  Fréquence :
                  <a-tag color="orange" class="ml-5">
                    4 jours par
                    semaine
                  </a-tag>
                </h5>
                <h5 v-else-if="formStateProfile?.disponibility_freq == 4" class="team-details-info sub-title">
                  Fréquence :
                  <a-tag color="orange" class="ml-5">
                    Soirs &
                    week-ends
                  </a-tag>
                </h5>
                <h5 v-else class="team-details-info sub-title">
                  Fréquence :
                  <a-tag color="orange" class="ml-5">
                    Temps plein
                  </a-tag>
                </h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-7 col-xl-8">
            <div class="team-details-item backgroundColorTheme">
              <div class="content">
                <h4 class="title">
                  Description
                </h4>
                <br>
                <p class="desc text-justify">
                  {{ formStateProfile?.description }}
                </p>
              </div>
              <div class="content">
                <h4 class="title">
                  Passion
                </h4>
                <br>
                <p class="desc text-justify">
                  {{ formStateProfile?.passion }}
                </p>
              </div>
              <div class="candidate-details-wrap">
                <h4 class="content-title">
                  Formations
                </h4>
                <br>
                <div v-for="formation in profile?.formations " :key=" formation._id" class="candidate-details-content">
                  <div class="content-item">
                    <h4 class="title">
                      <span
                        class="i-carbon-education text-xl inline-block pr-8"
                      /> {{ formation.name }}
                      <a-tag
                        v-if="formation.type == 'terminé'"
                        color="orange"
                      >
                        {{ formation.year }}
                      </a-tag>
                      <a-tag v-if="formation.type == 'en cours'" color="blue">
                        En cours
                      </a-tag>
                      <a-tag v-else color="green">
                        Terminé
                      </a-tag>
                    </h4>
                    <h5 class="sub-title m-2">
                      <span
                        class="i-carbon-building text-xl inline-block"
                      /> {{ formation.institute }}
                    </h5>
                    <p class="desc text-justify">
                      {{ formation.description }}
                    </p>
                    <br>
                  </div>
                </div>
              </div>
              <div class="candidate-details-wrap">
                <h4 class="content-title">
                  Expériences
                </h4>
                <br>
                <div v-for="experience in profile?.experiences " :key=" experience._id" class="candidate-details-content">
                  <br>
                  <div class="content-item">
                    <h4 class="title">
                      <span
                        class="i-carbon-enterprise text-xl inline-block mr-5"
                      />{{ experience.society }}
                      <a-tag class="orange">
                        {{ dayjs(experience.dateBegin).format("DD-MM-YYYY") }}
                      </a-tag> <a-tag v-if="experience.actuallyPost == false" color="orange">
                        - {{
                          dayjs(experience.dateEnd).format("DD-MM-YYYY")
                        }}
                      </a-tag>
                    </h4>
                    <h4 class="title">
                      <span class="i-carbon-industry text-xl inline-block mr-5" />{{ experience.title }}
                      <a-tag v-if="experience.isFreelancer" color="green">
                        Freelance
                      </a-tag>
                      <a-tag v-if="experience.actuallyPost" color="green">
                        Poste actuelle
                      </a-tag>
                    </h4>
                    <h5>
                      <span class="i-carbon-location text-xl inline-block mr-5" /> Localisation : {{ experience.place }}
                    </h5>
                    <h5>
                      <span class="i-carbon-list text-xl inline-block mr-5" /> Domaine : {{ " " + experience.domain }}
                    </h5>
                    <p class="desc text-justify">
                      {{ experience.description }}
                    </p>
                    <h4 v-if="experience.skills.length > 0" class="title">
                      Compétences :
                    </h4>
                    <div v-for="skill in experience.skills" :key="skill">
                      <span class="i-carbon-checkmark-filled text-xl inline-block mr-5" /> {{ skill }}<br>
                    </div>
                  </div>
                </div>
              </div>
              <div class="candidate-details-wrap">
                <h4 class="content-title">
                  Cerifications
                </h4>
                <br>
                <div
                  v-for="certification in profile?.certifications " :key=" certification._id"
                  class="candidate-details-content"
                >
                  <div class=" content-item">
                    <h4 class="title">
                      <span class="i-carbon-badge text-xl inline-block mr-5" /> {{ certification.name }}
                      <a-tag
                        v-if="certification.type == 'terminé'"
                        color="orange"
                      >
                        // {{ certification.year }}
                      </a-tag>
                      <a-tag v-if="certification.type == 'en cours'" color="blue">
                        En cours
                      </a-tag>
                      <a-tag v-else color="green">
                        Terminé
                      </a-tag>
                    </h4>
                    <h5 class="sub-title m-2">
                      <span class="i-carbon-enterprise text-xl inline-block mr-5 " /> {{ certification.organism }}
                    </h5>
                    <h5 class="sub-title m-2">
                      <i class="i-carbon-location-filled text-xl inline-block mr-5" /> {{ certification.place }}
                    </h5>
                    <p class="desc">
                      {{ certification.description }}
                    </p>
                    <br>
                  </div>
                </div>
              </div>
              <div class="content-list-wrap">
                <div class="content reduceContent">
                  <h4 class="title">
                    Compétences Professionelles
                  </h4>
                  <br>
                  <ul v-for="skill in formStateProfile?.skills" class="team-details-list mb--0">
                    <li>
                      <i class="icofont-check text-xl inline-block mr-5" /> {{ skill }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-5 col-xl-4">
            <div class="team-sidebar">
              <div class="widget-item backgroundColorTheme">
                <div class="widget-title">
                  <h3 class="title">
                    Notre Question Green
                  </h3>
                </div>
                <br>
                <p class="desc">
                  {{ formStateProfile?.greenQuestion }}
                </p>
              </div>
              <div class="widget-item backgroundColorTheme">
                <div class="widget-title">
                  <h3 class="title">
                    Informations
                  </h3>
                </div>
                <br>
                <h5 class="team-details-info sub-title">
                  Prix :
                  <div v-if="formStateProfile?.show_price" class="ml-5">
                    {{ formStateProfile?.price_per_day }} Euro
                  </div>
                  <a-tag v-else color="red" class="ml-5">
                    NON
                  </a-tag>
                </h5>
              </div>
              <div class="widget-item backgroundColorTheme">
                <div class="widget-title">
                  <h3 class="title">
                    Langues
                  </h3>
                </div>
                <br>
                <ul
                  v-for="(langue,index) in formStateProfile?.languages" :key="langue.name"
                  class="team-details-list mb--0"
                >
                  <li>
                    <i class="icofont-check" />
                    <span v-if="langue.level =='BASIC'">{{ langue.name }} // Notions</span>
                    <span v-if="langue.level =='CONVERSATIONAL'">{{
                      langue.name
                    }} // Capacité professionnelle limitée</span>
                    <span v-if="langue.level =='FLUENT'">{{
                      langue.name
                    }} // Capacité professionnelle complète</span>
                    <span v-if="langue.level =='NATIVE'">{{ langue.name }} // Bilingue ou natif</span>
                    <div class="team-details-btn" />
                  </li>
                </ul>
              </div>
              <div class="widget-item backgroundColorTheme">
                <div class="widget-title">
                  <h3 class="title">
                    Centre d'intéréts
                  </h3>
                </div>
                <br>
                <ul
                  v-for="item in formStateProfile?.interest" class="team-details-list mb--0"
                >
                  {{ item }}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Team Details Area Wrapper ==-->
  </main>
</template>
<style lang="css">

</style>
<route lang="yaml">
meta:
  layout: home
</route>
