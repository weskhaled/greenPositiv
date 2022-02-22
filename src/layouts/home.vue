<template>
  <!--wrapper start-->
  <div class="wrapper">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>
<script setup lang="ts">
import { currentUser, token } from '~/stores'
import authApi from '~/api/modules/auth'

onMounted(async() => {
  if (token.value) {
    const { data: currentUserData } = await authApi.currentUser()
    if (currentUserData) { currentUser.value = currentUserData }
    else {
      currentUser.value = null
      token.value = null
    }
  }
})
</script>
