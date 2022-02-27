<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
import { currentUser, isAuthenticated, token } from '~/stores'

const router = useRouter()
const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <!--== Start Header Wrapper ==-->
  <header class="header-area transparent">
    <div class="container">
      <div class="row no-gutter align-items-center position-relative">
        <div class="col-12">
          <div class="header-align">
            <div class="header-align-start">
              <div class="header-logo-area">
                <a href="javascript:;" @click="router.push('/')">
                  <img class="logo-main" src="../assets/img/logo-light.png" alt="Logo">
                  <img class="logo-light" src="../assets/img/logo-light.png" alt="Logo">
                </a>
              </div>
            </div>
            <div class="header-align-center">
              <div class="header-navigation-area position-relative">
                <ul class="main-menu nav">
                  <li><a href="javascript:;" @click="router.push('/')"><span>Offres et tarifs</span></a></li>
                  <li><a href="javascript:;" @click="router.push('/')"><span>Entreprise</span></a></li>
                  <li class="has-submenu">
                    <a href="#/"><span>Ressources</span></a>
                    <ul class="submenu-nav">
                      <li><a href="job.html"><span>Freelance</span></a></li>
                      <li><a href="job-details.html"><span>Agence</span></a></li>
                      <li><a href="job-details.html"><span>Entreprise</span></a></li>
                    </ul>
                  </li>
                  <li><a href="javascript:;" @click="router.push('/blog')"><span>Blog</span></a></li>
                  <li><a href="employers-details.html"><span>À propos</span></a></li>
                  <li v-if="!isAuthenticated">
                    <router-link to="/auth/registration" class="header-action-area">
                      <span class="btn-registration">Je suis freelance</span>
                    </router-link>
                  </li>
                  <li v-if="!isAuthenticated">
                    <a href="javascript:;" class="header-action-area" @click="router.push({path: '/auth/registration', query:{agence: 'true'}})">
                      <span class="btn-registration">Je suis une entreprise</span>
                    </a>
                  </li>
                  <li v-if="!isAuthenticated">
                    <router-link class="nav-link" to="/auth">
                      <span>Se Connecter</span>
                    </router-link>
                  </li>
                  <li v-if="isAuthenticated" class="header-align has-submenu">
                    <router-link class="nav-link" to="#">
                      <span>Mon espace</span>
                    </router-link>
                    <ul class="submenu-nav">
                      <li>
                        <router-link class="nav-link" :to="`/profile/${currentUser?.username}`">
                          <span>Modifier mon profil</span>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="nav-link" to="#">
                          <span>Mes missions</span>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="nav-link" to="#">
                          <span>Créer un devis </span>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="nav-link" :to="`/profile-entreprise/${currentUser?.username}`">
                          <span>Paramètre de mon entreprise</span>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="nav-link" to="#">
                          <span>Paramètre de compte</span>
                        </router-link>
                      </li>
                      <li class="nav-item">
                        <router-link class="nav-link" to="#" @click="() => token = null">
                          <span>Déconnexion</span>
                        </router-link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <div class="header-align-end">
              <div class="header-action-area">
                <button class="btn-menu !flex md:!hidden items-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#AsideOffcanvasMenu" aria-controls="AsideOffcanvasMenu">
                  <span class="i-mdi-light-menu inline-block text-xl mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <!--== End Header Wrapper ==-->
</template>
