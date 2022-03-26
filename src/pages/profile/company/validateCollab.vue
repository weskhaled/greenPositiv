<script setup lang="ts">
import companyApi from '~/api/modules/company'
import signCharter from '~/assets/img/charter/signCharter.png'

// const props = defineProps<[ id: string, idCollab: string ]>()
const formStateValidation = reactive<Record<string, any>>({
  message: '',
})
const getFormData = async() => {
  /*
 companyApi.addCollab(props.id, props.idCollab).then(({ data }) => {
    if (data.value)
      formStateValidation.message = data.value.message
  }) */
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
                Confirmation Collaborateur
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Accueil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Confirmation Collaborateur</li>
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
            <div class="col-lg-4 col-xl-3">
              <div class="team-details-item">
                <div class="candidate-details-wrap">
                  <section class="company-charter">
                    <div class="company-charter-image">
                      <img class="logo-main" :src="signCharter" alt="signCharter">
                      <h1> {{ formStateValidation.message }}</h1>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div class="col-lg-1 col-xl-2" />
          </div>
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
