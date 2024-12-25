<script setup>
import { ref } from 'vue';

// 定义参考人的响应式数据
const reference = ref({
  company: '',
  personName: '',
  roleOfPerson: '',
  email: '',
  phoneNumber: '',
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
  <div class="referencesComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>🔗 References</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-group">
        <label>Company Name</label>
        <input type="text" v-model="reference.company" placeholder="Company providing the reference" />
      </div>
      <div class="form-group">
        <label>Person's Name</label>
        <input type="text" v-model="reference.personName" placeholder="Name of the reference person" />
      </div>
      <div class="form-group">
        <label>Role of Person</label>
        <input type="text" v-model="reference.roleOfPerson" placeholder="Role of the reference person" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="reference.email" placeholder="Contact email" />
      </div>
      <div class="form-group">
        <label>Phone Number</label>
        <input type="tel" v-model="reference.phoneNumber" placeholder="Contact phone number" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="reference.description"
            placeholder="Describe the reference and their relationship with you"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器样式 */
.referencesComponent {
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