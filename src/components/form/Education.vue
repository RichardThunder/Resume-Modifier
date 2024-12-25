<script setup>
import { ref } from 'vue';
import { store } from '../../store.js';

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

// 初始化显示状态
initializeVisibility();
</script>

<template>
  <div>
    <h2 class="section-title">🎓 Education</h2>
    <!-- 遍历 store.education 数组 -->
    <div v-for="(education, index) in store.education" :key="index" class="educationComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Education #{{ index + 1 }}</span>
        <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
      </h3>
      <!-- 动态显示/隐藏 -->
      <div v-if="visibleIndexes[index]" class="form-container">
        <div class="form-row">
          <div class="form-group">
            <label>Institution Name</label>
            <input type="text" v-model="education.institutionName" placeholder="Institution Name" />
          </div>
          <div class="form-group">
            <label>Field of Study</label>
            <input type="text" v-model="education.fieldOfStudy" placeholder="Field of Study" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Degree</label>
            <input type="text" v-model="education.degree" placeholder="Degree" />
          </div>
          <div class="form-group">
            <label>Grade</label>
            <input type="text" v-model="education.grade" placeholder="Grade or Classification" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input type="text" v-model="education.city" placeholder="City" />
          </div>
          <div class="form-group">
            <label>Country</label>
            <input type="text" v-model="education.country" placeholder="Country" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>From Date</label>
            <input type="date" v-model="education.fromDate" />
          </div>
          <div class="form-group">
            <label>To Date</label>
            <input type="date" v-model="education.toDate" :disabled="education.isPresent" />
          </div>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="education.isPresent" /> Currently Studying Here
          </label>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea
              v-model="education.description"
              placeholder="Describe your education details, achievements, or notable projects"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* 容器样式 */
.educationComponent {
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

/* 表单行布局 */
.form-row {
  display: flex;
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

.form-group input,
textarea {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  width: 100%;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group input:focus,
textarea:focus {
  outline: none;
  border-color: #007BFF;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>