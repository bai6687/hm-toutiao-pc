import MyBread from '@/components/my-bread'
import MyChannel from '@/components/my-channel'
import MyCover from '@/components/my-cover'
export default {
    install(Vue) {
        Vue.component(MyBread.name, MyBread)
        Vue.component(MyChannel.name, MyChannel)
        Vue.component(MyCover.name, MyCover)
        // 自己扩展的功能
    }
}