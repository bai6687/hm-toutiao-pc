// 导入路由
import VueRouter from 'vue-router'
// 导入vue
import Vue from 'vue'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome.vue'
import NotFound from '../views/404.vue'

// 导入auth模块
import auth from '@/utils/auth.js'

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
    },
    // 通配规则，匹配以上规则没处理的路径
    { path: '*', component: NotFound }
]

// 初始化路由实例
const router = new VueRouter({ routes })

// 导航守卫
router.beforeEach((to, from, next) => {
    // 如果访问的路径是除去登录外的路径，并且此时没有登录，拦截到登录页面
    // 其他情况一概放行
    const user = auth.getUser()
    // 如果user.token为空对象，返回undefined，!user.token返回true
    if (to.path !== '/login' && !user.token) return next('/login')
    next()
})

// 导出路由实例
export default router