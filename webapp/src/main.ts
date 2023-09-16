import App from './App.vue'
import { createApp } from 'vue'
import pinia from '@/store';
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.use(pinia)
app.mount('#app')
