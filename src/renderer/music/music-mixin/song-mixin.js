/**
 * Created by Sorrow.X on 2018/6/26.
 */

import { getOneSong, getSongInfoById, getRecommendSongSheetDetails } from '../music-api/music-api'
import { mapActions, mapGetters } from 'vuex'
import { remote } from 'electron'
const { Menu, MenuItem } = remote
import fs from 'fs'

let mySongListCurIndex = -1
let delMySongListSongIdx = -1
let curPlaySong = null

const SongMiXin = {
    data: function () {
        return {
            curRowIndex: -1
        }
    },
    computed: mapGetters(['mySongList', 'audienceWaitSongList', 'audienceAlreadyPlayedSongList']),
    methods: {
        /*
         * 播放在线歌曲(new)
         * song Object 歌曲对象 { id, playSrc, name, singer, album, lyricObjData }
         * updateSong Boolean 是否需要更新存储中心和缓存中的歌曲信息
         * type String mySongList|audienceWaitSongList|audienceAlreadyPlayedSongList 更新哪个类型中的歌曲信息
        */
        playOnlineMusic(song, updateSong, type) {
            this.playerComponent.outsidePlayMusicChangeUi(song)
            return getSongInfoById(song.id, song).then(music => { // 需要根据id重新获取歌曲信息
                curPlaySong = music
                if (updateSong && type) {
                    this.updateSong({ type, id: song.id, song })
                }
                if (music.playSrc) {
                    this.playerComponent.outsidePlayMusic(music.playSrc, music.lyricObjData, music, music.name, music.singer)
                } else {
                    this.playerComponent.playMusicFaild()
                    this.$Message.info({ content: `播放歌曲 <${song.name}>,  失败！` })
                }
            }).catch(() => {
                this.playerComponent.playMusicFaild()
                this.$Message.info({ content: `播放歌曲 <${song.name}>,  失败！` })
            })
        },
        /*
         * 播放本地歌曲
         * song Object 歌曲对象 { id, playSrc, name, singer, album, lyricObjData }
        */
        playLocalMusic(song) {
            if (!song.lyricObjData && song.localLyricSrc) {
                try {
                    song.lyricObjData = JSON.parse(fs.readFileSync(song.localLyricSrc, 'utf8'))
                } catch (e) {
                    song.lyricObjData = null
                }
            }
            this.playerComponent.outsidePlayMusic(song.playSrc, song.lyricObjData, song, song.name, song.singer)
        },
        /*
         * 播放在线歌曲且移动到已经播放列表中(该方法主要为了等待播放列表中歌曲的播放 new)
         * song Object 歌曲对象 { id, playSrc, name, singer, album, lyricObjData }
        */
        playOnlineMusicAndRemove(song) {
            this.removeSong({ type: 'audienceWaitSongList', id: song.id }) // 1.从等待列表中移除
            this.addSong({ type: 'audienceAlreadyPlayedSongList', song }) // 2.添加到已播列表
            this.$nextTick(() => {
                this.playOnlineMusic(song)
            })
        },
        /*
         * 播放在线歌曲且添加到已经播放列表中(该方法主要为了我的歌曲列表中歌曲的播放 new)
         * song Object 歌曲对象 { id, playSrc, name, singer, album, lyricObjData }
        */
        playOnlineMusicAndAdd(song) {
            mySongListCurIndex = this.getSongIdx({ type: 'mySongList', songId: song.id })
            this.addSong({ type: 'audienceAlreadyPlayedSongList', song }) // 1.添加到已播列表
            this.$nextTick(() => {
                this.playOnlineMusic(song)
            })
        },
        /*
         * 播放下一首歌曲(先从等待播放数据中获取,没有的话就从我的歌单数据中获取)
        */
        async playNextSong() {
            // 获取待播放数据,且在线播放
            let music = this._getSongFromWaitSongList()
            if (music) {
                await this.playOnlineMusic(music)
                return music
            }

            // 获取我的歌单数据,且本地播放(本地是不可能的了,这辈子都不可能了,需求说暂时关闭本地播放)
            music = this._getSongFromMySongList()
            if (music) {
                await this.playOnlineMusic(music)
                return music
            } else {
                return '当前暂无可播的音乐'
            }
        },
        _getSongFromWaitSongList() {
            let song = null
            if (this.audienceWaitSongList.length > 0) {
                let music = this.audienceWaitSongList.slice(0)[0]
                this.removeSong({ type: 'audienceWaitSongList', id: music.id })
                this.addSong({ type: 'audienceAlreadyPlayedSongList', song: music })
                song = music
            }
            return song
        },
        _getSongFromMySongList() {
            let song = null
            if (this.mySongList.length > 0) {
                let music = this.mySongList.slice(0)[this._getMySongListCurIndex()]
                this.addSong({ type: 'audienceAlreadyPlayedSongList', song: music })
                song = music
            }
            return song
        },
        _getMySongListCurIndex() {
            let len = this.mySongList.length - 1
            if (mySongListCurIndex >= len) {
                mySongListCurIndex = -1
            }
            return ++mySongListCurIndex
        },
        /*
         * 根据id获取到歌单数据添加到我的歌单 或者 直接把歌单音乐数据添加到我的歌单
         * songSheetId 歌单Id或者歌曲列表
        */
        addToMySongSheet(songSheetId) {
            return new Promise((resolve) => {
                if (Array.isArray(songSheetId)) {
                    let musicList = songSheetId
                    musicList = musicList.filter((obj) => {
                        return obj.playSrc !== null || obj.playSrc == ''
                    })
                    this.addSong({ type: 'mySongList', song: musicList })
                    this.$Message.info({ content: '已添加至我的歌单, 部分付费歌曲已过滤！' })
                    return resolve(musicList)
                } else {
                    getRecommendSongSheetDetails(songSheetId).then(ret => {
                        let musicList = ret.musicList
                        musicList = musicList.filter((obj) => {
                            return obj.playSrc !== null || obj.playSrc == ''
                        })
                        this.addSong({ type: 'mySongList', song: ret.musicList })
                        this.$Message.info({ content: '已添加至我的歌单, 部分付费歌曲已过滤！' })
                        return resolve(ret.musicList)
                    })
                }
            })
        },
        /*
         * 添加一首歌到我的歌单去
         * songSheetId 歌单Id或者歌曲列表
        */
        collectSong(music) {
            if (music.playSrc == null || music.playSrc == '') {
                this.$Message.error({ content: '付费歌曲, 添加失败!' })
            } else {
                this.addSong({ type: "mySongList", song: music })
                this.$Message.info({ content: '已添加至我的歌单!' })
            }
        },
        registerMenu(options, index) {
            let musicId = options['id'] // musicId
            let song = options['song'] // 歌曲对象
            let type = options['type'] // ['mySongList', 'audienceWaitSongList', 'audienceAlreadyPlayedSongList']
            let cbs = options['cbs'] // ['play', 'del', 'clear', 'top']
            let callback = options['callback'] // 删除和清空有回调
            if (this.curRowIndex) {
                this.curRowIndex = index
            }
            if (!this.menuInstance[musicId]) {
                let menu = new Menu()
                cbs.forEach(cbName => {
                    let name = this.menuInfo[cbName]['label']
                    let cb = this.menuInfo[cbName]['cb']
                    menu.append(
                        new MenuItem({
                            label: name,
                            click() {
                                cb(type, musicId, song)
                            }
                        })
                    )
                })
                this.menuInstance[musicId] = menu
            }
            this.menuInstance[musicId].popup({ window: remote.getCurrentWindow() })
        },
        menuPlay(type, musicId, song) {
            if (type === 'audienceWaitSongList') {
                this.playOnlineMusicAndRemove(song)
            } else if ((type === 'mySongList')) {
                this.playOnlineMusicAndAdd(song)
            } else {
                this.playOnlineMusic(song)
            }
        },
        menuDel(type, musicId, song) {
            delMySongListSongIdx = this.getSongIdx({ type: 'mySongList', songId: musicId })
            this.removeSong({ type, id: musicId })
            this.delSongUpdateNextPlatSongIdx(musicId, type)
        },
        menuClear(type, musicId, song) {
            this.removeAllSong({ type })
            this.clearSongUpdateNextPlatSongIdx(type)
        },
        menuTop(type, musicId, song) {
            this.moveSong({ type, id: musicId })
            this.topSongUpdateNextPlaySongIdx('mySongList')
        },
        getSongIdx({ type, songId }) {
            let obj = {
                mySongList: this.mySongList,
                audienceWaitSongList: this.audienceWaitSongList,
                audienceAlreadyPlayedSongList: this.audienceAlreadyPlayedSongList,
            }
            let arr = obj[type]
            return arr.findIndex((obj) => {
                return obj.id === songId
            })
        },
        topSongUpdateNextPlaySongIdx(type) { // 置顶歌曲后更新下一次播放歌曲索引
            if (curPlaySong && type === 'mySongList') {
                let curIdx = this.getSongIdx({ type, songId: curPlaySong.id })
                if (curIdx !== -1) {
                    return mySongListCurIndex = curIdx
                } else {
                    return ++mySongListCurIndex
                }
            } else {
                return mySongListCurIndex
            }
        },
        delSongUpdateNextPlatSongIdx(delCurSongIdx, type) { // 删除歌曲后更新下一次播放歌曲索引
            if (curPlaySong.id === delCurSongIdx || delMySongListSongIdx < mySongListCurIndex) { // 删除当前正在播放的歌曲
                if (type === 'mySongList') {
                    --mySongListCurIndex
                    if (mySongListCurIndex <= -1) {
                        mySongListCurIndex = -1
                    }
                    return mySongListCurIndex
                }
            }
        },
        clearSongUpdateNextPlatSongIdx(type) { // 清除所有歌曲后更新重置播放歌曲索引
            if (type === 'mySongList') {
                return mySongListCurIndex = -1
            }
        },
        ...mapActions(["addSong", "updateSong", "removeSong", "removeAllSong", "moveSong"])
    },
    created() {
        this.menuInstance = {} // 存放menu的实例
        this.menuInfo = {
            top: {
                label: '置顶',
                cb: this.menuTop
            },
            play: {
                label: '播放',
                cb: this.menuPlay
            },
            del: {
                label: '删除',
                cb: this.menuDel
            },
            clear: {
                label: '清空',
                cb: this.menuClear
            }
        }
        this.$Message.config({ top: 280 })
    },
    mounted() {
        this.playerComponent = this.$_live_getChildComponent(this.$root, 'music-player')
    }
}

export default SongMiXin
