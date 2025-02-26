<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import { analysis, model } from '@/model.js';
import { scoreToColors } from '@/methods.js';
import FeedbackForm from "@/components/FeedbackForm.vue";

const sectionType = ref('certifications');
// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);
const draggingIndex = ref(null);
const skillsListRef = ref(null);
const isDragOver = ref(null);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {

  if (model.certifications?.length > 0) {
    while (visibleIndexes.value.length < model.certifications.length) {
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    if (visibleIndexes.value.length > model.certifications.length) {
      visibleIndexes.value.splice(model.certifications.length);
    }
  }
}

watch(
    () => model.certifications,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addCertification() {
  model.certifications.push({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    url: '',
    description: ''
  });
  visibleIndexes.value.push(true);
}

function deleteCertification(index) {
  model.certifications.splice(index, 1); //
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

const isModalVisible = ref(false);
const toggleModal = () => {
  isModalVisible.value = !isModalVisible.value;
};

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

  const draggedItem = model.certifications[draggingIndex.value];
  model.certifications.splice(draggingIndex.value, 1);
  model.certifications.splice(index, 0, draggedItem);

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

</script>

<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="section-title">📜 Certifications</h2>
      <button @click="addCertification" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div class="education-list" ref="skillsListRef">
      <div
          v-for="(certification, index) in model.certifications"
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
          <span>Certification #{{ index + 1 }}</span>
          <div class="d-flex align-items-center">
            <v-tooltip v-if="analysis.certifications[index]?.score"
                       :text="analysis.certifications[index]?.comment"
                       location="bottom"
                       max-width="500px"
                       close-delay="200"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <v-progress-circular :size="35" :width="4" :model-value="analysis.certifications[index]?.score"
                                       :color="scoreToColors(analysis.certifications[index]?.score)">
                    <template v-slot:default>
                      <span class="score">{{ analysis.certifications[index]?.score }}</span>
                    </template>
                  </v-progress-circular>
                </span>
              </template>
            </v-tooltip>
            <img class="delete-block ms-1" src="../../assets/block-delete.svg" alt="delete"
                 @click="deleteCertification(index)">
            <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
          </div>
        </div>
        <transition name="slide">
          <div v-if="visibleIndexes[index]" class="card-body p-2">
            <div class="mb-0">
              <label class="form-label">Certification Name</label>
              <input type="text" class="form-control form-control-sm" v-model="certification.name"
                     placeholder="Name of the Certification"
                     ondragstart="return false;"/>
            </div>
            <div class="mb-0">
              <label class="form-label">Issuer</label>
              <input type="text" class="form-control form-control-sm" v-model="certification.issuer"
                     placeholder="Organization Issuing the Certification"
                     ondragstart="return false;"/>
            </div>
            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Certification Date</label>
                  <input type="date" class="form-control form-control-sm" v-model="certification.date"
                         ondragstart="return false;"/>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Expiry Date</label>
                  <input type="date" class="form-control form-control-sm" v-model="certification.expiryDate"
                         ondragstart="return false;"/>
                </div>
              </div>
            </div>
            <div class="mb-0">
              <label class="form-label">URL</label>
              <input type="url" class="form-control form-control-sm" v-model="certification.url"
                     placeholder="Certification URL"
                     ondragstart="return false;"/>
            </div>
            <div class="mb-0">
              <label class="form-label">Description</label>
              <textarea class="form-control form-control-sm" v-model="certification.description"
                        placeholder="Describe the certification, its importance, or related details"
                        ondragstart="return false;"
              ></textarea>
              <div class="d-flex justify-content-end">
                <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
                  AI Writer
                </button>
              </div>
            </div>
            <div v-if="isModalVisible" class="modal fade show" style="display: block;">
              <FeedbackForm @close="toggleModal" v-model="certification.description" :sectionType="sectionType"
                            :section="certification" :updated_resume="model"/>
              <div v-if="isModalVisible" class="modal-backdrop fade show"></div>
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