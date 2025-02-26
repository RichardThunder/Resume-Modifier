<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="section-title">🔗 References</h2>
      <button @click="addReference" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-for="(reference, index) in model.references" :key="index" class="card mb-1">
      <div class="card-header d-flex justify-content-between align-items-center p-2"
           @click="toggleShow(index)" style="cursor: pointer;">
        <span>Reference #{{ index + 1 }}</span>
        <div class="d-flex align-items-center">
          <v-tooltip v-if="analysis.references[index]?.score"
                     :text="analysis.references[index]?.comment"
                     location="bottom"
                     max-width="500px"
                     close-delay="200"
          >
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="35" :width="4"
                                     :model-value="analysis.references[index]?.score"
                                     :color="scoreToColors(analysis.references[index]?.score)">
                  <template v-slot:default>
                    <span class="score">{{ analysis.references[index]?.score }}</span>
                  </template>
                </v-progress-circular>
              </span>
            </template>
          </v-tooltip>
          <img class="delete-block ms-1" src="../../assets/block-delete.svg" alt="delete"
               @click="deleteReferences(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </div>

      <div v-if="visibleIndexes[index]" class="card-body p-2">
        <div class="mb-0">
          <label class="form-label">Company Name</label>
          <input type="text" class="form-control form-control-sm" v-model="reference.company"
                 placeholder="Company providing the reference"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Person's Name</label>
          <input type="text" class="form-control form-control-sm" v-model="reference.personName"
                 placeholder="Name of the reference person"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Role of Person</label>
          <input type="text" class="form-control form-control-sm" v-model="reference.roleOfPerson"
                 placeholder="Role of the reference person"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Email</label>
          <input type="email" class="form-control form-control-sm" v-model="reference.email"
                 placeholder="Contact email"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Phone Number</label>
          <input type="tel" class="form-control form-control-sm" v-model="reference.phoneNumber"
                 placeholder="Contact phone number"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Description</label>
          <textarea class="form-control form-control-sm" v-model="reference.description"
                    placeholder="Describe the reference and their relationship with you"></textarea>
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
const sectionType = ref('references');

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  if (model.references?.length > 0) {
    while (visibleIndexes.value.length < model.references.length) {
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    if (visibleIndexes.value.length > model.references.length) {
      visibleIndexes.value.splice(model.references.length);
    }
  }
}

watch(
    () => model.references,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addReference() {
  model.references.push({
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
  model.references.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
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