<template>
  <nav class="navbar navbar-expand-lg fixed-top bg-white shadow-sm py-2" >
    <div class="container-fluid px-4">
      <!-- Logo and Brand -->
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img src="../assets/bot.svg" alt="Logo" width="40" height="40" class="me-2">
        <span class="fw-bold fs-4">ResumeBot</span>
      </a>
      <button class="navbar-toggler" type="button" @click="toggleNavbar"  :aria-expanded="isNavbarOpen.toString()" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Content -->
       <div :class="['collapse', 'navbar-collapse', 'justify-content-end', { show: isNavbarOpen }]" id="navbarNavContent">
        <ul class="navbar-nav  mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link fw-bold" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link fw-bold" to="/Chart">Chart</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link fw-bold" to="/job_market">Job Market</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link fw-bold" to="/resume">Resume Editor</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link fw-bold text-primary" href="/template">Hot Template</a>
          </li>
        </ul>

        <!-- Avatar and Sign In -->
        <div class="d-flex align-items-center gap-3">
          <router-link  v-if="!isUserAuthenticated" to="/login">
            <button
                class="btn btn-primary">
              Sign In
            </button>
          </router-link>
          <router-link v-if="isUserAuthenticated" to="/profile">
            <img
                v-if="messages.avatar"
                :src="messages.avatar"
                alt="Avatar"
                class="rounded-circle cursor-pointer"
                style="width: 36px; height: 36px; object-fit: cover;"
            >
          </router-link>

        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {ref,onMounted, reactive} from 'vue';
import Avatar from '@/assets/Avatar.png';
import 'bootstrap';
import {isAuthenticated} from '@/utils/auth.js';
const messages = reactive({
  avatar: Avatar
});
const isUserAuthenticated = ref(isAuthenticated());
const isNavbarOpen = ref(false);
const toggleNavbar = () => {
      isNavbarOpen.value = !isNavbarOpen.value;
    }
onMounted(() => {
  // 监听用户认证状态变化
  window.addEventListener('storage', () => {
    isUserAuthenticated.value = isAuthenticated();
  });
});

</script>

<style scoped>
.navbar {
  background-color: var(--background-color);
}

.cursor-pointer {
  cursor: pointer;
}

/* 保持原有的主题色 */
.btn-primary {
  background-color: var(--button-primary-color);
  border-color: var(--button-primary-color);
}

.text-primary {
  color: var(--fuchsia-100) !important;
}

.nav-link {
  font-size: 18px;
}
</style>