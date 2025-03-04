/*
 * @Author: Richard yuetingpei888@gmail.com
 * @Date: 2025-01-19 09:12:24
 * @LastEditors: Richard yuetingpei888@gmail.com
 * @LastEditTime: 2025-01-31 22:24:02
 * @FilePath: /Resume-Modifier/src/main.js
 * @Description:
 *
 */
import { createApp } from "vue";
//引入全局样式
import "./styles/global.css";
import App from "./App.vue";
import router from './router/index.js';
// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
const vuetify = createVuetify({
  components,
  directives,
  icons:{
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  }
});
createApp(App).use(vuetify).use(router).mount("#app");
