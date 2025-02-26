<script setup>
import {ref, watch} from 'vue';
import {analysis, data, model} from '@/model.js';
import {feedBack, scoreToColors} from '@/methods.js';
import FeedbackForm from "../../components/FeedbackForm.vue"; // 假设 FeedbackForm 组件路径

const visibleIndexes = ref([]);
const sectionType = ref('project');
const isModalVisible = ref(false); // 控制 FeedbackForm 显示/隐藏

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  if (model.project?.length > 0) {
    while (visibleIndexes.value.length < model.project.length) { // Fixed: model.project
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    if (visibleIndexes.value.length > model.project.length) { // Fixed: model.project
      visibleIndexes.value.splice(model.project.length); // Fixed: model.project
    }
  }
}

watch(
    () => model.project,
    () => {
      initializeVisibility();
    },
    {deep: true} // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

// 定义项目经历的响应式数据
function addProject() {
  model.project.push({
    title: '',
    projectRole: '',
    city: '',
    country: '',
    fromDate: '',
    toDate: '',
    isPresent: false,
    description: ''
  });
  visibleIndexes.value.push(true);
  console.log(model);
  console.log(visibleIndexes.value);
}

function deleteProject(index) {
  model.project.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

// feedback with array
const handleFeedBack = async (index) => {
  loading.value = true;
  console.log(data.feedback);

  // Call the feedBack function and get content
  try {
    data.section = model.project[index].description;
    const content = await feedBack(data);
    if (!content) {
      loading.value = false;
      return;
    }
    model.project[index].description = content; // Update the summary with feedback data
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
      <h2 class="section-title">📁 Projects</h2>
      <button @click="addProject" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-for="(project, index) in model.project" :key="index" class="card mb-1">
      <div class="card-header d-flex justify-content-between align-items-center p-2" @click="toggleShow(index)"
           style="cursor: pointer;">
        <span>Project #{{ index + 1 }}</span>
        <div class="d-flex align-items-center">
          <v-tooltip v-if="analysis.project[index]?.score" :text="analysis.project[index]?.comment"
                     location="bottom" max-width="500px" close-delay="200">
            <template v-slot:activator="{ props }">
                            <span v-bind="props">
                                <v-progress-circular :size="35" :width="4"
                                                     :model-value="analysis.project[index].score"
                                                     :color="scoreToColors(analysis.project[index].score)">
                                    <template v-slot:default>
                                        <span class="score">{{ analysis.project[index].score }}</span>
                                    </template>
                                </v-progress-circular>
                            </span>
            </template>
          </v-tooltip>

          <img class="delete-block ms-1" src="../../assets/block-delete.svg" alt="delete"
               @click="deleteProject(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </div>
      <transition name="slide">
      <div v-if="visibleIndexes[index]" class="card-body p-2">
        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Project Title</label>
              <input type="text" class="form-control form-control-sm" v-model="project.title"
                     placeholder="Project Title"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Role in Project</label>
              <input type="text" class="form-control form-control-sm" v-model="project.projectRole"
                     placeholder="Role in Project"/>
            </div>
          </div>
        </div>

        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">City</label>
              <input type="text" class="form-control form-control-sm" v-model="project.city"
                     placeholder="City"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">Country</label>
              <input type="text" class="form-control form-control-sm" v-model="project.country"
                     placeholder="Country"/>
            </div>
          </div>
        </div>

        <div class="row mb-0">
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">From Date</label>
              <input type="date" class="form-control form-control-sm" v-model="project.fromDate"/>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-0">
              <label class="form-label">To Date</label>
              <input type="date" class="form-control form-control-sm" v-model="project.toDate"
                     :disabled="project.isPresent"/>
            </div>
          </div>
        </div>

        <div class="mb-0 form-check">
          <input type="checkbox" class="form-check-input" v-model="project.isPresent"
                 id="isPresent">
          <label class="form-check-label" for="isPresent">Currently Working on this Project</label>
        </div>

        <div class="mb-0">
          <label class="form-label">Description</label>
          <textarea class="form-control form-control-sm" v-model="project.description"
                    placeholder="Describe the project, responsibilities, and achievements"></textarea>
          <div class="d-flex justify-content-end">
            <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
              AI Writer
            </button>
          </div>
        </div>

        <div v-if="isModalVisible" class="modal fade show" style="display: block;">
          <FeedbackForm @close="toggleModal" v-model="project.description" :sectionType=sectionType
                        :section="project" :updated_resume="model"/>
          <div v-if="isModalVisible" class="modal-backdrop fade show"></div>
        </div>
      </div>
      </transition>
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