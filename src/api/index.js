import axios from 'axios'
// 获取用户信息
import auth from '@/utils/auth'
// 基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求头--页面刷新后执行
// axios.defaults.headers.Authorization = `Bearer ${auth.getUser().token}`

// 请求拦截器--在每次请求前执行
// axios.interceptors.request.use(fn1,fn2)--fn1:配置，fn2：错误
axios.interceptors.request.use(config => {
    // 修改请求头配置，追加token
    // 从用户信息中解构token？
    const { token } = auth.getUser();
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
}, err => Promise.reject(err))

export default axios