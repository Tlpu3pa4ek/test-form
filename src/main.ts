import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './style.css';

// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'




// Компоненты PrimeVue (регистрируй нужные отдельно)
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Password from "primevue/password";
import InlineMessage from "primevue/inlinemessage";

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue)

// Глобальная регистрация компонентов
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('Password', Password)
app.component('InlineMessage', InlineMessage)

app.mount('#app')