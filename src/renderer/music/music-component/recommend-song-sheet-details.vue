/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <transition name="song-sheet-details-fade">
        <div class="list-detail" v-if="show">
            <div class="operate">
                <button class="btn-gradient" @click="toggleShow()">
                    <i class="icon-back"></i>
                    返回
                </button>
                <button class="btn-primary" @click="addToSheet(songSheetData.musicList)" v-show="songSheetData.musicList.length > 0">添加到我的歌单</button>
            </div>
            <div class="desc">
                <img
                    :src="songSheetData.coverImgUrl +'?param=150x150'"
                    draggable="false"
                    width="150"
                    height="150"
                    @error="handlerImgError($event)"
                >
                <h3>{{ songSheetData.songSheetName }}</h3>
                <p>介绍：</p>
                <p class="desc-content" :class="{collapsed: descCollapsed}">
                    <span ref="descContent">{{songSheetData.description}}</span>
                </p>
                <button v-if="hasMoreDesc" class="btn-link" @click="toggleCollapse">
                    {{descCollapsed ? "展开" : "收起"}}
                </button>
            </div>
            <p>歌曲列表</p>
            <song-list :songList="songSheetData.musicList"></song-list>
            <loading :tip="'正在获取歌单详情'" :show="loading && !error"></loading>
            <empty
                :show="error && songSheetData.musicList.length === 0"
                :tip="['很抱歉，获取详情信息失败！']"
            >
            </empty>
        </div>
    </transition>
</template>

<script>
    import { getRecommendSongSheetDetails } from '../music-api/music-api'
    import Empty from './empty'
    import Loading from './loading'
    import SongMiXin from '../music-mixin/song-mixin'
    import SongList from './song-list'

    export default {
        name: "RecommendSongSheetDetails",
        components: { SongList, Loading, Empty },
        mixins: [SongMiXin],
        data: function () {
            return {
                show: false,
                songSheetData: {
                    coverImgUrl: "",
                    description: "",
                    songSheetName: "",
                    musicList: [] // 对象数组 { album, id, name, playSrc, singer, time, size }
                },
                hasMoreDesc: false,
                descCollapsed: false,
                loading: true,
                error: false
            }
        },
        watch: {
            "songSheetData.description"() {
                this.$nextTick(() => {
                    let h = window.getComputedStyle(this.$refs.descContent, null)["height"]
                    if (parseInt(h.split("px")[0]) > 72) {
                        //font-size:12,line-height:1.5,lines:4
                        this.hasMoreDesc = true
                        this.descCollapsed = true
                    } else {
                        this.hasMoreDesc = false
                        this.descCollapsed = false
                    }
                })
            }
        },
        methods: {
            toggleShow() {
                this.show = !this.show
            },
            isShow(bool) {
                this.show = bool
            },
            replaceDetailsData(songSheetData, callback) {
                this.songSheetData = songSheetData
                this.$nextTick(() => {
                    callback && callback()
                })
            },
            openSongSheetDetailsComponent(songSheetData) {
                this.replaceDetailsData(songSheetData, () => {
                    this.toggleShow()
                })
            },
            showComp(songSheetId) {
                this.toggleShow()
                this.songSheetData.musicList = []
                this.loading = true
                getRecommendSongSheetDetails(songSheetId, 15 * 1000).then(ret => {
                    this.loading = false
                    this.songSheetData = ret
                }).catch((e) => {
                    this.error = true
                })
            },
            addToSheet(musicList) {
                this.addToMySongSheet(musicList)
            },
            toggleCollapse() {
                this.descCollapsed = !this.descCollapsed
            },
            handlerImgError(evt) {
                evt.target.src = require('../music-style/img/default-album-cover_160x160.png')
            }
        }
    }
</script>
