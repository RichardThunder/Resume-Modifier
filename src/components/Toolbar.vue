<template>
  <div class="toolbar">
    <div v-if="!isEditing" class="filename-edit">
      <button class="toolbar-btn rename" @click="editFileName">
        <img src="../assets/toolbar/ep_edit.svg" alt="edit"/>Rename
      </button>
    </div>

    <div v-else class="filename-edit">
      <button class="toolbar-btn rename" @click="disableEditing">
        <img src="../assets/toolbar/save.svg" alt="save"/>Save
      </button>
      <input type="text" class="file-name-input" ref="fileNameInput" v-model="fileName" @blur="disableEditing"
             @keyup.enter="disableEditing"/>
    </div>

    <button class="toolbar-btn upload" @click="toggleModalRM">
      <img src="../assets/toolbar/circum_export.svg" alt="upload Resume"/>Resume
    </button>
    <button class="toolbar-btn upload" @click="toggleModalJD">
      <img src="../assets/toolbar/circum_export.svg" alt="upload JD"/>JD
    </button>
    <button class="toolbar-btn undo" :disabled="history.length <= 1" @click="undo">
      <img src="../assets/toolbar/material-symbols-light_undo.svg" alt="undo"/>Undo
    </button>
    <button class="toolbar-btn redo" :disabled="future.length === 0"  @click="redo">
      <img src="../assets/toolbar/material-symbols-light_redo.svg" alt="redo"/>Redo
    </button>
    <button class="toolbar-btn export" @click="exportToPDF">
      <img src="../assets/toolbar/material-symbols-light_download.svg" alt="export"/>Export PDF
    </button>
  </div>
  <!-- 弹出窗口 -->
  <div v-if="showModalRM" class="modal-overlay">
<!--    <div v-if="isLoading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>-->
<!--    <div v-else class="modal">-->
    <div class="my-modal">
      <h3>Upload File</h3>
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
        <button class="modal-btn cancel" @click="toggleModalRM">Cancel</button>
        <button class="modal-btn" @click="submitDataRM">Submit</button>
      </div>
    </div>
  </div>
  <!-- 弹出窗口 -->
  <div v-if="showModalJD" class="modal-overlay">
    <div v-if="isLoading" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
    <div v-else class="my-modal">
      <h3>Upload Job Description</h3>
      <label for="jobDescription">Job Description:</label>
      <textarea
          id="jobDescription"
          v-model="jobDescription"
          placeholder="Enter Job Description"
          class="modal-input"
      />
      <div class="modal-actions">
        <button class="modal-btn cancel" @click="toggleModalJD">Cancel</button>
        <button class="modal-btn" @click="submitDataJD">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import {model, fileName, analysis} from '../model.js';
import {nextTick, ref, watch} from 'vue';
import {cloneDeep} from 'lodash-es';

const fileInput = ref(null);
const isEditing = ref(false);
const fileNameInput = ref(null);
const showModalRM = ref(false);
const showModalJD = ref(false);
const jobDescription = ref('');
const selectedFile = ref(null);
const isLoading = ref(false);
const API_URL = import.meta.env.VUE_APP_API_URL;
const history = ref([]); // 历史状态栈
const future = ref([]); // 未来状态栈 (用于 redo)
let ignoreChange = ref(false);

//监听model变化, 记录历史
watch(model, (newModel)=>{
  if(!ignoreChange.value){
    history.value.push(cloneDeep(newModel));
    future.value = []; // 清空 redo 栈
    console.log("History:", history.value);
  }else{
    ignoreChange.value=false; //重置标志位
  }
},{deep:true});

const undo =()=>{
  if(history.value.length>1){
    future.value.push(cloneDeep(model));
    history.value.pop();
    ignoreChange.value = true;
    Object.assign(model,cloneDeep(history.value[history.value.length-1]));
    console.log("Undo History:",history.value);
    console.log("Future:", future.value);
  }else{
    console.log("Nothing to undo");
  }
}

const redo = () => {
  if (future.value.length > 0) {
    history.value.push(cloneDeep(model)); // 当前状态推入 history 栈
    ignoreChange.value = true; // 避免重复记录
    Object.assign(model, cloneDeep(future.value.pop()));  // 恢复到 future 栈顶状态
    console.log("Redo. Future:", future.value);
    console.log("History:", history.value)
  } else {
    console.log("Nothing to redo.");
  }
};

const toggleModalRM = () => {
  showModalRM.value = !showModalRM.value;
};

const toggleModalJD = () => {
  showModalJD.value = !showModalJD.value;
};

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const submitDataRM = async () => {
  if (!selectedFile.value) {
    alert('Please provide a file.');
    return;
  }
  const formData = new FormData();
  formData.append('file', selectedFile.value);


  try {
    // 设置加载状态为 true
    isLoading.value = true;
    const response = await axios.post(
        `${API_URL}/pdfupload`,
        formData,
        {
      headers: {'Content-Type': 'multipart/form-data'},
      withCredentials: true
    });
    if (response.data.status === 200) {
      console.log('Data received from server:', response.data);
      fileName.value = selectedFile.value.name;
      // 1) 先删除旧属性
      Object.keys(model).forEach(key => {
        delete model[key]
      })
      // 2) 把 newData 的属性合并进来
      Object.assign(model, response.data.data);
      console.log(model);
      // convertModel(model,textToHtml);
    } else {
      alert('Failed to upload data. Please try again.');
      console.error('Error uploading data:', response.data);
    }
  } catch (error) {

    console.error('Failed to upload data:', error);
  } finally {
    // 结束加载状态
    isLoading.value = false;
    toggleModalRM();
    // jobDescription.value = '';
    // selectedFile.value = null;
  }
};

const submitDataJD = async () => {
  if (!jobDescription.value) {
    alert('Please provide a job description ');
    return;
  }
  isLoading.value = true;
  try {
    const response = await axios.post(
        `${API_URL}/job_description_upload`,
        jobDescription.value,
        {
      headers: {'Content-Type': 'text/plain'},
          withCredentials: true
    }
    );
    if (response.data.status === 200) {
      console.log('Data received from server:', response.data);
      Object.keys(analysis).forEach(key => {
        delete analysis[key]
      })
      Object.assign(analysis, response.data.data);
    } else {
      alert('Failed to upload data. Please try again.');
      console.error('Error uploading data:', response.data);
    }
  } catch (error) {
    console.error('Failed to upload data:', error);
  } finally {
    // 设置加载状态为 false
    isLoading.value = false;
    toggleModalJD();
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

const exportToPDF = async () => {
  const element = document.querySelector('.resume-container');
  const tmpTitle = document.title;
  document.title = fileName.value;
  window.print();
  document.title = tmpTitle;
};


</script>

<style >
.toolbar {
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #CDCDCD;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  gap: 10px;
  min-width: 210mm;

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
  background-color: var(--button-thirdary-color); /* 使用不同颜色区分导出按钮 */
}

.toolbar .toolbar-btn:hover {
  opacity: 0.9;
}

.toolbar .toolbar-btn:active {
  transform: scale(0.98);
}
.toolbar .toolbar-btn:disabled {  /*  禁用状态样式  */
  background-color: #ddd; /*  或其他你想要的颜色  */
  color: #999;
  cursor: not-allowed; /*  鼠标变为禁止图标  */
  opacity: 0.9;        /* 稍微降低透明度  */
}
.toolbar button {
  padding: 5px 5px;
}

.file-input {
  display: flex;
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

.my-modal {
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

.choose-and-filename {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-file-upload span {
  margin-left: 10px;
  font-size: 14px;
  color: #fffdfd;
}


@keyframes modal-in {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}



/* Spinner Overlay */
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Spinner */
.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid var(--button-primary-color);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

/* Spinner Animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>