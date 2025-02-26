<script setup>
import { ref, watch, onMounted, reactive } from 'vue';
import { analysis, model } from '@/model.js';
import { feedBack, scoreToColors } from '@/methods.js';
import FeedbackForm from "@/components/FeedbackForm.vue";
import { nextTick } from 'vue';

const visibleIndexes = ref([]);
const sectionType = ref('education');
const draggingIndex = ref(null);
const skillsListRef = ref(null);
const isDragOver = ref(null);
const showDragHint = ref(true); // 添加一个 ref 来控制是否显示提示

function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

function initializeVisibility() {
  if (model.education?.length > 0) {
    while (visibleIndexes.value.length < model.education.length) {
      visibleIndexes.value.push(false);
    }
    if (visibleIndexes.value.length > model.education.length) {
      visibleIndexes.value.splice(model.education.length);
    }
  }
}

watch(
    () => model.education,
    () => {
      initializeVisibility();
    },
    { deep: true }
);

initializeVisibility();

async function addEducation() {
  model.education.push({
    institutionName: '',
    fieldOfStudy: '',
    degree: '',
    grade: '',
    city: '',
    country: '',
    fromDate: '',
    toDate: '',
    isPresent: false,
    description: ''
  });
  visibleIndexes.value.push(true);

  await nextTick();
  showDragHint.value = true; // 添加元素后显示提示
  setTimeout(() => {
    showDragHint.value = false; // 3秒后隐藏提示
  }, 3000);
}

function deleteEducation(index) {
  model.education.splice(index, 1);
  visibleIndexes.value.splice(index, 1);
}

const isModalVisible = ref(false);
const handleFeedBack = async (index) => {
  loading.value = true;

  try {
    data.section = model.education[index].description;
    const content = await feedBack(data);
    if (!content) {
      loading.value = false;
      return;
    }
    model.education[index].description = content;
  } catch (e) {
    console.error('Error load feedback');
  } finally {
    loading.value = false;
  }
  loading.value = true;
};
const loading = ref(false);
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

  const draggedItem = model.education[draggingIndex.value];
  model.education.splice(draggingIndex.value, 1);
  model.education.splice(index, 0, draggedItem);

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
      <h2 class="section-title">🎓 Education</h2>
      <button @click="addEducation" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-if="showDragHint" class="drag-hint">
      Drag and drop to reorder education entries.
    </div>

    <div class="education-list" ref="skillsListRef">
      <div
          v-for="(education, index) in model.education"
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
          <span>Education #{{ index + 1 }}</span>
          <div class="d-flex align-items-center">
            <v-tooltip
                v-if="analysis.education[index]?.score"
                :text="analysis.education[index]?.comment"
                location="bottom"
                max-width="500px"
                close-delay="200"
            >
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <v-progress-circular
                      :size="35"
                      :width="4"
                      :model-value="analysis.education[index].score"
                      :color="scoreToColors(analysis.education[index].score)"
                  >
                    <template v-slot:default>
                      <span class="score">{{ analysis.education[index].score }}</span>
                    </template>
                  </v-progress-circular>
                </span>
              </template>
            </v-tooltip>

            <img
                class="delete-block ms-1"
                src="../../assets/block-delete.svg"
                alt="delete"
                @click="deleteEducation(index)"
            >

            <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
          </div>
        </div>

        <transition name="slide">
          <div v-if="visibleIndexes[index]" class="card-body p-2">
            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Institution Name</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="education.institutionName"
                      placeholder="Institution Name"
                      ondragstart="return false;"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Field of Study</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="education.fieldOfStudy"
                      placeholder="Field of Study"
                      ondragstart="return false;"
                  />
                </div>
              </div>
            </div>

            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Degree</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="education.degree"
                      placeholder="Degree"
                      ondragstart="return false;"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Grade</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="education.grade"
                      placeholder="Grade or Classification"
                      ondragstart="return false;"
                  />
                </div>
              </div>
            </div>

            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">City</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="education.city"
                      placeholder="City"
                      ondragstart="return false;"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Country</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="education.country"
                      placeholder="Country"
                      ondragstart="return false;"
                  />
                </div>
              </div>
            </div>

            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">From Date</label>
                  <input
                      type="date"
                      class="form-control form-control-sm"
                      v-model="education.fromDate"
                      ondragstart="return false;"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">To Date</label>
                  <input
                      type="date"
                      class="form-control form-control-sm"
                      v-model="education.toDate"
                      :disabled="education.isPresent"
                      ondragstart="return false;"
                  />
                </div>
              </div>
            </div>

            <div class="mb-0 form-check">
              <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="education.isPresent"
                  id="isPresent"
                  ondragstart="return false;"
              >
              <label class="form-check-label" for="isPresent">Currently Studying Here</label>
            </div>

            <div class="mb-0">
              <label class="form-label">Description</label>
              <textarea
                  class="form-control form-control-sm"
                  v-model="education.description"
                  placeholder="Describe your education details, achievements, or notable projects"
                  ondragstart="return false;"
              ></textarea>
              <div class="d-flex justify-content-end">
                <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
                  AI Writer
                </button>
              </div>
            </div>
            <div v-if="isModalVisible" class="modal fade show" style="display: block;">
              <FeedbackForm @close="toggleModal" v-model="education.description" :sectionType=sectionType
                            :section="education" :updated_resume="model" />
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

/* Transition Styles */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  height: auto;
  max-height: 1000px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  height: 0;
  max-height: 0;
}

.slide-move {
  transition: transform 0.3s ease;
}

/* Highlight style for drop target */
.drag-over {
  background-color: rgba(0, 0, 0, 0.1); /* Subtle highlight */
}

.education-list {
  min-height: 50px;
}

/* Drag hint style */
.drag-hint {
  text-align: center;
  font-style: italic;
  color: #777;
  margin-bottom: 10px;
}
</style>