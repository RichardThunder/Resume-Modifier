<template>
  <nav class="navbar navbar-expand-lg fixed-top bg-white shadow-sm py-2" >
    <div class="container-fluid px-4">
      <!-- Logo and Brand -->
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img src="../assets/bot.svg" alt="Logo" width="40" height="40" class="me-2">
        <span class="fw-bold fs-4">ResumeBot</span>
      </a>
      <!-- Mobile Toggle Button -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Content -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
        <ul class="navbar-nav  mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link fw-bold" to="/home">Home</router-link>
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
          <router-link to="/profile">
            <img
                v-if="messages.avatar"
                :src="messages.avatar"
                alt="Avatar"
                class="rounded-circle cursor-pointer"
                style="width: 36px; height: 36px; object-fit: cover;"

            >
          </router-link>
          <router-link to="/login">
          <button
              class="btn btn-primary">
            Sign In
          </button>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {onMounted, reactive} from 'vue';
import router from '@/router/index.js';
import Avatar from '@/assets/Avatar.png';
import 'bootstrap';
const messages = reactive({
  avatar: Avatar
});

/*onMounted(() => {
  const navbarContent = document.getElementById('navbarContent');
  if (navbarContent) {
    new bootstrap.Collapse(navbarContent);
  }
});*/

</script>

<style scoped>
.navbar {
  background-color: var(--background-color);
}

.cursor-pointer {
  cursor: pointer;
}

/* 确保导航栏下方内容不会被遮挡 */
/*.navbar + * {
  margin-top: 76px;
}*/

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