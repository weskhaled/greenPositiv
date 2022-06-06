<script setup lang="ts">
import { message } from 'ant-design-vue'
import authApi from '~/api/modules/auth'

const router = useRouter()
const { t } = useI18n()
const profileEntrepriseLoading = ref(false)

const formState = reactive<any>({
  password: '',
  repeatPassword: '',
})

const updatePassword = async () => {
  profileEntrepriseLoading.value = true
  try {
    const response = await authApi.updatePassword(formState)

    if (response.status === 200) {
      message.success(response.data.message)
      profileEntrepriseLoading.value = false
      router.push('/')
    }
    else {
      message.warning(response.data.message)
      profileEntrepriseLoading.value = false
    }
  }
  catch (error: any) {
    profileEntrepriseLoading.value = false
    message.destroy()
    message.error(`${error.message}`)
  }
}

const validatePassword = async (_rule: RuleObject, value: string) => {
  if (value === '')
    return Promise.reject(new Error('veuillez saisir votre mot de passe'))

  else if (value.length < 8)
    return Promise.reject(new Error('la longeur minimale est égale à 8'))

  else
    return Promise.resolve()
}

const validateRepeatPassword = async (_rule: RuleObject, value: string) => {
  if (value === '')
    return Promise.reject(new Error('veuillez resaisir votre mot de passe'))

  else if (value !== formState.password)
    return Promise.reject(new Error('les mots de passes ne sont pas les mêmes'))

  else
    return Promise.resolve()
}
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
                Paramétre de compte
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Accueil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Modification de mot de passe</li>
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
                    Changer votre mot de passe
                  </h4>
                </div>
                <a-form
                  :model="formState"
                  name="formState"
                  :label-col="{ span: 0 }"
                  :wrapper-col="{ span: 24 }"
                  autocomplete="on"
                >
                  <a-form-item
                    name="password"
                    :rules="[{ required: true, validator: validatePassword, trigger: 'change' }]"
                  >
                    <a-input-password v-model:value="formState.password" placeholder="mot de passe" />
                  </a-form-item>

                  <a-form-item
                    name="repeatPassword"
                    :rules="[{ required: true, validator: validateRepeatPassword, trigger: 'change' }]"
                  >
                    <a-input-password v-model:value="formState.repeatPassword" autocomplete="off" placeholder="répéter votre mot de passe" />
                  </a-form-item>
                  <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                    <a-button type="primary" block html-type="submit" :loading="profileEntrepriseLoading" @click="updatePassword">
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
