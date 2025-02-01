<template>
  <header class="header">

    <img src="../assets/bot.svg" alt="Logo" />
    <h1>ResumeBot</h1>
    <nav>
      <ul>

        <li><router-link to="/my-resume">My Resume</router-link></li>
        <li class="highlighted">Hot Template</li>
        <li>Job Market</li>
        <li>Profile</li>
      </ul>
      <div class="avatar"><img src="../assets/Avatar.png" alt="avatar"></div>
      <button class="signIn" @click="goToLogin">Sign In</button>
    </nav>
  </header>
</template>

<script setup>
import router from '@/router/index.js';
const goToLogin =()=>{
  router.push("/login");
}

</script>

<style>
.header {
  position: fixed; /* 固定定位 */
  top: 0; /* 紧贴页面顶部 */
  left: 0; /* 紧贴页面左侧 */
  width:100%; /* 占满页面宽度 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  z-index: 1000; /* 保证 Header 在其他内容之上 */
  background-color: var(--background-color);
  padding: 10px 10px 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.header img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.header h1 {
  align-items: center;
  display: flex;
  margin: 0 auto 0 0;
  font-weight: bold;
  font-size: 32px;
}

.header nav{
  display: flex;
  align-items: center;
  gap:15px;
}
.header nav ul {
  list-style: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;

}

.header nav ul li {
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  padding: 10px 0;
}

.header .highlighted {
  color: var(--fuchsia-100);
}

.signIn {
  color: white;
  border: none;
  cursor: pointer;

}
.header button {
  background-color: var(--button-primary-color);
  border: none;
  padding: 8px 12px;
  cursor: pointer;

}
.header .avatar {
  cursor: pointer;
}
.header nav ul router-link{
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
  padding: 10px 0;
}
</style>