<script setup lang="ts">
import { message } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'
import SwiperCore, { Controller, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { loadStripe } from '@stripe/stripe-js'

import missionApi from '~/api/modules/mission'
import 'swiper/css/pagination'
SwiperCore.use([Controller, Pagination])

const controlledSwiper = ref(null)

const setDevisSwiper = (swiper) => {
  controlledSwiper.value = swiper
}

const router = useRouter()
const { t } = useI18n()
const devisLoading = ref(true)
const paymentLoading = ref(true)
const props = defineProps<{ id: string }>()
const tasks = ref([])
const cardElement = ref()
const formStateDevis = reactive<Record<string, any>>({
  id: null,
  id_company: undefined,
  id_mission: undefined,
  dateBegin: undefined,
  dateEnd: undefined,
  tasks: [],
  total: 0,
  tva: 20,
  totalTva: 0,
  totalGreen: 0,
  totalGreenTva: 0,
  totalUser: 0,
  offer: undefined,
  id_offer: undefined,
})
const formState = reactive<any>({
  name: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  card: '',
})
let stripe = null

const setupStripe = async () => {
  const ELEMENT_TYPE = 'card'
  stripe = await loadStripe(import.meta.env.VITE_STRIPE_KEY)
  const elements = stripe.elements()
  cardElement.value = elements.create(ELEMENT_TYPE)
  cardElement.value.mount('#stripe-element-mount-point')
  cardElement.value.on('change', (event) => {
    const displayError = document.getElementById('card-errors')
    if (event.error)
      displayError.textContent = event.error.message
    else
      displayError.textContent = ''
  })

  paymentLoading.value = false
}

const getFormData = async () => {
  missionApi.getDevisById(props.id).then(({ data }) => {
    const { devise } = data
    formStateDevis._id = devise._id
    formStateDevis.dateBegin = devise.dateBegin
    formStateDevis.dateEnd = devise.dateEnd
    formStateDevis.totalGreen = devise.totalGreen
    formStateDevis.totalGreenTva = devise.totalGreenTva
    tasks.value = devise.tasks
    devisLoading.value = false
  })
}
const onFinish = async (values: any) => {
  devisLoading.value = true
  const { name, email, address, city, state, zip } = formState
  const billingDetails = {
    name,
    email,
    address: {
      city,
      line1: address,
      state,
      postal_code: zip,
    },
  }
  const elements = stripe.elements()
  try {
    const response = await missionApi.pay(props.id)

    const { secret } = await response.data
    const paymentMethodReq = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement.value,
      billing_details: billingDetails,
    })
    const { error } = await stripe.confirmCardPayment(secret, {
      payment_method: paymentMethodReq.paymentMethod.id,
    })
    if (error) {
      console.log('error confirm ', error)
      return
    }
    else {
      devisLoading.value = false
      message.info('paiement effectué')
      router.push(`/mission/${formStateDevis.id_mission}`)
    }
  }
  catch (error) {
    devisLoading.value = false
    message.error('le paiement n\'a pas pu être effectué')
  }
}

onMounted(async () => {
  getFormData()
  setupStripe()
})
</script>

<template>
  <main class="main-content">
    <!--== Start Page Header Area Wrapper ==-->
    <div class="page-header-area sec-overlay sec-overlay-black" data-bg-img="../assets/img/photos/bg2.jpg">
      <div class="container pt-0 pb-0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                Paiement
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Accueil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Paiement Green Positiv</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Page Header Area Wrapper ==-->

    <!--== Start Login Area Wrapper ==-->
    <section class="account-login-area">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-7 col-xl-6">
            <div class="login-register-form-wrap">
              <a-spin v-if="devisLoading" class="mx-auto" />
              <div v-else class="login-register-form">
                <div class="form-title">
                  <h4 class="title">
                    Devis
                  </h4>
                </div>

                <div class="mb-4">
                  <swiper
                    :modules="[Controller]"
                    :slides-per-view="1" class="p-3"
                    :pagination="{
                      clickable: true,
                    }"
                    :grab-cursor="true"
                    @swiper="setDevisSwiper"
                  >
                    <swiper-slide
                      v-for="(item2, index2) in tasks"
                      :key="index2"
                    >
                      <div>
                        <a-card class="mr-2" hoverable>
                          <a-card-meta :title="`Tâche : ${index2 + 1}`">
                            <template #description>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Nombre d'heures :</b>
                                </span>
                                {{ item2.nb_hours }} heures
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Coût / heure :</b>
                                </span>
                                {{ item2.cost_per_hour }} €
                              </div>
                              <div class="flex items-center">
                                <span class="text-dark-300 mr-1.5">
                                  <b>Description :</b>
                                </span>
                              </div>
                              {{ item2.description }}
                            </template>
                          </a-card-meta>
                        </a-card>
                      </div>
                    </swiper-slide>
                  </swiper>
                  <br>
                  <label><b> Période : </b>
                    {{ dayjs(formStateDevis.dateBegin).format("DD-MM-YYYY") }} - {{ dayjs(formStateDevis.dateEnd).format("DD-MM-YYYY") }}

                  </label>
                  <br>
                  <label><b> Frais GreenPositiv (10% HT): </b> {{ formStateDevis.totalGreen }} €</label>
                  <br>
                  <label><b> Frais GreenPositiv (TTC): </b> {{ formStateDevis.totalGreenTva }} €</label>
                  <br>
                </div>
                <div class="form-title">
                  <h4 class="title">
                    Paiement
                  </h4>
                </div>
                <div class="mb-4">
                  <a-form
                    :model="formState"
                    name="formState"
                    :label-col="{ span: 0 }"
                    :wrapper-col="{ span: 24 }"
                    autocomplete="on"
                    @finish="onFinish"
                  >
                    <a-form-item
                      name="name"
                      :rules="[{ required: true,message:'veuillez saisir votre nom', trigger: 'change' }]"
                    >
                      <a-input v-model:value="formState.name" placeholder="Nom" />
                    </a-form-item>
                    <a-form-item
                      name="email"
                      :rules="[{ required: true, message: 'Veuillez saisir votre adresse mail', type: 'email', trigger: 'change' }]"
                    >
                      <a-input v-model:value="formState.email" placeholder="Email" />
                    </a-form-item>
                    <a-form-item
                      name="address"
                      :rules="[{ required: true,message:'veuillez saisir votre adresse', trigger: 'change' }]"
                    >
                      <a-input v-model:value="formState.address" placeholder="addresse" />
                    </a-form-item>
                    <a-form-item
                      name="city"
                      :rules="[{ required: true,message:'veuillez saisir votre localisation', trigger: 'change' }]"
                    >
                      <a-input v-model:value="formState.city" placeholder="localisation" />
                    </a-form-item>
                    <a-form-item
                      name="state"
                      :rules="[{ required: true,message:'veuillez saisir votre ville', trigger: 'change' }]"
                    >
                      <a-input v-model:value="formState.state" placeholder="ville" />
                    </a-form-item>
                    <a-form-item
                      name="zip"
                      :rules="[{ required: true,message:'veuillez saisir votre code postal', trigger: 'change' }]"
                    >
                      <a-input v-model:value="formState.zip" placeholder="zip" />
                    </a-form-item>
                    <div id="stripe-element-mount-point" />
                    <br>
                    <label id="card-errors" />

                    <br><br>

                    <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                      <a-button type="primary" block html-type="submit" :loading="devisLoading">
                        Payer {{ formStateDevis.totalGreenTva }} €
                      </a-button>
                    </a-form-item>
                  </a-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Login Area Wrapper ==-->
  </main>
</template>
<style lang="scss">
.ant-btn {
  @apply px-2 !h-auto;
}
#stripe-element-mount-point {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum';
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    padding: 4px 11px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 1.5715;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    transition: all 0.3s;
}
#card-errors {
    color:red !important;
}
</style>
<route lang="yaml">
meta:
  layout: home
</route>
