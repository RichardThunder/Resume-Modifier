<script setup>
import {store} from '../../store.js';
// 添加技能方法
function addSkill() {
  if (newSkill.value.trim() !== '') {

    store.skills.push(newSkill.value.trim());
    newSkill.value = ''; // 清空输入框
  }
}

// 删除技能方法
function removeSkill(index) {
  store.value.splice(index, 1); // 根据索引删除技能
}
</script>

<template>
  <div class="skillsComponent">
    <h2 class="toggle-header">
      <span>🛠️ Skills</span>
    </h2>
    <!-- 表单内容 -->
    <div class="form-container">
      <div class="form-group">
        <label for="skill">Add a Skill</label>
        <div class="add-skill-row">
          <input
              id="skill"
              type="text"
              v-model="newSkill"
              placeholder="Enter a skill"
          />
          <button @click="addSkill" class="add-button">Add</button>
        </div>
      </div>
      <ul class="skills-list">
        <!-- 遍历 store.skills 数组，渲染多个 Skill 组件 -->
        <li v-for="(skill, index) in store.skills" :key="index" class="skill-item">
          <Skill :skill="skill" :index="index" @remove-skill="removeSkill" />
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
/* 容器样式 */
.skillsComponent {
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

.add-skill-row .add-button {
  padding: 8px 12px;
  font-size: 14px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-skill-row .add-button:hover {
  background-color: #0056b3;
}

/* 技能列表样式 */
.skills-list {
  list-style: none;
  padding: 0;
}

.skill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
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