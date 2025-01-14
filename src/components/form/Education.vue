<script setup>
import {ref, watch} from 'vue';
import {model} from '../../model.js';
import {scoreToColors} from '../../methods.js';

// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  while (visibleIndexes.value.length < model.education.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  if (visibleIndexes.value.length > model.education.length) {
    visibleIndexes.value.splice(model.education.length);
  }
}

watch(
    () => model.education,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();
function addEducation(){
  model.education.push({
    institutionName:'',
    fieldOfStudy:'',
    degree:'',
    grade:'',
    city:'',
    country:'',
    fromDate:'',
    toDate:'',
    isPresent:false,
    description:'',
  })
  visibleIndexes.value.push(true);
}
function deleteEducation(index) {
  model.education.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}
</script>

<template>

    <div class="block-header">
      <h2 class="section-title">🎓 Education</h2>
      <button @click="addEducation" class="add-button">Add</button>
    </div>
    <!-- 遍历 model.education 数组 -->
    <div v-for="(education, index) in model.education" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Education #{{ index + 1 }}</span>
        <div class="block-utils">
          <v-tooltip v-if="model.education[index].score"
              :text="model.education[index].comment"
                     location="bottom"
                     max-width="500px"
                     close-delay="200"
          >
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="model.education[index].score" :color="scoreToColors(model.education[index].score)">
                  <template v-slot:default> <span class="score">{{model.education[index].score}}</span></template>
                </v-progress-circular>
              </span>
            </template>
          </v-tooltip>

          <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteEducation(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </h3>
      <!-- 动态显示/隐藏 -->
      <div v-if="visibleIndexes[index]" class="form-container">
        <div class="form-row">
          <div class="form-group">
            <label>Institution Name</label>
            <input type="text" v-model="model.education[index].institutionName" placeholder="Institution Name"/>
          </div>
          <div class="form-group">
            <label>Field of Study</label>
            <input type="text" v-model="model.education[index].fieldOfStudy" placeholder="Field of Study"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Degree</label>
            <input type="text" v-model="model.education[index].degree" placeholder="Degree"/>
          </div>
          <div class="form-group">
            <label>Grade</label>
            <input type="text" v-model="model.education[index].grade" placeholder="Grade or Classification"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input type="text" v-model="model.education[index].city" placeholder="City"/>
          </div>
          <div class="form-group">
            <label>Country</label>
            <input type="text" v-model="model.education[index].country" placeholder="Country"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>From Date</label>
            <input type="date" v-model="model.education[index].fromDate"/>
          </div>
          <div class="form-group">
            <label>To Date</label>
            <input type="date" v-model="model.education[index].toDate" :disabled="model.education[index].isPresent"/>
          </div>
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="model.education[index].isPresent"/> Currently Studying Here
          </label>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea
              v-model="model.education[index].description"
              placeholder="Describe your education details, achievements, or notable projects"
          ></textarea>
        </div>
      </div>
    </div>
</template>
<style scoped>

</style>