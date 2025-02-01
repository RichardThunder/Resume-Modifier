import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vite.dev/config/
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
    port: 3001, 
  },

})
