import { createApp } from 'vue'
import './styles/global.css'
//引入全局样式
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
// import vuetify from
const vuetify = createVuetify({
  components,
  directives,
})
createApp(App).use(vuetify).mount('#app')
