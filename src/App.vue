<template>
  <div id="app">
    <!-- 头部 -->
    <Header/>
    <div class="container">
      <div class="personalForm">
      <PersonalForm />
      </div>

      <!-- 右侧预览 -->
      <div class="resume-preview">
        <ResumePreview />
      </div>
    </div>
  </div>

</template>

<script setup>
import PersonalForm from './components/PersonalForm.vue';
import ResumePreview from './components/ResumePreview.vue';
import Header from './components/Header.vue';
import {store} from './store.js';
</script>

<style>
.container {
  display: flex;
  height: 100vh;
  flex-direction: row;
  padding: 64px 0;
  overflow-y: auto; /* 启用垂直滚动 */

}
.personalForm{
  padding:20px;
  overflow-y:  auto;
  max-height: 100%;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.resume-preview {
  flex: 2;
  padding: 10px;
  background-color: white;
  overflow-y: auto;
  box-shadow: -1px 0 5px rgba(0, 0, 0, 0.1);
}
</style>