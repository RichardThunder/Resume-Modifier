<template>
  <div class="toolbar d-flex align-items-center justify-content-between bg-toolbar p-2 border-bottom">
    <div v-if="!isEditing" class="filename-edit">
      <button class="btn btn-sm btn-custom btn-outline-dark rename" @click="editFileName">
        <img src="../assets/toolbar/ep_edit.svg" alt="edit" class="me-1" style="width: 16px; height: 16px;"/>Rename
      </button>
    </div>

    <div v-else class="filename-edit d-flex align-items-center">
      <button class="btn btn-sm btn-success me-2" @click="disableEditing">
        <img src="../assets/toolbar/save.svg" alt="save" class="me-1" style="width: 16px; height: 16px;"/>Save
      </button>
      <input type="text" class="form-control form-control-sm file-name-input" ref="fileNameInput" v-model="fileName"
             @blur="disableEditing" @keyup.enter="disableEditing"/>
    </div>

    <div>
      <button class="btn btn-sm btn-custom me-4" @click="toggleModalRM">
        <img src="../assets/toolbar/circum_export.svg" alt="upload Resume" class="me-1"
             style="width: 16px; height: 16px;"/>Resume
      </button>
      <button class="btn btn-sm btn-custom me-4" @click="toggleModalJD">
        <img src="../assets/toolbar/circum_export.svg" alt="upload JD" class="me-1" style="width: 16px; height: 16px;"/>JD
      </button>
      <button class="btn btn-sm btn-custom me-4 " :disabled="history.length <= 1" @click="undo">
        <img src="../assets/toolbar/material-symbols-light_undo.svg" alt="undo" class="me-1"
             style="width: 16px; height: 16px;"/>Undo
      </button>
      <button class="btn btn-sm btn-custom me-4" :disabled="future.length === 0" @click="redo">
        <img src="../assets/toolbar/material-symbols-light_redo.svg" alt="redo" class="me-1"
             style="width: 16px; height: 16px;"/>Redo
      </button>
      <button class="btn btn-sm btn-primary me-4" @click="saveResume">
        <img src="../assets/toolbar/save.svg" alt="save" class="me-1" style="width: 16px; height: 16px;"/>Save
      </button>
      <button class="btn btn-sm btn-primary" @click="exportToPDF">
        <img src="../assets/toolbar/material-symbols-light_download.svg" alt="export" class="me-1"
             style="width: 16px; height: 16px;"/>Export PDF
      </button>
    </div>
  </div>

  <!-- Resume Modal -->
  <div v-if="showModalRM" class="modal fade show" tabindex="-1" role="dialog"
       style="display: block; background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Upload Resume</h5>
          <button type="button" class="btn-close" @click="toggleModalRM"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="fileUpload" class="form-label">Choose a file</label>
            <input
                id="fileUpload"
                type="file"
                ref="fileInput"
                class="form-control"
                accept=".pdf"
                @change="handleFileChange"
            />
          </div>
          <div v-if="selectedFile">
            <span style="font-weight: bold">{{ selectedFile.name }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="toggleModalRM">Cancel</button>
          <button type="button" class="btn btn-primary" @click="submitDataRM" :disabled="isRMLoading">
            <span v-if="isRMLoading" class="spinner-border spinner-border-sm"></span>
           Submit
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Job Description Modal -->
  <div v-if="showModalJD" class="modal fade show" tabindex="-1" role="dialog"
       style="display: block; background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Upload Job Description</h5>
          <button type="button" class="btn-close" @click="toggleModalJD"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="jobDescription" class="form-label">Job Description:</label>
            <textarea
                id="jobDescription"
                v-model="jobDescription"
                placeholder="Enter Job Description"
                class="form-control"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="toggleModalJD">Cancel</button>
          <button type="button" class="btn btn-primary" @click="submitDataJD" :disabled="isJDLoading">
            <span v-if="isJDLoading" class="spinner-border spinner-border-sm"></span>
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Backdrop -->
  <div v-if="showModalRM || showModalJD" class="modal-backdrop fade show"></div>
</template>

<script setup>
import axios from 'axios';
import {model, fileName, analysis} from '../model.js';
import {nextTick, ref, watch} from 'vue';
import {cloneDeep} from 'lodash-es';
import {getToken} from '@/utils/auth.js';
import router from '@/router/index.js';

const fileInput = ref(null);
const isEditing = ref(false);
const fileNameInput = ref(null);
const showModalRM = ref(false);
const showModalJD = ref(false);
const jobDescription = ref('');
const selectedFile = ref(null);
const API_URL = import.meta.env.VITE_API_URL;
const history = ref([]); // 历史状态栈
const future = ref([]); // 未来状态栈 (用于 redo)
let ignoreChange = ref(false);
const isRMLoading = ref(false);
const isJDLoading = ref(false);

//监听model变化, 记录历史
watch(model, (newModel) => {
  if (!ignoreChange.value) {
    history.value.push(cloneDeep(newModel));
    future.value = []; // 清空 redo 栈
    console.log('History:', history.value);
  } else {
    ignoreChange.value = false; //重置标志位
  }
}, {deep: true});

const undo = () => {
  if (history.value.length > 1) {
    future.value.push(cloneDeep(model));
    history.value.pop();
    ignoreChange.value = true;
    Object.assign(model, cloneDeep(history.value[history.value.length - 1]));
    console.log('Undo History:', history.value);
    console.log('Future:', future.value);
  } else {
    console.log('Nothing to undo');
  }
};

const redo = () => {
  if (future.value.length > 0) {
    history.value.push(cloneDeep(model)); // 当前状态推入 history 栈
    ignoreChange.value = true; // 避免重复记录
    Object.assign(model, cloneDeep(future.value.pop()));  // 恢复到 future 栈顶状态
    console.log('Redo. Future:', future.value);
    console.log('History:', history.value);
  } else {
    console.log('Nothing to redo.');
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

  const jwtToken = getToken('token');
  if (!jwtToken) {
    alert('You need to Login to continue');
    await router.push({name: 'Login'});
    return;
  }
  if (!selectedFile.value) {
    alert('Please provide a file.');
    return;
  }
  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    isRMLoading.value = true;
    const response = await axios.post(
        `${API_URL}/pdfupload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${getToken('token')}`
          }

        });
    if (response.data.status === 200) {
      console.log('Data received from server:', response.data);
      fileName.value = selectedFile.value.name;
      // 1) 先删除旧属性
      Object.keys(model).forEach(key => {
        delete model[key];
      });
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
    isRMLoading.value = false;
    toggleModalRM();
    selectedFile.value = null;

  }
};

const submitDataJD = async () => {

  const jwtToken = getToken('token');
  if (!jwtToken) {
    console.error('JWT token not found');
    alert('You need to Login to continue');
    await router.push({name: 'Login'});
    return;
  }
  if (!jobDescription.value) {
    alert('Please provide a job description ');
    return;
  }

  try {
    isJDLoading.value = true;
    const response = await axios.post(
        `${API_URL}/job_description_upload`,
        {
          updated_resume: model,
          job_description: jobDescription.value
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          }
        }
    );
    if (response.data.status === 200) {
      console.log('Data received from server:', response.data);
      Object.keys(analysis).forEach(key => {
        delete analysis[key];
      });
      Object.assign(analysis, response.data.data);
    } else {
      alert('Failed to upload data. Please try again.');
      console.error('Error uploading data:', response.data);
    }
  } catch (error) {
    console.error('Failed to upload data:', error);
  } finally {
    // 设置加载状态为 false
    isJDLoading.value = false;
    toggleModalJD();
    jobDescription.value = null;
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
  // const element = document.querySelector('.resume-container');
  const tmpTitle = document.title;
  document.title = fileName.value;
  window.print();
  document.title = tmpTitle;
};

const saveResume = async () => {
  const jwtToken = getToken('token');
  if (!jwtToken) {
    console.error('JWT token not found');
    alert('You need to Login to continue');
    await router.push({name: 'Login'});
  } else {
    try {
      const response = await axios.put(
          `${API_URL}/save_resume`,
          model,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwtToken}`
            }
          }
      );
      if (response.data.status === 200) {
        console.log('Data saved successfully:', response.data);
      } else {
        console.error('Error saving data:', response.data);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
};


</script>

<style scoped>
.toolbar {
  min-width: 210mm;
}

/* Modal styles (Bootstrap handles most) */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.file-name-input {
  width: auto;
  flex-shrink: 0; /* Prevent input from shrinking */
}



/* Custom button style */
.btn-custom {
  background-color: #4a95ce;
  color: white;
  border: none;
}

.btn-custom:hover {
  background-color: #357ab5;
}

.btn-custom:focus {
  box-shadow: 0 0 0 0.2rem rgba(74, 149, 206, 0.5);
}

/* Tool bar background color */
.bg-toolbar {
  background-color: #ccc;
}
</style>