<script setup>
import { ref } from 'vue';
import { model} from '../../model.js';
import {feedBack} from '../../methods.js';
import {data} from '../../model.js';
import {da} from 'vuetify/locale';
// 显示/隐藏状态
const isVisible = ref(false);
// 切换显示/隐藏
function toggleShow() {
  isVisible.value = !isVisible.value;
}

// feedback
const isModalVisible = ref(false);
const handleFeedBack = async () =>{
  loading.value = true;
  console.log(data.feedback);
   // Call the feedBack function and get content
    try {
      data.section = model.summary;
      const content = await feedBack(data);
      if(!content){
        loading.value = false;
        return;
      }
      model.summary = content; // Update the summary with feedback data
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
  <div class="blockComponent">
    <h2 @click="toggleShow" class="toggle-header">
      <span>ℹ️ Summary</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </h2>
    <!-- 表单内容 -->
    <div v-if="isVisible" class="form-container">
      <div class="form-row">
        <div class="form-group">
          <label for="summary">Brief Summary</label>
          <textarea
              id="summary"
              v-model="model.summary"
              placeholder="Write a brief summary about your professional background and skills."
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
            <button  class="AI-writer" @click="handleFeedBack">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


</style>
