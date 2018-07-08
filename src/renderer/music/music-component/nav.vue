/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <nav class="music-nav">
        <button
            v-for="(item, index) in btns"
            :class="index === curIndex && hideSearch ? 'active' : ''"
            @click="handlerClickNav(index)"
        >
            <i :class="item.class"></i>
            {{ item.name }}
        </button>
    </nav>
</template>

<script>
    export default {
        name: 'Nav',
        data() {
            return {
                btns: [
                    {
                        name: '观众歌单',
                        class: 'icon-music-nav-audience'
                    },
                    {
                        name: '我的歌单',
                        class: 'icon-music-nav-mine'
                    },
                    {
                        name: '推荐歌单',
                        class: 'icon-music-nav-recommend'
                    },
                    {
                        name: '热门歌曲',
                        class: 'icon-music-nav-hot'
                    }
                ],
                curIndex: 0,
                hideSearch: true
            }
        },
        methods: {
            handlerClickNav(index) {
                this.curIndex = index
                this.$emit('handle-music-nav', index)
            }
        }
    }
</script>
