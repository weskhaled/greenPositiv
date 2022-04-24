<script setup lang="ts">
import { message } from 'ant-design-vue'
import { token } from '~/stores'
import authApi from '~/api/modules/auth'

const router = useRouter()
const { t } = useI18n()
const profileEntrepriseLoading = ref(false)

const formState = reactive<any>({
  email: '',
})

const forgotPassword = async() => {
  profileEntrepriseLoading.value = true
  try {
    const response = await authApi.forgotPassword({ email: formState.email })
    console.log('response ', response.data.value.message)

    if (response.status === 200) {
      message.success(response.data.value.message)
      profileEntrepriseLoading.value = false
    }
    else {
      message.warning(response.data.value.message)
      profileEntrepriseLoading.value = false
    }
  }
  catch (error: any) {
    profileEntrepriseLoading.value = false
    message.destroy()
    message.error(`${error.message}`)
  }
}

onMounted(() => {
  if (token.value)
    router.push('/')
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
                Récupérer votre compte
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Accueil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Récupération de mot de passe</li>
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
              <div class="login-register-form">
                <div class="form-title">
                  <h4 class="title">
                    Récupérer votre mot de passe
                  </h4>
                </div>
                <a-form
                  :model="formState"
                  name="formState"
                  :label-col="{ span: 0 }"
                  :wrapper-col="{ span: 24 }"
                  autocomplete="on"
                  @finish="onFinish"
                >
                  <a-form-item
                    name="email"
                    :rules="[{ required: true, message: 'Veuillez saisir votre adresse mail', type: 'email', trigger: 'change' }]"
                  >
                    <a-input v-model:value="formState.email" placeholder="Email" />
                  </a-form-item>
                  <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                    <a-button type="primary" block html-type="submit" :loading="profileEntrepriseLoading" @click="forgotPassword">
                      Envoyer
                    </a-button>
                  </a-form-item>
                </a-form>
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

</style>
<route lang="yaml">
meta:
  layout: home
</route>
