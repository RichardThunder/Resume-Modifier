<!--
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-01-31 22:46:48
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-01-31 23:25:52
 * @FilePath: /Resume-Modifier/src/views/LoginPage.vue
 * @Description: 
 * 
-->

<template>

     <div class="login-page">
       <h1 class="title">Sign In</h1>
        <LoginForm @login="handleLogin" />
     </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue';
import {login} from '../services/authService.js';
import {setToken} from '../utils/auth.js';
import {useRouter} from 'vue-router';

const router = useRouter();

const handleLogin = async (username, password)=>{
  try{
    const data = await login(username, password);
    setToken(data.token);
    await router.push({name: 'Home'});
  }catch(error){
    console.error(error);
  }
}
</script>
<style scoped>
/* 页面整体样式 */
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f4f9;
}

/* 标题样式 */
.title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

/* 登录表单容器样式 */
.login-page > LoginForm {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

/* 登录页面背景 */
body {
  font-family: 'Arial', sans-serif;
  background-color: #eef0f3;
  margin: 0;
  padding: 0;
}
</style>