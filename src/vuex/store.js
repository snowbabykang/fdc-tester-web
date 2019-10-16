import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'

Vue.use(Vuex);

import { state } from "./initState"

// 创建 store 实例
export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
})