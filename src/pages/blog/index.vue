<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import { message } from 'ant-design-vue'
import { currentUser, token } from '~/stores'
import postsApi from '~/api/modules/posts'
import logoLight from '~/assets/img/logo-light.png'
import logoLightTheme from '~/assets/img/logo-light-theme.png'

const router = useRouter()
const { t } = useI18n()
const posts: Ref<any> = ref([])

const getPosts = async() => {
  const { data } = await postsApi.posts()
  console.log(data.value)
  posts.value = data.value
}
onMounted(() => {
  getPosts()
})
</script>

<template>
  <main class="main-content">
    <!--== Start Page Header Area Wrapper ==-->
    <div
      class="page-header-area sec-overlay sec-overlay-black"
      data-bg-img="../assets/img/photos/bg2.jpg"
    >
      <div class="container pt-0 pb-0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                Blog
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li>
                    <a href="index.html">Home</a>
                  </li>
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
        <div class="grid grid-cols-3 gap-2">
          <div v-for="(post, index) in posts" :key="index" class="post-item">
            <div class="thumb">
              <a href="blog-details.html">
                <img :src="post.image" alt="Image" width="370" height="270">
              </a>
            </div>
            <div class="content">
              <div class="author">
                By
                <a href="blog.html">{{ post.author }}</a>
              </div>
              <h4 class="title">
                <a
                  href="blog-details.html"
                >{{ post.title }}</a>
              </h4>
              <div class="meta">
                <span class="post-date">{{ dayjs(post.createdAt).format("DD MMMM, YYYY") }}</span>
                <span class="dots" />
                <span class="post-time">10 min read</span>
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
