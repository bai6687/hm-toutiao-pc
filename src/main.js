import Vue from 'vue'
import App from './App.vue'

// 导入element包
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入路由实例
import router from './router/index.js'

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
