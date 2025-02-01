<script setup>
import {ref, watch} from 'vue';
import {analysis, data, model} from '../../model.js';
import {feedBack, scoreToColors} from '../../methods.js';

// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  while (visibleIndexes.value.length < model.award.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  if (visibleIndexes.value.length > model.award.length) {
    visibleIndexes.value.splice(model.award.length);
  }
}

watch(
    () => model.award,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
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
const handleFeedBack = async (index) =>{
  loading.value = true;
  console.log(data.feedback);

  // Call the feedBack function and get content
  try {
    data.section = model.award[index].description;
    const content = await feedBack(data);
    if(!content){
      loading.value = false;
      return;
    }
    model.award[index].description = content;
  }catch (e){
    console.error("Error load feedback");
  }
  finally{
    loading.value=false;
    // toggleModal();
  }
  loading.value = true;
}
const loading = ref(false);
const toggleModal = ()=> {
  isModalVisible.value = !isModalVisible.value;
}
</script>

<template>
  <div class="block-header">
    <h2 class="section-title">🏅 Awards</h2>
    <button @click="addAwards" class="add-button">Add</button>
  </div>
  <div v-for="(award, index) in model.award" :key="index" class="blockComponent">
    <h3 @click="toggleShow(index)" class="toggle-header">
      <span>Award #{{ index + 1 }}</span>
      <div class="block-utils">
        <v-tooltip v-if="analysis.award[index]?.score"
                   :text="analysis.award[index]?.comment"
                   location="bottom"
                   max-width="500px"
                   close-delay="200"
        >
          <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.award[index]?.score" :color="scoreToColors(analysis.award[index]?.score)">
                  <template v-slot:default> <span class="score">{{analysis.award[index]?.score}}</span></template>
                </v-progress-circular>
              </span>
          </template>
        </v-tooltip>
        <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteAward(index)">
        <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
      </div>
    </h3>
  <!-- 表单内容 -->
  <div v-if="visibleIndexes[index]" class="form-container">
    <div class="form-group">
      <label>Award Name</label>
      <input type="text" v-model="award.name" placeholder="Name of the Award"/>
    </div>
    <div class="form-group">
      <label>Issuer</label>
      <input type="text" v-model="award.issuer" placeholder="Organization Issuing the Award"/>
    </div>
    <div class="form-group">
      <label>URL to Award</label>
      <input type="url" v-model="award.urlToAward" placeholder="Award URL"/>
    </div>
    <div class="form-group">
      <label>Date of Award</label>
      <input type="date" v-model="award.dateOfAward"/>
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea
          v-model="award.description"
          placeholder="Describe the award and why it was given"
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
          <button  class="AI-writer" @click="toggleModal">Cancel</button>
          <button  class="AI-writer" @click="handleFeedBack(index)">Submit</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>

</style>