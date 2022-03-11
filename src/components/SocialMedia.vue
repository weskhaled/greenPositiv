<script setup lang="ts">
const props = defineProps<{
  socials: any[]
  inEdit: boolean
}>()

</script>

<template>
  <div class="flex mt-3">
    <a v-for="(social, index) in socials" :key="index" :href="social.link" class="border border-gray-700/30 p-1 mr-1">
      <span :class="`${social.icon} text-2xl block ${social.classes}`" />
    </a>
    <a v-if="props.inEdit" href="" class="border border-gray-700/30 p-1 mr-1">
      <span :class="`i-mdi-plus text-2xl block ${socials[0]?.classes}`" />
    </a>
  </div>
</template>
