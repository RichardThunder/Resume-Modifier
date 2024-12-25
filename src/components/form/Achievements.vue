<script setup>
import { ref } from 'vue';

// 定义成就的响应式数据
const achievements = ref('');

// 是否显示表单
const isVisible = ref(false);

// 切换显示/隐藏状态
function toggleShow() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div class="achievementsComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>🏆 Achievements</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-group">
        <label for="achievements">Your Achievements</label>
        <textarea
            id="achievements"
            v-model="achievements"
            placeholder="Summarize your achievements, awards, or significant accomplishments."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器样式 */
.achievementsComponent {
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

.form-group textarea {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  resize: vertical;
  min-height: 100px;
}

.form-group textarea:focus {
  outline: none;
  border-color: #007BFF;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>