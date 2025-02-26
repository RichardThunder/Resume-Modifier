<script setup>
import { ref } from 'vue';
import { analysis, model } from '@/model.js';
import { scoreToColors } from '@/methods.js';

const isVisible = ref(true);
const sectionType = ref('userInfo');
function toggleShow() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div class="card mb-3 mx-auto w-90">
    <div class="card-header d-flex justify-content-between align-items-center" @click="toggleShow"
         style="cursor: pointer;">
      <span>ℹ️ Personal Information</span>
      <div>
        <v-tooltip v-if="analysis.overallAnalysis?.score" :text="analysis.overallAnalysis?.comment"
                   location="bottom" max-width="500px" close-delay="200">
          <template v-slot:activator="{ props }">
                        <span v-bind="props">
                            <v-progress-circular :size="30" :width="5"
                                                 :model-value="analysis.overallAnalysis?.score"
                                                 :color="scoreToColors(analysis.overallAnalysis?.score)">
                                <template v-slot:default> <span class="score">{{ analysis.overallAnalysis?.score
                                  }}</span></template>
                            </v-progress-circular>
                        </span>
          </template>
        </v-tooltip>
        <span class="ml-1">{{ isVisible ? '▲' : '▼' }}</span>
      </div>
    </div>
    <transition name="slide">
    <div v-if="isVisible" class="card-body">
      <div class="row mb-0">
        <div class="col-md-6">
          <div class="mb-0">
            <label class="form-label">First Name</label>
            <input type="text" class="form-control" v-model="model.userInfo.firstName"
                   placeholder="First Name" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-0">
            <label class="form-label">Last Name</label>
            <input type="text" class="form-control" v-model="model.userInfo.lastName"
                   placeholder="Last Name" />
          </div>
        </div>
      </div>
      <div class="row mb-0">
        <div class="col-md-12">
          <div class="mb-0">
            <label class="form-label">HeadLine</label>
            <input type="text" class="form-control" v-model="model.userInfo.headLine"
                   placeholder="job title or role" />
          </div>
        </div>
      </div>
      <div class="row mb-0">
        <div class="col-md-6">
          <div class="mb-0">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-control" v-model="model.userInfo.phoneNumber"
                   placeholder="Phone Number" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-0">
            <label class="form-label">Email</label>
            <input type="text" class="form-control" v-model="model.userInfo.email" placeholder="Email" />
          </div>
        </div>
      </div>
      <div class="row mb-0">
        <div class="col-md-6">
          <div class="mb-0">
            <label class="form-label">City</label>
            <input type="text" class="form-control" v-model="model.userInfo.city" placeholder="City" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-0">
            <label class="form-label">Country</label>
            <input type="text" class="form-control" v-model="model.userInfo.country"
                   placeholder="Country" />
          </div>
        </div>
      </div>
      <div class="row mb-0">
        <div class="col-md-6">
          <div class="mb-0">
            <label class="form-label">LinkedIn URL</label>
            <input type="text" class="form-control" v-model="model.userInfo.linkedInURL"
                   placeholder="LinkedIn URL" />
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-0">
            <label class="form-label">Other Profile URL</label>
            <input type="text" class="form-control"
                   v-model="model.userInfo.websiteOrOtherProfileURL" placeholder="Other Profile URL" />
          </div>
        </div>
      </div>
    </div>
      </transition>
  </div>
</template>

<style scoped>
/* Existing styles - you might need to adjust some of these */
.score {
  color: black;
  font-size: 14px;
}

</style>