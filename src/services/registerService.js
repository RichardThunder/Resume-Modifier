import router from '@/router/index.js';

export const register = async (username, email, password) => {
  try {
    // Simulate registration logic (e.g., calling an API to create a user)
    console.log('User registered:', username, email, password);
    // Redirect user to login page after successful registration
    await router.push({name: 'Login'});
  } catch (error) {
    console.error('Registration failed:', error);
  }
};