<template>
  <div class="toolbar">

    <div v-if="!isEditing" class="filename-edit">
    <button class="toolbar-btn rename" @click="editFileName">
      <img src="../assets/toolbar/ep_edit.svg" alt="edit"/>Rename
    </button>
      <span class="file-name">{{fileName}}</span>
    </div>

    <div v-else class="filename-edit">
      <button class="toolbar-btn rename" @click="disableEditing">
        <img src="../assets/toolbar/save.svg" alt="save"/>Save
      </button>
    <input type="text" class="file-name-input" ref="fileNameInput" v-model="fileName" @blur="disableEditing"  @keyup.enter="disableEditing"/>
    </div>

    <button class="toolbar-btn upload" @click="toggleUpload">
      <img src="../assets/toolbar/circum_export.svg" alt="upload"/>Upload
    </button>
    <input
        type="file"
        ref="fileInput"
        class="file-input"
        accept=".pdf"
        @change="handleFileUpload"
        v-show="showUpload"
    />
    <button class="toolbar-btn reanalyze">
      <img src="../assets/toolbar/mynaui_redo.svg" alt="redo"/>Re-Analyze
    </button>
    <button class="toolbar-btn undo">
      <img src="../assets/toolbar/material-symbols-light_undo.svg" alt="undo"/>Undo
    </button>
    <button class="toolbar-btn export" @click="exportToPDF">
      <img src="../assets/toolbar/material-symbols-light_download.svg" alt="export" />Export
    </button>
  </div>
</template>

<script setup>
import axios from 'axios';
import {store,fileName} from '../store.js';
import {nextTick, ref} from 'vue';
import html2pdf from 'html2pdf.js';

const showUpload = ref(false);
const fileInput = ref(null);
const isEditing = ref(false);
const fileNameInput =ref(null);

const toggleUpload = () => {
  showUpload.value = !showUpload.value;
  if (showUpload.value) {
    // 自动点击文件上传框
    fileInput.value?.click();
  }
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  fileName.value = file.name; // 保存文件名

  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await axios.post('http://localhost:8080/api/pdfupload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response.data.status === 200) {
      Object.assign(store, response.data.data);
      console.log('Data received from server:', store);
    } else {
      console.error('Error uploading PDF:', response.data);
    }
  } catch (error) {
    console.error('Failed to upload PDF:', error);
  } finally {
    showUpload.value = false;
  }
};
const editFileName = ()=>{
  isEditing.value=true;
  nextTick(()=>{fileNameInput.value?.focus();})

}
const disableEditing=()=>{
  isEditing.value=false;
  if(!fileName.value){
    fileName.value="Untitled.pdf";
  }
}

const exportToPDF=()=>{
  const element = document.querySelector('.resume-container'); // 选择需要导出的内容
  console.log(element+""+"element");
  const options = {
      margin: 0.5,
      filename: fileName.value,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2,useCORS: true, },
      jsPDF: { unit: 'in', format: [11,17], orientation: 'portrait' },
    };

    html2pdf().set(options).from(element).save();
}
/*const uploadPDF = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/pdfupload/');
    if (response.data.status === 200) {
      Object.assign(store,response.data.data);
      console.log("get data from server",store);
    } else {
      console.error('Error uploading PDF:', response.data);
    }
  } catch (error) {
    console.error('Failed to upload PDF:', error);
  }
};*/
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
  display: none;
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
.filename-edit{
  display: flex;
  align-items: center;
}

</style>