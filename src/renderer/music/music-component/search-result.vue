/**
 * Created by Sorrow.X on 2018/6/25.
 */
<template>
    <transition name="music-result-fade">
        <div class="music-search-result" v-if="show">
            <button class="btn-gradient" @click="show = false">
                <i class="icon-back"></i>
                返回
            </button>
            <p>
                搜索
                <mark>“{{ keyWords }}”</mark> ，找到{{ curTabIndex === 0 ? songList.length + "首单曲" : songSheetList.length + "个歌单"}}
            </p>
            <nav class="music-sub-nav">
                <button
                    v-for="(item, index) in tabBtns"
                    class="tab-nav-btn"
                    :class="{'active': index === curTabIndex}"
                    @click="switchTab(index)"
                >
                    {{ item }}
                </button>
            </nav>
            <div class="tab-content">
                <div class="tab-pane active">
                    <song-list :songList="songList" v-show="curTabIndex === 0"></song-list>
                    <song-sheet-list class="play-list-table" :songSheetList="songSheetList" v-show="curTabIndex === 1"></song-sheet-list>
                    <loading :show="loading"></loading>
                    <empty
                        :show="songList.length === 0 || songSheetList.length === 0"
                        :tip="['很抱歉，未能找到相关搜索结果！']"
                    >
                    </empty>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { searchResult } from '../music-api/music-api'
    import { debounce } from '../music-util/util'
    import Empty from './empty'
    import Loading from './loading'
    import SongList from './song-list'
    import SongSheetList from './song-sheet-list'

    export default {
        name: 'SearchResult',
        components: { SongList, SongSheetList, Loading, Empty },
        props: {
            searchKeywords: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                show: false,
                curTabIndex: 0,
                tabBtns: ['单曲', '歌单'],
                songList: [],
                songSheetList: [],
                loading: true,
                keyWords: ''
            }
        },
        watch: {
            searchKeywords(newVal) {
                // this.debouncedGetResult(newVal)
            },
            show(val) {
                if (val === true) { // 隐藏详情页和歌词页
                    this.recommendSongSheetDetailsComponent = this.recommendSongSheetDetailsComponent ||
                        this.$_live_getChildComponent(
                            this.$root,
                            'recommend-song-sheet-details'
                        )
                    this.recommendSongSheetDetailsComponent.isShow(false)

                    this.lyricPanelComponent = this.lyricPanelComponent ||
                        this.$_live_getChildComponent(
                            this.$root,
                            'music-lyric-panel'
                        )
                    this.lyricPanelComponent.isShow(false)
                }

                this.musicNavComponent = this.musicNavComponent ||
                    this.$_live_getChildComponent(
                        this.$root,
                        'music-nav'
                    )
                this.musicNavComponent.hideSearch = !val //搜索页是否打开，决定侧边栏active状态
            }
        },
        methods: {
            isShow(bool) {
                this.show = bool
            },
            showAndSearch() {
                if (!this.show) {
                    this.show = true
                }
                this.getResult(this.searchKeywords, 15 * 1000)
            },
            switchTab(index) {
                this.curTabIndex = index
            },
            getResult(keyWords, timeout) {
                this.keyWords = keyWords
                this.loading = true
                searchResult(keyWords, timeout).then((ret) => {
                    this.loading = false
                    this.songList = ret.songInfo || []
                    this.songSheetList = ret.songSheetInfo || []
                }).catch((e) => {
                    this.loading = false
                    this.songList = []
                    this.songSheetList = []
                    this.$Message.warning({ content: `抱歉,搜索结果异常！ ${e}` })
                })
            }
        },
        created() {
            this.$Message.config({ top: 300 })
            this.debouncedGetResult = debounce(this.getResult, 500)
        }
    }
</script>