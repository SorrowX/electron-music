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
    // let getChooseSong = require('../music_util/publish_song')
    // const { broadcast } = require('../music_util/broadcast_lyric')
    // const { message_box } = require("../../../../src/view/base/render_common.js")

    import { getOneSong, getSongInfoById } from '../music-api/music-api'
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
            },
            addSongToWaitSongList(keyWords, chooseSongUserName, chooseSongTime) {
                getOneSong(keyWords).then((ret) => {
                    // console.log('看: ', ret)
                    ret['chooseSongUserName'] = chooseSongUserName
                    ret['chooseSongTime'] = chooseSongTime
                    this.addSong({ type: 'audienceWaitSongList', song: ret })
                    this.playerComponent.startPlayMusic()
                    broadcast({
                        msgId: 1001,
                        data: {
                            from: chooseSongUserName,
                            name: ret.name
                        }
                    })
                })
            },
            tipMessage(tip, callback) { // 重写mixin中的方法
                message_box(
                    {
                        title: "小葫芦直播管家开播版",
                        type: 2,
                        text: tip,
                        showCheckbox: false,
                        checkboxLabel: "不再显示",
                        checkboxChecked: false
                    },
                    this.instance_id,
                    this.class_id,
                    null,
                    (evt, data) => {
                        callback && callback(data.ok)
                    }
                )
            },
            onceTip(fn) {
                let called = false
                return function () {
                    if (!called) {
                        called = true
                        fn.apply(this, arguments)
                    }
                }
            },
            broadcastConnectState(state) {
                broadcast({
                    msgId: 1003,
                    data: {
                        state: state
                    }
                });

            }
        },
        mounted() {
            this.MusicHeaderComponent = this.$_live_getChildComponent(this.$root, "music-header")
        }
    }
</script>