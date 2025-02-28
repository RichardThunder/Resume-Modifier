/*
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-02-26 18:28:48
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-02-28 04:40:51
 * @FilePath: /Resume-Modifier/vite.config.js
 * @Description: 
 * 
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
export default defineConfig({
  plugins: [vue()],
  //添加@->src
  resolve: {
    alias:{
      "@": path.resolve(__dirname,'src'),
    },
  },
  // change port to 3001
  server: {
    host: "0.0.0.0",
    port: 3001, 
  },
  base: "/",
});

