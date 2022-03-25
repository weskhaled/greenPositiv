<script setup lang="ts">
import { message } from 'ant-design-vue'
import companyApi from '~/api/modules/company'

import signCharter from '~/assets/img/charter/signCharter.png'
import engineer from '~/assets/img/charter/engineer.png'
import loyalty from '~/assets/img/charter/loyalty.png'
import promotion from '~/assets/img/charter/promotion.png'
import seedling from '~/assets/img/charter/seedling.png'
import outsourcing from '~/assets/img/charter/outsourcing.png'
import leaf from '~/assets/img/charter/leaf.png'

const props = defineProps<{ id: string }>()
const profile = ref(null)
const formStateCharte = reactive<Record<string, any>>({
  role: '',
  signed_company: undefined,
})

const getFormData = async() => {
  companyApi.profile(props.id).then(({ data }) => {
    if (data.value)
      profile.value = data.value
    const company = profile.value?.company
    formStateCharte.role = company.role
    formStateCharte.signed_company = company.signed_company
  })
}
const updateProfile = async(profileData: any) => {
  const { data } = await companyApi.updateProfile(profileData)
  data && message.info(data.message)
  profile.value = null
  getFormData()
}
onMounted(async() => {
  getFormData()
})
</script>
<template>
  <main class="main-content">
    <!--== Start Page Header Area Wrapper ==-->
    <div class="page-header-area sec-overlay sec-overlay-black" data-bg-img="../assets/img/photos/bg2.jpg">
      <div class="container pt--0 pb--0">
        <div class="row">
          <div class="col-12">
            <div class="page-header-content">
              <h2 class="title">
                Charte Entreprise
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Accueil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Charte Entreprise</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Page Header Area Wrapper ==-->

    <!--== Start Contact Area Wrapper ==-->
    <section class="contact-area contact-page-area">
      <div class="container">
        <div class="row contact-page-wrapper">
          <div class="col-lg-1 col-xl-2" />
          <div class="col-lg-6 col-xl-5">
            <div class="team-details-item">
              <div class="candidate-details-wrap">
                <section class="company-charter">
                  <div class="company-charter-desc">
                    <div class="company-charter-title title-underline">
                      <h3>La charte des entreprises Green Positiv</h3>
                    </div>
                    <div class="company-charter-text">
                      Lorem ipsum dolor sit amet. Aut cupiditate natus cum ducimus quam qui minima nihil non illo
                      voluptatem aut fuga perspiciatis sed neque labore non ratione dolorem. Et maiores numquam ad quasi
                      quasi et autem illum ut aspernatur quaerat et ullam sint qui impedit dolore et maiores cumque.
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-xl-3">
            <div class="team-details-item">
              <div class="candidate-details-wrap">
                <section class="company-charter">
                  <div class="company-charter-image">
                    <img class="logo-main" :src="signCharter" alt="signCharter">
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div class="col-lg-1 col-xl-2" />
        </div>
        <div class="row contact-page-wrapper">
          <div class="col-lg-1 col-xl-2" />
          <div class="col-lg-10 col-xl-8">
            <div class="company-charter-rules">
              <section class="company-charter-rule">
                <img class="logo-main" :src="engineer" alt="engineer">
                <div class="company-charter-rule-desc">
                  <h3 class="company-charter-rule-title">
                    1.
                  </h3>
                  <div class="company-charter-rule-body">
                    L'Entreprise s’engage à accéder et utiliser la Plateforme GREEN POSITIV et les services conformément aux lois en vigueur et aux présentes Conditions Générales.
                  </div>
                </div>
              </section>
              <section class="company-charter-rule">
                <img class="logo-main" :src="loyalty" alt="loyalty">
                <div class="company-charter-rule-desc">
                  <h3 class="company-charter-rule-title">
                    2.
                  </h3>
                  <div class="company-charter-rule-body">
                    L'Entreprise s’engage à réaliser toutes les déclarations et formalités nécessaires à son activité, ainsi qu’à satisfaire à toutes ses obligations légales, sociales, administratives et fiscales et à toutes les obligations spécifiques qui lui incombe le cas échéant en application du droit français et/ou de la législation étrangère dont il dépend.
                  </div>
                </div>
              </section>
              <section class="company-charter-rule">
                <img class="logo-main" :src="promotion" alt="promotion">
                <div class="company-charter-rule-desc">
                  <h3 class="company-charter-rule-title">
                    3.
                  </h3>
                  <div class="company-charter-rule-body">
                    L'Entreprise s’engage à faire une utilisation correcte de la plateforme GREEN POSITIV, notamment à ne pas contourner la plateforme GREEN POSITIV et ses Services. L'Entreprise s’engage notamment à ne pas contractualiser une mission en dehors de la plateforme GREEN POSITIV.
                  </div>
                </div>
              </section>
              <section class="company-charter-rule">
                <img class="logo-main" :src="seedling" alt="seedling">

                <div class="company-charter-rule-desc">
                  <h3 class="company-charter-rule-title">
                    4.
                  </h3>
                  <div class="company-charter-rule-body">
                    L'Entreprise s’engage à proposer une offre de mission sérieuse et suffisamment détaillée au(x) Freelance(s) avec le(s)quel(s) elle rentre en contact par le biais de la plateforme GREEN POSITIV en vue d’obtenir un devis.
                  </div>
                </div>
              </section>
              <section class="company-charter-rule">
                <img class="logo-main" :src="outsourcing" alt="outsourcing">
                <div class="company-charter-rule-desc">
                  <h3 class="company-charter-rule-title">
                    5.
                  </h3>
                  <div class="company-charter-rule-body">
                    L'Entreprise  s’interdit notamment de partager avec tout tiers, que ce soit en privé ou sur les réseaux sociaux, tout échange, information ou extrait de conversation provenant de la messagerie de la plateforme GREEN POSITIV.
                  </div>
                </div>
              </section>
              <section class="company-charter-rule">
                <img class="logo-main" :src="leaf" alt="leaf" width="50px">
                <div class="company-charter-rule-desc">
                  <h3 class="company-charter-rule-title">
                    6.
                  </h3>
                  <div class="company-charter-rule-body">
                    L'Entreprise accepte que la Société GREEN POSITIV puisse intervenir pour modérer les contenus publiés, s’ils ne respectent pas les lois et règlements en vigueur.
                  </div>
                </div>
              </section>
              <section class="company-charter-rule">
                <img class="logo-main" :src="leaf" alt="leaf" width="50px">
                <div class="company-charter-rule-desc">
                  <h3 class="company-charter-rule-title">
                    7.
                  </h3>
                  <div class="company-charter-rule-body">
                    L'Entreprise ne pourra pas utiliser les services de la plateforme GREEN POSITIV pour faire la promotion de son activité ou de celle d’un tiers. A ce titre, l'Entreprise s’engage notamment à ne pas envoyer de message publicitaire aux utilisateurs de la plateforme GREEN POSITIV ou à les démarcher.
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div class="col-lg-1 col-xl-2" />
        </div>
        <br>
        <div v-if="formStateCharte.role === 'Company'">
          <button
            v-if="!formStateCharte.signed_company" class="btn-theme center m-2"
            @click="updateProfile({ signed_company: true })"
          >
            Signez notre charte
          </button>
          <button v-else disabled class="btn-theme center m-2">
            Charte signé <i class="icofont-check" />
          </button>
        </div>
      </div>
    </section>
    <!--== End Contact Area Wrapper ==-->
  </main>
</template>
<style lang="css">
.company-charter {
  margin: 50px auto 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.company-charter.company-charter-desc .company-charter-title {
  font-size: 48px;
  margin-bottom: 40px;
  line-height: 72px;
}

.title-underline {
  position: relative;
  margin-bottom: 15px;
}

.company-charter .company-charter-desc .company-charter-text {
  font-family: OpenSans-light, Arial, Helvetica, sans-serif;
  font-size: 22px;
  max-width: 650px;
  text-align: justify;
}

.company-charter .company-charter-image {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.company-charter-rules {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, minmax(160px, 1fr));
  grid-gap: 100px;
  width: 100%;
  margin: 50px auto;
}

.company-charter-rule .company-charter-rule-icon {
  max-width: 56px;
  height: auto;
}

.company-charter-rule .company-charter-rule-desc .company-charter-rule-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 33px;
}

.company-charter-rule .company-charter-rule-desc .company-charter-rule-body {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: justify;
}

.company-charter-rule img {
  width: 50px !important;
}
.center {
  display: block !important;
  margin-left: auto !important;
  margin-right: auto !important;
  width: 40%;
}
</style>
<route lang="yaml">
meta:
  layout: home
</route>
