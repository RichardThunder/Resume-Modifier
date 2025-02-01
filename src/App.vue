<!-- src/App.vue -->
<template>
  <div id="app">
    <Header/>
    <router-view></router-view>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
</script>