<script setup>
import {ref, watch} from 'vue';
import {analysis, model} from '../../model.js';
import {scoreToColors} from '../../methods.js';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const showData = (index)=>{
  console.log(model.workExperience[index].description);
}
// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  // 确保 visibleIndexes 长度与 model.workExperience 一致
  while (visibleIndexes.value.length < model.workExperience.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  // 如果 visibleIndexes 长度超过 model.workExperience，则截断
  if (visibleIndexes.value.length > model.workExperience.length) {
    visibleIndexes.value.splice(model.workExperience.length);
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
      [{ 'header': [1, 2, 3, false] }],      // 标题
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // 列表
      ['clean']                               // 清除格式
    ]
  },
};
// 保存工作经验（根据需要自定义，例如 API 调用）
function saveExperience(index) {
  console.log(`Saved Work Experience #${index + 1}`);
  console.log(model.workExperience);
}
</script>

<template>

    <div class="block-header">
      <h2 class="section-title">💼 Work Experience</h2>
      <button @click="addExperience" class="add-button">Add</button>
    </div>
    <!-- 遍历 model.workExperience 数组 -->
    <div v-for="(experience, index) in model.workExperience" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Work Experience #{{ index + 1 }}</span>
        <div class="block-utils">
          <v-tooltip v-if="analysis?.workExperience[index]"
              :text="analysis.workExperience[index]?.comment"
                     location="bottom"
                     max-width="500px"
                     close-delay="200"
          >
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.workExperience[index]?.score" :color="scoreToColors(analysis.workExperience[index]?.score)">
                  <template v-slot:default> <span class="score">{{analysis.workExperience[index]?.score}}</span></template>
                </v-progress-circular>
              </span>
            </template>
          </v-tooltip>

          <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteExperience(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>

      </h3>
      <!-- 动态显示/隐藏 -->
      <div v-if="visibleIndexes[index]" class="form-container">
        <div class="form-row">
          <div class="form-group">
            <label>Company Name</label>
            <input type="text" v-model="model.workExperience[index].companyName" placeholder="Company Name"/>
          </div>
          <div class="form-group">
            <label>Job Title</label>
            <input type="text" v-model="model.workExperience[index].jobTitle" placeholder="Job Title"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input type="text" v-model="model.workExperience[index].city" placeholder="City"/>
          </div>
          <div class="form-group">
            <label>Country</label>
            <input type="text" v-model="model.workExperience[index].country" placeholder="Country"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>From Date</label>
            <input type="date" v-model="model.workExperience[index].fromDate"/>
          </div>
          <div class="form-group">
            <label>To Date</label>
            <input type="date" v-model="model.workExperience[index].toDate"
                   :disabled="model.workExperience[index].isPresent"/>
          </div>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="model.workExperience[index].isPresent"/> Currently Working Here
          </label>
        </div>
        <div class="form-group">
          <label>Job Description</label>
<!--          <textarea v-model="model.workExperience[index].description"-->
<!--                    placeholder="Describe your responsibilities and achievements">-->
<!--          </textarea>-->
          <QuillEditor
              v-model:content="model.workExperience[index].description"
              content="model.workExperience[index].description"
              content-type="text"
              :options="editorOptions"
              @blur="saveExperience(index)"
          />
          <button @click="showData(index)">showData</button>
        </div>
      </div>
    </div>

</template>
<style scoped>
/* 容器样式 */

</style>
