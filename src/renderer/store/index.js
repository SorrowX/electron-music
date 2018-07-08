/**
 * Created by Sorrow.X on 2018/6/23.
 */
 
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import actions from './actions'
import getters from './getters'
import state from './state'
import mutations from './mutations'

Vue.use(Vuex)
const debug = true

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
