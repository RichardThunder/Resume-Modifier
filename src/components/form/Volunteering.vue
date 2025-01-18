<script setup>
import {ref, watch} from 'vue';
import {analysis, model} from '../../model.js';
import {scoreToColors} from '../../methods.js';

// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  while (visibleIndexes.value.length < model.volunteering.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  if (visibleIndexes.value.length > model.volunteering.length) {
    visibleIndexes.value.splice(model.volunteering.length);
  }
}
watch(
    () => model.volunteering,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addVolunteer() {
  model.volunteering.push({
    name: '',
    role: '',
    city: '',
    country: '',
    fromDate: '',
    toDate: '',
    description: ''
  });
  visibleIndexes.value.push(true);
}
function deleteVolunteer(index) {
  model.volunteering.splice(index, 1); // 从 model.workExperience 中删除指定索引的项目
  visibleIndexes.value.splice(index, 1); // 同步更新 visibleIndexes 的状态
}
</script>

<template>
    <div class="block-header">
      <h2 class="section-title">🌟 Volunteering</h2>
      <button @click="addVolunteer" class="add-button">Add</button>
    </div>


    <div v-for="(volunteering, index) in model.volunteering" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Volunteering #{{ index + 1 }}</span>
        <div class="block-utils">
          <v-tooltip v-if="analysis?.volunteering[index]"
                     :text="analysis?.volunteering[index].comment"
                     location="bottom"
                     max-width="500px"
                     close-delay="200"
          >
            <template v-slot:activator="{ props }">
              <span v-bind="props">
                <v-progress-circular :size="45" :width="5" :model-value="analysis.volunteering[index]?.score" :color="scoreToColors(analysis.volunteering[index]?.score)">
                  <template v-slot:default> <span class="score">{{analysis.volunteering[index]?.score}}</span></template>
                </v-progress-circular>
              </span>
            </template>
          </v-tooltip>
          <img class="delete-block" src="../../assets/block-delete.svg" @click="deleteVolunteer(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </h3>
      <!-- 表单内容 -->
      <div v-if="visibleIndexes[index]" class="form-container">
        <div class="form-group">
          <label>Volunteer Organization/Event</label>
          <input type="text" v-model="volunteering.name" placeholder="Name of the Organization/Event"/>
        </div>
        <div class="form-group">
          <label>Your Role</label>
          <input type="text" v-model="volunteering.role" placeholder="Your Role in Volunteering"/>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input type="text" v-model="volunteering.city" placeholder="City"/>
          </div>
          <div class="form-group">
            <label>Country</label>
            <input type="text" v-model="volunteering.country" placeholder="Country"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>From Date</label>
            <input type="date" v-model="volunteering.fromDate"/>
          </div>
          <div class="form-group">
            <label>To Date</label>
            <input type="date" v-model="volunteering.toDate">
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea
              v-model="volunteering.description"
              placeholder="Describe the volunteering work, responsibilities, and achievements"
          ></textarea>
        </div>
      </div>
    </div>

</template>

<style scoped>

</style>