import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCoffee, faTrash, faCircleInfo, faPenToSquare } from '@fortawesome/free-solid-svg-icons'

library.add(faCoffee, faTrash, faCircleInfo, faPenToSquare)

const app = createApp(App)

app.use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
