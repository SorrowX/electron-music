/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <div class="tab-pane active">
        <ul class="play-list">
            <li v-for="(songSheet, index) in recommendSongSheet" @click="showDetails(songSheet)">
                <div class="cover">
                    <img
                        :src="songSheet.coverImgUrl + '?param=150x150'"
                        draggable="false"
                        :onerror="defaultDetailCover"
                    >
                    <div class="bottom">
                        <i class="icon-headset"></i>
                        {{ Math.floor(songSheet.playCount / 10000) }}万
                        <Tooltip content="添加到我的歌单" placement="top" transfer>
                            <button class="btn-plus" @click.stop="addToSheet(songSheet['id'])"></button>
                        </Tooltip>
                    </div>
                </div>
                <p class="desc">{{ songSheet.name }}</p>
            </li>
        </ul>
        <loading :tip="'正在初始化歌单列表'" :show="loading"></loading>
        <empty
            :show="error"
            :tip="['很抱歉，未能获取到推荐歌单信息！']"
        >
        </empty>
    </div>
</template>

<script>
    import { getTopPlayList } from '../music-api/music-api'
    import Empty from './empty'
    import Loading from './loading'
    import SongMiXin from '../music-mixin/song-mixin'

    export default {
        name: "Recommend",
        mixins: [SongMiXin],
        components: { Loading, Empty },
        data: function () {
            return {
                recommendSongSheet: [], // 对象数组 {id, name, coverImgUrl, playCount}
                loadingDetail: false,
                loading: true,
                error: false,
                defaultDetailCover: "this.src='../../../static/img/default-album-cover_160x160.png'"
            }
        },
        methods: {
            getPlayListDataFormApi() {
                this.recommendSongSheet = []

                if (!this.playList) {
                    this.loading = true
                    getTopPlayList(15 * 1000).then(ret => {
                        this.error = this.loading = false
                        if (ret.code === 200) {
                            this.playList = new Array(ret.playlists.length)
                            ret.playlists.forEach((obj, index) => {
                                this.playList[index] = {
                                    id: obj.id,
                                    name: obj.name,
                                    coverImgUrl: obj.coverImgUrl,
                                    playCount: obj.playCount
                                }
                            })
                            this.recommendSongSheet = this.playList
                        }
                    }).catch((e) => {
                        this.loading = false
                        this.error = true
                    })
                } else {
                    this.recommendSongSheet = this.playList
                }
            },
            showDetails(songSheet) {
                let detailsComp = this.$_live_getChildComponent(this.$root, "recommend-song-sheet-details")
                detailsComp.showComp(songSheet.id)
            },
            addToSheet(songSheetId) {
                this.addToMySongSheet(songSheetId)
            }
        },
        created() {
            this.playList = null
        },
        mounted() {
            this.getPlayListDataFormApi()
        }
    }
</script>
