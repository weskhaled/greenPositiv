<script setup lang="ts">
import { message } from 'ant-design-vue'
import { isDark, toggleDark } from '~/composables'
import logo from '~/assets/img/Green_positive.png'
import adminApi from '~/api/modules/admin'

const { t, availableLocales, locale } = useI18n()
const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
const { y } = useWindowScroll()
const scrollTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}
const email = ref('')

const addSubscription = () => {
  adminApi.addSubscription(email.value).then(({ data }) => {
    if (data && data.value.message === 'Abonnement créé avec succés')
      message.success(data.value.message)
    else message.warning(data.value.message)
  })
}
</script>

<template>
  <!--== Start Footer Area Wrapper ==-->
  <footer id="footer" class="footer-area">
    <!--== Start Footer Top ==-->
    <div class="footer-top">
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-lg-7">
            <div class="footer-newsletter-content">
              <h6 class="title">
                N’oubliez pas de vous inscrire à notre newsletter si vous souhaitez recevoir des informations par rapport à la transition écologique des entreprises.
              </h6>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="footer-newsletter-form">
              <form>
                <input v-model="email" type="email" placeholder="Saisir votre email">
                <button type="submit" @click.prevent="addSubscription()">
                  Abonnez vous
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Footer Top ==-->

    <!--== Start Footer Main ==-->
    <div class="footer-main">
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-md-6 col-lg-3">
            <div class="widget-item widget-about">
              <div class="widget-logo-area">
                <a href="index.html">
                  <img class="logo-main" :src="logo" alt="Logo">
                </a>
              </div>
              <p
                class="desc"
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </p>
              <div class="social-icons">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  class="!flex items-center"
                  rel="noopener"
                >
                  <span
                    class="i-fa-brands-facebook-f icofont-facebook inline-block mx-auto text-xl"
                  />
                </a>
                <a
                  href="https://www.isntagram.com"
                  target="_blank"
                  class="!flex items-center"
                  rel="noopener"
                >
                  <span
                    class="i-fa-brands-instagram icofont-facebook inline-block mx-auto text-xl"
                  />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  class="!flex items-center"
                  rel="noopener"
                >
                  <span
                    class="i-fa-brands-linkedin-in icofont-facebook inline-block mx-auto text-xl"
                  />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  class="!flex items-center"
                  rel="noopener"
                >
                  <span class="i-fa-brands-twitter icofont-facebook inline-block mx-auto text-xl" />
                </a>
              </div>
            </div>
          </div>
          <div class="col-lg-9">
            <div class="row">
              <div class="col-md-3 col-lg-3">
                <div class="widget-item nav-menu-item1">
                  <h4 class="widget-title">
                    Green-positiv
                  </h4>
                  <h4
                    class="widget-collapsed-title collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#widgetId-1"
                  >
                    Company
                  </h4>
                  <div id="widgetId-1" class="collapse widget-collapse-body">
                    <div class="collapse-body">
                      <div class="widget-menu-wrap">
                        <ul class="nav-menu">
                          <li>
                            <router-link class="nav-link" to="#">
                              <span>Offres et tarifs</span>
                            </router-link>
                          </li>
                          <li>
                            <router-link class="nav-link" to="#">
                              <span>Entreprise</span>
                            </router-link>
                          </li>
                          <li>
                            <router-link class="nav-link" to="/blog">
                              <span>Blog</span>
                            </router-link>
                          </li>
                          <li>
                            <router-link class="nav-link" to="#">
                              <span>À propos</span>
                            </router-link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-lg-3">
                <div class="widget-item nav-menu-item2">
                  <h4 class="widget-title">
                    Ressource
                  </h4>
                  <h4
                    class="widget-collapsed-title collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#widgetId-2"
                  >
                    Resources
                  </h4>
                  <div id="widgetId-2" class="collapse widget-collapse-body">
                    <div class="collapse-body">
                      <div class="widget-menu-wrap">
                        <ul class="nav-menu">
                          <li>
                            <router-link class="nav-link" to="#">
                              <span>Freelance</span>
                            </router-link>
                          </li>
                          <li>
                            <router-link class="nav-link" to="#">
                              <span>Agence</span>
                            </router-link>
                          </li>
                          <li>
                            <router-link class="nav-link" to="#">
                              <span>Entreprise</span>
                            </router-link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-lg-3">
                <div class="widget-item nav-menu-item3">
                  <h4 class="widget-title">
                    Legal
                  </h4>
                  <h4
                    class="widget-collapsed-title collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#widgetId-3"
                  >
                    Legal
                  </h4>
                  <div id="widgetId-3" class="collapse widget-collapse-body">
                    <div class="collapse-body">
                      <div class="widget-menu-wrap">
                        <ul class="nav-menu">
                          <li>
                            <router-link class="nav-link" to="#">
                              Charte Green Positiv Freelance
                            </router-link>
                          </li>
                          <li>
                            <router-link class="nav-link" to="#">
                              Charte Green Positiv Agence
                            </router-link>
                          </li>
                          <li>
                            <router-link class="nav-link" to="#">
                              Charte Green Positiv Entreprise
                            </router-link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-lg-3">
                <div class="widget-item nav-menu-item4">
                  <h4 class="widget-title">
                    Inscription
                  </h4>
                  <h4
                    class="widget-collapsed-title collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#widgetId-4"
                  >
                    Inscriptions
                  </h4>
                  <div id="widgetId-4" class="collapse widget-collapse-body">
                    <div class="collapse-body">
                      <div class="widget-menu-wrap">
                        <ul class="nav-menu">
                          <li>
                            <router-link class="nav-link" to="/login">
                              <span>Se Connecter</span>
                            </router-link>
                          </li>
                          <li>
                            <router-link to="/register">
                              <span class="btn-registration">Je suis freelance</span>
                            </router-link>
                          </li>
                          <li>
                            <router-link to="/register">
                              <span class="btn-registration">Je suis une entreprise</span>
                            </router-link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Footer Main ==-->

    <!--== Start Footer Bottom ==-->
    <div class="footer-bottom">
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-12">
            <div class="footer-bottom-content">
              <p class="copyright">
                © 2021 Finate. Made with
                <i class="icofont-heart" /> by
                <a target="_blank" href="https://themeforest.net/user/codecarnival">Codecarnival.</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Footer Bottom ==-->
  </footer>
  <!--== End Footer Area Wrapper ==-->

  <!--== Scroll Top Button ==-->
  <div id="scroll-to-top" class="scroll-to-top" :class="y > 200 && 'show'" @click="scrollTop()">
    <span class="i-mdi-light-arrow-up inline-block mx-auto text-2xl icofont-rounded-up mt-1" />
  </div>
</template>
