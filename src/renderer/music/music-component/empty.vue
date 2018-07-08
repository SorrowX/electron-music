/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <transition name="loading-fade">
        <div class="empty" v-show="show">
            <i class="icon-music-empty"></i>
            <p v-for="t in tip">{{t}}</p>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'Empty',
        props: {
            tip: {
                type: Array,
                default: ['没有歌曲，快去“推荐歌单”添加自己喜欢的歌曲吧~']
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            isShow(bool) {
                this.show = bool
            }
        }
    }
</script>