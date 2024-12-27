<script setup>
import {ref} from 'vue';
import {store} from '../../store.js';

const isVisible = ref(true);

function toggleShow() {
  isVisible.value = !isVisible.value;
  console.log(store.userInfo);
}
</script>

<template>
  <div class="blockComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>ℹ️ Personal Information</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-row">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" v-model="store.userInfo.firstName" placeholder="First Name"/>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" v-model="store.userInfo.lastName" placeholder="Last Name"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
        <label>HeadLine</label>
        <input type="text" v-model="store.userInfo.headLine" placeholder="job title or role"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Phone Number</label>
          <input type="text" v-model="store.userInfo.phoneNumber" placeholder="Phone Number"/>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="text" v-model="store.userInfo.email" placeholder="Email"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City</label>
          <input type="text" v-model="store.userInfo.city" placeholder="City"/>
        </div>
        <div class="form-group">
          <label>Country</label>
          <input type="text" v-model="store.userInfo.country" placeholder="Country"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>LinkedIn URL</label>
          <input type="text" v-model="store.userInfo.linkedInURL" placeholder="LinkedIn URL"/>
        </div>
        <div class="form-group">
          <label>Other Profile URL</label>
          <input type="text" v-model="store.userInfo.websiteOrOtherProfileURL" placeholder="Other Profile URL"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>