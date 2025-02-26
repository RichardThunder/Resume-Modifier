<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="section-title">🌟 Volunteering</h2>
      <button @click="addVolunteer" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-for="(volunteering, index) in model.volunteering" :key="index" class="card mb-1">
      <div class="card-header d-flex justify-content-between align-items-center p-2"
           @click="toggleShow(index)" style="cursor: pointer;">
        <span>Volunteering #{{ index + 1 }}</span>
        <div class="d-flex align-items-center">
          <v-tooltip v-if="analysis.volunteering[index]?.score"
                     :text="analysis.volunteering[index]?.comment"
                     location="bottom"
                     max-width="500px"
                     close-delay="200"
          >
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="35" :width="4"
                                     :model-value="analysis.volunteering[index]?.score"
                                     :color="scoreToColors(analysis.volunteering[index]?.score)">
                  <template v-slot:default>
                    <span class="score">{{ analysis.volunteering[index]?.score }}</span>
                  </template>
                </v-progress-circular>
              </span>
            </template>
          </v-tooltip>
          <img class="delete-block ms-1" src="../../assets/block-delete.svg" alt="delete"
               @click="deleteVolunteer(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </div>
      <transition name="slide">
      <div v-if="visibleIndexes[index]" class="card-body p-2">
        <div class="mb-0">
          <label class="form-label">Volunteer Organization/Event</label>
          <input type="text" class="form-control form-control-sm" v-model="volunteering.name"
                 placeholder="Name of the Organization/Event"/>
        </div>
        <div class="mb-0">
          <label class="form-label">Your Role</label>
          <input type="text" class="form-control form-control-sm" v-model="volunteering.role"
                 placeholder="Your Role in Volunteering"/>
        </div>
        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">City</label>
              <input type="text" class="form-control form-control-sm" v-model="volunteering.city"
                     placeholder="City"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Country</label>
              <input type="text" class="form-control form-control-sm" v-model="volunteering.country"
                     placeholder="Country"/>
            </div>
          </div>
        </div>
        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">From Date</label>
              <input type="date" class="form-control form-control-sm" v-model="volunteering.fromDate"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">To Date</label>
              <input type="date" class="form-control form-control-sm" v-model="volunteering.toDate">
            </div>
          </div>
        </div>
        <div class="mb-0">
          <label class="form-label">Description</label>
          <textarea class="form-control form-control-sm" v-model="volunteering.description"
                    placeholder="Describe the volunteering work, responsibilities, and achievements"></textarea>
          <div class="d-flex justify-content-end">
            <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
              AI Writer
            </button>
          </div>
        </div>
        <div v-if="isModalVisible" class="modal fade show" style="display: block;">
          <FeedbackForm @close="toggleModal" v-model="volunteering.description" :sectionType="sectionType"
                        :section="volunteering" :updated_resume="model"/>
          <div v-if="isModalVisible" class="modal-backdrop fade show"></div>
        </div>
      </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { analysis, model } from '@/model.js';
import { feedBack, scoreToColors } from '@/methods.js';
import FeedbackForm from "@/components/FeedbackForm.vue";

// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);
const sectionType = ref('volunteering');

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  if (model.volunteering?.length > 0) {
    while (visibleIndexes.value.length < model.volunteering.length) {
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    if (visibleIndexes.value.length > model.volunteering.length) {
      visibleIndexes.value.splice(model.volunteering.length);
    }
  }
}

watch(
    () => model.volunteering,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addVolunteer() {
  model.volunteering.push({
    name: '',
    role: '',
    city: '',
    country: '',
    fromDate: '',
    toDate: '',
    description: ''
  });
  visibleIndexes.value.push(true);
}

function deleteVolunteer(index) {
  model.volunteering.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

// feedback with array
const isModalVisible = ref(false);
const handleFeedBack = async (index) => {
  loading.value = true;
  console.log(data.feedback);

  // Call the feedBack function and get content
  try {
    data.section = model.volunteering[index].description;
    const content = await feedBack(data);
    if (!content) {
      loading.value = false;
      return;
    }
    model.volunteering[index].description = content;
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
  .slide-enter-active,
  .slide-leave-active {
    transition: max-height 0.5s ease, opacity 0.5s ease;
    max-height: 1000px;
    overflow: hidden;
    opacity: 1;
  }

  .slide-enter-from,
  .slide-leave-to {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }

  /* Optional: Add a subtle background color change during transition */
  .card-header:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  /* Optional: Animate the arrow icon rotation */
  .card-header span:last-child {
    transition: transform 0.5s ease;
  }

  .card-header[aria-expanded="true"] span:last-child {
    transform: rotate(180deg);
  }
</style>