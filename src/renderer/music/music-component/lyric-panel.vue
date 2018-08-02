/**
 * Created by Sorrow.X on 2018/6/27.
 */
<template>
    <div 
        class="music-lyric-panel" 
        :style="[{opacity: calcOpacity}]" 
        ref="lyricPanelDom"
        @dblclick="showImgBg = !showImgBg"
    >   
        <transition name="bg-fade">
            <img class="bg-img" :src="backgroundUrl" ref="bgDom" v-show="showImgBg">
        </transition>
        <div
            class="music-lyric-panel-content"
            :style="[{ height: contentHeight + 'px', transform: transform3d }]"
            ref="panelContentDom"
        >
            <pre
                v-for="(item, index) in lrcArr"
                ref="preAllDom"
                :class="{'lyric-active': index === curIndex}"
            >{{ item }}</pre>
        </div>
        <div class="no-lyric" v-show="tip">
            <p>{{ tipMessage }}</p>
        </div>
    </div>
</template>

<script>
    const fixedHeight = 5000
    const defaultBg = require('../music-style/skin/dark/img/bk.jpg')

    export default {
        name: 'MusicLyricPanel',
        data: function() {
            return {
                show: false,
                lrcArr: [],
                curIndex: -1,
                contentHeight: 448,
                transform3d: 'translate3d(0, 0, 0)',
                tip: true,
                tipMessage: '啊偶, 暂无歌词信息!',
                backgroundUrl: defaultBg,
                showImgBg: true
            }
        },
        computed: {
            calcOpacity() {
                let dom = this.$refs["lyricPanelDom"]
                if (dom) {
                    if (this.show) {
                        dom["style"]["pointer-events"] = "all"
                    } else {
                        dom["style"]["pointer-events"] = "none"
                    }
                }
                return this.show ? .9 : 0
            }
        },
        methods: {
            isShow(bool) {
                this.show = bool
                if (bool) {
                    this.searchResultComponent.isShow(false)
                }
            },
            toggleShow() {
                return this.show = !this.show
            },
            initUi(lyricInstance, song) {
                this.showImgBg = false
                if (lyricInstance && lyricInstance["finalLrcMap"]) {
                    if (Object.keys(lyricInstance["finalLrcMap"]).length === 0) {
                        this.tip = true
                        this.lrcArr = []
                        this.tipMessage = '该歌曲暂未提供歌词!'
                    } else {
                        this.tip = false
                        this.lrcArr = this.initLrcArr(lyricInstance.finalLrcMap)
                        this.initContentHeight()
                    }
                } else {
                    this.tip = true
                    this.lrcArr = []
                }
                this.switchBg(song['picUrl'])
            },
            initLrcArr(lrcMap) {
                let arr = []
                for (let prop in lrcMap) {
                    arr.push(lrcMap[prop])
                }
                return arr
            },
            initContentHeight() {
                this.$nextTick(() => {
                    let allHeight = 0
                    if (this.$refs["preAllDom"]) {
                        this.$refs["preAllDom"].forEach(dom => {
                            let height = parseInt(window.getComputedStyle(dom, null)["height"])
                            if (!isNaN(height)) {
                                allHeight += height
                            }
                        })
                        this.contentHeight = allHeight
                    } else {
                        this.contentHeight = fixedHeight
                    }
                })
            },
            scrollLyric(index) {
                try {
                    if (typeof index === "number" && this.$refs["preAllDom"].length > 0) {
                        this.curIndex = index
                        let height = parseInt(window.getComputedStyle(this.$refs["preAllDom"][index], null)["height"])
                        let curHeight = index * height - 224
                        if (curHeight >= 0 && curHeight <= this.contentHeight) {
                            curHeight *= -1
                            curHeight = curHeight
                            this.transform3d = "translate3d(0, " + curHeight + "px, 0)"
                        } else {
                            this.transform3d = "translate3d(0, " + 0 + "px, 0)"
                        }
                    }
                } catch(e) {}
            },
            recovery() {
                this.contentHeight = fixedHeight
                this.transform3d = "translate3d(0, " + 0 + "px, 0)"
            },
            switchBg(url) {
                url = url || defaultBg
                this.doImage.setSrc(this.$refs.bgDom, url)
            },
            handlerImage(localImgSrc, errorImgSrc) {
                let self = this
                return {
                    setSrc(imgNode, src) {
                        let img = new Image
                        img.onload = function() {
                            clearTimeout(this.tick)
                            this.tick = setTimeout(() => { // nextTick中的渲染watcher还未更新，开个定时器(暂时没想都更好的办法)
                                imgNode.src = this.src
                                self.showImgBg = true
                            }, 1000)
                        }
                        img.onerror = function() {
                            imgNode.src = errorImgSrc
                            self.showImgBg = true
                        }
                        img.src = src
                    }
                }
            },
            handlerSongError() {
                this.showImgBg = false
                this.tip = true
                this.lrcArr = []
                this.tipMessage = '播放失败!'
            }
        },
        mounted() {
            this.searchResultComponent = this.$_live_getChildComponent(this.$root, 'search-result')
            this.doImage = this.handlerImage(defaultBg, defaultBg)
            this.tick = null
        }
    }
</script>

<style>
    .music-lyric-panel {
        left: 0px !important;
    }
    .no-lyric {
        position: absolute;
    }
    .bg-img {
        transition: all 3s;
        position: absolute;
        top: 0px;
        left: 0px;
        vertical-align: middle;
        max-width: 798px;
        width: 100%;
        /*filter: blur(3px);*/
    }

    .bg-fade-enter-active {
        transition: all 1s;
    }
    .bg-fade-leave-active {
        transition: all .35s;
    }
    .bg-fade-enter, .bg-fade-leave-to{
        opacity: 0;
    }
</style>
