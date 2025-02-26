<script setup>
import {ref, watch} from 'vue';
import {analysis, model} from '@/model.js';
import {scoreToColors} from '@/methods.js';
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import FeedbackForm from "@/components/FeedbackForm.vue";

const showData = (index) => {
  console.log(model.workExperience[index].description);
}
// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);
const sectionType = ref('workExperience');

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  if (model.workExperience?.length > 0) {
    // 确保 visibleIndexes 长度与 model.workExperience 一致
    while (visibleIndexes.value.length < model.workExperience.length) {
      visibleIndexes.value.push(false); // 新增的默认值为 false
    }
    // 如果 visibleIndexes 长度超过 model.workExperience，则截断
    if (visibleIndexes.value.length > model.workExperience.length) {
      visibleIndexes.value.splice(model.workExperience.length);
    }
  }
}

watch(
    () => model.workExperience,
    () => {
      initializeVisibility();
    },
    {deep: true} // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();


// 添加新项目的函数
function addExperience() {
  model.workExperience.push({
    companyName: '',
    jobTitle: '',
    city: '',
    country: '',
    fromDate: '',
    toDate: '',
    isPresent: false,
    description: ''
  });
  visibleIndexes.value.push(true);
}

function deleteExperience(index) {
  model.workExperience.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}

// 编辑器配置选项
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline'],        // 加粗、斜体、下划线
      [{'header': [1, 2, 3, false]}],      // 标题
      [{'list': 'ordered'}, {'list': 'bullet'}], // 列表
      ['clean']                               // 清除格式
    ]
  },
};

// 保存工作经验（根据需要自定义，例如 API 调用）
function saveExperience(index) {
  console.log(`Saved Work Experience #${index + 1}`);
  console.log(model.workExperience);
}

// feedback with array
const isModalVisible = ref(false);

const loading = ref(false);
const toggleModal = () => {
  isModalVisible.value = !isModalVisible.value;
}
</script>

<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2 class="section-title">💼 Work Experience</h2>
      <button @click="addExperience" class="btn btn-sm btn-custom me-4">Add</button>
    </div>

    <div v-for="(experience, index) in model.workExperience" :key="index" class="card mb-2">
      <div
          class="card-header d-flex justify-content-between align-items-center p-2"
          @click="toggleShow(index)"
          style="cursor: pointer;"
          :aria-expanded="visibleIndexes[index]"
          :aria-controls="'work-experience-details-' + index"
          role="button"
      >
        <span>Work Experience #{{ index + 1 }}</span>
        <div class="d-flex align-items-center">
          <v-tooltip v-if="analysis.workExperience[index]?.score" :text="analysis.workExperience[index]?.comment"
                     location="bottom" max-width="500px" close-delay="200">
            <template v-slot:activator="{ props }">
                            <span v-bind="props">
                                <v-progress-circular :size="35" :width="4"
                                                     :model-value="analysis.workExperience[index].score"
                                                     :color="scoreToColors(analysis.workExperience[index].score)">
                                    <template v-slot:default>
                                        <span class="score">{{ analysis.workExperience[index].score }}</span>
                                    </template>
                                </v-progress-circular>
                            </span>
            </template>
          </v-tooltip>
          <img
              class="delete-block ms-1"
              src="../../assets/block-delete.svg"
              alt="delete"
              @click="deleteExperience(index)"
          />
<!--          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>-->
          <span>{{'▼' }}</span>
        </div>
      </div>
      <transition name="slide">
        <div
            v-if="visibleIndexes[index]"
            class="card-body p-2"
            :id="'work-experience-details-' + index"
        >
          <div class="row mb-0">
            <div class="col-md-6">
              <div class="mb-0">
                <label class="form-label" for="companyName-{{ index }}">Company Name</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="experience.companyName"
                    placeholder="Company Name"
                    :id="'companyName-' + index"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-0">
                <label class="form-label" for="jobTitle-{{ index }}">Job Title</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="experience.jobTitle"
                    placeholder="Job Title"
                    :id="'jobTitle-' + index"
                />
              </div>
            </div>
          </div>

          <div class="row mb-0">
            <div class="col-md-6">
              <div class="mb-0">
                <label class="form-label" for="city-{{ index }}">City</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="experience.city"
                    placeholder="City"
                    :id="'city-' + index"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-0">
                <label class="form-label" for="country-{{ index }}">Country</label>
                <input
                    type="text"
                    class="form-control form-control-sm"
                    v-model="experience.country"
                    placeholder="Country"
                    :id="'country-' + index"
                />
              </div>
            </div>
          </div>

          <div class="row mb-0">
            <div class="col-md-6">
              <div class="mb-0">
                <label class="form-label" for="fromDate-{{ index }}">From Date</label>
                <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="experience.fromDate"
                    :id="'fromDate-' + index"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-0">
                <label class="form-label" for="toDate-{{ index }}">To Date</label>
                <input
                    type="date"
                    class="form-control form-control-sm"
                    v-model="experience.toDate"
                    :disabled="experience.isPresent"
                    :id="'toDate-' + index"
                />
              </div>
            </div>
          </div>

          <div class="mb-0 form-check">
            <input
                type="checkbox"
                class="form-check-input"
                v-model="experience.isPresent"
                :id="'isPresent-' + index"
            />
            <label class="form-check-label" :for="'isPresent-' + index">Currently Working Here</label>
          </div>

          <div class="mb-0">
            <label class="form-label" for="description-{{index}}">Job Description</label>
            <textarea class="form-control form-control-sm" v-model="experience.description"
                      placeholder="Describe your experience details, achievements, or notable projects"></textarea>
            <div class="d-flex justify-content-end">
              <button @click="toggleModal" class="btn btn-sm btn-custom mt-2">
                AI Writer
              </button>
            </div>
          </div>
          <div v-if="isModalVisible" class="modal fade show" style="display: block;">
            <FeedbackForm @close="toggleModal" v-model="experience.description" :sectionType=sectionType
                          :section="experience" :updated_resume="model"/>
            <div v-if="isModalVisible" class="modal-backdrop fade show"></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<style scoped>


.section-title {
  margin-bottom: 0;
}

.delete-block {
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.delete-block:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

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

</style>
