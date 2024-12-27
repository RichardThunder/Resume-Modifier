<script setup>
import {ref, watch} from 'vue';
import {store} from '../../store.js';

// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  visibleIndexes.value = store.education.map(() => false); // 初始化每个教育条目为隐藏状态
}

watch(
    () => store.certifications,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addCertification() {
  store.certifications.push({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    url: '',
    description: ''
  });
  visibleIndexes.value.push(true);
}
</script>

<template>
  <div class="block-header">
    <h2 class="section-title">📜 Certifications</h2>
    <button @click="addCertification" class="add-button">Add</button>
  </div>
  <div v-for="(certification, index) in store.certifications" :key="index" class="blockComponent">
    <h3 @click="toggleShow(index)" class="toggle-header">
      <span>Certification #{{ index + 1 }}</span>
      <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
    </h3>
    <!-- 表单内容 -->
    <div v-if="visibleIndexes[index]" class="form-container">
      <div class="form-group">
        <label>Certification Name</label>
        <input type="text" v-model="certification.name" placeholder="Name of the Certification"/>
      </div>
      <div class="form-group">
        <label>Issuer</label>
        <input
            type="text"
            v-model="certification.issuer"
            placeholder="Organization Issuing the Certification"
        />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Certification Date</label>
          <input type="date" v-model="certification.date"/>
        </div>
        <div class="form-group">
          <label>Expiry Date</label>
          <input type="date" v-model="certification.expiryDate"/>
        </div>
      </div>
      <div class="form-group">
        <label>URL</label>
        <input type="url" v-model="certification.url" placeholder="Certification URL"/>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="certification.description"
            placeholder="Describe the certification, its importance, or related details"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>