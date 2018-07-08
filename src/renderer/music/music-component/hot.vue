/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <div class="tab-pane active">
        <nav class="music-sub-nav">
            <button
                v-for="(btnTag, index) in tabArr"
                :class="['tab-nav-btn', index === curTabIndex ? 'active' : '']"
                @click="switchTab(index)"
            >
                {{ btnTag }}
            </button>
        </nav>
        <div class="tab-content">
            <div class="tab-pane active">
                <song-list :songList="curSongList" v-show="!loading && !requestError" ></song-list>
                <loading :tip="'正在初始化列表歌曲'" :show="loading"></loading>
                <empty
                    :show="requestError === true"
                    :tip="['获取失败，未能找到相关歌曲信息！']"
                >
                </empty>
            </div>
        </div>
    </div>
</template>

<script>
    import { getMusicList } from '../music-api/music-api'
    import Empty from './empty'
    import Loading from './loading'
    import SongList from './song-list'

    export default {
        name: 'Hot',
        components: { SongList, Loading, Empty },
        data: function () {
            return {
                curTabIndex: 0,
                tabArr: ['新歌榜', '热歌榜'],
                curSongList: [], // 对象数组 {album, id, name, playSrc, singer, size, time}
                requestError: false, // 请求出错
                loading: true
            }
        },
        methods: {
            switchTab(index) {
                this.curSongList = []

                this.curTabIndex = index
                if (index === 0) { // 新歌榜
                    if (!this.newSongList) {
                        this.loading = true
                        getMusicList(index, 15 * 1000).then((ret) => {
                            this.loading = this.requestError = false
                            this.curSongList = this.newSongList = ret
                        }).catch((e) => {
                            this.requestError = true
                        })
                    } else {
                        this.curSongList = this.newSongList
                    }
                }

                if (index === 1) { // 热歌榜
                    if (!this.hotSongList) {
                        this.loading = true
                        getMusicList(index, 15 * 1000).then((ret) => {
                            this.loading = this.requestError = false
                            this.curSongList = this.hotSongList = ret
                        }).catch((e) => {
                            this.requestError = true
                        })
                    } else {
                        this.curSongList = this.hotSongList
                    }
                }
            }
        },
        created() {
            this.newSongList = null
            this.hotSongList = null
        },
        mounted() {
            this.switchTab(0)
        }
    }
</script>