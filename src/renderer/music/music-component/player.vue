/**
 * Created by Sorrow.X on 2018/6/22.
 */

<template>
    <div class="player" id="player" :style="lyricPlayStyle.playStyle">
        <div class="player-controls">
            <button class="btn-play" :class="{ 'hidden': playState }" @click="playMusic" :disabled="playBtnDisabledAttr"></button>
            <button class="btn-pause" :class="{ 'hidden': !playState }" @click="pauseMusic" :disabled="playBtnDisabledAttr"></button>
            <button class="btn-next" @click="playNextMusic" :disabled="playBtnDisabledAttr" ></button>
        </div>
        <div class="play">
            <p>
                <template v-if="noSongPlay === true">
                    当前暂无正在播放的音乐，开启您的音乐之旅吧~
                </template>
                <template v-else-if="noSongPlay === false">
                    <span class="name" :style="lyricPlayStyle.songNameStyle">{{ songName }}</span>
                    -
                    <span class="artists" :style="lyricPlayStyle.singerStyle">{{ singer }}</span>
                </template>
                <span class="time" :style="lyricPlayStyle.timeStyle">
                    {{ currentPlayTime || "00:00" }} / {{ durationTime || "00:00"}}
                </span>
                <span class="player-lyric" @click="toggleLyricPanel" :style="lyricPlayStyle.playerLyricStyle">词</span>
            </p>
            <input
                type="range"
                max="100"
                min="0"
                step="1"
                slot="list"
                :value="playTime"
                @change="setProgress"
                @input="setProgressUi"
                @mousedown="handlerMouseDown"
                @mouseup="handlerMouseUp"
                :disabled="noSongPlay === true || songPlayFaild"
                :style="[{'background-size': playTime + '% 4px'}, lyricPlayStyle.inputStyle]">
        </div>
        <Dropdown placement="top" trigger="click">
            <button class="btn-volume"></button>
            <input
                type="range"
                max="100"
                min="0"
                step="1"
                slot="list"
                :value="userVolumeVal"
                @input="setVolume"
                :style="{'background-size': userVolumeVal + '% 4px'}"
            >
        </Dropdown>
    </div>
</template>

<script>
    import Player from '../music-player/music-player'
    import SongMiXin from '../music-mixin/song-mixin'
    import { extendDeep } from '../music-util/util'

    const defaultStyle = {
        playStyle: {
            'border-top': 'solid 1px #e8e8e8', // 'none'
            'background': 'none' // '#242330'
        },
        songNameStyle: {
            'color': '#333' // '#00BFFF'
        },
        singerStyle: {
            'color': 'inherit' // '#8470FF'
        },
        timeStyle: {
            'color': '#999' // '#fb910c'
        },
        playerLyricStyle: {
            'border': '1px solid #eee' // '1px solid #fb910c'
        },
        inputStyle: {
            'background-color': 'aliceblue' // '#6CA6CD'
        }
    }

    const playerStyle = {
        playStyle: {
            'border-top': 'none',
            'background': '#242330'
        },
        songNameStyle: {
            'color': '#00BFFF'
        },
        singerStyle: {
            'color': '#8470FF'
        },
        timeStyle: {
            'color': '#fb910c'
        },
        playerLyricStyle: {
            'border': '1px solid #fb910c'
        },
        inputStyle: {
            'background-color': '#6CA6CD'
        }
    }

    export default {
        name: 'MusicPlayer',
        mixins: [ SongMiXin ],
        data: function() {
            return {
                playTime: 0, // 控制进度条的变量
                volume: 100, // 控制音量进度条的变量
                playState: false, // 播放状态
                currentPlayTime: 0, // 歌曲当前播放的时间
                durationTime: 0, // 歌曲总时长
                songName: '',
                singer: '',
                songPlayFaild: false, // 歌曲播放失败
                noSongPlay: true, // 一开始初始化, true: 无歌曲, false: audio有歌曲
                curSongLoadState: 0, // 播放歌曲数据载入情况 0: 载入中 1: 载入成功 2: 载入失败
                lyricPlayStyle: defaultStyle
            }
        },
        computed: {
            playBtnDisabledAttr() { // 无歌曲则禁用播放按钮或者播放失败
                if (this.noSongPlay === false) { // 当前列表无歌曲但是试听了,状态回置
                    return false
                }

                if (this.mySongList.length === 0 && this.audienceWaitSongList.length === 0) {
                    return 'disabled'
                }

                return false
            }
        },
        methods: {
            initPlayer() {
                let self = this
                this.mp = new Player({ // 初始化音乐播放器
                    el: '#player',
                    data: {
                        playSrc: self.playSrc,
                        songName: self.songName,
                        singer: self.singer,
                        songInfo: {},
                        lyricData: self.lyricData
                    },
                    audio: {
                        audioHide: false
                    },
                    callbacks: {
                        currentTime(v, currentTime) {
                            self.currentPlayTime = v
                            self.calcProgress(currentTime)
                        },

                        duration(v, duration) {
                            self.durationTime = v
                            self.duration = duration
                        },

                        curPlayLyric(error, curLyric, duration, parseLyricData) {
                            if (!error && error !== '') {
                                self.musicLyricPanelComponent.scrollLyric(parseLyricData.curIndex)
                            } else {
                                if (error === 'empty') { }
                                // console.log('error: ', error)
                            }
                        },

                        loadstart() {
                            // console.log('loadstart')
                            self.curSongLoadState = 0
                        },

                        loadeddata() {
                            // console.log('loadeddata')
                            self.curSongLoadState = 1
                        },

                        error(e) {
                            // console.error('error', e)
                            self.curSongLoadState = 2
                        },

                        playEnd() { // 播放完当前歌曲，自动播放下一首
                            if (self.mySongList.length != 0 || self.audienceWaitSongList.length != 0) {
                                self.playNextMusic()
                            } else {
                                self.resetPlayerUi()
                            }
                        }
                    }
                }).init()
            },
            setProgress(evt) { // 用户拖动进度条放开时设置歌曲的进度
                let curVal = parseInt(evt.target.value)
                this.playTime = curVal
                this.mp.setProgress(curVal / 100)

                // 继续播放
                if (!this.mp.isPaused) {
                    this.playMusic()
                }
            },
            setProgressUi(evt) { // 用户拖动进度条时只设置ui进度
                let curVal = parseInt(evt.target.value)
                this.playTime = curVal
            },
            recoveryProgressUi() { // 重置歌曲进度条及ui进度条

                let evt = { target: { value: 0 } } // ui进度条
                this.setProgressUi(evt)

                this.mp.setProgress(0) // audio进度条
            },
            setVolume(evt) { // 设置音量大小
                let curVal = parseInt(evt.target.value)
                this.volume = curVal
                this.setVolumeValue({ value: curVal })
                this.mp.setVolume(curVal / 100)
            },
            calcProgress(curSecond) { // 自动计算歌曲播放时对应时间的进度条
                if (this._drag) return // 拖拽中不执行计算
                let percent = (curSecond / this.duration) * 100
                if (isFinite(percent)) {
                    this.playTime = percent
                }
            },
            playMusic(isSpare) { // 播放音乐 isSpare:是否备用
                this.curSongLoadState = 0

                this.playState = true
                this.noSongPlay = false
                this.mp.play().catch((e) => {
                    console.log('播放失败: ', e)
                    if (isSpare) { // 备用播放失败则播放下一首
                        this.playNextMusic()
                    } else { // 正式url播放失败则使用备用地址
                        this.sparePlay()
                    }
                })
            },
            pauseMusic() { // 暂停音乐
                this.playState = this.noSongPlay = false
                this.mp.pause()
            },
            playMusicFaild() { // 播放失败 ui重置

                this.musicLyricPanelComponent.handlerSongError()
                this.pauseMusic()
                this.mp.setAudioSrc()
                this.recoveryProgressUi()

                this.songPlayFaild = true
                this.durationTime = this.currentPlayTime = 0
            },
            outsidePlayMusic(playSrc, lyricData, songInfo, songName, singer) { // 外部调用播放方法
                this.playSrc = playSrc
                this.lyricData = lyricData
                this.songName = songName
                this.singer = singer
                this.songInfo = songInfo

                this.songPlayFaild = false

                // 进度条恢复
                this.recoveryProgressUi()

                this.cutSong(playSrc, lyricData, songInfo, songName, singer)
            },
            cutSong(playSrc, lyricData, songInfo, songName, singer) { // 切歌
                this.sparePlay = this.sparePlayMusic(playSrc, lyricData, songInfo, songName, singer)
                this.musicLyricPanelComponent.recovery()
                let mp = this.mp.cutSong(playSrc, lyricData, songInfo, songName, singer)
                this.musicLyricPanelComponent.initUi(mp.ly, songInfo)
                this.playMusic()
            },
            sparePlayMusic(playSrc, lyricData, songInfo, songName, singer) {
                let self = this
                return function() {
                    self.musicLyricPanelComponent.recovery()
                    let mp = self.mp.cutSong(songInfo.sparePlaySrc, lyricData, songInfo, songName, singer)
                    self.musicLyricPanelComponent.initUi(mp.ly, songInfo)
                    self.playMusic(true)
                }
            },
            outsidePlayMusicChangeUi(song) {
                this.songName = song.name
                this.singer = song.singer

                // 进度条恢复
                this.recoveryProgressUi()
            },
            playNextMusic() { // 播放下一首
                if (!this.waiting) {
                    this.waiting = true
                    this.playNextSong().then((music) => {
                        this.waiting = false
                        // console.log('当前播放的歌曲是: ', music)
                        if (music === '当前暂无可播的音乐') {
                            this.resetPlayerUi()
                        }
                    }).catch((e) => {
                        this.waiting = false
                        console.error('当前歌曲播放失败: ', e)
                    })
                }
            },
            handlerMouseDown() {
                this._drag = true
            },
            handlerMouseUp() {
                this._drag = false
            },
            toggleLyricPanel() {
                let isShow = this.musicLyricPanelComponent.toggleShow()
                this.switchPlayerStyle(!isShow)
            },
            /*
             * 该方法主要为了删除一首歌或者清空歌曲后，将播放下一首歌曲
            */
            updateNextSongState() {
                if (!this.mp.isPaused()) { // 说明歌曲正在播放(未播放则不做处理)
                    this.playMusicFaild() // 删除了当前歌曲则做播放失败处理
                    this.singer = this.songName = ''
                    this.noSongPlay = true
                    this.playNextMusic() // 播放下一首
                }
            },
            resetPlayerUi() {
                this.recoveryProgressUi()
                this.pauseMusic()
                this.mp.setAudioSrc() // url设为''
                this.singer = this.songName = ''
                this.durationTime = this.currentPlayTime = 0
                this.noSongPlay = true
            },
            startPlayMusic() {
                if (this.noSongPlay) {
                    this.playNextMusic()
                }
            },
            switchPlayerStyle(isDefault) {
                isDefault ? (this.lyricPlayStyle = defaultStyle)
                          : (this.lyricPlayStyle = playerStyle)
            }
        },
        created() {
            this.playSrc = ''
            this.lyricData = {}
            this.waiting = false // 切换歌曲需要等待一个流程走完
        },
        mounted() {
            this.initPlayer()
            this.musicLyricPanelComponent = this.$_live_getChildComponent(this.$root, "music-lyric-panel")
        }
    }
</script>

<style>
    .player-lyric {
        font-size: 12px;
        border: 1px solid #eee;
        margin-left: 10px;
        padding: 1px 4px;
    }
    .player {
        transition: all .6s;
    }
</style>