const KEY = 'hm-toutiao-pc-user'
/**
 * 设置用户信息对象
 * @param {Object} user 
 */
const setUser = (user) => {
    window.sessionStorage.setItem(KEY, JSON.stringify(user))
}
const getUser = () => {
    return JSON.parse(window.sessionStorage.getItem(KEY) || '{}')
}

const delUser = () => {
    window.sessionStorage.removeItem(KEY)
}

export default { setUser, getUser, delUser }