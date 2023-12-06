// main.js

import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from '@/plugins'
import axios from 'axios'

const app = createApp(App)

// Configurar Axios
const axiosInstance = axios.create({
  // Configuración personalizada si es necesario
});

// Hacer que Axios esté disponible globalmente a través de Vue.prototype
app.config.globalProperties.$axios = axiosInstance;

// Registrar otros plugins
registerPlugins(app)

app.mount('#app')
