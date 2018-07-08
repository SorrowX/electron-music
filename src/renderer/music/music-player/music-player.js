/**
 * Created by Sorrow.X on 2018/6/22.
 */
import Lyric from './music-lyric'

function getValue(options, prop, key) {
    return options
        ? options[prop]
            ? options[prop][key]
            : null
        : null
}

function noop() {}

function query (el) {
    if (typeof el === 'string') {
        return document.querySelector(el) || document.body
    } else {
        return el
    }
}

export default class MusicPlayer {
    constructor(options) {
        this.el = query(options['el'])

        this.playSrc = getValue(options, 'data', 'playSrc')
        this.songName = getValue(options, 'data', 'songName')
        this.singer = getValue(options, 'data', 'singer')
        this.songInfo = getValue(options, 'data', 'songInfo') || {}
        this.lyricData = getValue(options, 'data', 'lyricData') || {}

        this.audioAttr = getValue(options, 'audio', 'audioAttr') || {}
        this.audioHide = getValue(options, 'audio', 'audioHide') == null
            ? true
            : getValue(options, 'audio', 'audioHide')
        this.audioAttr.src = this.playSrc

        this.currentTimeFn = getValue(options, 'callbacks', 'currentTime') || noop
        this.durationFn = getValue(options, 'callbacks', 'duration') || noop
        this.curPlayLyricFn = getValue(options, 'callbacks', 'curPlayLyric') || noop
        this.playEndFn = getValue(options, 'callbacks', 'playEnd') || noop
        this.loadstartFn = getValue(options, 'callbacks', 'loadstart') || noop
        this.canplayFn = getValue(options, 'callbacks', 'canplay') || noop
        this.loadeddataFn = getValue(options, 'callbacks', 'loadeddata') || noop
        this.errorFn = getValue(options, 'callbacks', 'error') || noop

        this.ly = new Lyric(this.lyricData)
        this.preLyric = null

        return this
    }

    init() {
        this.createAudio()
        this.handlerEvent()
        return this
    }

    createAudio() {
        this.audio = document.createElement('audio')
        let keys = Object.keys(this.audioAttr)
        keys.forEach((attr) => {
            this.audio.setAttribute(attr, this.audioAttr[attr])
        })
        this.audioHide
            ? (this.audio.style.display = 'none')
            : (this.audio.style.display = 'block')
        this.el.appendChild(this.audio)
    }

    play() {
        if (this.audio.paused) {
            return this.audio.play()
        } else {
            return Promise.resolve()
        }
    }

    pause() {
        if (!this.audio.paused) {                 
            this.audio.pause()
        }
    }

    isPaused() {
        return this.audio.paused
    }

    setAudioSrc(srcUrl) {
        this.audio.src = srcUrl || ''
    }

    setVolume(percent) { // percent 百分比  0 - 1 eg: 0.2
        this.audio.volume = percent
    }

    setProgress(percent) { // percent 百分比 0 - 1 eg: 0.2
        let second = this.audio.duration * percent
        if (!isNaN(second))
            this.audio.currentTime = second
    }

    cutSong(playSrc, lyricData, songInfo, songName, singer) {
        this._load = false

        this.playSrc = playSrc || this.playSrc
        this.songInfo = songInfo || this.songInfo
        this.songName = songName || this.songName
        this.singer = singer || this.singer

        this.lyricData = lyricData
        this.ly = new Lyric(this.lyricData)
        this.preLyric = null
        if (!this.ly.isGoOn) {
            this.curPlayLyricFn.call(this, 'empty')
        }

        this.audioAttr.src = this.playSrc
        this.audio.setAttribute('src', this.playSrc)
        this.audio.load() // load() 方法用于在更改来源或其他设置后对音频/视频元素进行更新, 会触发canplay事件

        return this
    }

    getCurPlayLyric(ms) {
        ms = ms || this.audio.currentTime
        let l = this.ly.getCurPlayLyric(ms)
        if (l) {
            let curLyric = l.cur
            let duration = l.duration
            if (this.preLyric !== curLyric && !isNaN(duration) && (typeof curLyric !== 'undefined' || curLyric == '')) {
                this.preLyric = curLyric
                this.curPlayLyricFn.call(this, null, curLyric, duration, l)
            }
        }
    }

    handlerEvent() {
        // 载入数据
        this.audio.addEventListener('loadstart', () => {
            this.loadstartFn.call(this)
        }, false)

        // 载入数据完毕
        this.audio.addEventListener('loadeddata', () => {
            this.loadeddataFn.call(this)
        }, false)

        // 准备就绪,可以播放
        this.audio.addEventListener('canplay', () => {
            this._load = true
            this.canplayFn.call(this)
        }, false)

        // audio失败
        this.audio.addEventListener('error', (e) => {
            this.errorFn.call(this, e)
        }, false)

        // 播放完毕
        this.audio.addEventListener('ended', () => {
            this.playEndFn.call(this)
        }, false)

        // 播放时间更新
        this.audio.addEventListener('timeupdate', () => {
            if (!this._load) return
            this.currentTimeFn.call(this, this._calcTime(this.audio.currentTime), this.audio.currentTime)
            if (!isNaN(this.audio.duration)) {
                this.durationFn.call(this, this._calcTime(this.audio.duration), this.audio.duration)
            }
            this.getCurPlayLyric(this.audio.currentTime)
        }, false)
    }

    _calcTime(second) {
        let m = Math.floor(second / 60)
        let s = Math.floor(second % 60)
        return cover(m) + ':' + cover(s)

        function cover(v) {
            return String(v).length === 1 ? '0' + v : String(v)
        }
    }
}

// 使用姿势
/*
let mp = new MusicPlayer({
    el: '.box', // audio标签挂载到哪个dom下
    audio: { // 属性
        audioAttr: { // 设置audio标签的属性
            'id': 'audio',
            'class': 'audio',
            'controls': 'controls'
        },
        audioHide: false // 是否显示audio标签,默认不显示
    },
    data: { // 数据
        playSrc: String, //'歌曲的播放地址',
        songName: String, //'歌曲名',
        lyricData: Object //'歌词数据(从网易云的歌词文件中读取出来转为对象即可)'
    },
    methods: { // 事件回调
        currentTime(v) { // 当前歌曲的播放时间
            console.log('currentTime', v)
        },

        duration(v) { // 当前歌曲的总时长
            console.log('duration', v)
        },

        curPlayLyric(obj) { // 当前歌曲对应的歌词(返回一个对象,含有当前歌词obj.cur,上一句歌词obj.pre,和下一句歌词obj.next)
            console.log('curPlayLyric', obj.cur)
        }
    }
}).init()

// api
mp.setProgress(0.2) // 设置歌曲的进度(参数为 0 - 1数值)
mp.setVolume(0.5) // 设置歌曲的音量大小(参数为 0 - 1数值)
mp.cutSong(playSrc, lyricData, songInfo, songName, singer) // 切歌*/
