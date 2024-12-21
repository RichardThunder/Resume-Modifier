<template>
  <div id="app">
    <!-- 头部 -->
    <Header />

    <div class="container">

        <PersonalForm />



      <!-- 右侧预览 -->
      <ResumePreview class="preview" />
  </div>
  </div>
</template>

<script>
import PersonalForm from './components/PersonalForm.vue';
import ResumePreview from './components/ResumePreview.vue';
import Header from './components/Header.vue';

export default {
  components: {
    Header,
    PersonalForm,
    ResumePreview,
  },

};
</script>

<style>
.container {
  display: flex;
  height: 100vh;
  padding: 64px 0;

}

.preview {
  padding: 20px;
}
</style>