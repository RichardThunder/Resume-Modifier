<script setup>
import {ref, watch} from 'vue';
import {analysis, model} from '@/model.js';
import {feedBack, scoreToColors} from '@/methods.js';
import FeedbackForm from "@/components/FeedbackForm.vue";

const visibleIndexes = ref([]);
const sectionType = ref('education');

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
    {deep: true}
);

initializeVisibility();

function addEducation() {
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
}

function deleteEducation(index) {
  model.education.splice(index, 1);
  visibleIndexes.value.splice(index, 1);
}

const isModalVisible = ref(false);
const handleFeedBack = async (index) => {
  loading.value = true;
  console.log(data.feedback);
  console.log(model.education[index].description);

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
</script>

<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="section-title">🎓 Education</h2>
      <button @click="addEducation" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-for="(education, index) in model.education" :key="index" class="card mb-1">
      <div class="card-header d-flex justify-content-between align-items-center p-2" @click="toggleShow(index)"
           style="cursor: pointer;">
        <span>Education #{{ index + 1 }}</span>
        <div class="d-flex align-items-center">
          <v-tooltip v-if="analysis.education[index]?.score" :text="analysis.education[index]?.comment"
                     location="bottom" max-width="500px" close-delay="200">
            <template v-slot:activator="{ props }">
                            <span v-bind="props">
                                <v-progress-circular :size="35" :width="4"
                                                     :model-value="analysis.education[index].score"
                                                     :color="scoreToColors(analysis.education[index].score)">
                                    <template v-slot:default>
                                        <span class="score">{{ analysis.education[index].score }}</span>
                                    </template>
                                </v-progress-circular>
                            </span>
            </template>
          </v-tooltip>

          <img class="delete-block ms-1" src="../../assets/block-delete.svg" alt="delete"
               @click="deleteEducation(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </div>

      <div v-if="visibleIndexes[index]" class="card-body p-2">
        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Institution Name</label>
              <input type="text" class="form-control form-control-sm" v-model="education.institutionName"
                     placeholder="Institution Name"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Field of Study</label>
              <input type="text" class="form-control form-control-sm" v-model="education.fieldOfStudy"
                     placeholder="Field of Study"/>
            </div>
          </div>
        </div>

        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Degree</label>
              <input type="text" class="form-control form-control-sm" v-model="education.degree"
                     placeholder="Degree"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Grade</label>
              <input type="text" class="form-control form-control-sm" v-model="education.grade"
                     placeholder="Grade or Classification"/>
            </div>
          </div>
        </div>

        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">City</label>
              <input type="text" class="form-control form-control-sm" v-model="education.city"
                     placeholder="City"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Country</label>
              <input type="text" class="form-control form-control-sm" v-model="education.country"
                     placeholder="Country"/>
            </div>
          </div>
        </div>

        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">From Date</label>
              <input type="date" class="form-control form-control-sm" v-model="education.fromDate"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">To Date</label>
              <input type="date" class="form-control form-control-sm" v-model="education.toDate"
                     :disabled="education.isPresent"/>
            </div>
          </div>
        </div>

        <div class="mb-0 form-check">
          <input type="checkbox" class="form-check-input" v-model="education.isPresent"
                 id="isPresent">
          <label class="form-check-label" for="isPresent">Currently Studying Here</label>
        </div>

        <div class="mb-0">
          <label class="form-label">Description</label>
          <textarea class="form-control form-control-sm" v-model="education.description"
                    placeholder="Describe your education details, achievements, or notable projects"></textarea>
          <div class="d-flex justify-content-end">
            <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
              AI Writer
            </button>
          </div>
        </div>
        <div v-if="isModalVisible" class="modal fade show" style="display: block;">
          <FeedbackForm @close="toggleModal" v-model="education.description" :sectionType=sectionType
                        :section="education" :updated_resume="model"/>
          <div v-if="isModalVisible" class="modal-backdrop fade show"></div>
        </div>
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