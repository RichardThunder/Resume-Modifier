<script setup>
import { ref } from 'vue';

// 定义志愿活动的响应式数据
const volunteering = ref({
  name: '',
  role: '',
  city: '',
  country: '',
  fromDate: '',
  toDate: '',
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
  <div class="volunteeringComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>🌟 Volunteering</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-group">
        <label>Volunteer Organization/Event</label>
        <input type="text" v-model="volunteering.name" placeholder="Name of the Organization/Event" />
      </div>
      <div class="form-group">
        <label>Your Role</label>
        <input type="text" v-model="volunteering.role" placeholder="Your Role in Volunteering" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City</label>
          <input type="text" v-model="volunteering.city" placeholder="City" />
        </div>
        <div class="form-group">
          <label>Country</label>
          <input type="text" v-model="volunteering.country" placeholder="Country" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>From Date</label>
          <input type="date" v-model="volunteering.fromDate" />
        </div>
        <div class="form-group">
          <label>To Date</label>
          <input type="date" v-model="volunteering.toDate" />
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="volunteering.description"
            placeholder="Describe the volunteering work, responsibilities, and achievements"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器样式 */
.volunteeringComponent {
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