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
  while (visibleIndexes.value.length < store.references.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  if (visibleIndexes.value.length > store.references.length) {
    visibleIndexes.value.splice(store.references.length);
  }}
watch(
    () => store.references,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addReference() {
  store.references.push({
    company: '',
    personName: '',
    roleOfPerson: '',
    email: '',
    phoneNumber: '',
    description: ''
  });
  visibleIndexes.value.push(true);
}
function deleteReferences(index) {
  store.references.splice(index, 1); // 从 store.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}
</script>

<template>

    <div class="block-header">
      <h2 class="section-title">🔗 References</h2>
      <button @click="addReference" class="add-button">Add</button>
    </div>
    <!-- 遍历 store.education 数组 -->
    <div v-for="(reference, index) in store.references" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Education #{{ index + 1 }}</span>
        <div class="block-utils">
          <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteReferences(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </h3>
      <!-- 表单内容 -->
      <div v-if="visibleIndexes[index]" class="form-container">
        <div class="form-group">
          <label>Company Name</label>
          <input type="text" v-model="reference.company" placeholder="Company providing the reference"/>
        </div>
        <div class="form-group">
          <label>Person's Name</label>
          <input type="text" v-model="reference.personName" placeholder="Name of the reference person"/>
        </div>
        <div class="form-group">
          <label>Role of Person</label>
          <input type="text" v-model="reference.roleOfPerson" placeholder="Role of the reference person"/>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="reference.email" placeholder="Contact email"/>
        </div>
        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" v-model="reference.phoneNumber" placeholder="Contact phone number"/>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea
              v-model="reference.description"
              placeholder="Describe the reference and their relationship with you"
          ></textarea>
        </div>
      </div>
    </div>

</template>

<style scoped>
</style>