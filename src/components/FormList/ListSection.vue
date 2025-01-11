<template>
  <div class="list-section">
    <div class="block-header">
      <h2 class="section-title">{{ sectionTitle }}</h2>
      <button @click="addItem" class="add-button">Add</button>
    </div>
    <!-- 遍历 items 数组 -->
    <div v-for="(item, index) in items" :key="index" class="blockComponent">
      <h3 @click="toggleShow(index)" class="toggle-header">
        <span>{{ itemTitle }} #{{ index + 1 }}</span>
        <div class="block-utils">
          <img
              class="delete-block"
              :src="deleteIcon"
              @click.stop="deleteItem(index)"
              alt="Delete"
          />
          <span>{{ visibleIndexes[index] ? '▲' : '▼' }}</span>
        </div>
      </h3>
      <!-- 动态显示/隐藏 -->
      <div v-if="visibleIndexes[index]" class="form-container">
        <slot name="form" :item="item" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { scoreToColors } from '../../methods.js'; // 根据需要引入
import deleteIconPath from '../../assets/block-delete.svg'; // 引入删除图标

// 接收的 props
const props = defineProps({
  sectionTitle: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  addItemData: {
    type: Function,
    required: true
  },
  deleteItemData: {
    type: Function,
    required: true
  },
  itemTitle: {
    type: String,
    default: 'Item'
  }
});

// 定义内部状态
const visibleIndexes = ref([]);

// 初始化 visibleIndexes
function initializeVisibility() {
  while (visibleIndexes.value.length < props.items.length) {
    visibleIndexes.value.push(false);
  }
  if (visibleIndexes.value.length > props.items.length) {
    visibleIndexes.value.splice(props.items.length);
  }
}

// 监视 items 的变化
watch(
    () => props.items,
    () => {
      initializeVisibility();
    },
    { deep: true }
);

// 初始化显示状态
onMounted(() => {
  initializeVisibility();
});

// 切换显示/隐藏
function toggleShow(index) {
  visibleIndexes.value[index] = !visibleIndexes.value[index];
}

// 添加新项目
function addItem() {
  props.addItemData();
  visibleIndexes.value.push(true);
}

// 删除项目
function deleteItem(index) {
  props.deleteItemData(index);
  visibleIndexes.value.splice(index, 1);
}

// 引入删除图标
const deleteIcon = deleteIconPath;
</script>

<style scoped>
.list-section {
  margin-bottom: 20px;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 1.5em;
}

.add-button {
  padding: 5px 10px;
  cursor: pointer;
}

.blockComponent {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
}

.toggle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.block-utils {
  display: flex;
  align-items: center;
}

.delete-block {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 10px;
}

.form-container {
  margin-top: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>