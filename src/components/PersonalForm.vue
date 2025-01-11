//TODO: 使用富文本编辑器
<template>
  <div class="editor-panel">


    <person-info />
    <resume-summary/>
    <work-experience />
    <education />
    <skills />
    <achievements />
    <projects />
    <awards />
    <certification />
    <publications />
    <volunteering />
    <references />
  </div>
</template>

<script setup>
import PersonInfo from './form/personInfo.vue';
import ResumeSummary from './form/summary.vue';
import WorkExperience from './form/work-experience.vue';
import Education from './form/Education.vue';
import Skills from './form/Skills.vue';
import Achievements from './form/Achievements.vue';
import Projects from './form/Project.vue';
import Awards from './form/awards.vue';
import Certification from './form/certification.vue';
import Publications from './form/Publications.vue';
import Volunteering from './form/Volunteering.vue';
import References from './form/References.vue';
import {analysis, model} from '../model.js';
import Forms from './Forms.vue';
import {scoreToColors} from '../methods.js';
const titles= {
  userInfo:'ℹ️ Personal Information',
}

</script>

<style>
.editor-panel{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input-group label {
  display: block;
  margin: 10px 0 5px;
}

.input-group input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.dropdown-sections button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background-color: #dfe6e9;
  border: none;
  cursor: pointer;
}
/* 容器样式 */
.blockComponent {
  margin: 20px 20px 0 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  width: 90%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.block-header{

  display: flex;
  margin:20px 0 0 0;
  padding: 15px;
  gap:20px;

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
  justify-content: space-between;
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
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
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

.form-group input[type="checkbox"] {
  margin: 0;
}
.add-button{
  padding: 8px 12px;
  font-size: 14px;
  background-color: var(--button-secondary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.delete-block {
  width: 30px; /* 设置宽度 */
  height: 30px; /* 设置高度 */
  cursor: pointer; /* 鼠标指针变为手形 */
}

.delete-block:hover {
  transform: scale(1.1); /* 鼠标悬停时稍微放大 */
  transition: transform 0.2s ease; /* 添加平滑过渡 */
}
.block-utils{
  display: flex;
  align-items: center;
  justify-content: space-between;

}
.score{
  color: black;
}
</style>