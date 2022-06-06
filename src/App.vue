<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,

import { currentUser } from './stores'

// they will be rendered correctly in the html results with vite-ssg
const router = useRouter()
// const route = useRoute()
useHead({
  title: 'Green Positiv',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
  ],
})
const isMounted = useMounted()

router.beforeEach(async (to, from, next) => {
  const { meta } = to

  if (currentUser.value && meta.roles) {
    if (meta?.roles?.includes(currentUser.value.role))
      next()
    else next('/')
  }
  next()
})

</script>

<template>
  <suspense>
    <router-view v-if="isMounted" />
  </suspense>
</template>
