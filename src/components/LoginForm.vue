<!--
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-01-31 19:27:12
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-02-28 09:04:37
 * @FilePath: /Resume-Modifier/src/components/LoginForm.vue
 * @Description: 
 * 
-->
<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="email">email</label>
      <input
          type="text"
          id="email"
          v-model="loginForm.email"
          :class="{ 'error': errors.email }"
          @focus="clearError('email')"
      />
      <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input
          type="password"
          id="password"
          v-model="loginForm.password"
          :class="{ 'error': errors.password }"
          @focus="clearError('password')"
          @keydown.enter="handleSubmit"
      />
      <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
    </div>
    <div class="form-options">
    <div class="remember-me">
      <input type="checkbox" id="remember" v-model="loginForm.remember" class="remember-radio">
      <label for="remember">Remember</label>
      <router-link to="/forgot-password" class=" forgot-password" style="margin-left: auto">
        Forgot Password?
      </router-link>
    </div>

    <button type="submit" :disabled="isLoading">
      <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
      {{ isLoading ? 'Loading...' : 'Sign In' }}
    </button>
      <div class="register-link">
        Need an account?
        <router-link to="/register">Sign up</router-link>
      </div>
    </div>
  </form>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
onMounted(() => {
  const savedEmail = localStorage.getItem('email');
  const savedPassword = localStorage.getItem('password');

  if (savedEmail) {
    loginForm.email = savedEmail;
  }

  if (savedPassword) {
    loginForm.password = savedPassword;
  }
});
const loginForm = reactive({
    email: "",
    password: "",
    remember: false,
})
const errors = reactive({
  email: '',
  password: '',
});
const isLoading = ref(false);

const validateForm=()=>{
  let isValid = true
  errors.email="";
  errors.password="";

  if (!loginForm.email.trim()) {
    errors.email = 'Email required!';
    isValid = false;
  }

  if (!loginForm.password) {
    errors.password = 'Password required!';
    isValid = false;
  } else if (loginForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long!';
    isValid = false;
  }
  return isValid;
}
const clearError=(field)=> {
  errors[field] = '';
};
const emit = defineEmits(['login']);
const handleSubmit= async ()=> {
  if (!validateForm()) {
    return;
  }
  toggleLoading();
  try {
    // 发送登录信息给父组件处理
    emit('login',loginForm.email,loginForm.password);
    if (loginForm.remember) {
      localStorage.setItem('email', loginForm.email);
      localStorage.setItem('password', loginForm.password);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  } catch (error) {
    console.error('表单提交失败:', error)
  }
}

const toggleLoading = () => {
  isLoading.value = !isLoading.value;
};

defineExpose(
    {
      toggleLoading,
    }
)
</script>
<style scoped>
.login-form {
  max-width: 90%;
  /* Take up 90% of the screen width */
  width: 400px;
  /* Or whatever you want the max width to be */
  margin: 0 auto;
  /* Center the form */
}

.form-group {
  max-width: 100%;
  /* Full width within the form */
  margin: auto;
  margin-bottom: 1rem;
  /* Add some spacing between form groups */
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  /* Input fields should take the full width of their container */
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  /* Important: Include padding and border in the width */
}

input.error {
  border-color: #ff4d4f;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Push Forgot Password to the right */
  width: 100%;
  margin-bottom: 1rem;
}

.remember-me input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.remember-radio {
  border: none;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #40a9ff;
}

button:disabled {
  background-color: #bfbfbf;
  cursor: not-allowed;
}

.forgot-password {
  color: #1890ff;
  text-decoration: none;
  font-size: 0.875rem;
}

.forgot-password:hover {
  color: #40a9ff;
}

.register-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}

.register-link a {
  color: #1890ff;
  text-decoration: none;
  margin-left: 0.5rem;
}

.register-link a:hover {
  color: #40a9ff;
}

/* Media query for smaller screens (e.g., mobile) */
@media (max-width: 768px) {
  .login-form {
    max-width: 95%;
    /* Even wider on smaller screens */
  }

  .register-link {
    text-align: center;
  }
}
</style>