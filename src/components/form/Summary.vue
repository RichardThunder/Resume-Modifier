<script setup>
import {reactive, ref} from 'vue';
import { model } from '@/model.js';
import FeedbackForm from "@/components/FeedbackForm.vue";

// 显示/隐藏状态
const isVisible = ref(false);
const sectionType = ref('summary');
const summaryToObj = reactive({
    summary:model.summary,
})
// 切换显示/隐藏
function toggleShow() {
  isVisible.value = !isVisible.value;
}


const isModalVisible = ref(false);

const toggleModal = () => {
  isModalVisible.value = !isModalVisible.value;
}
</script>

<template>
  <div class="card mb-3 mx-auto w-90">
    <div class="card-header d-flex justify-content-between align-items-center" @click="toggleShow"
         style="cursor: pointer;">
      <span>ℹ️ Summary</span>
      <span class="triangle">{{ isVisible ? '▲' : '▼' }}</span>
    </div>
    <transition name="slide">
    <div v-if="isVisible" class="card-body">
      <div class="mb-3">
        <label for="summary" class="form-label">Brief Summary</label>
        <textarea id="summary" class="form-control" v-model="model.summary"
                  placeholder="Write a brief summary about your professional background and skills." rows="4"></textarea>
        <button @click="toggleModal" class="btn btn-primary float-end mt-2">  <!-- Bootstrap button classes -->
          <span>AI Writer</span>
        </button>
      </div>
      <div v-if="isModalVisible">
      <FeedbackForm @close="toggleModal" v-model="model.summary" :sectionType=sectionType :section=summaryToObj :updated_resume="model" />
      </div>
      <div v-if="isModalVisible" class="modal-backdrop fade show"></div>  <!-- Bootstrap modal backdrop -->

    </div>
    </transition>
  </div>
</template>

<style scoped>
</style>