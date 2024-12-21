<template>
  <div class="toolbar">
    <button class="toolbar-btn rename">
      <img src="../assets/toolbar/ep_edit.svg" alt="edit"/>Rename
    </button>
    <button class="toolbar-btn upload">
      <img src="../assets/toolbar/circum_export.svg" alt="upload"/>Upload
    </button>
    <button class="toolbar-btn reanalyze">
      <img src="../assets/toolbar/mynaui_redo.svg" alt="redo"/>Re-Analyze
    </button>
    <button class="toolbar-btn undo">
      <img src="../assets/toolbar/material-symbols-light_undo.svg" alt="undo"/>Undo
    </button>
    <button class="toolbar-btn export">
      <img src="../assets/toolbar/material-symbols-light_download.svg" alt="export"/>Export
    </button>
  </div>
</template>

<script>
export default {
  name: 'Toolbar',
};
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #CDCDCD;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  gap:10px;
}

.toolbar-btn {
  background-color: var(--button-primary-color);
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.toolbar-btn.export {
  background-color: var(--accent-color); /* 使用不同颜色区分导出按钮 */
}

.toolbar-btn:hover {
  opacity: 0.9;
}

.toolbar-btn:active {
  transform: scale(0.98);
}
button{
  padding: 5px 5px;
}
</style>