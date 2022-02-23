<script setup lang="ts">
import { message } from 'ant-design-vue'
import { currentUser, token } from '~/stores'
import authApi from '~/api/modules/auth'
import logoLight from '~/assets/img/logo-light.png'
import logoLightTheme from '~/assets/img/logo-light-theme.png'

const router = useRouter()
const { t } = useI18n()

const formState = reactive<any>({
  username: 'khaled',
  password: 'azerty123',
  remember: true,
})
const onFinish = async(values: any) => {
  const { username, password } = values
  const { data } = await authApi.login({ username, password })
  data && (token.value = data.token)
  const { data: currentUserData } = await authApi.currentUser()
  if (currentUserData) {
    currentUser.value = currentUserData
    router.push('/')
  }
  else {
    currentUser.value = null
    token.value = null
  }
}

const onFinishFailed = (errorInfo: any) => {
  message.error(errorInfo)
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
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                Login
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Home</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Pages</li>
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
                    Sign In
                  </h4>
                </div>
                <a-form
                  :model="formState"
                  name="basic"
                  :label-col="{ span: 0 }"
                  :wrapper-col="{ span: 24 }"
                  autocomplete="on"
                  @finish="onFinish"
                  @finish-failed="onFinishFailed"
                >
                  <a-form-item
                    name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]"
                  >
                    <a-input v-model:value="formState.username" />
                  </a-form-item>

                  <a-form-item
                    name="password"
                    :rules="[{ required: true, message: 'Please input your password!' }]"
                  >
                    <a-input-password v-model:value="formState.password" />
                  </a-form-item>

                  <a-form-item name="remember" :wrapper-col="{ offset: 0, span: 24 }">
                    <a-checkbox v-model:checked="formState.remember">
                      Remember me
                    </a-checkbox>
                  </a-form-item>

                  <a-form-item :wrapper-col="{ offset: 0, span: 24 }">
                    <a-button type="primary" block html-type="submit">
                      Submit
                    </a-button>
                  </a-form-item>
                </a-form>
                <div class="login-register-form-info">
                  <p>Don't you have an account? <a href="javascript:;" @click="router.push('/auth/registration')">Register</a></p>
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

<route lang="yaml">
meta:
  layout: home
</route>
