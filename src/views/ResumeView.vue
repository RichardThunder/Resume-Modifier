<!-- src/views/ResumeView.vue -->
<template>
  <div class="container-fluid vh-100 p-0">
    <div class="row h-100 g-0" style="padding-top: 64px;">
      <!-- Toggle Button -->
      <button
          class="btn btn-light toggle-button"
          @click="toggleForm"
          :class="{ 'button-collapsed': !showForm }"
      >
        <i class="bi" :class="showForm ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
      </button>
      <!-- Personal Form Section -->
      <div
          class="col-lg-5 col-md-5 border-end shadow-sm overflow-auto h-100 bg-white form-section"
          :class="{ 'd-none': !showForm  }"
      >
        <div class="p-4">
          <PersonalForm/>
        </div>
      </div>

      <!-- Resume Preview Section -->
      <div
          class="overflow-auto h-100 bg-white"
          :class="[showForm && !isSmallScreen ? 'col-lg-7 col-md-7' : 'col-12']"
      >
        <div class="p-3">
          <ResumePreview/>
        </div>
      </div>
    </div>
    Use code with caution.
  </div>
</template>
<script setup>
import PersonalForm from '@/components/PersonalForm.vue';
import ResumePreview from '@/components/ResumePreview.vue';
import { ref, computed,onMounted,watch } from 'vue';
import {model,modelExample }from '@/model';
import {reAssign} from "@/methods.js";
import ResumeSaver from "@/utils/ResumeSaver.js";


const showForm = ref(true);
const isSmallScreen = ref(window.innerWidth < 768); // Adjust breakpoint as needed (Bootstrap's sm is 768px)


const toggleForm = () => {
  if (isSmallScreen.value) {
    showForm.value = true; // Force showForm to true on small screens
  } else {
    showForm.value = !showForm.value; // Toggle normally on larger screens
  }
};

onMounted(() => {
  ResumeSaver.loadResume();
  if(ResumeSaver.isStorageEmpty()){
    reAssign(model,modelExample);
  }else{
    reAssign(model,ResumeSaver.getResumeData());
  }
});

// Watch for changes in the 'model' and save to localStorage
watch(
    model,
    (newModel) => {
      ResumeSaver.setResumeData(newModel)// Update ResumeSaver's data
      ResumeSaver.saveResume(newModel); // Save to localStorage
    },
    { deep: true } // Watch nested properties within the model
);

/*// 在组件挂载时绑定事件
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('resize', handleResize);
});

// 在组件卸载时移除事件
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('resize', handleResize);
});

// 处理关闭或刷新页面时的提示
const handleBeforeUnload = (event) => {
  event.preventDefault();
  event.returnValue = '';
};*/

// 监听屏幕尺寸变化
const handleResize = () => {
  isSmallScreen.value = window.innerWidth < 768; // Adjust breakpoint as needed
};


const toggleButtonLeft = computed(() => {
  if (isSmallScreen.value) {
    return 0; // Always at left on small screens
  } else {
    return showForm.value ? '41.66%' : '0';
  }
});

</script>
<style scoped>
/* 切换按钮样式 */
.toggle-button {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  width: 20px;
  height: 48px;
  padding: 0;
  border-radius: 0 4px 4px 0;
  border: 1px solid #dee2e6;
  border-left: none;
  background-color: #4a95ce;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  min-width: 20px;
  color:white;
}

.button-collapsed {
  left: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 过渡动画 */
.form-section {
  transition: all 0.3s ease;
}
</style>