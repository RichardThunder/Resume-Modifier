/*
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-01-31 22:42:52
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-02-01 00:01:44
 * @FilePath: /Resume-Modifier/src/router/index.js
 * @Description:
 *
 */
import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../utils/auth";
import LoginPage from '@/views/LoginPage.vue';
import HomeView from '@/views/HomeView.vue';


const routes=[
  {
    path: '/my-resume',
    name: 'Home',
    component: HomeView,
    beforeEnter:(to,from,next)=>{
      if(!isAuthenticated()){
        next({name: 'Login'});
      }else{
        next();
      }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;