<template>
  <!-- 当 items 数组不为空时，显示整个 Section -->
  <section class="resume-section" v-if="items && items.length">
    <h2>{{ sectionTitle }}</h2>
    <ul>
      <li v-for="(item, index) in items" :key="index" class="list-block">
        <!-- 左侧 -->
        <div class="flex-col width25">
          <!-- 机构/公司名 -->
          <DoubleClickEditable
              v-model="item.leftTitle"
              placeholder="Institution/Company"
              class="title"
          />

          <!-- 城市、国家 -->
          <p>
            <i>
              <DoubleClickEditable
                  v-model="item.leftSub"
                  placeholder="City, Country"
              />
            </i>
          </p>

          <!-- 日期区间 -->
          <i>
            <DoubleClickEditable
                v-model="item.dateRange"
                placeholder="YYYY-MM - YYYY-MM"
            />
          </i>
        </div>

        <!-- 右侧 -->
        <div class="width75 flex-col">
          <!-- 标题（如 "Bachelor's in Computer Science" / "Software Engineer" 等） -->
          <DoubleClickEditable
              v-model="item.rightTitle"
              placeholder="Title / Degree / Position"
              class="title"
          />

          <!-- 描述 -->
          <p>
            <DoubleClickEditable
                v-model="item.rightDesc"
                placeholder="Description..."
            />
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import DoubleClickEditable from './DoubleClickEditable.vue';
import { defineProps } from 'vue';

// 父组件传进来的 props
const props = defineProps({
  sectionTitle: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
/* 与示例类似的样式，可根据实际需要灵活调整 */
.resume-section {
  margin-bottom: 20px;
  page-break-inside: avoid;
  break-inside: avoid;
}

.resume-section h2 {
  border-bottom: 2px solid rgba(120, 197, 206, 0.55);
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
  background-color: rgba(158, 204, 209, 0.77);
}

.list-block {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.width25 {
  width: 25%;
}

.width75 {
  width: 75%;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  font-weight: bolder;
}
</style>