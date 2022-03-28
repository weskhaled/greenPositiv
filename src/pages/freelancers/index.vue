<script setup lang="ts">
import { message } from 'ant-design-vue'
import { currentUser } from '~/stores'
import freelancerApi from '~/api/modules/freelancer'
import companyApi from '~/api/modules/company'
import bookMark from '~/assets/img/icons/bookmark1.png'
import bookMarkHover from '~/assets/img/icons/bookmark2.png'

const freelancers = ref([])
const getFormData = async() => {
  await freelancerApi.getAllVisibleAndValidated().then(({ data }) => {
    if (data.value) {
      console.log('data ', data.value)
      freelancers.value = data.value
    }
    else {
      message.error('aucun freelance disponible')
    }
  })
}
const addFavoris = async(id: string) => {
  await companyApi.addFavoris(id).then(async({ data }) => {
    message.success(data.message)
  }).catch((err) => {
    message.error(err.message)
  })
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
                Freelancers
              </h2>
              <nav class="breadcrumb-area">
                <ul class="breadcrumb justify-content-center">
                  <li><a href="index.html">Acceuil</a></li>
                  <li class="breadcrumb-sep">
                    //
                  </li>
                  <li>Freelancers</li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--== End Page Header Area Wrapper ==-->
    <section class="blog-area blog-right-sidebar-area">
      <div class="container">
        <div class="row justify-content-between">
          <div class="col-xl-2">
            <div class="blog-sidebar blog-sidebar-right">
              <div class="widget-item">
                <div class="widget-body">
                  <div class="widget-search-box">
                    <form action="#" method="post">
                      <div class="form-input-item">
                        <input id="search2" type="search" placeholder="Search here">
                        <button type="submit" class="btn-src">
                          <i class="icofont-search" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="widget-item">
                <div class="widget-title">
                  <h3 class="title">
                    Post Category
                  </h3>
                </div>
                <div class="widget-body">
                  <div class="widget-categories">
                    <ul>
                      <li><a href="job.html">Commercial Movers<span>(16)</span></a></li>
                      <li><a href="job.html">Air Freight Services<span>(03)</span></a></li>
                      <li><a href="job.html">Drone Services<span>(08)</span></a></li>
                      <li><a href="job.html">Road Freight<span>(18)</span></a></li>
                      <li><a href="job.html">Warehousing<span>(02)</span></a></li>
                      <li><a href="job.html">Consulting Storage<span>(14)</span></a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="widget-item">
                <div class="widget-title">
                  <h3 class="title">
                    Recent Post
                  </h3>
                </div>
                <div class="widget-body">
                  <div class="widget-post">
                    <div class="widget-blog-post">
                      <div class="thumb">
                        <a href="blog-details.html"><img src="assets/img/blog/s1.jpg" alt="Image" width="71" height="70"></a>
                      </div>
                      <div class="content">
                        <h4><a href="blog-details.html">This includes shipment <br>of raw materials.</a></h4>
                        <div class="meta">
                          <span class="post-date"><i class="icofont-ui-calendar" /> 10 August, 2021</span>
                        </div>
                      </div>
                    </div>
                    <div class="widget-blog-post">
                      <div class="thumb">
                        <a href="blog-details.html"><img src="assets/img/blog/s2.jpg" alt="Image" width="71" height="70"></a>
                      </div>
                      <div class="content">
                        <h4><a href="blog-details.html">All of these amazing <br>features come price.</a></h4>
                        <div class="meta">
                          <span class="post-date"><i class="icofont-ui-calendar" /> 18 August, 2021</span>
                        </div>
                      </div>
                    </div>
                    <div class="widget-blog-post">
                      <div class="thumb">
                        <a href="blog-details.html"><img src="assets/img/blog/s3.jpg" alt="Image" width="71" height="70"></a>
                      </div>
                      <div class="content">
                        <h4><a href="blog-details.html">This includes shipment <br>of raw materials.</a></h4>
                        <div class="meta">
                          <span class="post-date"><i class="icofont-ui-calendar" /> 19 August, 2021</span>
                        </div>
                      </div>
                    </div>
                    <div class="widget-blog-post">
                      <div class="thumb">
                        <a href="blog-details.html"><img src="assets/img/blog/s4.jpg" alt="Image" width="71" height="70"></a>
                      </div>
                      <div class="content">
                        <h4><a href="blog-details.html">All of these amazing <br>features come price.</a></h4>
                        <div class="meta">
                          <span class="post-date"><i class="icofont-ui-calendar" /> 10 August, 2021</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="widget-item mb-md-0">
                <div class="widget-title">
                  <h3 class="title">
                    Popular Tags
                  </h3>
                </div>
                <div class="widget-body">
                  <div class="widget-tags">
                    <ul>
                      <li><a href="job.html">Animal</a></li>
                      <li><a class="tags-padding mr-0" href="job.html">Bird’s</a></li>
                      <li><a class="tags-padding" href="job.html">Charity</a></li>
                      <li><a class="mr-0" href="job.html">Forest</a></li>
                      <li><a href="job.html">Water</a></li>
                      <li><a class="tags-padding mr-0" href="job.html">Children</a></li>
                      <li><a class="tags-padding" href="job.html">Human</a></li>
                      <li><a href="job.html">Jungle</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-10">
            <a-skeleton v-if="!freelancers" avatar active :paragraph="{ rows: 15 }" />

            <div class="row row-gutter-70">
              <div class="row">
                <div v-for="item in freelancers" class="col-sm-6 col-md-6 col-lg-4 col-xl-3">
                  <!--== Start Team Item ==-->
                  <div class="team-item">
                    <div class="thumb">
                      <a-avatar
                        :src="item?.image"
                        shape="square"
                        :size="{ xs: 160, sm: 160, md: 160, lg: 160, xl: 160, xxl: 160 }"
                      />
                    </div>
                    <div class="content">
                      <h4 class="title">
                        <routrer-link :to="`/profile/${item._id}`">
                          {{ item.firstName }} {{ item.lastName }}
                        </routrer-link>
                      </h4>
                      <h5 class="sub-title">
                        {{ item.title_profile }}
                      </h5>
                      <div v-if="item.skills.length == 0">
                        compétences pas encore ajoutée
                        <br>
                        <br>
                      </div>
                      <div v-else>
                        <v-row>
                          <v-col v-for="skill in item.skills">
                            <a-tag color="green">
                              {{ skill }}
                            </a-tag>
                          </v-col>
                        </v-row>
                        <br>
                        <br>
                      </div>
                      <router-link class="btn-theme btn-white btn-sm" :to="`/freelancers/${item._id}`">
                        Voir profile
                      </router-link>

                      <div v-if="currentUser.role == 'Company'" class="bookmark-icon">
                        <img :src="bookMark" alt="Image-HasTech">
                      </div>
                      <div v-if="currentUser.role == 'Company'" class="bookmark-icon-hover">
                        <img :src="bookMarkHover" alt="Image-HasTech" @click="addFavoris(item._id)">
                      </div>
                    </div>
                    <!--== End Team Item ==-->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style lang="css">
@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1800px;
  }
}
</style>
<route lang="yaml">
meta:
  layout: home
</route>
