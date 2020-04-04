import axios from 'axios'
// 获取用户信息
import auth from '@/utils/auth'

import router from '@/router'

import JSONbig from 'json-bigint'

// 基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求头--页面刷新后执行
// axios.defaults.headers.Authorization = `Bearer ${auth.getUser().token}`

// 1.transformResponse 2.响应拦截器 3.then()catch()
axios.defaults.transformResponse = [data => {
    try {
        // id超过最大安全数值，json.parse之后跟后台不一样，需要使用插件转换
        return JSONbig.parse(data)
    } catch (e) {
        return data
    }
}]


// 请求拦截器--在每次请求前执行
// axios.interceptors.request.use(fn1,fn2)--fn1:配置，fn2：错误
axios.interceptors.request.use(config => {
    // 修改请求头配置，追加token
    // 从用户信息中解构token？
    const { token } = auth.getUser();
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
}, err => Promise.reject(err))

// 响应拦截器
axios.interceptors.response.use(res => res, err => {
    // 判断401状态码，清除本地token信息，跳转到登录页面
    // 获取响应状态码，在响应报文中，响应报文对象--res.response
    if (err.response && err.response.status === 401) {
        // 清除本地token
        auth.delUser()
        // 跳转到登录页面
        router.push('/login')
    }
    return Promise.reject(err)
})

export default axios