<script setup>
import { ref } from 'vue';

// 定义项目经历的响应式数据
const project = ref({
  title: '',
  projectRole: '',
  city: '',
  country: '',
  fromDate: '',
  toDate: '',
  isPresent: false,
  description: '',
});

// 是否显示表单
const isVisible = ref(false);

// 切换显示/隐藏状态
function toggleShow() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div class="projectsComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>📁 Projects</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
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
/* 容器样式 */
.projectsComponent {
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