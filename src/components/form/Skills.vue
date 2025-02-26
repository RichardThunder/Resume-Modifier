<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2 class="section-title">🛠️ Skills</h2>
    </div>
    <!-- 表单内容 -->
    <div class="card border-none">
      <div >
        <div class="skills-list">
          <div v-for="(skill, index) in model.skills" :key="index" class="skill-item">  <!-- 使用 skill-item class -->
            <span class="badge skill-badge me-1">  <!-- 使用 skill-badge class -->
              {{ skill }}
              <span class="remove-badge" @click="removeSkill(index)"><i class="bi bi-trash"></i></span>
            </span>
          </div>
        </div>

        <div class="add-skill-row d-flex justify-content-between align-items-center mb-2">
          <input v-model="newSkill" placeholder="Enter a skill" class="form-control me-2"/>
          <button @click="addSkill" class="btn btn-sm btn-custom ">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { model } from '@/model.js';
import { ref } from 'vue';

const newSkill = ref('');

function addSkill() {
  if (newSkill.value.trim() === '')
    return;
  model.skills.push(newSkill.value.trim());
  newSkill.value = '';
}

function removeSkill(index) {
  model.skills.splice(index, 1);
}
</script>

<style scoped>
.skills-list {
  display: flex; /* 使 skill-item 横向排列 */
  flex-wrap: wrap; /* 允许自动换行 */
}

.skill-item {
  display: inline-block; /* skill-item 横向排列 */
  margin-right: 5px;
  margin-bottom: 5px; /* 如果技能太多换行， 添加一点底边距 */
}

.skill-badge {
  background-color: #0072cd;  /* 设置背景颜色 */
  color: white; /* 设置文字颜色，使其在深色背景上更清晰 */
  position: relative;
  display: inline-flex; /* 为了让 remove-badge 和文字在同一行显示 */
  align-items: center; /* 垂直居中 */
  padding: 4px 0 4px 4px; /* 调整 badge 的 padding 使其更美观 */
  border-radius: 0.375rem; /* 根据 Bootstrap 的标准，设置圆角 */
}

.add-skill-row {
  display: flex;
  align-items: center;
}

.add-skill-row input {
  margin-right: 10px;
}

.remove-badge {
  /* 修改 remove-badge 的样式 */
  position: relative; /* 从 absolute 改为 relative，使其在 badge 内部定位 */
  top: auto;      /* 移除 top */
  right: auto;    /* 移除 right */
  margin-left: 5px; /* 调整 X 的位置，使其位于文字后方 */
  width: auto;      /* 宽度自适应内容 */
  height: auto;     /* 高度自适应内容 */

  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  padding: 0 5px;
}

.remove-badge:hover {
  background-color:  #357ab5 /* Hover 时更深的红色 */
}

.btn-custom {
  background-color: #4a95ce;
  color: white;
  border: none;
}

.btn-custom:hover {
  background-color: #357ab5;
}

.btn-custom:focus {
  box-shadow: 0 0 0 0.2rem rgba(74, 149, 206, 0.5);
}
</style>