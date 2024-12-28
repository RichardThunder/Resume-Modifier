<script setup>
import { ref } from 'vue';
import {store} from '../../store.js';


// 显示/隐藏状态
const isVisible = ref(false);

// 切换显示/隐藏
function toggleShow() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div class="blockComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>ℹ️ Summary</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-row">
        <div class="form-group">
          <label for="summary">Brief Summary</label>
          <textarea
              id="summary"
              v-model="store.summary"
              placeholder="Write a brief summary about your professional background and skills."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


</style>
