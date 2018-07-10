/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <div class="tab-pane active">
        <nav class="music-sub-nav">
            <button class="tab-nav-btn" @click="switchTab(0)" :class="{ 'active': curTabIndex === 0 }">等待播放({{ audienceWaitSongList.length }})</button>
            <button class="tab-nav-btn" @click="switchTab(1)" :class="{ 'active': curTabIndex === 1 }">已播放列表</button>
        </nav>
        <div class="tab-content">
            <audience-wait-play-list
                v-show="curTabIndex === 0"
                :songList="audienceWaitSongList"
            >
            </audience-wait-play-list>
            <audience-already-play-list
                v-show="curTabIndex === 1"
                :songList="audienceAlreadyPlayedSongList"
            >
            </audience-already-play-list>
        </div>
    </div>
</template>

<script>
    import AudienceWaitPlayList from './audience-wait-play-list'
    import AudienceAlreadyPlayList from './audience-already-play-list'
    import SongMiXin from '../music-mixin/song-mixin'

    export default {
        name: 'Audience',
        components: { AudienceWaitPlayList, AudienceAlreadyPlayList },
        mixins: [ SongMiXin ],
        data: function () {
            return {
                curTabIndex: 0
            }
        },
        methods: {
            switchTab(index) {
                this.curTabIndex = index
            }
        }
    }
</script>