<!--
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-02-24 06:33:02
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-02-24 15:47:28
 * @FilePath: /Resume-Modifier/src/views/RegisterView.vue
 * @Description: 
 * 
-->
<template>
  <div class="register-page">
    <h1 class="title">Sign Up</h1>
    <RegisterForm @register="handleRegister" ref="registerFormRef"/>
    <div v-if="error" class="alert alert-danger mt-3" role="alert">
      {{ error }}
    </div>
    <div v-if="userEmail" class="alert alert-success">
      <strong>Success!</strong>  {{ countdown}} seconds return to login...
    </div>
  </div>

</template>

<script setup>
import RegisterForm from '@/components/RegisterForm.vue';
import {registerService} from '@/services/registerService.js';
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const error = ref(null);
const userEmail = ref(null);
const registerFormRef = ref(null);
const countdown = ref(5);
const router = useRouter();


const handleRegister = async (email,password) => {
  error.value = null;
  userEmail.value = null;
  countdown.value = 5;
  const result = await registerService.register(email,password);
  if (result.success) {
    userEmail.value = result.data.user.email;
    error.value = null;  // 清除错误信息
    registerFormRef.value.toggleLoading();
    const intervalId = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(intervalId);
        router.push('/login');
      }
    }, 1000);
  } else {
    // 注册失败，显示错误信息
    error.value = result.error;
    registerFormRef.value.toggleLoading();
  }
  setTimeout(() => {
    error.value = null;
  }, 3000);
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
