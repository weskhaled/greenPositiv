<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import adminApi from '~/api/modules/admin'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { t } = useI18n()
const socials = reactive({
  facebook: {
    icon: 'i-mdi-facebook-box',
    link: '',
    classes: 'text-green-600',
  },
  twitter: {
    icon: 'i-mdi-twitter-box',
    link: '',
    classes: 'text-green-600',
  },
  linkedin: {
    icon: 'i-mdi-linkedin',
    link: '',
    classes: 'text-green-600',
  },
  github: {
    icon: 'i-mdi-github-box',
    link: '',
    classes: 'text-green-600',
  },
})
const post = ref(null)
const formPost = reactive<Record<string, any>>({
  title: '',
  content: '',
  resume: '',
  validated: '',
  author: '',
  image: '',
  url_fb: '',
  url_github: '',
  url_twitter: '',
  url_linkedin: '',
})
const getPostById = async () => {
  const { data } = await adminApi.getPostById(props.id)
  post.value = data.value
  formPost.title = post.value?.title
  formPost.content = post.value?.content
  formPost.resume = post.value?.resume
  formPost.author = post.value?.author
  formPost.image = post.value?.image
  socials.facebook.link = post.value?.url_fb
  socials.twitter.link = post.value?.url_twitter
  socials.linkedin.link = post.value?.url_linkedin
  socials.github.link = post.value?.url_github
}
onMounted(() => {
  getPostById()
})
</script>

<template>
  <main class="main-content">
    <!--== Start Page Header Area Wrapper ==-->
    <div
      class="page-header-area sec-overlay sec-overlay-black" data-bg-img="assets/img/photos/bg2.jpg"
      style="background-image: url(&quot;assets/img/photos/bg2.jpg&quot;);"
    >
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                Article Details
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li>
                    <router-link to="/blog">
                      <span>Blog</span>
                    </router-link>
                  </li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>{{ formPost?.title }}</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Page Header Area Wrapper ==-->

    <!--== Start Blog Area Wrapper ==-->
    <section class="blog-details-area">
      <div class="post-details-item">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12">
              <div class="post-details-info text-center">
                <div class="meta">
                  <span class="author">By <b>{{ formPost?.author }}</b></span>
                  <span class="dots" />
                  <span class="post-date">{{ dayjs(formPost.updatedAt).format("DD MMMM, YYYY") }} </span>
                </div>
                <h4 class="title">
                  {{ formPost?.title }}.
                </h4>
              </div>
              <div class="post-details-thumb">
                <img class="w-100" :src="`${formPost?.image}`" :alt="`/${formPost?.title}`">
              </div>
            </div>
            <div class="col-lg-10">
              <div class="post-details-content">
                <p class="blog-content" v-html="formPost?.content" />
                <div class>
                  <div class="widget-social-icons">
                    <span>Consultez cette article et partagez les :</span>
                  </div>
                  <social-media :socials="socials" />
                </div>

                <div
                  v-if="formPost?.url_fb || formPost?.url_instagram || formPost?.url_twitter || formPost?.url_linkedin"
                  class="post-details-footer"
                >
                  <div class="widget-social-icons">
                    <span>Consultez cette article et partagez les :</span>
                    <div class>
                      <social-media :socials="socials" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Blog Area Wrapper ==-->
  </main>
</template>
<style lang="css">
.blog-content h1 h2 h3 h4 h5 h6 {
  font-size: 27px;
  margin-bottom: 18px;
  line-height: 1.48148;
  color: #272a33;
  font-family: "Jost", sans-serif;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 10px;
  margin-top: 0;
}

.blog-content >>> p >>> span {
  line-height: 1.8125;
  margin-right: -2px;
  margin-bottom: 19px;
  color: #656565;
  font-size: 16px;
  font-family: "Jost", sans-serif;
  font-weight: 400;
  text-align: justify;
}

.blog-content >>> p {
  line-height: 1.8125;
  margin-right: -2px;
  margin-bottom: 19px;
  color: #656565;
  font-size: 16px;
  font-family: "Jost", sans-serif;
  font-weight: 400;
  text-align: justify;
}
.blog-content >>> a {
  color: #03a84e !important;
  display: block !important;
  font-size: 16px !important;
  text-shadow: 0px 0px 100px rgb(0 0 0 / 10%) !important;
  transition: all 0.2s ease-out !important;
  -webkit-transition: all 0.2s ease-out !important;
  -moz-transition: all 0.2s ease-out !important;
  -ms-transition: all 0.2s ease-out !important;
  -o-transition: all 0.2s ease-out !important;
}
</style>
<route lang="yaml">
meta:
  layout: home
</route>
