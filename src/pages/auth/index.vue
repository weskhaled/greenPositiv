<script setup lang="ts">
import { message } from 'ant-design-vue'
import { currentUser, refreshToken, token } from '~/stores'
import authApi from '~/api/modules/auth'

const router = useRouter()
const { t } = useI18n()
const profileEntrepriseLoading = ref(false)

const formState = reactive<any>({
  username: 'khaled',
  password: 'azerty123',
  remember: true,
})
const onLoad = () => {
  profileEntrepriseLoading.value = true
}
const onFinish = async (values: any) => {
  profileEntrepriseLoading.value = true
  const { username, password } = values
  try {
    const { data } = await authApi.login({ username, password })

    if (data) {
      token.value = data.token
      refreshToken.value = data.refreshToken
      const { data: currentUserData } = await authApi.currentUser()
      if (currentUserData) {
        profileEntrepriseLoading.value = false
        currentUser.value = currentUserData
        message.success('Bienvenue')
        router.push('/')
      }
      else {
        currentUser.value = null
      }
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
                Connexion
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Accueil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Connexion</li>
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
                    Connexion
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
                    name="username"
                    :rules="[{ required: true, message: 'veuillez saisir votre identifiant' }]"
                  >
                    <a-input v-model:value="formState.username" />
                  </a-form-item>

                  <a-form-item
                    name="password"
                    :rules="[{ required: true, message: 'veuillez saisir votre mot de passe ' }]"
                  >
                    <a-input-password v-model:value="formState.password" />
                  </a-form-item>

                  <a-form-item name="remember" :wrapper-col="{ offset: 0, span: 24 }">
                    <a-checkbox v-model:checked="formState.remember">
                      Se rappeller de mon compte
                    </a-checkbox>
                  </a-form-item>

                  <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                    <a-button type="primary" block html-type="submit" :loading="profileEntrepriseLoading">
                      Connexion
                    </a-button>
                  </a-form-item>
                </a-form>
                <div class="login-register-form-info">
                  <p>
                    Pas encore de compte? <a href="javascript:;" @click="router.push('/auth/registration')">Créer un
                      compte</a>
                  </p>
                  <p>
                    Mot de passe oublié? <a href="javascript:;" @click="router.push('/auth/forgot-password')">Récupérer votre
                      compte</a>
                  </p>
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

</style>
<route lang="yaml">
meta:
  layout: home
</route>
