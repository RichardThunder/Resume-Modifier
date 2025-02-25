<script setup>
import { ref } from 'vue';
import { model } from '@/model.js';
import { feedBack } from '@/methods.js';
import { data } from '@/model.js';

// 显示/隐藏状态
const isVisible = ref(false);
// 切换显示/隐藏
function toggleShow() {
  isVisible.value = !isVisible.value;
}

// feedback
const isModalVisible = ref(false);
const handleFeedBack = async () => {
  loading.value = true;
  console.log(data.feedback);
  // Call the feedBack function and get content
  try {
    data.section = model.summary;
    const content = await feedBack(data);
    if (!content) {
      loading.value = false;
      return;
    }
    model.summary = content; // Update the summary with feedback data
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
  <div class="card mb-3 mx-auto w-90">
    <div class="card-header d-flex justify-content-between align-items-center" @click="toggleShow"
         style="cursor: pointer;">
      <span>ℹ️ Summary</span>
      <span>{{ isVisible ? '▲' : '▼' }}</span>
    </div>

    <div v-if="isVisible" class="card-body">
      <div class="mb-3">
        <label for="summary" class="form-label">Brief Summary</label>
        <textarea id="summary" class="form-control" v-model="model.summary"
                  placeholder="Write a brief summary about your professional background and skills." rows="4"></textarea>
        <button @click="toggleModal" class="btn btn-primary float-end mt-2">  <!-- Bootstrap button classes -->
          <span>AI Writer</span>
        </button>
      </div>

      <!-- Modal -->
      <div v-if="isModalVisible" class="modal fade show" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div v-if="loading" class="modal-body text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else class="modal-body">
              <h5 class="modal-title">Enter Feedback</h5>
              <textarea class="form-control mb-3" v-model="data.feedback"
                        placeholder="Enter your feedback..." rows="3"></textarea>
              <div class="d-flex justify-content-between">
                <button class="btn btn-secondary" @click="toggleModal">Cancel</button>
                <button class="btn btn-primary" @click="handleFeedBack">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isModalVisible" class="modal-backdrop fade show"></div>  <!-- Bootstrap modal backdrop -->

    </div>
  </div>
</template>

<style scoped>

</style>