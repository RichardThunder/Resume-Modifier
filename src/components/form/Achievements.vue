<script setup>
import {ref} from 'vue';
import {analysis, model} from '@/model.js';
import {scoreToColors} from '@/methods.js';

const sectionType = ref('achievements');
// 是否显示表单
const isVisible = ref(false);


function addAchieve() {
  model.achievements = '';
  isVisible.value = true;
}

function deleteAchieve() {
  model.achievements = null; // 从 model.workExperience 中删除指定索引的项目
  isVisible.value = false;// 同步更新 visibleIndexes 的状态
}
</script>

<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-0">
      <h2 class="section-title">🏆 Achievements</h2>
      <button @click="addAchieve" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-if="isVisible" class="card mb-3">
      <div class="card-header toggle-header d-flex justify-content-between align-items-center">
        <span>Your Achievements</span>
        <div class="block-utils d-flex align-items-center">
          <v-tooltip v-if="analysis.achievements?.score"
                     :text="analysis.achievements?.comment"
                     location="bottom"
                     max-width="500px"
                     close-delay="200"
          >
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.achievements?.score"
                                     :color="scoreToColors(analysis.achievements?.score)">
                  <template v-slot:default> <span class="score">{{ analysis.achievements?.score }}</span></template>
                </v-progress-circular>
              </span>
            </template>
          </v-tooltip>
          <img class="delete-block ms-2" alt="delete" src="../../assets/block-delete.svg" @click="deleteAchieve">
        </div>
      </div>
      <div class="card-body">
      <textarea
          id="achievements"
          v-model="model.achievements"
          placeholder="Summarize your achievements, awards, or significant accomplishments."
          class="form-control form-control-sm">
      </textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>

.btn-custom {
  background-color: #4a95ce;
  color: white;
  border: none;
}

.btn-custom:hover {
  background-color: #357ab5;
}

.btn-custom:focus {
  box-shadow: 0 0 0 0.2rem rgba(74, 149, 206, 0.5);
}

</style>