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

})
