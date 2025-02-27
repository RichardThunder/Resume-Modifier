<script setup>
import { ref, watch, onMounted, reactive } from 'vue';
import { analysis, model } from '@/model.js';
import { feedBack, scoreToColors } from '@/methods.js';
import FeedbackForm from "../../components/FeedbackForm.vue"; // 假设 FeedbackForm 组件路径

const visibleIndexes = ref([]);
const sectionType = ref('project');
const isModalVisible = ref(false); // 控制 FeedbackForm 显示/隐藏
const draggingIndex = ref(null);
const skillsListRef = ref(null);
const showDragHint = ref(false);

// Validation Rules
const titleRules = [
  v => !!v || 'Project title is required',
  v => (v && v.length <= 50) || 'Project title must be less than 50 characters',
];

const projectRoleRules = [
  v => !!v || 'Project role is required',
  v => (v && v.length <= 50) || 'Project role must be less than 50 characters',
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

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  if (model.project?.length > 0) {
    while (visibleIndexes.value.length < model.project.length) {
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    if (visibleIndexes.value.length > model.project.length) {
      visibleIndexes.value.splice(model.project.length);
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
  showDragHint.value = true;
  setTimeout(() => {
    showDragHint.value = false;
  }, 3000);
}

function deleteProject(index) {
  model.project.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

// feedback with array
const handleFeedBack = async (index) => {
  loading.value = true;

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

  const draggedItem = model.project[draggingIndex.value];
  model.project.splice(draggingIndex.value, 1);
  model.project.splice(index, 0, draggedItem);

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
      <h2 class="section-title">📁 Projects</h2>
      <button @click="addProject" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-if="showDragHint" class="alert alert-success pt-2">
      <strong>Drag</strong> and <strong>drop</strong> to reorder project entries.
    </div>

    <div class="education-list" ref="skillsListRef">
      <div v-for="(project, index) in model.project" :key="index" class="card mb-1">
        <div class="card-header d-flex justify-content-between align-items-center p-2" @click="toggleShow(index)"
          style="cursor: pointer;" draggable="true" @dragstart="dragStart(index)" @dragenter.prevent="dragEnter(index)"
          @dragleave="dragLeave(index)" @dragover.prevent="dragOver($event)" @drop="drop(index)">
          <span>Project #{{ index + 1 }}</span>
          <div class="d-flex align-items-center">
            <v-tooltip v-if="analysis.project[index]?.score" :text="analysis.project[index]?.comment" location="bottom"
              max-width="500px" close-delay="200">
              <template v-slot:activator="{ props }">
                <span v-bind="props">
                  <v-progress-circular :size="35" :width="4" :model-value="analysis.project[index].score"
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
                    placeholder="Project Title" :rules="titleRules" ondragstart="return false;" />
                  <div class="error-message"
                    v-if="project.title && !titleRules.every(rule => rule(project.title) === true)">
                    {{ titleRules.find(rule => rule(project.title) !== true)(project.title) }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Role in Project</label>
                  <input type="text" class="form-control form-control-sm" v-model="project.projectRole"
                    placeholder="Role in Project" :rules="projectRoleRules" ondragstart="return false;" />
                  <div class="error-message"
                    v-if="project.projectRole && !projectRoleRules.every(rule => rule(project.projectRole) === true)">
                    {{ projectRoleRules.find(rule => rule(project.projectRole) !== true)(project.projectRole) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">City</label>
                  <input type="text" class="form-control form-control-sm" v-model="project.city" placeholder="City"
                    :rules="cityRules" ondragstart="return false;" />
                  <div class="error-message"
                    v-if="project.city && !cityRules.every(rule => rule(project.city) === true)">
                    {{ cityRules.find(rule => rule(project.city) !== true)(project.city) }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">Country</label>
                  <input type="text" class="form-control form-control-sm" v-model="project.country"
                    placeholder="Country" :rules="countryRules" ondragstart="return false;" />
                  <div class="error-message"
                    v-if="project.country && !countryRules.every(rule => rule(project.country) === true)">
                    {{ countryRules.find(rule => rule(project.country) !== true)(project.country) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-0">
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">From Date</label>
                  <input type="date" class="form-control form-control-sm" v-model="project.fromDate"
                    ondragstart="return false;" />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-0">
                  <label class="form-label">To Date</label>
                  <input type="date" class="form-control form-control-sm" v-model="project.toDate"
                    :disabled="project.isPresent" ondragstart="return false;" />
                </div>
              </div>
            </div>

            <div class="mb-0 form-check">
              <input type="checkbox" class="form-check-input" v-model="project.isPresent" id="isPresent"
                ondragstart="return false;">
              <label class="form-check-label" for="isPresent">Currently Working on this Project</label>
            </div>

            <div class="mb-0">
              <label class="form-label">Description</label>
              <textarea class="form-control form-control-sm" v-model="project.description"
                placeholder="Describe the project, responsibilities, and achievements" :rules="descriptionRules"
                ondragstart="return false;"></textarea>
              <div class="error-message"
                v-if="project.description && !descriptionRules.every(rule => rule(project.description) === true)">
                {{ descriptionRules.find(rule => rule(project.description) !== true)(project.description) }}
              </div>
              <div class="d-flex justify-content-end">
                <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
                  AI Writer
                </button>
              </div>
            </div>

            <div v-if="isModalVisible" class="modal fade show" style="display: block;">
              <FeedbackForm @close="toggleModal" v-model="project.description" :sectionType=sectionType
                :section="project" :updated_resume="model" />
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

/* Error message style */
.error-message {
  color: red;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
</style>