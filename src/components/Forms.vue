<script setup>

</script>
<!--TODO 组件化-->
<template>
  <div class="block-header">
    <h2 class="section-title"><slot name="header"></slot></h2>
    <button  @click="addSection" class="add-button">Add</button>
    <span>{{ isVisible ? '▲' : '▼' }}</span>
  </div>
  <div class="blockComponent">

  </div>
</template>

<style scoped>

</style>