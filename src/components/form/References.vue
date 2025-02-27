<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import { analysis, model } from '@/model.js';
import { scoreToColors } from '@/methods.js';

// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);
const sectionType = ref('references');
const draggingIndex = ref(null);
const skillsListRef = ref(null);
const isDragOver = ref(null);
const showDragHint = ref(false);

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
  showDragHint.value = true;
  setTimeout(() => {
    showDragHint.value = false;
  }, 3000);
}

function deleteReferences(index) {
  model.references.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

// Drag and Drop Functions
function dragStart(index) {
  draggingIndex.value = index;
}

function dragEnter(index) {
  if (index === draggingIndex.value) return;

  const element = skillsListRef.value.children[index];
  if (element) {
    element.classList.add('drag-over');
  }
}

function dragLeave(index) {
  const element = skillsListRef.value.children[index];
  if (element) {
    element.classList.remove('drag-over');
  }
}

function dragOver(event) {
  event.preventDefault();
}

function drop(index) {
  if (index === draggingIndex.value) return;

  const element = skillsListRef.value.children[index];
  if (element) {
    element.classList.remove('drag-over');
  }

  const draggedItem = model.references[draggingIndex.value];
  model.references.splice(draggingIndex.value, 1);
  model.references.splice(index, 0, draggedItem);

  const draggedVisibility = visibleIndexes.value[draggingIndex.value];
  visibleIndexes.value.splice(draggingIndex.value, 1);
  visibleIndexes.value.splice(index, 0, draggedVisibility);

  draggingIndex.value = null;
}

onMounted(() => {
  const list = skillsListRef.value;

  list.addEventListener('dragstart', (event) => {
    if (event.target.classList.contains('card-header')) {
      event.dataTransfer.effectAllowed = 'move';
    }
  });

  list.addEventListener('dragover', (event) => {
    event.preventDefault();
  });
});

const data = reactive({
  feedback: '',
  section: '',
  loading: false,
});
</script>

<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="section-title">🔗 References</h2>
      <button @click="addReference" class="btn btn-sm btn-custom me-4">Add</button>
    </div>
    <div v-if="showDragHint" class="alert alert-success pt-2">
      <strong>Drag</strong> and <strong>drop</strong> to reorder education entries.
    </div>
    <div class="education-list" ref="skillsListRef">
      <div
          v-for="(reference, index) in model.references"
          :key="index"
          class="card mb-1"
      >
        <div
            class="card-header d-flex justify-content-between align-items-center p-2"
            @click="toggleShow(index)"
            style="cursor: pointer;"
            draggable="true"
            @dragstart="dragStart(index)"
            @dragenter.prevent="dragEnter(index)"
            @dragleave="dragLeave(index)"
            @dragover.prevent="dragOver($event)"
            @drop="drop(index)"
        >
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
        <transition name="slide">
          <div v-if="visibleIndexes[index]" class="card-body p-2">
            <div class="mb-0">
              <label class="form-label">Company Name</label>
              <input type="text" class="form-control form-control-sm" v-model="reference.company"
                     placeholder="Company providing the reference"
                     ondragstart="return false;"/>
            </div>
            <div class="mb-0">
              <label class="form-label">Person's Name</label>
              <input type="text" class="form-control form-control-sm" v-model="reference.personName"
                     placeholder="Name of the reference person"
                     ondragstart="return false;"/>
            </div>
            <div class="mb-0">
              <label class="form-label">Role of Person</label>
              <input type="text" class="form-control form-control-sm" v-model="reference.roleOfPerson"
                     placeholder="Role of the reference person"
                     ondragstart="return false;"/>
            </div>
            <div class="mb-0">
              <label class="form-label">Email</label>
              <input type="email" class="form-control form-control-sm" v-model="reference.email"
                     placeholder="Contact email"
                     ondragstart="return false;"/>
            </div>
            <div class="mb-0">
              <label class="form-label">Phone Number</label>
              <input type="tel" class="form-control form-control-sm" v-model="reference.phoneNumber"
                     placeholder="Contact phone number"
                     ondragstart="return false;"/>
            </div>
            <div class="mb-0">
              <label class="form-label">Description</label>
              <textarea class="form-control form-control-sm" v-model="reference.description"
                        placeholder="Describe the reference and their relationship with you"
                        ondragstart="return false;"
              ></textarea>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

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