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
  store.workExperience.map(() => {
    visibleIndexes.value.push(false);
  })
}
watch(
    () => store.workExperience,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();


// 添加新项目的函数
function addExperience() {
  store.workExperience.push({
    companyName: '',
    jobTitle: '',
    city: '',
    country: '',
    fromDate: '',
    toDate: '',
    isPresent: '',
    description: ''
  });
  visibleIndexes.value.push(true);
}
</script>

<template>
  <div>
    <div class="block-header">
      <h2 class="section-title">💼 Work Experience</h2>
      <button @click="addExperience" class="add-button">Add</button>
    </div>
    <!-- 遍历 store.workExperience 数组 -->
    <div v-for="(experience, index) in store.workExperience" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Work Experience #{{ index + 1 }}</span>
        <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
      </h3>
      <!-- 动态显示/隐藏 -->
      <div v-if="visibleIndexes[index]" class="form-container">
        <div class="form-row">
          <div class="form-group">
            <label>Company Name</label>
            <input type="text" v-model="store.workExperience[index].companyName" placeholder="Company Name"/>
          </div>
          <div class="form-group">
            <label>Job Title</label>
            <input type="text" v-model="store.workExperience[index].jobTitle" placeholder="Job Title"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input type="text" v-model="store.workExperience[index].city" placeholder="City"/>
          </div>
          <div class="form-group">
            <label>Country</label>
            <input type="text" v-model="store.workExperience[index].country" placeholder="Country"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>From Date</label>
            <input type="date" v-model="store.workExperience[index].fromDate"/>
          </div>
          <div class="form-group">
            <label>To Date</label>
            <input type="date" v-model="store.workExperience[index].toDate"
                   :disabled="store.workExperience[index].isPresent"/>
          </div>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="store.workExperience[index].isPresent"/> Currently Working Here
          </label>
        </div>
        <div class="form-group">
          <label>Job Description</label>
          <textarea v-model="store.workExperience[index].description"
                    placeholder="Describe your responsibilities and achievements"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* 容器样式 */

</style>