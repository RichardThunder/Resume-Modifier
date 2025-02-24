<template>
  <form class="register-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="email">Email</label>
      <input
          type="email"
          id="email"
          v-model="registerForm.email"
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
          v-model="registerForm.password"
          :class="{ 'error': errors.password }"
          @focus="clearError('password')"
      />
      <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirm Password</label>
      <input
          type="password"
          id="confirmPassword"
          v-model="registerForm.confirmPassword"
          :class="{ 'error': errors.confirmPassword }"
          @focus="clearError('confirmPassword')"
      />
      <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
    </div>

    <button type="submit" :disabled="isLoading" >
      <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
      {{ isLoading ? 'Loading...' : 'Sign Up' }}
    </button>

    <div class="login-link">
      Already have an account?
      <router-link to="/login">Sign in</router-link>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';

const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

const isLoading = ref(false);

const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';

  if (!registerForm.email.trim()) {
    errors.email = 'Email is required!';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
    errors.email = 'Invalid email format!';
    isValid = false;
  }

  if (!registerForm.password) {
    errors.password = 'Password is required!';
    isValid = false;
  } else if (registerForm.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long!';
    isValid = false;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match!';
    isValid = false;
  }

  return isValid;
};

const clearError = (field) => {
  errors[field] = '';
};
const emit = defineEmits();

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  toggleLoading();
  try {
     emit('register',registerForm.email,registerForm.password);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
const toggleLoading = () => {
  isLoading.value = !isLoading.value;
  console.log(isLoading.value);
};

defineExpose(
  {
    toggleLoading,
  }
)

</script>

<style scoped>
.register-form {
  width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input.error {
  border-color: #ff4d4f;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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
}

button:hover {
  background-color: #40a9ff;
}

button:disabled {
  background-color: #bfbfbf;
  cursor: not-allowed;
}

.login-link {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}

.login-link a {
  color: #1890ff;
  text-decoration: none;
}

.login-link a:hover {
  color: #40a9ff;
}
</style>
