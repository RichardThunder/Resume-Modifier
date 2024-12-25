<script setup>
import { ref } from 'vue';

// 定义出版物的响应式数据
const publication = ref({
  name: '',
  publisher: '',
  url: '',
  date: '',
});

// 是否显示表单
const isVisible = ref(false);

// 切换显示/隐藏状态
function toggleShow() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div class="publicationsComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>📚 Publications</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-group">
        <label>Publication Title</label>
        <input type="text" v-model="publication.name" placeholder="Title of the Publication" />
      </div>
      <div class="form-group">
        <label>Publisher</label>
        <input type="text" v-model="publication.publisher" placeholder="Publisher of the Publication" />
      </div>
      <div class="form-group">
        <label>URL</label>
        <input type="url" v-model="publication.url" placeholder="Publication URL" />
      </div>
      <div class="form-group">
        <label>Date of Publication</label>
        <input type="date" v-model="publication.date" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器样式 */
.publicationsComponent {
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
  box-sizing: border-box;
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

.form-group input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007BFF;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>