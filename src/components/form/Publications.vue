<script setup>
import {ref, watch} from 'vue';
import {store} from '../../store.js';
// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  while (visibleIndexes.value.length < store.publications.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  if (visibleIndexes.value.length > store.publications.length) {
    visibleIndexes.value.splice(store.publications.length);
  }
}
watch(
    () => store.publications,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addPublication() {
  store.publications.push({
    name: '',
    publisher: '',
    url: '',
    date: ''
  });
  visibleIndexes.value.push(true);
}
function deletePublication(index) {
  store.publications.splice(index, 1); // 从 store.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}
</script>

<template>
    <div class="block-header">
      <h2 class="section-title">📚 Publications</h2>
      <button @click="addPublication" class="add-button">Add</button>
    </div>
    <div v-for="(publication, index) in store.publications" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Publication #{{ index + 1 }}</span>
        <div class="block-utils">
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