<!-- src/App.vue -->
<template>

    <Header/>

    <router-view></router-view>


</template>

<script setup>
import Header from './components/Header.vue';
</script>
<style scoped>
.main-content {
  padding-top: 68px; /* 确保header不被覆盖 */
}
</style>