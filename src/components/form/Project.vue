<script setup>
import {ref, watch} from 'vue';
import {store} from '../../store.js';

const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  visibleIndexes.value = store.project.map(() => false); // 初始化每个教育条目为隐藏状态
}
watch(
    () => store.project,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();
// 定义项目经历的响应式数据
function addProject(){
  store.project.push({
    title: '',
    projectRole: '',
    city: '',
    country: '',
    fromDate: '',
    toDate: '',
    isPresent:'',
    description: '',
  })
  visibleIndexes.value.push(true);
}

</script>

<template>
  <div class="block-header">
    <h2 class="section-title">📁 Projects</h2>
    <button @click="addProject" class="add-button">Add</button>
  </div>
  <div v-for="(project, index) in store.project" :key="index" class="blockComponent">
    <h3 @click="toggleShow(index)" class="toggle-header">
      <span>Project #{{ index + 1 }}</span>
      <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
    </h3>
    <div v-if="visibleIndexes[index]" class="form-container">
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" v-model="project.title" placeholder="Project Title" />
      </div>
      <div class="form-group">
        <label>Role in Project</label>
        <input
            type="text"
            v-model="project.projectRole"
            placeholder="Your Role in the Project"
        />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City</label>
          <input type="text" v-model="project.city" placeholder="City" />
        </div>
        <div class="form-group">
          <label>Country</label>
          <input type="text" v-model="project.country" placeholder="Country" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>From Date</label>
          <input type="date" v-model="project.fromDate" />
        </div>
        <div class="form-group">
          <label>To Date</label>
          <input type="date" v-model="project.toDate" :disabled="project.isPresent" />
        </div>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="project.isPresent" /> Currently Working on
          this Project
        </label>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="project.description"
            placeholder="Describe the project, responsibilities, and achievements"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>