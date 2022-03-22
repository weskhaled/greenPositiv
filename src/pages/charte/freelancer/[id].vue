<script setup lang="ts">
import { message } from 'ant-design-vue'
import freelancerApi from '~/api/modules/freelancer'

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
  signed_client: undefined,
})

const getFormData = async() => {
  freelancerApi.profile(props.id).then(({ data }) => {
    if (data.value)
      profile.value = data.value
    const freelancer = profile.value?.freelancer
    formStateCharte.role = freelancer.role
    formStateCharte.signed_client = freelancer.signed_client
  })
}
const updateProfile = async(profileData: any) => {
  const { data } = await freelancerApi.updateProfile(profileData)
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
                Charte Freelance
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Acceuil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Charte Freelance</li>
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
                <section class="freelancer-charter">
                  <div class="freelancer-charter-desc">
                    <div class="freelancer-charter-title title-underline">
                      <h3>La charte du freelance Green Positiv</h3>
                    </div>
                    <div class="freelancer-charter-text">
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
                <section class="freelancer-charter">
                  <div class="freelancer-charter-image">
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
            <div class="freelancer-charter-rules">
              <section class="freelancer-charter-rule">
                <img class="logo-main" :src="engineer" alt="engineer">
                <div class="freelancer-charter-rule-desc">
                  <h3 class="freelancer-charter-rule-title">
                    1.
                  </h3>
                  <div class="freelancer-charter-rule-body">
                    Lorsque vous acceptez une mission, vous vous engagez à la
                    mener jusqu'au bout. Nous faisons en sorte que vous ayez le maximum de chances de pouvoir travailler
                    avec une entreprise, nous attendons de vous un engagement certain.
                  </div>
                </div>
              </section>
              <section class="freelancer-charter-rule">
                <img class="logo-main" :src="loyalty" alt="loyalty">
                <div class="freelancer-charter-rule-desc">
                  <h3 class="freelancer-charter-rule-title">
                    2.
                  </h3>
                  <div class="freelancer-charter-rule-body">
                    Adoptez toujours un comportement professionnel, peu
                    importe la situation. Si vous rencontrez un problème avec votre client, n'hésitez pas à contacter
                    les équipes de Green'Positiv, nous trouverons une solution !
                  </div>
                </div>
              </section>
              <section class="freelancer-charter-rule">
                <img class="logo-main" :src="promotion" alt="promotion">
                <div class="freelancer-charter-rule-desc">
                  <h3 class="freelancer-charter-rule-title">
                    3.
                  </h3>
                  <div class="freelancer-charter-rule-body">
                    Vous avez un empêchement majeur ? ça arrive ! N'oubliez
                    pas de nous avertir et surtout d'avertir votre client. N'hésitez pas à communiquer régulièrement, et
                    à tenir au courant votre client des empêchements que vous pourriez avoir.
                  </div>
                </div>
              </section>
              <section class="freelancer-charter-rule">
                <img class="logo-main" :src="seedling" alt="seedling">

                <div class="freelancer-charter-rule-desc">
                  <h3 class="freelancer-charter-rule-title">
                    4.
                  </h3>
                  <div class="freelancer-charter-rule-body">
                    Soyez honnête dans votre présentation, et dans le détail
                    de vos expériences. Il y aura certainement un client qui saura vous apprécier à votre juste valeur !
                  </div>
                </div>
              </section>
              <section class="freelancer-charter-rule">
                <img class="logo-main" :src="outsourcing" alt="outsourcing">
                <div class="freelancer-charter-rule-desc">
                  <h3 class="freelancer-charter-rule-title">
                    5.
                  </h3>
                  <div class="freelancer-charter-rule-body">
                    La plateforme Green-Positiv n'accepte pas la
                    sous-traitance. Si vous vous engagez à réaliser une mission, vous ne pouvez pas l'affecter à une
                    autre personne ou à une entreprise.
                  </div>
                </div>
              </section>
              <section class="freelancer-charter-rule">
                <img class="logo-main" :src="leaf" alt="leaf" width="50px">
                <div class="freelancer-charter-rule-desc">
                  <h3 class="freelancer-charter-rule-title">
                    6.
                  </h3>
                  <div class="freelancer-charter-rule-body">
                    Vous vous engagez à ne passer que par la plateforme
                    Green'Positiv pour la réalisation de vos missions. Nous mettons toutes les actions en place pour
                    vous permettre de trouver une clientèle. Nous attendons donc des freelances une transparence
                    complète. Plus vous réaliserez de missions sur notre plateforme, plus vous gagnerez en visibilité.
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div class="col-lg-1 col-xl-2" />
        </div>
        <br>
        <div v-if="formStateCharte.role === 'Freelancer'">
          <button
            v-if="!formStateCharte.signed_client" class="btn-theme center m-2"
            @click="updateProfile({ signed_client: true })"
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
.freelancer-charter {
  margin: 50px auto 150px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.freelancer-charter.freelancer-charter-desc .freelancer-charter-title {
  font-size: 48px;
  margin-bottom: 40px;
  line-height: 72px;
}

.title-underline {
  position: relative;
  margin-bottom: 15px;
}

.freelancer-charter .freelancer-charter-desc .freelancer-charter-text {
  font-family: OpenSans-light, Arial, Helvetica, sans-serif;
  font-size: 22px;
  max-width: 650px;
  text-align: justify;
}

.freelancer-charter .freelancer-charter-image {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.freelancer-charter-rules {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, minmax(160px, 1fr));
  grid-gap: 100px;
  width: 100%;
  margin: 50px auto;
}

.freelancer-charter-rule .freelancer-charter-rule-icon {
  max-width: 56px;
  height: auto;
}

.freelancer-charter-rule .freelancer-charter-rule-desc .freelancer-charter-rule-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 33px;
}

.freelancer-charter-rule .freelancer-charter-rule-desc .freelancer-charter-rule-body {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: justify;
}

.freelancer-charter-rule img {
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
