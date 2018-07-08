import Vue from 'vue'
import Router from 'vue-router'
import Music from '@/music/music-component/index'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'music',
            component: Music
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
