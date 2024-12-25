<script setup>
import { ref } from 'vue';
import {store} from '../../store.js';
// 定义奖项的响应式数据
const award = ref({
  name: '',
  issuer: '',
  urlToAward: '',
  dateOfAward: '',
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
  <div class="awardComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>🏅 Awards</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-group">
        <label>Award Name</label>
        <input type="text" v-model="store.award.name" placeholder="Name of the Award" />
      </div>
      <div class="form-group">
        <label>Issuer</label>
        <input type="text" v-model="store.award.issuer" placeholder="Organization Issuing the Award" />
      </div>
      <div class="form-group">
        <label>URL to Award</label>
        <input type="url" v-model="store.award.urlToAward" placeholder="Award URL" />
      </div>
      <div class="form-group">
        <label>Date of Award</label>
        <input type="date" v-model="store.award.dateOfAward" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="store.award.description"
            placeholder="Describe the award and why it was given"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器样式 */
.awardComponent {
  margin: 20px auto;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box; /* 确保宽度包含边框和填充 */
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

/* 表单组样式 */
.form-group {
  display: flex;
  flex-direction: column;
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