<script setup>
import {ref, watch} from 'vue';
import {analysis, data, model} from '@/model.js';
import {feedBack, scoreToColors} from '@/methods.js';
import FeedbackForm from "@/components/FeedbackForm.vue";

const sectionType = ref('award');
// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

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
}

function deleteAward(index) {
  model.award.splice(index, 1);
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

// feedback with array
const isModalVisible = ref(false);
const handleFeedBack = async (index) => {
  loading.value = true;
  console.log(data.feedback);

  // Call the feedBack function and get content
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
</script>

<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="section-title">🏅 Awards</h2>
      <button @click="addAwards" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-for="(award, index) in model.award" :key="index" class="card mb-1">
      <div class="card-header d-flex justify-content-between align-items-center p-2"
           @click="toggleShow(index)" style="cursor: pointer;">
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

      <div v-if="visibleIndexes[index]" class="card-body p-2">
        <div class="mb-0">
          <label class="form-label">Award Name</label>
          <input type="text" class="form-control form-control-sm" v-model="award.name"
                 placeholder="Name of the Award"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Issuer</label>
          <input type="text" class="form-control form-control-sm" v-model="award.issuer"
                 placeholder="Organization Issuing the Award"/>
        </div>
        <div class="mb-0">
          <label class="form-label">URL to Award</label>
          <input type="url" class="form-control form-control-sm" v-model="award.urlToAward"
                 placeholder="Award URL"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Date of Award</label>
          <input type="date" class="form-control form-control-sm" v-model="award.dateOfAward"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Description</label>
          <textarea class="form-control form-control-sm" v-model="award.description"
                    placeholder="Describe the award and why it was given"></textarea>
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
</style>