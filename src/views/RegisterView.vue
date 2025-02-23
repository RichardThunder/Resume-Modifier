<template>
  <div class="register-page">
    <h1 class="title">Sign Up</h1>
    <RegisterForm @register="handleRegister" />
  </div>
</template>

<script setup>
import RegisterForm from '@/components/RegisterForm.vue';
import {register} from '@/services/registerService.js';
const handleRegister = (formData) => {
  console.log(formData);
    register(formData)
};
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f4f9;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.register-page > RegisterForm {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #eef0f3;
  margin: 0;
  padding: 0;
}
</style>
