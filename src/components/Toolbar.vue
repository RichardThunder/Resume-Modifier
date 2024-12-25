<template>
  <div class="toolbar">
    <button class="toolbar-btn rename">
      <img src="../assets/toolbar/ep_edit.svg" alt="edit"/>Rename
    </button>
    <button class="toolbar-btn upload" @click="uploadPDF">
      <img src="../assets/toolbar/circum_export.svg" alt="upload"/>Upload
    </button>
    <button class="toolbar-btn reanalyze">
      <img src="../assets/toolbar/mynaui_redo.svg" alt="redo"/>Re-Analyze
    </button>
    <button class="toolbar-btn undo">
      <img src="../assets/toolbar/material-symbols-light_undo.svg" alt="undo"/>Undo
    </button>
    <button class="toolbar-btn export">
      <img src="../assets/toolbar/material-symbols-light_download.svg" alt="export"/>Export
    </button>
  </div>
</template>

<script setup>
import axios from 'axios';
import {store} from '../store.js';

const uploadPDF = async () => {
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
</style>