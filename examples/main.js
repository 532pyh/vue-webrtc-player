import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vueWebRTCPlayer from '@/index'

Vue.config.productionTip = false

Vue.use(vueWebRTCPlayer)


new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
