<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="section-title">📚 Publications</h2>
      <button @click="addPublication" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-for="(publication, index) in model.publications" :key="index" class="card mb-1">
      <div class="card-header d-flex justify-content-between align-items-center p-2"
           @click="toggleShow(index)" style="cursor: pointer;">
        <span>Publication #{{ index + 1 }}</span>
        <div class="d-flex align-items-center">
          <v-tooltip v-if="analysis.publications[index]?.score"
                     :text="analysis.publications[index]?.comment"
                     location="bottom"
                     max-width="500px"
                     close-delay="200"
          >
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="35" :width="4"
                                     :model-value="analysis.publications[index]?.score"
                                     :color="scoreToColors(analysis.publications[index]?.score)">
                  <template v-slot:default>
                    <span class="score">{{ analysis.publications[index]?.score }}</span>
                  </template>
                </v-progress-circular>
              </span>
            </template>
          </v-tooltip>
          <img class="delete-block ms-1" src="../../assets/block-delete.svg" alt="delete"
               @click="deletePublication(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </div>

      <div v-if="visibleIndexes[index]" class="card-body p-2">
        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Publication Title</label>
              <input type="text" class="form-control form-control-sm" v-model="publication.name"
                     placeholder="Title of the Publication"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Publisher</label>
              <input type="text" class="form-control form-control-sm" v-model="publication.publisher"
                     placeholder="Publisher of the Publication"/>
            </div>
          </div>
        </div>
        <div class="mb-0">
          <label class="form-label">URL</label>
          <input type="url" class="form-control form-control-sm" v-model="publication.url"
                 placeholder="Publication URL"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Date of Publication</label>
          <input type="date" class="form-control form-control-sm" v-model="publication.date"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { analysis, model } from '@/model.js';
import { scoreToColors } from '@/methods.js';

// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);
const sectionType = ref('publications');

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  if (model.publications?.length > 0) {
    while (visibleIndexes.value.length < model.publications.length) {
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    if (visibleIndexes.value.length > model.publications.length) {
      visibleIndexes.value.splice(model.publications.length);
    }
  }
}

watch(
    () => model.publications,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addPublication() {
  model.publications.push({
    name: '',
    publisher: '',
    url: '',
    date: ''
  });
  visibleIndexes.value.push(true);
}

function deletePublication(index) {
  model.publications.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

</script>

<style scoped>
.section-title {
  margin-bottom: 0;
}

.delete-block {
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.delete-block:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

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