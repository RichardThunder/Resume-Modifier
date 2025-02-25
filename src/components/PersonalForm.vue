<template>
  <div class="editor-panel">
    <div class="d-flex align-content-space-between mb-3 mx-auto">
      <button class="btn btn-sm btn-custom me-4" @click="resetResume">
        Reset
      </button>
      <button class="btn btn-sm btn-custom me-4" @click="clearResume">
        Clear
      </button>
    </div>
    <person-info />
    <resume-summary/>
    <education />
    <work-experience />
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
import PersonInfo from '@/components/form/PersonInfo.vue';
import ResumeSummary from '@/components/form/Summary.vue';
import WorkExperience from '@/components/form/WorkExperience.vue';
import Education from '@/components/form/Education.vue';
import Skills from '@/components/form/Skills.vue';
import Achievements from '@/components/form/Achievements.vue';
import Projects from '@/components/form/Project.vue';
import Awards from '@/components/form/Awards.vue';
import Certification from '@/components/form/Certification.vue';
import Publications from '@/components/form/Publications.vue';
import Volunteering from '@/components/form/Volunteering.vue';
import References from '@/components/form/References.vue';
import {reAssign} from "@/methods.js";
import {model, modelClear, modelExample} from "@/model.js";

const resetResume = () => {
  reAssign(model,modelExample);
}
const clearResume = () => {
  reAssign(model,modelClear)
}

</script>

<style scoped>
.editor-panel{
  display: flex;
  flex-direction: column;
  align-items: flex-start;

}
.btn-custom {
  background-color: #4a95ce;
  color: white;
  border: none;
}
.btn-custom:hover {
  background-color: #357ab5;
}
.btn-custom:focus {
  box-shadow: 0 0 0 0.2rem rgba(74, 149, 206, 0.5);
}



</style>