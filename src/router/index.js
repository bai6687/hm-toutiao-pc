// 导入路由
import VueRouter from 'vue-router'
// 导入vue
import Vue from 'vue'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'

// 注册路由
Vue.use(VueRouter)

// 声明路由规则
const routes = [
    { path: '/login', component: Login },
    {
        path: '/',
        component: Home,
        children: [
            { path: '/', component: Welcome }
        ]
    }
]

// 初始化路由实例
const router = new VueRouter({ routes })

// 导出路由实例
export default router