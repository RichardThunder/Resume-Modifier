<script setup>
import {ref, watch} from 'vue';
import {store} from '../../store.js';

// 控制每个组件的显示/隐藏状态
const visibleIndexes = ref([]);

// 切换指定组件的显示/隐藏状态
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 初始化 visibleIndexes 的状态
function initializeVisibility() {
  while (visibleIndexes.value.length < store.volunteering.length) {
    visibleIndexes.value.push(false); // 新增的默认值为 false
  }
  if (visibleIndexes.value.length > store.volunteering.length) {
    visibleIndexes.value.splice(store.volunteering.length);
  }
}
watch(
    () => store.volunteering,
    () => {
      initializeVisibility();
    },
    { deep: true } // 深度监听以捕获数组内容的变化
);
// 初始化显示状态
initializeVisibility();

function addVolunteer() {
  store.volunteering.push({
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
</script>

<template>
  <div>
    <div class="block-header">
      <h2 class="section-title">🌟 Volunteering</h2>
      <button @click="addVolunteer" class="add-button">Add</button>
    </div>


    <div v-for="(volunteering, index) in store.volunteering" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>Volunteering #{{ index + 1 }}</span>
        <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
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
            <input type="date" v-model="volunteering.toDate"/>
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
  </div>
</template>

<style scoped>

</style>