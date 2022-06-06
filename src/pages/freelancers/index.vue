<script setup lang="ts">
import { message } from 'ant-design-vue'
import { currentUser } from '~/stores'
import freelancerApi from '~/api/modules/freelancer'
import adminApi from '~/api/modules/admin'

import companyApi from '~/api/modules/company'
import bookMark from '~/assets/img/icons/bookmark1.png'
import bookMarkHover from '~/assets/img/icons/bookmark2.png'

const router = useRouter()
const freelancers = ref([])
const freelancersLoading = ref(false)
const freelancersUnfiltred = ref([])
const boolFalse = ref(false)

const priceRange = ref([50, 810])
const checkList = ref([])
const jobs = ref([])
const numberJobs = []
const jobsName = ref([])
const disponibility_freq = ref([])
const jobsValues = ref([])
const formStateFilter = reactive<Record<string, any>>({
  min: 50,
  max: 810,
  jobCats: [],
})
const favorites = ref([])

const getFormData = async () => {
  jobsValues.value = []
  freelancersLoading.value = true
  await freelancerApi.getAllVisibleAndValidated().then(({ data }) => {
    if (data.value) {
      freelancers.value = data.value
      freelancersUnfiltred.value = data.value
    }
    else {
      message.error('aucun freelance disponible')
    }
  })
  const { data } = await adminApi.jobs()

  data.value && (jobs.value = data.value.filter(j => j._id && j.name).map(j => ({
    value: j._id,
    label: j.name,
  })))
  jobsName.value = data.value.filter(el => el._id).map(el => el._id)
  jobsName.value.map(el => numberJobs.push(0))
  freelancers.value.map((el) => {
    const index = jobsName.value.indexOf(el.jobCat)
    numberJobs[index]++
  })
  if (currentUser?.value?.role === 'Collab') {
    await companyApi.getCollabFavoriteList().then(({ data }) => {
      favorites.value = data.favorites.filter(el => el._id).map(el => el._id)
    })
  }
  else if (currentUser?.value?.role === 'Company') {
    await companyApi.profile(currentUser?.value?.idUser).then(({ data }) => {
      favorites.value = data.value.favorites.filter(el => el._id).map(el => el._id)
    })
  }
  freelancersLoading.value = false
}
const addFavoris = async (id: string) => {
  favorites.value.push(id)
  await companyApi.addFavoris(id).then(async ({ data }) => {
    message.success(data.message)
  }).catch((err) => {
    message.error(err.message)
  })
}
const filterAll = async () => {
  freelancers.value = freelancersUnfiltred.value
  if (jobsValues.value.length !== 0)
    freelancers.value = await freelancers.value.filter(j => jobsValues.value.includes(j.jobCat))
  if (disponibility_freq.value.length !== 0)
    freelancers.value = await freelancers.value.filter(j => j.disponibility_freq === 5)
  if (priceRange.value[1] === formStateFilter.max)
    freelancers.value = await freelancers.value.filter(j => j.price_per_day >= priceRange.value[0])
  else
    freelancers.value = await freelancers.value.filter(j => j.price_per_day >= priceRange.value[0] && j.price_per_day <= priceRange.value[1])

  if (checkList.value.length !== 0)
    freelancers.value = await freelancers.value.filter(j => checkList.value.includes(j.level))
}

const initJobs = async () => {
  jobsValues.value = []
  filterAll()
}
onMounted(async () => {
  getFormData()
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
                Freelancers
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Accueil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Freelancers</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Page Header Area Wrapper ==-->
    <section class="blog-area blog-right-sidebar-area">
      <div class="container">
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
                    <h3><b>Prix/jour</b></h3>
                    <a-slider v-model:value="priceRange" :max="formStateFilter.max" range @change="filterAll($event)" />
                  </div>
                  <div>
                    <h3><b>Niveau d'éxpérience</b></h3>
                    <a-checkbox-group v-model:value="checkList" @change="filterAll($event)">
                      <a-col :span="16">
                        <a-checkbox value="Junior">
                          0 - 2 ans d'éxpérience
                        </a-checkbox>
                      </a-col>

                      <a-col :span="16">
                        <a-checkbox value="Intermédiaire">
                          2 - 5 ans d'éxpérience
                        </a-checkbox>
                      </a-col>

                      <a-col :span="16">
                        <a-checkbox value="Senior">
                          7 ans et plus
                        </a-checkbox>
                      </a-col>
                    </a-checkbox-group>
                  </div>
                  <div>
                    <h3><b>Disponibilité</b></h3>
                    <a-checkbox-group v-model:value="disponibility_freq" @change="filterAll($event)">
                      <a-col :span="16">
                        <a-checkbox value="5">
                          A temps plein uniquement
                        </a-checkbox>
                      </a-col>
                    </a-checkbox-group>
                  </div>
                </div>
              </div>
              <div class="widget-item">
                <div class="widget-title">
                  <h3 class="title">
                    Catégories
                  </h3>
                </div>
                <div>
                  <a-checkbox-group @change="initJobs($event)">
                    <a-col :span="16">
                      <a-checkbox v-if="jobsValues?.value?.length == 0" value="all" checked>
                        Tous
                      </a-checkbox>
                      <a-checkbox v-else :checked="boolFalse">
                        Tous
                      </a-checkbox>
                    </a-col>
                  </a-checkbox-group>
                  <a-checkbox-group v-model:value="jobsValues" @change="filterAll($event)">
                    <a-col v-for="item in jobs" :key="item.value" :span="16">
                      <a-checkbox :value="`${item.value}`">
                        {{ item.label }}  <!--<span>({{ numberJobs[jobsName.indexOf(item.value)] }})</span>-->
                      </a-checkbox>
                    </a-col>
                  </a-checkbox-group>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-10">
            <a-skeleton v-if="!freelancers" avatar active :paragraph="{ rows: 15 }" />

            <div class="min-h-70 flex items-center justify-center">
              <a-spin v-if="freelancersLoading" class="mx-auto" />
              <div v-else class="grid gap-4 grid-cols-4 items-stretch">
                <div v-for="(item, index) in freelancers" :key="index" class="">
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
                        <div @click="router.push(`/profile/${item._id}`)">
                          {{ item.firstName }} {{ item.lastName }}
                        </div>
                      </h4>
                      <h5 class="sub-title">
                        {{ item.title_profile }}
                      </h5>
                      <a-tag class="sub-title" color="green">
                        {{ item.price_per_day }}
                      </a-tag>
                      <div v-if="item.skills.length == 0">
                        compétences pas encore ajoutée
                        <br>
                        <br>
                      </div>
                      <div v-else>
                        <a-tag v-for="(skill, indexSkill) in item.skills.slice(0,3)" :key="indexSkill" color="green">
                          {{ skill }}
                        </a-tag>
                        <br>
                      </div>
                      <div
                        class="btn-theme mt-2 btn-white btn-sm"
                        @click="router.push(`/freelancers/${item._id}`)"
                      >
                        Voir profile
                      </div>
                      <div v-if="currentUser && (currentUser.role == 'Company'|| currentUser.role == 'Collab') && favorites.includes(item._id)" class="bookmark-icon">
                        <img :src="bookMarkHover" alt="Image-HasTech">
                      </div>
                      <div v-if="currentUser && (currentUser.role == 'Company'|| currentUser.role == 'Collab') && favorites.includes(item._id)" class="bookmark-icon-hover">
                        <img :src="bookMarkHover" alt="Image-HasTech">
                      </div>
                      <div v-if="currentUser && (currentUser.role == 'Company'|| currentUser.role == 'Collab') && !favorites.includes(item._id)" class="bookmark-icon">
                        <img :src="bookMark" alt="Image-HasTech">
                      </div>
                      <div v-if="currentUser && (currentUser.role == 'Company'|| currentUser.role == 'Collab') && !favorites.includes(item._id)" class="bookmark-icon-hover">
                        <img :src="bookMarkHover" alt="Image-HasTech" @click="addFavoris(item._id)">
                      </div>
                    </div>
                    <!--== End Team Item ==-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style lang="css">
@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1800px;
  }
}
.green-link {
    background-color: #03a84e !important;
    color: #fff !important;
}
.team-item {
  @apply p-5 min-h-[440px];
}
</style>
<route lang="yaml">
meta:
  layout: home
</route>
