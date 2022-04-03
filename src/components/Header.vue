<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
import { currentUser, isAuthenticated, token } from '~/stores'

const router = useRouter()
const { t } = useI18n()

const asideOffcanvasMenu = ref(null)
const [value, toggleAsideOffcanvasMenu] = useToggle()

onClickOutside(asideOffcanvasMenu.value, () => {
  console.log(value.value)
  // value.value = false
})

</script>

<template>
  <!--== Start Header Wrapper ==-->
  <header class="header-area fixed bg-white w-full z-50">
    <div class="container">
      <div class="row no-gutter align-items-center position-relative">
        <div class="col-12">
          <div class="header-align">
            <div class="header-align-start">
              <div class="header-logo-area">
                <a href="javascript:;" @click="router.push('/')">
                  <img class="logo-main" src="../assets/img/Green_positive.png" alt="Logo">
                  <img class="logo-light" src="../assets/img/Green_positive.png" alt="Logo">
                </a>
              </div>
            </div>
            <div class="header-align-center">
              <div class="header-navigation-area position-relative">
                <ul class="main-menu nav">
                  <li><a href="javascript:;" @click="router.push('/')"><span>Offres et tarifs</span></a></li>
                  <li><a href="javascript:;" @click="router.push('/')"><span>Entreprise</span></a></li>
                  <li><a href="javascript:;" @click="router.push('/freelancers')"><span>Freelance</span></a></li>
                  <li class="has-submenu">
                    <a href="#/"><span>Ressources</span></a>
                    <ul class="submenu-nav">
                      <li>
                        <router-link class="nav-link" :to="`/charte/freelancer/${currentUser?.idUser}`">
                          <span>Freelance</span>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="nav-link" :to="`/charte/agence/${currentUser?.idUser}`">
                          <span>Solution innovante</span>
                        </router-link>
                      </li>
                      <li>
                        <router-link class="nav-link" :to="`/charte/company/${currentUser?.idUser}`">
                          <span>Entreprise</span>
                        </router-link>
                      </li>
                    </ul>
                  </li>
                  <li><a href="javascript:;" @click="router.push('/blog')"><span>Blog</span></a></li>
                  <li><a href="employers-details.html"><span>À propos</span></a></li>
                  <li v-if="!isAuthenticated">
                    <router-link to="/auth/registration" class="header-action-area">
                      <span class="btn-registration">Créer votre compte</span>
                    </router-link>
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
                      <li v-if="currentUser && currentUser.role === 'Freelancer'">
                        <router-link class="nav-link" :to="`/profile/freelancer/${currentUser?.idUser}`">
                          <span>Modifier mon profil</span>
                        </router-link>
                      </li>
                      <li v-else-if="currentUser && currentUser.role === 'Agence'">
                        <router-link class="nav-link" :to="`/profile/agence/${currentUser?.idUser}`">
                          <span>Modifier mon profil</span>
                        </router-link>
                      </li>
                      <li v-else-if="currentUser && currentUser.role === 'Company'">
                        <router-link class="nav-link" :to="`/profile/company/${currentUser?.idUser}`">
                          <span>Modifier mon profil</span>
                        </router-link>
                      </li>
                      <li v-else-if="currentUser && currentUser.role === 'Collab'">
                        <router-link class="nav-link" :to="`/profile/collaborator/${currentUser?.idUser}`">
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
                <button class="btn-menu flex lg:!hidden items-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#AsideOffcanvasMenu" aria-controls="AsideOffcanvasMenu" @click="toggleAsideOffcanvasMenu()">
                  <span class="i-mdi-light-menu inline-block text-2xl mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <!--== End Header Wrapper ==-->

  <!--== Start Aside Menu ==-->
  <aside
    ref="asideOffcanvasMenu"
    class="off-canvas-wrapper offcanvas offcanvas-start transition ease-in"
    :class="value && `show visible before:block before:absolute before:w-screen before-h-screen before:z-20 before:bg-pink-500`"
    tabindex="-1"
    aria-labelledby="offcanvasExampleLabel"
  >
    <div class="offcanvas-header">
      <h1 id="offcanvasExampleLabel" class="d-none">
        Aside Menu
      </h1>
      <button class="btn-menu-close" data-bs-dismiss="offcanvas" aria-label="Close" @click="value = false">
        menu
        <i class="i-mdi-close text-xl" />
      </button>
    </div>
    <div class="offcanvas-body">
      <!-- Mobile Menu Start -->
      <div class="mobile-menu-items">
        <ul class="nav-menu">
          <li><a href="javascript:;" @click="router.push('/')"><span>Offres et tarifs</span></a></li>
          <li><a href="javascript:;" @click="router.push('/')"><span>Entreprise</span></a></li>
          <li><a href="javascript:;" @click="router.push('/freelancers')"><span>Freelance</span></a></li>
          <li>
            <a href="#">Ressources</a>
            <ul class="sub-menu">
              <li>
                <router-link class="nav-link" :to="`/charte/freelancer/${currentUser?.idUser}`">
                  <span>Freelance</span>
                </router-link>
              </li>
              <li>
                <router-link class="nav-link" :to="`/charte/agence/${currentUser?.idUser}`">
                  <span>Solution innovante</span>
                </router-link>
              </li>
              <li>
                <router-link class="nav-link" :to="`/charte/company/${currentUser?.idUser}`">
                  <span>Entreprise</span>
                </router-link>
              </li>
            </ul>
          </li>
          <li><a href="javascript:;" @click="router.push('/blog')"><span>Blog</span></a></li>
          <li><a href="employers-details.html"><span>À propos</span></a></li>
          <li v-if="!isAuthenticated">
            <router-link to="/auth/registration">
              <span>Créer votre compte</span>
            </router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link class="nav-link" to="/auth">
              <span>Se Connecter</span>
            </router-link>
          </li>
          <li>
            <a href="#">Mon espace</a>
            <ul class="sub-menu">
              <li v-if="currentUser && currentUser.role === 'Freelancer'">
                <router-link class="nav-link" :to="`/profile/freelancer/${currentUser?.idUser}`">
                  <span>Modifier mon profil</span>
                </router-link>
              </li>
              <li v-else-if="currentUser && currentUser.role === 'Agence'">
                <router-link class="nav-link" :to="`/profile/agence/${currentUser?.idUser}`">
                  <span>Modifier mon profil</span>
                </router-link>
              </li>
              <li v-else-if="currentUser && currentUser.role === 'Company'">
                <router-link class="nav-link" :to="`/profile/company/${currentUser?.idUser}`">
                  <span>Modifier mon profil</span>
                </router-link>
              </li>
              <li v-else-if="currentUser && currentUser.role === 'Collab'">
                <router-link class="nav-link" :to="`/profile/collaborator/${currentUser?.idUser}`">
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
      <!-- Mobile Menu End -->
    </div>
  </aside>
  <!--== End Aside Menu ==-->
</template>
