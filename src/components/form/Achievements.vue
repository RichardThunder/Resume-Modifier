<script setup>
import { ref } from 'vue';
import {store} from '../../store.js';

// 是否显示表单
const isVisible = ref(false);

// 切换显示/隐藏状态
function toggleShow() {
  isVisible.value = !isVisible.value;
}
</script>

<template>
  <div class="blockComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>🏆 Achievements</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-group">
        <label for="achievements">Your Achievements</label>
        <textarea
            id="achievements"
            v-model="store.achievements"
            placeholder="Summarize your achievements, awards, or significant accomplishments."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>