<template>
  <div class="toolbar">

    <div v-if="!isEditing" class="filename-edit">
      <button class="toolbar-btn rename" @click="editFileName">
        <img src="../assets/toolbar/ep_edit.svg" alt="edit"/>Rename
      </button>
      <span class="file-name">{{ fileName }}</span>
    </div>

    <div v-else class="filename-edit">
      <button class="toolbar-btn rename" @click="disableEditing">
        <img src="../assets/toolbar/save.svg" alt="save"/>Save
      </button>
      <input type="text" class="file-name-input" ref="fileNameInput" v-model="fileName" @blur="disableEditing"
             @keyup.enter="disableEditing"/>
    </div>

    <button class="toolbar-btn upload" @click="toggleModal">
      <img src="../assets/toolbar/circum_export.svg" alt="upload"/>Upload
    </button>
    <button class="toolbar-btn reanalyze">
      <img src="../assets/toolbar/mynaui_redo.svg" alt="redo"/>Re-Analyze
    </button>
    <button class="toolbar-btn undo">
      <img src="../assets/toolbar/material-symbols-light_undo.svg" alt="undo"/>Undo
    </button>
    <button class="toolbar-btn export" @click="exportToPDF">
      <img src="../assets/toolbar/material-symbols-light_download.svg" alt="export"/>Export
    </button>
  </div>
  <!-- 弹出窗口 -->
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h3>Upload File</h3>
      <label for="jobDescription">Job Description:</label>
      <textarea
          id="jobDescription"
          v-model="jobDescription"
          placeholder="Enter Job Description"
          class="modal-input"
      />
      <div class="choose-and-filename">
        <div class="choose-file">
          <label for="fileUpload">Choose a file</label>
          <input
              id="fileUpload"
              type="file"
              ref="fileInput"
              class="file-input"
              accept=".pdf"
              @change="handleFileChange"
          />
        </div>
        <span v-if="selectedFile" style="font-weight: bold">{{ selectedFile.name }}</span>
      </div>
      <div class="modal-actions">
        <button class="modal-btn cancel" @click="toggleModal">Cancel</button>
        <button class="modal-btn" @click="submitData">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {store, fileName} from '../store.js';
import {nextTick, ref} from 'vue';
import html2pdf from 'html2pdf.js';

const showUpload = ref(false);
const fileInput = ref(null);
const isEditing = ref(false);
const fileNameInput = ref(null);
const showModal = ref(false);
const jobDescription = ref('');
const selectedFile = ref(null);

const toggleModal = () => {
  showModal.value = !showModal.value;
};
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const submitData = async () => {
  if (!jobDescription.value || !selectedFile.value) {
    alert('Please provide both job description and a file.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('job_description', jobDescription.value);

  try {
    const response = await axios.post('http://localhost:8080/api/pdfupload/', formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    });

    if (response.data.status === 200) {
      console.log('Data received from server:', response.data);
      fileName.value = selectedFile.value.name;
      Object.assign(store, response.data.data);
    } else {
      console.error('Error uploading data:', response.data);
    }
  } catch (error) {
    console.error('Failed to upload data:', error);
  } finally {
    toggleModal();
    jobDescription.value = '';
    selectedFile.value = null;

  }
};
const editFileName = () => {
  isEditing.value = true;
  nextTick(() => {
    fileNameInput.value?.focus();
  });

};
const disableEditing = () => {
  isEditing.value = false;
  if (!fileName.value) {
    fileName.value = 'Untitled.pdf';
  }
};

const exportToPDF = () => {
  const element = document.querySelector('.resume-container'); // 选择需要导出的内容
  console.log(element + '' + 'element');
  const options = {
    margin: 0,
    filename: fileName.value,
    image: {type: 'jpeg', quality: 0.98},
    html2canvas: {scale: 3, useCORS: true},
    jsPDF: {unit: 'in', format: [11, 17], orientation: 'portrait'}
  };

  html2pdf().set(options).from(element).save();
};
</script>

<style>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #CDCDCD;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  gap: 10px;
}

.toolbar .toolbar-btn {
  background-color: var(--button-primary-color);
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.toolbar .toolbar-btn.export {
  background-color: var(--accent-color); /* 使用不同颜色区分导出按钮 */
}

.toolbar .toolbar-btn:hover {
  opacity: 0.9;
}

.toolbar .toolbar-btn:active {
  transform: scale(0.98);
}

.toolbar button {
  padding: 5px 5px;
}

.file-input {
  display: flex;
}

.file-name {
  margin-left: 10px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  align-items: center;
}

.file-name-input {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 5px;
  width: auto;
  flex-shrink: 0;
}

.file-name-input:focus {
  outline: none;
  border-color: #007BFF;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.filename-edit {
  display: flex;
  align-items: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
}

.modal h3 {
  margin-top: 0;
}

.modal-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.modal-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--button-secondary-color);
}

.modal-btn.cancel {
  background-color: #ccc;
}

.modal-btn:hover {
  opacity: 0.9;
}

.choose-file {
  justify-content: space-between;
  gap: 10px;
  white-space: nowrap;
  background-color: var(--button-primary-color); /* 按钮背景颜色 */
  color: white; /* 按钮文字颜色 */
  padding: 10px 16px; /* 按钮内边距 */
  border-radius: 6px; /* 按钮圆角 */
  font-size: 14px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  display: inline-block; /* 使其看起来像按钮 */
  cursor: pointer; /* 鼠标悬浮变为手形 */
  text-align: center; /* 文字居中 */
  transition: background-color 0.3s ease, transform 0.2s ease; /* 交互动画 */
}

.file-input {
  display: none; /* 隐藏默认的文件选择框 */
}
.choose-and-filename{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-file-upload span {
  margin-left: 10px;
  font-size: 14px;
  color: #fffdfd;
}
</style>