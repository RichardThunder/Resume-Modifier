<script setup>
import {ref} from 'vue';
import {analysis, model} from '../../model.js';
import {scoreToColors} from '../../methods.js';

// 是否显示表单
const isVisible = ref(false);

// 切换显示/隐藏状态
function toggleShow() {
  isVisible.value = !isVisible.value;
}

function addAchieve() {
  model.achievements = ' ';
  isVisible.value = true;
}

function deleteAchieve() {
  model.achievements = ''; // 从 model.workExperience 中删除指定索引的项目
  isVisible.value = false;// 同步更新 visibleIndexes 的状态
}
</script>

<template>
  <div class="block-header">
    <h2 class="section-title">🏆 Achievements</h2>
    <button @click="addAchieve" class="add-button">Add</button>
  </div>
  <div v-if="isVisible" class="blockComponent">
    <h3 class="toggle-header">
      <span for="achievements">Your Achievements</span>
      <div class="block-utils">
        <v-tooltip :text="analysis.achievements.comment"
                   location="bottom"
                   max-width="500px"
                   close-delay="200"
        >
          <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.achievements.score"
                                     :color="scoreToColors(analysis.achievements.score)">
                  <template v-slot:default> <span class="score">{{ analysis.achievements.score }}</span></template>
                </v-progress-circular>
              </span>
          </template>
        </v-tooltip>
        <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteAchieve">
      </div>
    </h3>
    <textarea
        id="achievements"
        v-model="model.achievements"
        placeholder="Summarize your achievements, awards, or significant accomplishments.">
        </textarea>
  </div>
</template>

<style scoped>

</style>