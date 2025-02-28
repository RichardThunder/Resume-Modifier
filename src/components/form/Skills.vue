<template>
  <div class="mb-3 mx-auto w-90">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2 class="section-title">🛠️ Skills</h2>
    </div>
    <div v-if="showDragHint" class="alert alert-success pt-2">
      <strong>Drag</strong> and <strong>drop</strong> to reorder skills
    </div>
    <!-- 表单内容 -->
    <div class="card border-none">
      <div>
        <div class="skills-list" ref="skillsListRef">
          <transition-group name="skill" tag="div" class="d-flex flex-wrap">
            <div v-for="(skill, index) in model.skills" :key="skill" class="skill-item" draggable="true"
              @dragstart="dragStart(index)" @dragover.prevent="dragOver(index)" @dragenter.prevent="dragEnter(index)"
              @dragleave="dragLeave(index)" @drop="drop(index)" :class="{ 'drag-over': isDragOver === index }">
              <span class="badge skill-badge me-1">
                {{ skill }}
                <span class="remove-badge" @click="removeSkill(index)"><i class="bi bi-trash"></i></span>
              </span>
            </div>
          </transition-group>
        </div>

        <div class="add-skill-row d-flex justify-content-between align-items-center mb-2">
          <input v-model="newSkill" placeholder="Enter a skill" class="form-control me-2" @keydown.enter="addSkill" />
          <button @click="addSkill" class="btn btn-sm btn-custom ">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { model } from '@/model.js';
import { ref } from 'vue';
import { onMounted } from 'vue';

const showDragHint = ref(false);
const newSkill = ref('');
const draggingIndex = ref(null);
const skillsListRef = ref(null);
const isDragOver = ref(null);

function addSkill() {
  if (newSkill.value.trim() === '') return;
  model.skills.push(newSkill.value.trim());
  newSkill.value = '';
  showDragHint.value = true;
  setTimeout(() => {
    showDragHint.value = false;
  }, 3000);
}

function removeSkill(index) {
  model.skills.splice(index, 1);
}

function dragStart(index) {
  draggingIndex.value = index;
}

function dragOver(index) {
  isDragOver.value = index;
}

function dragEnter(index) {
  if (index !== draggingIndex.value) {
    isDragOver.value = index;
  }
}

function dragLeave(index) {
  isDragOver.value = null;
}

function drop(index) {
  if (index !== draggingIndex.value) {
    const skills = [...model.skills];
    const draggedSkill = skills[draggingIndex.value];
    skills.splice(draggingIndex.value, 1);
    skills.splice(index, 0, draggedSkill);
    model.skills = skills;
    draggingIndex.value = null;
    isDragOver.value = null;
  }
}

onMounted(() => {
  document.addEventListener('dragstart', (event) => {
    if (event.target.classList.contains('skill-item')) {
      event.dataTransfer.effectAllowed = 'move';
    }
  });

  document.addEventListener('dragover', (event) => {
    event.preventDefault();
  });
});
</script>

<style scoped>
.skills-list {
  display: flex;
  flex-wrap: wrap;
}

.skill-item {
  margin-right: 5px;
  margin-bottom: 5px;
  cursor: grab;
}

.skill-badge {
  background-color: #0071cd9d;
  color: white;
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 4px 0 4px 4px;
  border-radius: 0.375rem;
}

.add-skill-row {
  display: flex;
  align-items: center;
}

.add-skill-row input {
  margin-right: 10px;
}

.remove-badge {
  position: relative;
  top: auto;
  right: auto;
  margin-left: 5px;
  width: auto;
  height: auto;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  padding: 0 5px;
  transition: background-color 0.2s ease-in-out;
}

.remove-badge:hover {
  background-color: #357ab5;
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

/* Transition Styles */
.skill-enter-active,
.skill-leave-active {
  transition: all 0.3s ease;
}

.skill-enter-from,
.skill-leave-to {
  opacity: 0;
  transform: translateX(20px);
  /* Slide in/out from right */
}

.skill-move {
  transition: transform 0.3s ease;
  /* For reordering */
}

/* Highlight style for drop target */
.drag-over {
  background-color: rgba(0, 0, 0, 0.1);
  /* Subtle highlight */
}
</style>