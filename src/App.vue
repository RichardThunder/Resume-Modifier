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


import { onMounted, onUnmounted } from 'vue';

// 在组件挂载时绑定事件
//防止意外关闭
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

// 在组件卸载时移除事件
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// 处理关闭或刷新页面时的提示
const handleBeforeUnload = (event) => {
  event.preventDefault(); // 必须调用 preventDefault
  event.returnValue = ''; // 这会触发浏览器显示默认的提示信息
};

</script>

<style>
.container {
  display: flex;
  height: 100vh;
  flex-direction: row;
  padding: 64px 0 0 0 ;
  overflow-y: auto; /* 启用垂直滚动 */

}
.personalForm{
  flex:2;
  padding:20px;
  overflow-y:  auto;
  max-height: 100%;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}
.resume-preview {
  flex: 3;
  padding: 5px;
  background-color: white;
  overflow-y: auto;
  box-shadow: -1px 0 5px rgba(0, 0, 0, 0.1);
}
</style>