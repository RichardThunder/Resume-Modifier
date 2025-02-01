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
  while (visibleIndexes.value.length < model.certifications.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  if (visibleIndexes.value.length > model.certifications.length) {
    visibleIndexes.value.splice(model.certifications.length);
  }
}

watch(
    () => model.certifications,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addCertification() {
  model.certifications.push({
    name: '',
    issuer: '',
    date: '',
    expiryDate: '',
    url: '',
    description: ''
  });
  visibleIndexes.value.push(true);
}
function deleteCertification(index) {
  model.certifications.splice(index, 1); //
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

// feedback with array
const isModalVisible = ref(false);
const handleFeedBack = async (index) =>{
  loading.value = true;
  console.log(data.feedback);

  // Call the feedBack function and get content
  try {
    data.section = model.certifications[index].description;
    const content = await feedBack(data);
    if(!content){
      loading.value = false;
      return;
    }
    model.certifications[index].description = content;
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
    <h2 class="section-title">📜 Certifications</h2>
    <button @click="addCertification" class="add-button">Add</button>
  </div>
  <div v-for="(certification, index) in model.certifications" :key="index" class="blockComponent">
    <h3 @click="toggleShow(index)" class="toggle-header">
      <span>Certification #{{ index + 1 }}</span>
      <div class="block-utils">
        <v-tooltip v-if="analysis.certifications[index]?.score"
                   :text="analysis.certifications[index]?.comment"
                   location="bottom"
                   max-width="500px"
                   close-delay="200"
        >
          <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.certifications[index]?.score" :color="scoreToColors(analysis.certifications[index]?.score)">
                  <template v-slot:default> <span class="score">{{analysis.certifications[index]?.score}}</span></template>
                </v-progress-circular>
              </span>
          </template>
        </v-tooltip>
        <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteCertification(index)">
        <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
      </div>
    </h3>
    <!-- 表单内容 -->
    <div v-if="visibleIndexes[index]" class="form-container">
      <div class="form-group">
        <label>Certification Name</label>
        <input type="text" v-model="certification.name" placeholder="Name of the Certification"/>
      </div>
      <div class="form-group">
        <label>Issuer</label>
        <input
            type="text"
            v-model="certification.issuer"
            placeholder="Organization Issuing the Certification"
        />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Certification Date</label>
          <input type="date" v-model="certification.date"/>
        </div>
        <div class="form-group">
          <label>Expiry Date</label>
          <input type="date" v-model="certification.expiryDate"/>
        </div>
      </div>
      <div class="form-group">
        <label>URL</label>
        <input type="url" v-model="certification.url" placeholder="Certification URL"/>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea
            v-model="certification.description"
            placeholder="Describe the certification, its importance, or related details"
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