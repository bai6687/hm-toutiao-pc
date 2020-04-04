import Vue from 'vue'
import App from './App.vue'

// 导入element包
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入路由实例
import router from './router/index.js'

// 导入配置好的axios
// 完整路径：./api/index.js
// 使用相对路径要根据目录结构进行书写，目录结构改变，
// @代表src的绝对路径（vue-cli下才可使用）
import axios from '@/api'

// 全局注册组件
// import MyBread from '@/components/my-bread'
// Vue.componnet(MyBread.name, MyBread)

// 导入公用样式
import '@/styles/index.less'

// 使用自己封装的组件
import plugin from '@/utils/plugin'
Vue.use(plugin)



// 挂载axios
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
