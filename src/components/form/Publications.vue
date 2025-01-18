<script setup>
import {ref, watch} from 'vue';
import {analysis, model} from '../../model.js';
import {scoreToColors} from '../../methods.js';
// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  while (visibleIndexes.value.length < model.publications.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  if (visibleIndexes.value.length > model.publications.length) {
    visibleIndexes.value.splice(model.publications.length);
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

<template>
    <div class="block-header">
      <h2 class="section-title">📚 Publications</h2>
      <button @click="addPublication" class="add-button">Add</button>
    </div>
    <div v-for="(publication, index) in model.publications" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Publication #{{ index + 1 }}</span>
        <div class="block-utils">
          <v-tooltip v-if="analysis?.publications[index]"
                     :text="analysis?.publications[index].comment"
                     location="bottom"
                     max-width="500px"
                     close-delay="200"
          >
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.publications[index]?.score" :color="scoreToColors(analysis.publications[index]?.score)">
                  <template v-slot:default> <span class="score">{{analysis.publications[index]?.score}}</span></template>
                </v-progress-circular>
              </span>
            </template>
          </v-tooltip>
          <img class="delete-block" src="../../assets/block-delete.svg" @click="deletePublication(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </h3>
      <!-- 表单内容 -->
      <div v-if="visibleIndexes[index]" class="form-container">
        <div class="form-row">
        <div class="form-group">
          <label>Publication Title</label>
          <input type="text" v-model="publication.name" placeholder="Title of the Publication"/>
        </div>
        <div class="form-group">
          <label>Publisher</label>
          <input type="text" v-model="publication.publisher" placeholder="Publisher of the Publication"/>
        </div>
        </div>
        <div class="form-group">
          <label>URL</label>
          <input type="url" v-model="publication.url" placeholder="Publication URL"/>
        </div>
        <div class="form-group">
          <label>Date of Publication</label>
          <input type="date" v-model="publication.date"/>
        </div>
      </div>
    </div>
</template>

<style scoped>

</style>