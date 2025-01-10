<script setup>
import { ref } from 'vue';
import {model} from '../../model.js';

// 是否显示表单
const isVisible = ref(false);

// 切换显示/隐藏状态
function toggleShow() {
  isVisible.value = !isVisible.value;
}
function addAchieve(){
  model.achievements=' ';
  isVisible.value=true;
}
function deleteAchieve() {
  model.achievements=''; // 从 model.workExperience 中删除指定索引的项目
  isVisible.value=false;// 同步更新 visibleIndexes 的状态
}
</script>

<template>
  <div class="block-header">
    <h2 class="section-title">🏆 Achievements</h2>
    <button @click="addAchieve" class="add-button">Add</button>
  </div>
  <div v-if="isVisible" class="blockComponent">
    <div  class="form-container">
      <div class="form-group">
        <div class="block-utils">
        <label for="achievements">Your Achievements</label>
        <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteAchieve">
      </div>
        <textarea
            id="achievements"
            v-model="model.achievements"
            placeholder="Summarize your achievements, awards, or significant accomplishments."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>