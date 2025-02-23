<script setup>
import {ref} from 'vue';
import {analysis, model} from '../../model.js';
import {scoreToColors} from '../../methods.js';

const isVisible = ref(true);
//TODO:使用插槽
function toggleShow() {
  isVisible.value = !isVisible.value;
  console.log(model.userInfo);
}
</script>
<template>
  <div class="blockComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>ℹ️ Personal Information</span>
      <div>
        <v-tooltip v-if="analysis.overallAnalysis?.score"
                   :text="analysis.overallAnalysis?.comment"
                   location="bottom"
                   max-width="500px"
                   close-delay="200"
        >
          <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.overallAnalysis?.score" :color="scoreToColors(analysis.overallAnalysis?.score)">
                  <template v-slot:default> <span class="score">{{analysis.overallAnalysis?.score}}</span></template>
                </v-progress-circular>
              </span>
          </template>
        </v-tooltip>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
      </div>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-row">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" v-model="model.userInfo.firstName" placeholder="First Name"/>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" v-model="model.userInfo.lastName" placeholder="Last Name"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
        <label>HeadLine</label>
        <input type="text" v-model="model.userInfo.headLine" placeholder="job title or role"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" v-model="model.userInfo.phoneNumber" placeholder="Phone Number"/>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="text" v-model="model.userInfo.email" placeholder="Email"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City</label>
          <input type="text" v-model="model.userInfo.city" placeholder="City"/>
        </div>
        <div class="form-group">
          <label>Country</label>
          <input type="text" v-model="model.userInfo.country" placeholder="Country"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>LinkedIn URL</label>
          <input type="text" v-model="model.userInfo.linkedInURL" placeholder="LinkedIn URL"/>
        </div>
        <div class="form-group">
          <label>Other Profile URL</label>
          <input type="text" v-model="model.userInfo.websiteOrOtherProfileURL" placeholder="Other Profile URL"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>