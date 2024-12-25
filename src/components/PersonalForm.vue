<template>
  <div class="editor-panel">
    <person-info />
    <resume-summary/>
    <work-experience />
    <education />
    <skills />
    <achievements />
    <projects />
    <awards />
    <certification />
    <publications />
    <volunteering />
    <references />
  </div>
</template>

<script setup>
import PersonInfo from './form/personInfo.vue';
import ResumeSummary from './form/resume-summary.vue';
import WorkExperience from './form/work-experience.vue';
import Education from './form/Education.vue';
import Skills from './form/Skills.vue';
import Achievements from './form/Achievements.vue';
import Projects from './form/Projects.vue';
import Awards from './form/awards.vue';
import Certification from './form/certification.vue';
import Publications from './form/Publications.vue';
import Volunteering from './form/Volunteering.vue';
import References from './form/References.vue';


</script>

<style>


.input-group label {
  display: block;
  margin: 10px 0 5px;
}

.input-group input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.dropdown-sections button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background-color: #dfe6e9;
  border: none;
  cursor: pointer;
}
</style>