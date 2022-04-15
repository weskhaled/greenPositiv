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
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const profile = ref(null)
const profileAvatar = ref('')
const activities = ref([])
const departements = ref([])
const favorites = ref([])

const profileEntrepriseLoading = ref(false)

const controlledSwiper = ref(null)
const setControlledSwiper = (swiper) => {
  controlledSwiper.value = swiper
}
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

const formStateProfile = reactive<Record<string, any>>({
  avatar: null,
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  departement: undefined,
  phone: '',
})

const getFormData = async() => {
  globalApi.activities().then(({ data }) => {
    data.value && (activities.value = data.value.filter(a => a.code && a.name).map(a => ({
      value: a.code,
      label: a.name,
    })))
  })
  await companyApi.profileCollab(props.id).then(({ data }) => {
    if (data) {
      profile.value = data.company
      const company = data.company
      profileAvatar.value = company.image || ''
      formStateProfile.email = company.email
      formStateProfile.username = company.username
      formStateProfile.firstName = company.firstName
      formStateProfile.lastName = company.lastName
      formStateProfile.departement = company.departement
      formStateProfile.searchable = company.searchable
      formStateProfile.phone = company.phone
    }
  })

  await companyApi.getCollabFavoriteList().then(({ data }) => {
    if (data)
      favorites.value = data.favorites
    console.log('length ', favorites.value.length)
  })
}
const onLoad = () => {
  profileEntrepriseLoading.value = true
}

const updateProfile = async(profileData: any) => {
  const { data } = await companyApi.updateProfile(profileData)
  data && message.info(data.message)
  getFormData()
  profileEntrepriseLoading.value = false
}
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

const onFinish = async(values: any) => {
  if (values.avatar) {
    const formData = new FormData()
    formData.append('image', values.avatar[0].originFileObj)

    if (profile.value?.image)
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
                :src="profile?.image"
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
                    >{{ `${profile?.lastName} ${profile?.firstName}` }}</a>
                  </div>
                  <!--end::Name-->
                  <!--begin::Info-->
                  <div class="flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    <a href="#" class="flex items-center text-gray-400 text-hover-primary mb-2">
                      <span class="i-carbon-email text-xl inline-block mr-1" />
                      {{ currentUser?.email }}
                    </a>
                  </div>
                  <!--end::Info-->
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
                          <a-form-item class="mb-0" :wrapper-col="{ span: 2, offset: 20 }">
                            <a-button size="large" type="primary" html-type="submit" :loading="profileEntrepriseLoading" @click="onLoad()">
                              Enregistrer
                            </a-button>
                          </a-form-item>
                        </a-form>
                      </div>
                    </div>
                  </a-card>
                </div>
              </a-tab-pane>
              <a-tab-pane key="2" tab="Freelance Favoris" force-render>
                <div class>
                  <a-card title="Freelance Favoris" :bordered="false" class="rounded-sm">
                    <div v-if="favorites?.length">
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
                            v-for="(item, index) in favorites"
                            :key="index"
                          >
                            <a-card class="mr-2" hoverable>
                              <template #actions>
                                <router-link key="show" class="i-ant-design-user-outlined inline-block" :to="`/freelancers/${item._id}`" />
                              </template>
                              <a-card-meta :title="item.title_profile" class="text-center">
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
            </a-tabs>
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
  roles: [Collab]
</route>
