/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <transition name="loading-fade">
        <div class="loading" v-show="show">
            <Icon type="load-d"></Icon>
            <p>{{ tip }}</p>
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'Loading',
        props: {
            tip: {
                type: String,
                default: '正在拼命加载中...'
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