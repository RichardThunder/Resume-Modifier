<template>
  <div class="editor-panel">
    <person-info />
    <resume-summary/>
    <education />
    <work-experience />
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
import PersonInfo from './form/PersonInfo.vue';
import ResumeSummary from './form/Summary.vue';
import WorkExperience from './form/WorkExperience.vue';
import Education from './form/Education.vue';
import Skills from './form/Skills.vue';
import Achievements from './form/Achievements.vue';
import Projects from './form/Project.vue';
import Awards from './form/Awards.vue';
import Certification from './form/Certification.vue';
import Publications from './form/Publications.vue';
import Volunteering from './form/Volunteering.vue';
import References from './form/References.vue';


</script>

<style>
/* 调整 Quill 编辑器的高度 */
.ql-editor {
  min-height: 150px;
}
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

.AI-writer{
  background-color: var(--button-primary-color);
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: center;
  gap: 5px;
  max-width: 100px;
  margin: 5px 5px 5px 5px;
  transition: background-color 0.3s ease;
}
.align-right{
  margin-left: auto;
}
.AI-writer:hover{
  opacity: 0.9;
}
.AI-writer:active{
  transform: scale(0.98);
}

.AI-writer.loading {
  background-color: gray;  /* Set background to gray while loading */
  pointer-events: none;    /* Disable clicking while loading */
}

.spinner {
  border: 3px solid #f3f3f3;  /* Light gray border */
  border-top: 3px solid #3498db;  /* Blue color for spinner */
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 2s linear infinite; /* Spin animation */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal window */
.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
}
</style>