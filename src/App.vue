<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Green Positiv',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
  ],
})
const isMounted = useMounted()
</script>

<template>
  <suspense>
    <router-view v-if="isMounted" />
  </suspense>
</template>
