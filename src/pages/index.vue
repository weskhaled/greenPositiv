<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import { useUserStore } from '~/stores/user'
import adminApi from '~/api/modules/admin'
import globalApi from '~/api/modules/global'

const user = useUserStore()
const name = ref(user.savedName)
const jobs = ref([])
const countries = ref([])
const posts = [{}, {}]

const router = useRouter()
const go = () => {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}

const { t } = useI18n()

const getPosts = async() => {
  const { data } = await adminApi.posts()
  posts[0] = (data.value[data.value.length - 1])
  posts[1] = (data.value[data.value.length - 2])
}

const getFormData = async() => {
  await getPosts()
  const { data } = await adminApi.jobs()

  data.value && (jobs.value = data.value.filter(j => j._id && j.name).map(j => ({
    value: j._id,
    label: j.name,
  })))

  globalApi.countries().then(({ data }) => {
    data.value && (countries.value = data.value.map(l => ({
      value: l,
      label: l,
    })))
  })
}

onMounted(async() => {
  getFormData()
})
</script>

<template>
  <main class="main-content">
    <!--== Start Hero Area Wrapper ==-->
    <section class="home-slider-area">
      <div class="home-slider-container default-slider-container bg-green-500">
        <div class="home-slider-wrapper slider-default">
          <div class="slider-content-area" data-bg-img="../assets/img/slider/013.jpg">
            <div class="container pt--0 pb--0">
              <div class="slider-container">
                <div class="row justify-content-center align-items-center">
                  <div class="col-12 col-lg-8">
                    <div class="slider-content">
                      <h2 class="title">
                        <span class="counter" data-counterup-delay="80">2,568</span> job available <br>You can choose your dream job
                      </h2>
                      <p class="desc">
                        Find great job for build your bright career. Have many job in this plactform.
                      </p>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="job-search-wrap">
                      <div class="job-search-form">
                        <form action="#">
                          <div class="row row-gutter-10">
                            <div class="col-lg-auto col-sm-6 col-12 flex-grow-1">
                              <div class="form-group">
                                <input type="text" class="form-control" placeholder="Compétence recherchée">
                              </div>
                            </div>
                            <div class="col-lg-auto col-sm-6 col-12 flex-grow-1">
                              <div class="form-group">
                                <select class="form-control">
                                  <option value="0" selected>
                                    Choisir un pays
                                  </option>
                                  <option v-for="item in countries" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div class="col-lg-auto col-sm-6 col-12 flex-grow-1">
                              <div class="form-group">
                                <select class="form-control">
                                  <option value="0" selected>
                                    Choisir une catégorie
                                  </option>
                                  <option v-for="item in jobs" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div class="col-lg-auto col-sm-6 col-12 flex-grow-1">
                              <div class="form-group">
                                <button type="button" class="btn-form-search">
                                  <span class="i-carbon-search icofont-search-1" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-12">
            <div class="play-video-btn">
              <a href="https://www.youtube.com/mcvqOUtcAJg" class="video-popup">
                <span class="i-carbon-play-filled-alt text-white text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="home-slider-shape">
        <img class="shape1" data-aos="fade-down" data-aos-duration="1500" src="../assets/img/slider/vector1.png" width="270" height="234" alt="Image-HasTech">
        <img class="shape2" data-aos="fade-left" data-aos-duration="2000" src="../assets/img/slider/vector2.png" width="201" height="346" alt="Image-HasTech">
        <img class="shape3" data-aos="fade-right" data-aos-duration="2000" src="../assets/img/slider/vector3.png" width="276" height="432" alt="Image-HasTech">
        <img class="shape4" data-aos="flip-left" data-aos-duration="1500" src="../assets/img/slider/vector4.png" width="127" height="121" alt="Image-HasTech">
      </div>
    </section>
    <!--== End Hero Area Wrapper ==-->

    <!--== Start Job Category Area Wrapper ==-->
    <section class="job-category-area">
      <div class="container" data-aos="fade-down">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                Catégories de métier
              </h3>
            </div>
          </div>
        </div>
        <div class="row row-gutter-20">
          <div v-for="job in jobs" class="col-sm-6 col-lg-3 flex-auto">
            <!--== Start Job Category Item ==-->
            <div class="job-category-item">
              <div class="content">
                <h3 class="title">
                  <a href="job-details.html">{{ job.label }}</a>
                </h3>
              </div>
              <a class="overlay-link" href="job-details.html" />
            </div>
            <!--== End Job Category Item ==-->
          </div>
        </div>
      </div>
    </section>
    <!--== End Job Category Area Wrapper ==-->

    <!--== Start Work Process Freelance Area Wrapper ==-->
    <section class="work-process-area">
      <div class="container" data-aos="fade-down">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                How It Work? Freelance
              </h3>
              <div class="desc">
                <p>Many desktop publishing packages and web page editors</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="working-process-content-wrap">
              <div class="working-col">
                <!--== Start Work Process ==-->
                <div class="working-process-item">
                  <div class="icon-box">
                    <div class="inner">
                      <img class="icon-img" src="../assets/img/icons/w1.png" alt="Image-HasTech">
                      <img class="icon-hover" src="../assets/img/icons/w1-hover.png" alt="Image-HasTech">
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="title">
                      Create an Account
                    </h4>
                    <p class="desc">
                      It is long established fact reader distracted readable content
                    </p>
                  </div>
                  <div class="shape-arrow-icon">
                    <img class="shape-icon" src="../assets/img/icons/right-arrow.png" alt="Image-HasTech">
                    <img class="shape-icon-hover" src="../assets/img/icons/right-arrow2.png" alt="Image-HasTech">
                  </div>
                </div>
                <!--== End Work Process ==-->
              </div>
              <div class="working-col">
                <!--== Start Work Process ==-->
                <div class="working-process-item">
                  <div class="icon-box">
                    <div class="inner">
                      <img class="icon-img" src="../assets/img/icons/w2.png" alt="Image-HasTech">
                      <img class="icon-hover" src="../assets/img/icons/w2-hover.png" alt="Image-HasTech">
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="title">
                      CV/Resume
                    </h4>
                    <p class="desc">
                      It is long established fact reader distracted readable content
                    </p>
                  </div>
                  <div class="shape-arrow-icon">
                    <img class="shape-icon" src="../assets/img/icons/right-arrow.png" alt="Image-HasTech">
                    <img class="shape-icon-hover" src="../assets/img/icons/right-arrow2.png" alt="Image-HasTech">
                  </div>
                </div>
                <!--== End Work Process ==-->
              </div>
              <div class="working-col">
                <!--== Start Work Process ==-->
                <div class="working-process-item">
                  <div class="icon-box">
                    <div class="inner">
                      <img class="icon-img" src="../assets/img/icons/w3.png" alt="Image-HasTech">
                      <img class="icon-hover" src="../assets/img/icons/w3-hover.png" alt="Image-HasTech">
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="title">
                      Find Your Job
                    </h4>
                    <p class="desc">
                      It is long established fact reader distracted readable content
                    </p>
                  </div>
                  <div class="shape-arrow-icon">
                    <img class="shape-icon" src="../assets/img/icons/right-arrow.png" alt="Image-HasTech">
                    <img class="shape-icon-hover" src="../assets/img/icons/right-arrow2.png" alt="Image-HasTech">
                  </div>
                </div>
                <!--== End Work Process ==-->
              </div>
              <div class="working-col">
                <!--== Start Work Process ==-->
                <div class="working-process-item">
                  <div class="icon-box">
                    <div class="inner">
                      <img class="icon-img" src="../assets/img/icons/w4.png" alt="Image-HasTech">
                      <img class="icon-hover" src="../assets/img/icons/w4-hover.png" alt="Image-HasTech">
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="title">
                      Save & Apply
                    </h4>
                    <p class="desc">
                      It is long established fact reader distracted readable content
                    </p>
                  </div>
                  <div class="shape-arrow-icon d-none">
                    <img class="shape-icon" src="../assets/img/icons/right-arrow.png" alt="Image-HasTech">
                    <img class="shape-icon-hover" src="../assets/img/icons/right-arrow2.png" alt="Image-HasTech">
                  </div>
                </div>
                <!--== End Work Process ==-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Work Process Freelance Area Wrapper ==-->

    <!--== Start Work Process Enterprise Area Wrapper ==-->
    <section class="work-process-area">
      <div class="container" data-aos="fade-down">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                How It Work? Entreprise
              </h3>
              <div class="desc">
                <p>Many desktop publishing packages and web page editors</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="working-process-content-wrap">
              <div class="working-col">
                <!--== Start Work Process ==-->
                <div class="working-process-item">
                  <div class="icon-box">
                    <div class="inner">
                      <img class="icon-img" src="../assets/img/icons/w1.png" alt="Image-HasTech">
                      <img class="icon-hover" src="../assets/img/icons/w1-hover.png" alt="Image-HasTech">
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="title">
                      Create an Account
                    </h4>
                    <p class="desc">
                      It is long established fact reader distracted readable content
                    </p>
                  </div>
                  <div class="shape-arrow-icon">
                    <img class="shape-icon" src="../assets/img/icons/right-arrow.png" alt="Image-HasTech">
                    <img class="shape-icon-hover" src="../assets/img/icons/right-arrow2.png" alt="Image-HasTech">
                  </div>
                </div>
                <!--== End Work Process ==-->
              </div>
              <div class="working-col">
                <!--== Start Work Process ==-->
                <div class="working-process-item">
                  <div class="icon-box">
                    <div class="inner">
                      <img class="icon-img" src="../assets/img/icons/w2.png" alt="Image-HasTech">
                      <img class="icon-hover" src="../assets/img/icons/w2-hover.png" alt="Image-HasTech">
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="title">
                      CV/Resume
                    </h4>
                    <p class="desc">
                      It is long established fact reader distracted readable content
                    </p>
                  </div>
                  <div class="shape-arrow-icon">
                    <img class="shape-icon" src="../assets/img/icons/right-arrow.png" alt="Image-HasTech">
                    <img class="shape-icon-hover" src="../assets/img/icons/right-arrow2.png" alt="Image-HasTech">
                  </div>
                </div>
                <!--== End Work Process ==-->
              </div>
              <div class="working-col">
                <!--== Start Work Process ==-->
                <div class="working-process-item">
                  <div class="icon-box">
                    <div class="inner">
                      <img class="icon-img" src="../assets/img/icons/w3.png" alt="Image-HasTech">
                      <img class="icon-hover" src="../assets/img/icons/w3-hover.png" alt="Image-HasTech">
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="title">
                      Find Your Job
                    </h4>
                    <p class="desc">
                      It is long established fact reader distracted readable content
                    </p>
                  </div>
                  <div class="shape-arrow-icon">
                    <img class="shape-icon" src="../assets/img/icons/right-arrow.png" alt="Image-HasTech">
                    <img class="shape-icon-hover" src="../assets/img/icons/right-arrow2.png" alt="Image-HasTech">
                  </div>
                </div>
                <!--== End Work Process ==-->
              </div>
              <div class="working-col">
                <!--== Start Work Process ==-->
                <div class="working-process-item">
                  <div class="icon-box">
                    <div class="inner">
                      <img class="icon-img" src="../assets/img/icons/w4.png" alt="Image-HasTech">
                      <img class="icon-hover" src="../assets/img/icons/w4-hover.png" alt="Image-HasTech">
                    </div>
                  </div>
                  <div class="content">
                    <h4 class="title">
                      Save & Apply
                    </h4>
                    <p class="desc">
                      It is long established fact reader distracted readable content
                    </p>
                  </div>
                  <div class="shape-arrow-icon d-none">
                    <img class="shape-icon" src="../assets/img/icons/right-arrow.png" alt="Image-HasTech">
                    <img class="shape-icon-hover" src="../assets/img/icons/right-arrow2.png" alt="Image-HasTech">
                  </div>
                </div>
                <!--== End Work Process ==-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Work Process Enterprise Area Wrapper ==-->

    <!--== Start Divider Area Wrapper ==-->
    <section class="sec-overlay sec-overlay-theme bg-img" data-bg-img="../assets/img/photos/bg1.jpg">
      <div class="container pt--0 pb--0">
        <div class="row justify-content-center divider-style1">
          <div class="col-lg-10 col-xl-7">
            <div class="divider-content text-center">
              <h4 class="sub-title" data-aos="fade-down">
                Trial Version Available
              </h4>
              <h2 class="title" data-aos="fade-down">
                Download Our Mobile App. <br>You Can Ready Resume & Apply Job.
              </h2>
              <div class="divider-btn-group">
                <a class="btn-divider" data-aos="fade-down" href="page-not-found.html">
                  <img src="../assets/img/photos/google-play.png" width="201" height="63" class="icon" alt="Image-HasTech">
                </a>
                <a class="btn-divider btn-divider-app-store" data-aos="fade-down" href="page-not-found.html">
                  <img src="../assets/img/photos/mac-os.png" width="201" height="63" class="icon" alt="Image-HasTech">
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-layer-style1" />
      <div class="bg-layer-style2" />
    </section>
    <!--== End Divider Area Wrapper ==-->

    <!--== Start Testimonial Area Wrapper ==-->
    <section class="testimonial-area bg-color-gray">
      <div class="container" data-aos="fade-down">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                Our Happy Clients
              </h3>
              <div class="desc">
                <p>Many desktop publishing packages and web page editors</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="swiper testi-slider-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <!--== Start Testimonial Item ==-->
                  <div class="testimonial-item">
                    <div class="testi-inner-content">
                      <div class="testi-author">
                        <div class="testi-thumb">
                          <img src="../assets/img/testimonial/1.jpg" width="75" height="75" alt="Image-HasTech">
                        </div>
                        <div class="testi-info">
                          <h4 class="name">
                            Roselia Hamets
                          </h4>
                          <span class="designation">Hiring Manager</span>
                        </div>
                      </div>
                      <div class="testi-content">
                        <p class="desc">
                          It is a long established fact that reader will distracted the readable content page looking at its layout point using that has more-or-less normal distribution of letters opposed using content making.
                        </p>
                        <div class="rating-box">
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                        </div>
                        <div class="testi-quote">
                          <img src="../assets/img/icons/quote1.png" alt="Image-HasTech">
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--== End Testimonial Item ==-->
                </div>
                <div class="swiper-slide">
                  <!--== Start Testimonial Item ==-->
                  <div class="testimonial-item">
                    <div class="testi-inner-content">
                      <div class="testi-author">
                        <div class="testi-thumb">
                          <img src="../assets/img/testimonial/2.jpg" width="75" height="75" alt="Image-HasTech">
                        </div>
                        <div class="testi-info">
                          <h4 class="name">
                            Assunta Manson
                          </h4>
                          <span class="designation">Hiring Manager</span>
                        </div>
                      </div>
                      <div class="testi-content">
                        <p class="desc">
                          It is a long established fact that reader will distracted the readable content page looking at its layout point using that has more-or-less normal distribution of letters opposed using content making.
                        </p>
                        <div class="rating-box">
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                        </div>
                        <div class="testi-quote">
                          <img src="../assets/img/icons/quote1.png" alt="Image-HasTech">
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--== End Testimonial Item ==-->
                </div>
                <div class="swiper-slide">
                  <!--== Start Testimonial Item ==-->
                  <div class="testimonial-item">
                    <div class="testi-inner-content">
                      <div class="testi-author">
                        <div class="testi-thumb">
                          <img src="../assets/img/testimonial/3.jpg" width="75" height="75" alt="Image-HasTech">
                        </div>
                        <div class="testi-info">
                          <h4 class="name">
                            Amira Shepard
                          </h4>
                          <span class="designation">Hiring Manager</span>
                        </div>
                      </div>
                      <div class="testi-content">
                        <p class="desc">
                          It is a long established fact that reader will distracted the readable content page looking at its layout point using that has more-or-less normal distribution of letters opposed using content making.
                        </p>
                        <div class="rating-box">
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                        </div>
                        <div class="testi-quote">
                          <img src="../assets/img/icons/quote1.png" alt="Image-HasTech">
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--== End Testimonial Item ==-->
                </div>
                <div class="swiper-slide">
                  <!--== Start Testimonial Item ==-->
                  <div class="testimonial-item">
                    <div class="testi-inner-content">
                      <div class="testi-author">
                        <div class="testi-thumb">
                          <img src="../assets/img/testimonial/4.jpg" width="75" height="75" alt="Image-HasTech">
                        </div>
                        <div class="testi-info">
                          <h4 class="name">
                            Joshua George
                          </h4>
                          <span class="designation">Hiring Manager</span>
                        </div>
                      </div>
                      <div class="testi-content">
                        <p class="desc">
                          It is a long established fact that reader will distracted the readable content page looking at its layout point using that has more-or-less normal distribution of letters opposed using content making.
                        </p>
                        <div class="rating-box">
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                        </div>
                        <div class="testi-quote">
                          <img src="../assets/img/icons/quote1.png" alt="Image-HasTech">
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--== End Testimonial Item ==-->
                </div>
                <div class="swiper-slide">
                  <!--== Start Testimonial Item ==-->
                  <div class="testimonial-item">
                    <div class="testi-inner-content">
                      <div class="testi-author">
                        <div class="testi-thumb">
                          <img src="../assets/img/testimonial/5.jpg" width="75" height="75" alt="Image-HasTech">
                        </div>
                        <div class="testi-info">
                          <h4 class="name">
                            Rosie Patton
                          </h4>
                          <span class="designation">Hiring Manager</span>
                        </div>
                      </div>
                      <div class="testi-content">
                        <p class="desc">
                          It is a long established fact that reader will distracted the readable content page looking at its layout point using that has more-or-less normal distribution of letters opposed using content making.
                        </p>
                        <div class="rating-box">
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                          <i class="icofont-star" />
                        </div>
                        <div class="testi-quote">
                          <img src="../assets/img/icons/quote1.png" alt="Image-HasTech">
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--== End Testimonial Item ==-->
                </div>
              </div>

              <!--== Add Swiper Pagination ==-->
              <div class="swiper-pagination" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Testimonial Area Wrapper ==-->

    <!--== Start Blog Area Wrapper ==-->
    <section class="blog-area blog-home-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                Nouveaux articles
              </h3>
              <div class="desc">
                <p>Lorem ipsum</p>
              </div>
            </div>
          </div>
        </div>
        <div class="row align-items-center post-home-style row-gutter-40">
          <div class="col-md-6 col-lg-4" data-aos="fade-right">
            <!--== Start Blog Post Item ==-->
            <div class="post-item">
              <div class="thumb mb--0">
                <a :href="`/blog/${posts[0]._id}`">
                  <img :src="posts[0].image" alt="Image" width="370" max-height="270">
                </a>
              </div>
              <div class="content">
                <div class="author mt-4">
                  By <a href="#">{{ posts[0].author }}</a>
                </div>
                <h4 class="title">
                  {{ posts[0].title }}
                </h4>
                <div class="meta">
                  <span class="post-date">{{ dayjs(posts[0].createdAt).format("DD MMMM, YYYY") }}</span>
                </div>
              </div>
            </div>
            <!--== End Blog Post Item ==-->
          </div>
          <div class="col-md-6 col-lg-4" data-aos="fade-left">
            <!--== Start Blog Post Item ==-->
            <div class="post-item">
              <div class="thumb mb--0">
                <a :href="`/blog/${posts[1]._id}`">
                  <img :src="posts[1].image" alt="Image" width="370" max-height="440">
                </a>
              </div>
            </div>
            <!--== End Blog Post Item ==-->
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="post-home-list-style">
              <!--== Start Blog Post Item ==-->
              <div class="post-item">
                <div class="content">
                  <div class="author">
                    By <a href="blog.html">{{ posts[1].author }}</a>
                  </div>
                  <h4 class="title">
                    {{ posts[1].title }}
                  </h4>
                  <div class="meta">
                    <span class="post-date">{{ dayjs(posts[1].createdAt).format("DD MMMM, YYYY") }}</span>
                  </div>
                </div>
              </div>
              <!--== End Blog Post Item ==-->

              <!--== Start Blog Post Item ==-->

              <!--== End Blog Post Item ==-->
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--== End Blog Area Wrapper ==-->
  </main>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
