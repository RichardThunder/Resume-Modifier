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
import ResumeView from '@/views/ResumeView.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import TemplateView from '@/views/TemplateView.vue';
import RegisterView from '@/views/RegisterView.vue';
import HomeView from '@/views/HomeView.vue';

const routes=[
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter:(to,from,next)=>{
      if(!isAuthenticated()){
        console.log('Please login first');
        next({name: 'Login'});
      }else{
        next();
      }
    }
  },

  {
    path: '/resume',
    name: 'Resume',
    component: ResumeView,
    beforeEnter:(to,from,next)=>{
      if(!isAuthenticated()){
        console.log('Please login first');
        next({name: 'Login'});
      }else{
        next();
      }
    }
  },
  {
    path: '/template',
    name: 'Template',
    component: TemplateView,
    beforeEnter:(to,from,next)=>{
      if(!isAuthenticated()){
        console.log('Please login first');
        next({name: 'Login'});
      }else{
        next();
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    beforeEnter:(to,from,next)=>{
      if(!isAuthenticated()){
        console.log('Please login first');
        next({name: 'Login'});
      }else{
        next();
      }
    }
  },
  {
    path: '/register',
    name:'Register',
    component: RegisterView
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
});

export default router;