<template>
  <div class="double-click-editable">
    <!-- 非编辑状态 -->
    <span v-if="!isEditing" @dblclick="enableEdit">
      {{ localValue || placeholder }}
    </span>

    <!-- 编辑状态：textarea 或 input 皆可 -->
    <textarea
        v-else
        v-model="localValue"
        @blur="saveEdit"
        rows="1"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

// 接收父组件传来的 modelValue，实现 v-model
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['update:modelValue']);

// 本地编辑值 & 编辑状态
const localValue = ref(props.modelValue);
const isEditing = ref(false);

// 父 -> 子，同步更新
watch(
    () => props.modelValue,
    (newVal) => {
      localValue.value = newVal;
    }
);

// 启用编辑
const enableEdit = () => {
  isEditing.value = true;
};

// 完成编辑（失焦时触发）
const saveEdit = () => {
  isEditing.value = false;
  emits('update:modelValue', localValue.value);
};
</script>

<style scoped>
.double-click-editable {
  display: inline-block;
  min-width: 50px;
  cursor: pointer;
}
textarea {
  width: 100%;
  font: inherit;      /* 保持父元素字体一致 */
  line-height: inherit;
  resize: none;       /* 禁止拖拽改变大小 */
  border: 1px solid #ccc;
  outline: none;
  padding: 3px 5px;
}
</style>