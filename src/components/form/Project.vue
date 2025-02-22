<script setup>
import {ref, watch} from 'vue';
import {analysis, data, model} from '../../model.js';
import {feedBack, scoreToColors} from '../../methods.js';

const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  if (model.project?.length > 0) {
    while (visibleIndexes.value.length < model.education.length) {
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    if (visibleIndexes.value.length > model.education.length) {
      visibleIndexes.value.splice(model.education.length);
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
const isModalVisible = ref(false);
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
    // toggleModal();
  }
  loading.value = true;
};
const loading = ref(false);
const toggleModal = () => {
  isModalVisible.value = !isModalVisible.value;
};
</script>

<template>
  <div class="block-header">
    <h2 class="section-title">📁 Projects</h2>
    <button @click="addProject" class="add-button">Add</button>
  </div>
  <div v-for="(project, index) in model.project" :key="index" class="blockComponent">
    <h3 @click="toggleShow(index)" class="toggle-header">
      <span>Project #{{ index + 1 }}</span>
      <div class="block-utils">
        <v-tooltip v-if="analysis.project[index]?.score"
                   :text="analysis.project[index]?.comment"
                   location="bottom"
                   max-width="500px"
                   close-delay="200"
        >
          <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.project[index]?.score"
                                     :color="scoreToColors(analysis.project[index]?.score)">
                  <template v-slot:default> <span class="score">{{ analysis.project[index]?.score }}</span></template>
                </v-progress-circular>
              </span>
          </template>
        </v-tooltip>
        <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteProject(index)">
        <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
      </div>
    </h3>
    <div v-if="visibleIndexes[index]" class="form-container">
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" v-model="project.title" placeholder="Project Title"/>
      </div>
      <div class="form-group">
        <label>Role in Project</label>
        <input
            type="text"
            v-model="project.projectRole"
            placeholder="Your Role in the Project"
        />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City</label>
          <input type="text" v-model="project.city" placeholder="City"/>
        </div>
        <div class="form-group">
          <label>Country</label>
          <input type="text" v-model="project.country" placeholder="Country"/>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>From Date</label>
          <input type="date" v-model="project.fromDate"/>
        </div>
        <div class="form-group">
          <label>To Date</label>
          <input type="date" v-model="project.toDate" :disabled="project.isPresent"/>
        </div>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="project.isPresent"/> Currently Working on
          this Project
        </label>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="project.description"
            placeholder="Describe the project, responsibilities, and achievements"
        ></textarea>
        <button
            @click="toggleModal"
            class="AI-writer align-right">
          <span>AI Writer</span>
        </button>
      </div>
      <div v-if="isModalVisible" class="modal-overlay">
        <div v-if="loading" class="spinner-overlay">
          <div class="spinner"></div>
        </div>
        <div v-else class="modal">
          <h3>Enter Feedback</h3>
          <textarea v-model="data.feedback" placeholder="Enter your feedback..."></textarea>
          <div style="display: flex;justify-content: space-between">
            <button class="AI-writer" @click="toggleModal">Cancel</button>
            <button class="AI-writer" @click="handleFeedBack(index)">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>