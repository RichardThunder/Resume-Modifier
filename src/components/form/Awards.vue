<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import { analysis, model } from '@/model.js';
import { feedBack, scoreToColors } from '@/methods.js';
import FeedbackForm from "../../components/FeedbackForm.vue";

const sectionType = ref('award');
const visibleIndexes = ref([]);
const draggingIndex = ref(null);
const skillsListRef = ref(null);
const isDragOver = ref(null);
const showDragHint = ref(false);

// Validation Rules
const nameRules = [
  v => !!v || 'Award name is required',
  v => (v && v.length <= 50) || 'Award name must be less than 50 characters',
];

const issuerRules = [
  v => !!v || 'Issuer is required',
  v => (v && v.length <= 50) || 'Issuer must be less than 50 characters',
];

const urlToAwardRules = [
  v => !v || /^(ftp|http|https):\/\/[^ "]+$/.test(v) || 'URL must be valid',
];

const descriptionRules = [
  v => (v && v.length <= 500) || 'Description must be less than 500 characters',
];

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  if (model.award?.length > 0) {
    while (visibleIndexes.value.length < model.award.length) {
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    if (visibleIndexes.value.length > model.award.length) {
      visibleIndexes.value.splice(model.award.length);
    }
  }
}

watch(
    () => model.award,
    () => {
      initializeVisibility();
    },
    {deep: true} // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addAwards() {
  model.award.push({
    name: '',
    issuer: '',
    urlToAward: '',
    dateOfAward: '',
    description: ''
  });
  visibleIndexes.value.push(true);
  showDragHint.value = true;
  setTimeout(() => {
    showDragHint.value = false;
  }, 3000);
}

function deleteAward(index) {
  model.award.splice(index, 1);
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

// feedback with array
const isModalVisible = ref(false);
const handleFeedBack = async (index) => {
  loading.value = true;

  try {
    data.section = model.award[index].description;
    const content = await feedBack(data);
    if (!content) {
      loading.value = false;
      return;
    }
    model.award[index].description = content;
  } catch (e) {
    console.error("Error load feedback");
  } finally {
    loading.value = false;
    // toggleModal();
  }
  loading.value = true;
}
const loading = ref(false);
const toggleModal = () => {
  isModalVisible.value = !isModalVisible.value;
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

  const draggedItem = model.award[draggingIndex.value];
  model.award.splice(draggingIndex.value, 1);
  model.award.splice(index, 0, draggedItem);

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
      <h2 class="section-title">🏅 Awards</h2>
      <button @click="addAwards" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div class="education-list" ref="skillsListRef">
      <div
          v-for="(award, index) in model.award"
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
          <span>Award #{{ index + 1 }}</span>
          <div class="d-flex align-items-center">
            <v-tooltip v-if="analysis.award[index]?.score"
                       :text="analysis.award[index]?.comment"
                       location="bottom"
                       max-width="500px"
                       close-delay="200"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <v-progress-circular :size="35" :width="4" :model-value="analysis.award[index]?.score"
                                       :color="scoreToColors(analysis.award[index]?.score)">
                    <template v-slot:default> <span class="score">{{ analysis.award[index]?.score }}</span></template>
                  </v-progress-circular>
                </span>
              </template>
            </v-tooltip>
            <img class="delete-block ms-1" src="../../assets/block-delete.svg" alt="delete"
                 @click="deleteAward(index)">
            <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
          </div>
        </div>
        <transition name="slide">
          <div v-if="visibleIndexes[index]" class="card-body p-2">
            <div class="mb-0">
              <label class="form-label">Award Name</label>
              <input type="text" class="form-control form-control-sm" v-model="award.name"
                     placeholder="Name of the Award" :rules="nameRules"
                     ondragstart="return false;"/>
              <div class="error-message" v-if="award.name && !nameRules.every(rule => rule(award.name) === true)">
                {{ nameRules.find(rule => rule(award.name) !== true)(award.name) }}
              </div>
            </div>
            <div class="mb-0">
              <label class="form-label">Issuer</label>
              <input type="text" class="form-control form-control-sm" v-model="award.issuer"
                     placeholder="Organization Issuing the Award" :rules="issuerRules"
                     ondragstart="return false;"/>
              <div class="error-message" v-if="award.issuer && !issuerRules.every(rule => rule(award.issuer) === true)">
                {{ issuerRules.find(rule => rule(award.issuer) !== true)(award.issuer) }}
              </div>
            </div>
            <div class="mb-0">
              <label class="form-label">URL to Award</label>
              <input type="url" class="form-control form-control-sm" v-model="award.urlToAward"
                     placeholder="Award URL" :rules="urlToAwardRules"
                     ondragstart="return false;"/>
              <div class="error-message" v-if="award.urlToAward && !urlToAwardRules.every(rule => rule(award.urlToAward) === true)">
                {{ urlToAwardRules.find(rule => rule(award.urlToAward) !== true)(award.urlToAward) }}
              </div>
            </div>
            <div class="mb-0">
              <label class="form-label">Date of Award</label>
              <input type="date" class="form-control form-control-sm" v-model="award.dateOfAward"
                     ondragstart="return false;"/>
            </div>
            <div class="mb-0">
              <label class="form-label">Description</label>
              <textarea class="form-control form-control-sm" v-model="award.description"
                        placeholder="Describe the award and why it was given" :rules="descriptionRules"
                        ondragstart="return false;"
              ></textarea>
              <div class="error-message" v-if="award.description && !descriptionRules.every(rule => rule(award.description) === true)">
                {{ descriptionRules.find(rule => rule(award.description) !== true)(award.description) }}
              </div>
              <div class="d-flex justify-content-end">
                <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
                  AI Writer
                </button>
              </div>
            </div>
            <div v-if="isModalVisible" class="modal fade show" style="display: block;">
              <FeedbackForm @close="toggleModal" v-model="award.description" :sectionType="sectionType"
                            :section="award" :updated_resume="model"/>
              <div v-if="isModalVisible" class="modal-backdrop fade show"></div>
            </div>

          </div>
        </transition>
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

/* Error message style */
.error-message {
  color: red;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
</style>