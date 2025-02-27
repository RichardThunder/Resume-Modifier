<script setup>

import feedbackService from "@/services/feedbackService.js";
import { defineProps, defineEmits, ref, watch } from 'vue';
const emit = defineEmits(['close', 'update:modelValue']);
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  section: {
    type: Object,
    default: null
  },
  sectionType: {
    type: String,
    default: ''
  },
  updated_resume: {
    type: Object,
    default: null
  }
})

const isSubmitLoading = ref(false);
const feedbackData = ref('');
const descriptionData = ref(props.modelValue);
const isError = ref(false);
const isSuccess = ref(false);
const errorMessage = ref('');

const cleanedText = (text) =>
  text.split('\n')
    .map(line => line.replace(/^-\s*/, ''))
    .join('\n');
const close = () => {
  emit('close', 'update');
}
const handleFeedback = async () => {
  isSubmitLoading.value = true;
  let result;
  if (props.sectionType === 'summary') {
    result = await feedbackService.sendFeedback(props.modelValue, props.sectionType, feedbackData.value, props.updated_resume);
  } else
    result = await feedbackService.sendFeedback(props.section, props.sectionType, feedbackData.value, props.updated_resume);
  if (result.success) {
    isSubmitLoading.value = false;
    descriptionData.value = cleanedText(result.content);
    isSuccess.value = true;
    setTimeout(() => { isSubmitLoading.value = false; }, 3000);
  } else {
    isSubmitLoading.value = false;
    isError.value = true;
    errorMessage.value = result.error;
    setTimeout(() => { isError.value = false; }, 3000);
  }
}

watch(descriptionData, (newValue) => {
  emit('update:modelValue', newValue);
})
</script>

<template>
  <!-- Modal -->
  <div class="modal fade show" tabindex="-1" role="dialog"
    style="display: block; background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Provide Your Feedback</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="modalText" class="form-label"></label>
            <textarea id="modalText" v-model="feedbackData" placeholder="Enter your feedback to Rewrite..."
              class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <div v-if="isError" class="alert alert-danger mt-3 mx-auto" role="alert">
            {{ errorMessage }}
          </div>
          <div v-if="isSuccess" class="alert alert-success pt-2 mx-auto" role="alert">
            <strong>Success!</strong>
          </div>
          <button type="button" class="btn btn-secondary" @click="close">Cancel</button>

          <button type="button" class="btn btn-primary" @click="handleFeedback" :disabled="isSubmitLoading">
            <span v-if="isSubmitLoading" class="spinner-border spinner-border-sm"></span>
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>