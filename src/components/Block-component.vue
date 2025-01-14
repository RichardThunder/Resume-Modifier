<script setup>
import { ref, watch } from 'vue';
import {model} from '../model.js';

const props = defineProps({
  title: String,                    // 块标题 (如 "Work Experience", "Education" 等)
  icon: String,                     // 图标 (如 "💼", "🎓" 等)
  modelKey: String,                 // model中的键名 (如 "workExperience", "education" 等)
  showScore: {                      // 是否显示分数
    type: Boolean,
    default: false
  }
});

const visibleIndexes = ref([]);

function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

function initializeVisibility() {
  const currentArray = model[props.modelKey];
  while (visibleIndexes.value.length < currentArray.length) {
    visibleIndexes.value.push(false);
  }
  if (visibleIndexes.value.length > currentArray.length) {
    visibleIndexes.value.splice(currentArray.length);
  }
}

watch(
  () => model[props.modelKey],
  () => {
    initializeVisibility();
  },
  { deep: true }
);

initializeVisibility();

function deleteItem(index) {
  model[props.modelKey].splice(index, 1);
  visibleIndexes.value.splice(index, 1);
}

// 暴露给父组件的方法
defineExpose({
  visibleIndexes
});
</script>

<template>
  <div>
    <div class="block-header">
      <h2 class="section-title">{{ icon }} {{ title }}</h2>
      <slot name="add-button"></slot>
    </div>

    <div v-for="(item, index) in model[modelKey]" 
         :key="index" 
         class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>{{ title }} #{{ index + 1 }}</span>
        <div class="block-utils">
          <!-- 评分组件插槽 -->
          <slot name="score" 
                v-if="showScore" 
                :item="item" 
                :index="index">
          </slot>

          <img class="delete-block" 
               src="../../assets/block-delete.svg" 
               @click.stop="deleteItem(index)">
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </h3>

      <div v-if="visibleIndexes[index]" class="form-container">
        <slot name="form-content" 
              :item="item" 
              :index="index">
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>