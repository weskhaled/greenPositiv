<script setup lang="ts">
import SwiperCore, { Controller, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css/pagination'
import missionApi from '~/api/modules/mission'

const props = defineProps<{ id: string }>()

SwiperCore.use([Controller, Pagination])
const freelancers = ref([])
const freelancersNeeded = ref([])
const freelancersAppreciated = ref([])
const freelancersLoading = ref(false)
const controlledSwiper = ref(null)
const setControlledSwiper = (swiper) => {
  controlledSwiper.value = swiper
}

const onFinish = async (values: any) => {
  console.log('finished')
}
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
const getFormData = async () => {
  freelancersLoading.value = true
  if (props.id) {
    await missionApi.getDemandById(props.id).then(({ data }) => {
      if (data.search !== undefined) {
        freelancers.value = data.search.freelancers
        freelancersNeeded.value = data.search.freelancersNeeded
        freelancersAppreciated.value = data.search.freelancersAppreciated
        freelancersLoading.value = false
      }
      else { freelancersLoading.value = false }
    })
  }
  else {
    freelancersLoading.value = false
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
        <div class>
          <div class="pt-0">
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
</style>
<route lang="yaml">
meta:
  layout: home
  requiresAuth: true
  roles: [Company]
</route>
