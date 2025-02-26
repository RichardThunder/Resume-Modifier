<script setup>
import { ref, watch, onMounted, reactive } from 'vue';
import { analysis, model } from '@/model.js';
import { feedBack, scoreToColors } from '@/methods.js';
import FeedbackForm from "@/components/FeedbackForm.vue";
import { nextTick } from 'vue';

const visibleIndexes = ref([]);
const sectionType = ref('workExperience');
const draggingIndex = ref(null);
const skillsListRef = ref(null);
const isDragOver = ref(null);
const showDragHint = ref(false);

// Validation Rules
const companyNameRules = [
  v => !!v || 'Company name is required',
  v => (v && v.length <= 50) || 'Company name must be less than 50 characters',
];

const jobTitleRules = [
  v => !!v || 'Job title is required',
  v => (v && v.length <= 50) || 'Job title must be less than 50 characters',
];

const cityRules = [
  v => (v && v.length <= 50) || 'City must be less than 50 characters',
];

const countryRules = [
  v => (v && v.length <= 50) || 'Country must be less than 50 characters',
];

const descriptionRules = [
  v => (v && v.length <= 500) || 'Description must be less than 500 characters',
];

function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

function initializeVisibility() {
  if (model.workExperience?.length > 0) {
    while (visibleIndexes.value.length < model.workExperience.length) {
      visibleIndexes.value.push(false);
    }
    if (visibleIndexes.value.length > model.workExperience.length) {
      visibleIndexes.value.splice(model.workExperience.length);
    }
  }
}

watch(
    () => model.workExperience,
    () => {
      initializeVisibility();
    },
    { deep: true }
);

initializeVisibility();

async function addExperience() {
  model.workExperience.push({
    companyName: '',
    jobTitle: '',
    city: '',
    country: '',
    fromDate: '',
    toDate: '',
    isPresent: false,
    description: ''
  });
  visibleIndexes.value.push(true);

  await nextTick();
  showDragHint.value = true;
  setTimeout(() => {
    showDragHint.value = false;
  }, 3000);
}

function deleteExperience(index) {
  model.workExperience.splice(index, 1);
  visibleIndexes.value.splice(index, 1);
}

const isModalVisible = ref(false);
const handleFeedBack = async (index) => {
  loading.value = true;

  try {
    data.section = model.workExperience[index].description;
    const content = await feedBack(data);
    if (!content) {
      loading.value = false;
      return;
    }
    model.workExperience[index].description = content;
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

  const draggedItem = model.workExperience[draggingIndex.value];
  model.workExperience.splice(draggingIndex.value, 1);
  model.workExperience.splice(index, 0, draggedItem);

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
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2 class="section-title">💼 Work Experience</h2>
      <button @click="addExperience" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-if="showDragHint" class="drag-hint">
      Drag and drop to reorder work experience entries.
    </div>

    <div class="education-list" ref="skillsListRef">
      <div
          v-for="(experience, index) in model.workExperience"
          :key="index"
          class="card mb-2"
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
          <span>Work Experience #{{ index + 1 }}</span>
          <div class="d-flex align-items-center">
            <v-tooltip v-if="analysis.workExperience[index]?.score" :text="analysis.workExperience[index]?.comment"
                       location="bottom" max-width="500px" close-delay="200">
              <template v-slot:activator="{ props }">
                            <span v-bind="props">
                                <v-progress-circular :size="35" :width="4"
                                                     :model-value="analysis.workExperience[index].score"
                                                     :color="scoreToColors(analysis.workExperience[index].score)">
                                    <template v-slot:default>
                                        <span class="score">{{ analysis.workExperience[index].score }}</span>
                                    </template>
                                </v-progress-circular>
                            </span>
              </template>
            </v-tooltip>
            <img
                class="delete-block ms-1"
                src="../../assets/block-delete.svg"
                alt="delete"
                @click="deleteExperience(index)"
            />
            <span>{{'▼' }}</span>
          </div>
        </div>
        <transition name="slide">
          <div
              v-if="visibleIndexes[index]"
              class="card-body p-2"
              :id="'work-experience-details-' + index"
          >
            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label" for="companyName-{{ index }}">Company Name</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="experience.companyName"
                      placeholder="Company Name"
                      :id="'companyName-' + index"
                      ondragstart="return false;"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label" for="jobTitle-{{ index }}">Job Title</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="experience.jobTitle"
                      placeholder="Job Title"
                      :id="'jobTitle-' + index"
                      ondragstart="return false;"
                  />
                </div>
              </div>
            </div>

            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label" for="city-{{ index }}">City</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="experience.city"
                      placeholder="City"
                      :id="'city-' + index"
                      ondragstart="return false;"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label" for="country-{{ index }}">Country</label>
                  <input
                      type="text"
                      class="form-control form-control-sm"
                      v-model="experience.country"
                      placeholder="Country"
                      :id="'country-' + index"
                      ondragstart="return false;"
                  />
                </div>
              </div>
            </div>

            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label" for="fromDate-{{ index }}">From Date</label>
                  <input
                      type="date"
                      class="form-control form-control-sm"
                      v-model="experience.fromDate"
                      :id="'fromDate-' + index"
                      ondragstart="return false;"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label" for="toDate-{{ index }}">To Date</label>
                  <input
                      type="date"
                      class="form-control form-control-sm"
                      v-model="experience.toDate"
                      :disabled="experience.isPresent"
                      :id="'toDate-' + index"
                      ondragstart="return false;"
                  />
                </div>
              </div>
            </div>

            <div class="mb-0 form-check">
              <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="experience.isPresent"
                  :id="'isPresent-' + index"
                  ondragstart="return false;"
              />
              <label class="form-check-label" :for="'isPresent-' + index">Currently Working Here</label>
            </div>

            <div class="mb-0">
              <label class="form-label" for="description-{{index}}">Job Description</label>
              <textarea class="form-control form-control-sm" v-model="experience.description"
                        placeholder="Describe your experience details, achievements, or notable projects"
                        ondragstart="return false;"
              ></textarea>
              <div class="d-flex justify-content-end">
                <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
                  AI Writer
                </button>
              </div>
            </div>
            <div v-if="isModalVisible" class="modal fade show" style="display: block;">
              <FeedbackForm @close="toggleModal" v-model="experience.description" :sectionType=sectionType
                            :section="experience" :updated_resume="model"/>
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