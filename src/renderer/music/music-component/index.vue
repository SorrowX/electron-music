/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <div class="container win win-music">
        <music-header @search-keywords="handlerSearchKeywords"></music-header>
        <main>
            <music-nav @handle-music-nav="switchTabComponent"></music-nav>
            <div class="tab-content">
                <keep-alive>
                    <component ref="curComp" :is="currentTabComponent"></component>
                </keep-alive>
            </div>
            <music-lyric-panel ref="musicLyricPanelComponent"></music-lyric-panel>
            <search-result :searchKeywords="searchKeywords" ref="searchResultComponent"></search-result>
            <recommend-song-sheet-details ref="recommendSongSheetDetailsComponent"></recommend-song-sheet-details>
        </main>
        <music-player></music-player>
    </div>
</template>

<script>
    import MusicHeader from '@/music/music-component/header'
    import MusicNav from '@/music/music-component/nav'
    import MusicPlayer from '@/music/music-component/player'
    import Audience from '@/music/music-component/audience'
    import Me from '@/music/music-component/me'
    import Recommend from '@/music/music-component/recommend'
    import Hot from '@/music/music-component/hot'
    import SearchResult from '@/music/music-component/search-result'
    import RecommendSongSheetDetails from '@/music/music-component/recommend-song-sheet-details'
    import MusicLyricPanel from '@/music/music-component/lyric-panel'

    export default {
        name: 'Music',
        components: {
            MusicHeader,
            MusicNav,
            MusicPlayer,
            Audience,
            Me,
            Recommend,
            Hot,
            SearchResult,
            RecommendSongSheetDetails,
            MusicLyricPanel
        },
        data() {
            return {
                currentTabComponent: 'Audience',
                searchKeywords: ''
            }
        },
        methods: {
            switchTabComponent(index) {
                this.$refs.searchResultComponent.isShow(false)
                this.$refs.recommendSongSheetDetailsComponent.isShow(false)
                this.$refs.musicLyricPanelComponent.isShow(false)
                let tabComponent = ['Audience', 'Me', 'Recommend', 'Hot']
                this.currentTabComponent = tabComponent[index]
                if (index === 2) {
                    this.$refs.curComp.getPlayListDataFormApi && this.$refs.curComp.getPlayListDataFormApi()
                }
            },
            handlerSearchKeywords(keyWords) {
                this.searchKeywords = keyWords
            }
        },
        mounted() {
            this.$Message.config({ top: 180 })
        }
    }
</script>

