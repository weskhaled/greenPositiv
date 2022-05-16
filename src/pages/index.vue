<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs'
import { useUserStore } from '~/stores/user'
import adminApi from '~/api/modules/admin'
import globalApi from '~/api/modules/global'
import mask1 from '~/assets/svg/mask-1.svg'

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

const getPosts = async () => {
  const { data } = await adminApi.posts()
  posts[0] = (data.value[data.value.length - 1])
  posts[1] = (data.value[data.value.length - 2])
}

const getFormData = async () => {
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

onMounted(async () => {
  getFormData()
})
</script>

<template>
  <svg style="display:none;">
    <symbol id="one" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="#04a74e" d="M0,96L1440,320L1440,320L0,320Z" />
    </symbol>
    <symbol id="two" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="white" d="M0,32L48,37.3C96,43,192,53,288,90.7C384,128,480,192,576,197.3C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
    </symbol>
    <symbol id="three" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="white" d="M0,128L30,144C60,160,120,192,180,197.3C240,203,300,181,360,192C420,203,480,245,540,245.3C600,245,660,203,720,192C780,181,840,203,900,181.3C960,160,1020,96,1080,80C1140,64,1200,96,1260,122.7C1320,149,1380,171,1410,181.3L1440,192L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z" />
    </symbol>
    <symbol id="four" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="white" d="M0,192L120,192C240,192,480,192,720,165.3C960,139,1200,85,1320,58.7L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
    </symbol>
    <symbol id="five" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="white" d="M0,32L120,69.3C240,107,480,181,720,192C960,203,1200,149,1320,122.7L1440,96L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
    </symbol>
    <symbol id="six" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="rgba(255, 255, 255, .8)" d="M0,32L120,64C240,96,480,160,720,160C960,160,1200,96,1320,64L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z" />
    </symbol>
    <symbol id="seven" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path fill="#f0f3f5" d="M0,96L1440,320L1440,320L0,320Z" />
    </symbol>
  </svg>
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
                        Des milliers de freelances disponibles pour réaliser votre transition écologique
                      </h2>
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
                                    Villes
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
    <section class="job-category-area bg-light-600 -mt-9 shadow-inner relative">
      <div class="container" data-aos="fade-down">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                Recherchez votre freelance idéal à travers les 10 catégories de métiers 100% <span class="text-green-500">GREEN</span>
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
      <svg class="absolute w-full origin-center rotate-180">
        <use xlink:href="#seven" />
      </svg>
    </section>
    <!--== End Job Category Area Wrapper ==-->

    <!--== Start Work Process Freelance Area Wrapper ==-->
    <section class="work-process-area relative before-content-none before:(absolute bottom-0 w-1/2 h-2px bg-green-500/70 right-25%)">
      <div class="container" data-aos="fade-down">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                Je suis un Freelance
              </h3>
              <div class="desc">
                <p>Trouvez la mission green qui correspond le mieux à votre profil !</p>
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
                      Créer votre compte
                    </h4>
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
                      Renseignez vos expériences et votre formation
                    </h4>
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
                      Téléchargez vos informations légales
                    </h4>
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
                      Votre profil est visible par les entreprises
                    </h4>
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
    <section class="work-process-area relative pb-122px">
      <span class="absolute bottom-0">
        <img class="w-120vw h-auto bg-cover mx-auto bg-top" :src="mask1">
      </span>
      <div class="container" data-aos="fade-down">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                Nous sommes une entreprise
              </h3>
              <div class="desc">
                <p><b>Entreprises : Simplifiez votre sourcing, pérennisez vos freelances !</b></p>
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
                      Créer votre compte
                    </h4>
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
                      Renseignez les informations de votre recherche
                    </h4>
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
                      Recherchez le profil freelance idéal pour votre projet, ou bien confiez-nous la mission
                    </h4>
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
                      Débutez la mission !
                    </h4>
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
    <!--== Start Advantages Green Area Wrapper ==-->
    <section class="work-process-area bg-[#04a74e] text-light-50">
      <div class="container" data-aos="fade-down">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title text-light-100">
                Quels sont les avantages de passer par Green Positiv ?
              </h3>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <p class="justify-self-auto desc text-size-22px bold">
              1 - Première plateforme de Freelancers 100% GreenNotre équipe met un point d’honneur à vérifier chaque profil pour qu’ils soient en adéquation avec votre projet de transition écologique !<br>
              2 - Une facturation 100% transparente Obtenez rapidement un devis de la part de nos talentueux freelance. 0 frais caché ! <br>
              3  -  Restez  informé  des  obligations  d’entreprise  en  matière  de  transition  écologique  avec  notre blog régulièrement mis à jour. <br>
              4 - Green Positiv est la première plateforme à vous proposer non seulement des freelances, mais également   des   entreprises   offrant   des   solutions   innovantes   pour   réaliser   votre   transition écologique.
            </p>
          </div>
        </div>
      </div>
      <svg class="absolute w-full origin-center rotate-180">
        <use xlink:href="#one" />
      </svg>
    </section>
    <!--== End Advantages Green Area Wrapper ==-->
    <!--== Start NewsLetter Area Wrapper ==-->
    <!--==
    <section class="sec-overlay sec-overlay-theme bg-img" data-bg-img="../assets/img/photos/bg1.jpg">
      <div class="container pt--0 pb--0">
        <div class="row justify-content-center divider-style1">
          <div class="col-lg-10 col-xl-7">
            <div class="divider-content text-center">
              <h4 class="sub-title" data-aos="fade-down">
                NewsLetter
              </h4>
              <h2 class="title" data-aos="fade-down">
                N’oubliez pas de vous inscrire à notre newsletter si vous souhaitez recevoir des informations par rapport à la transition écologique des entreprises.
              </h2>
              <div class="divider-btn-group">
                <a class="header-action-area" href="#footer">
                  <span class="btn-registration">
                    Abonnez vous
                  </span>
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
    </section>==-->
    <!--== EndNewsLetter Wrapper ==-->

    <!--== Start Divider Area Wrapper ==-->
    <!--==
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
    </section>==-->
    <!--== End Divider Area Wrapper ==-->

    <!--== Start Testimonial Area Wrapper ==-->
    <!--==
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
                </div>
                <div class="swiper-slide">
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
                </div>
                <div class="swiper-slide">
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
                </div>
                <div class="swiper-slide">
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
                </div>
                <div class="swiper-slide">
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
                </div>
              </div>
              <div class="swiper-pagination" />
            </div>
          </div>
        </div>
      </div>
    </section> ==-->
    <!--== End Testimonial Area Wrapper ==-->

    <!--== Start Blog Area Wrapper ==-->
    <section class="blog-area blog-home-area">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="section-title text-center">
              <h3 class="title">
                L'actualité <span class="text-green-500">Green</span>
              </h3>
              <div class="desc">
                <h2>Retrouvez dans notre Blog toute l'actualité de la transition écologique des entreprises.</h2>
              </div>
            </div>
          </div>
        </div>
        <div class="row align-items-center post-home-style row-gutter-40">
          <div class="col-md-6 col-lg-4" data-aos="fade-right">
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
          </div>
          <div class="col-md-6 col-lg-4" data-aos="fade-left">
            <div class="post-item">
              <div class="thumb mb--0">
                <a :href="`/blog/${posts[1]._id}`">
                  <img :src="posts[1].image" alt="Image" width="370" max-height="440">
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-4" data-aos="fade-left">
            <div class="post-home-list-style">
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
