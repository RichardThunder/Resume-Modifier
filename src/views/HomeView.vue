<!-- src/views/HomeView.vue -->
<template>
  <div>
    <div class="container">
      <div class="personalForm">
        <PersonalForm/>
      </div>

      <div class="resume-preview">
        <ResumePreview/>
      </div>
    </div>
  </div>
</template>

<script setup>
import PersonalForm from '@/components/PersonalForm.vue';
import ResumePreview from '@/components/ResumePreview.vue';
import {onMounted, onUnmounted} from 'vue';

// 在组件挂载时绑定事件
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

// 在组件卸载时移除事件
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// 处理关闭或刷新页面时的提示
const handleBeforeUnload = (event) => {
  event.preventDefault();
  event.returnValue = '';
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  flex-direction: row;
  padding: 64px 0 0 0;
  overflow-y: auto;
}

.personalForm {
  flex: 2;
  padding: 20px;
  overflow-y: auto;
  max-height: 100%;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.resume-preview {
  flex: 3;
  flex-direction: column;
  padding: 5px;
  background-color: white;
  overflow-y: auto;
  box-shadow: -1px 0 5px rgba(0, 0, 0, 0.1);
}
</style>