<script setup>
import {model} from '../../model.js';
import {ref} from 'vue';
// 创建一个响应式变量来绑定输入框的值
const newSkill = ref('');

// 添加技能方法
function addSkill() {
  if (newSkill.value.trim() === '')
    return;
  model.skills.push(newSkill.value.trim());
  newSkill.value = ''; // 清空输入框

}

// 删除技能方法
function removeSkill(index) {
  model.skills.splice(index, 1); // 根据索引删除技能
}
</script>

<template>
  <div class="block-header">
    <h2 class="section-tittle">
      🛠️ Skills
    </h2>
  </div>
  <!-- 表单内容 -->
  <div class="blockComponent">
    <div class="form-container">
      <div class="skills-list">

        <div v-for="(skill, index) in model.skills" :key="index" class="form-row">
          <span class="skill-item">{{ skill }}</span>
          <button @click="removeSkill(index)" class="add-button" style="margin-left:auto;margin-top:auto;margin-bottom:auto;height: 40px">Remove️</button>
        </div>
      </div>
      <div class="add-skill-row">
        <input v-model="newSkill" placeholder="Enter a skill"/>
        <button @click="addSkill" class="add-button">Add</button>
      </div>
    </div>
  </div>
</template>
<style scoped>

/* 添加技能输入框样式 */
.add-skill-row {
  display: flex;
  gap: 10px;
}

.add-skill-row input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.add-skill-row input:focus {
  outline: none;
  border-color: #007BFF;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}


/* 技能列表样式 */
.skills-list {
  list-style: none;
  padding: 0;
}

.skill-item {
  display: flex;
  gap: 5px;
  padding: 8px;
  margin-bottom: 5px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.skill-item .remove-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.skill-item .remove-button:hover {
  background-color: #a71d2a;
}
</style>