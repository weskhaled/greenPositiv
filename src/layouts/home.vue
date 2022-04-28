<script setup lang="ts">
import { message } from 'ant-design-vue'
import { useJwt } from '@vueuse/integrations/useJwt'
import { currentUser, isAuthenticated, refreshToken, token } from '~/stores'
import authApi from '~/api/modules/auth'

const BASE_PREFIX = `${import.meta.env.VITE_API_AUTH}`

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  if (token.value && refreshToken.value) {
    const encodedToken = ref(token.value)
    const { payload } = useJwt(encodedToken)
    const expiresIn = payload.value?.exp
    if (expiresIn && (Date.now() < expiresIn * 1000)) {
      const { data: currentUserData } = await authApi.currentUser()
      if (currentUserData) {
        currentUser.value = currentUserData

        if (route.meta?.requiresAuth && (!route.meta?.roles?.includes(currentUser.value?.role)))
          await router.push({ path: '/not_authorized' })

        router.beforeResolve(async (to, from) => {
          if (isAuthenticated.value) {
            if (currentUser.value) {
              const pageRoles: any[] = to.meta?.roles || []
              if (to.meta.requiresAuth && (!pageRoles.includes(currentUser.value?.role))) {
                message.warn('Not Authorized')
                return false
              }
              return true
            }
          }
        })
      }
    }
    else {
      const { data } = await useFetch(`${BASE_PREFIX}/auth/refresh`).post({ email: payload.value?.emailConnected, username: payload.value?.usernameConnected, refreshToken: refreshToken.value }).json()
      data.value && (token.value = data.value.token)
      const { data: currentUserData } = await authApi.currentUser()
      if (currentUserData) {
        currentUser.value = currentUserData

        if (route.meta?.requiresAuth && (!route.meta?.roles?.includes(currentUser.value?.role)))
          await router.push({ path: '/not_authorized' })

        router.beforeResolve(async (to, from) => {
          if (isAuthenticated.value) {
            if (currentUser.value) {
              const pageRoles: any[] = to.meta?.roles || []
              if (to.meta.requiresAuth && (!pageRoles.includes(currentUser.value?.role))) {
                message.warn('Not Authorized')
                return false
              }
              return true
            }
          }
        })
      }
    }
  }
  else {
    token.value = null
    refreshToken.value = null
    currentUser.value = null
  }
})
watch(
  isAuthenticated,
  (value) => {
    if (!value)
      router.push('/auth')
  },
  { immediate: true },
)
</script>
<template>
  <!--wrapper start-->
  <div class="wrapper">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>
