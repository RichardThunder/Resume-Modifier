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
  <div class="personInfo">
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
/* 容器样式 */
.personInfo {
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  width: 600px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 标题样式 */
.toggle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

/* 表单容器 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 行样式 */
.form-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

/* 表单组样式 */
.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.form-group label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.form-group input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.form-group input:focus {
  outline: none;
  border-color: #007BFF;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>