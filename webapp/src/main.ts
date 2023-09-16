import App from './App.vue'
import { createApp } from 'vue'
import VueCountdown from '@chenfengyuan/vue-countdown';
import pinia from '@/store';
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

app.component(VueCountdown.name, VueCountdown);
app.use(pinia)
app.mount('#app')
