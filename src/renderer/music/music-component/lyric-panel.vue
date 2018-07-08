/**
 * Created by Sorrow.X on 2018/6/27.
 */
<template>
    <div class="music-lyric-panel" :style="[{opacity: calcOpacity}]" ref="lyricPanelDom">
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
    export default {
        name: "MusicLyricPanel",
        data: function() {
            return {
                show: false,
                lrcArr: [],
                curIndex: -1,
                contentHeight: 448,
                transform3d: "translate3d(0, 0, 0)",
                tip: true,
                tipMessage: '啊偶, 暂无歌词信息!'
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
                return this.show ? .85 : 0
            }
        },
        methods: {
            isShow(bool) {
                this.show = bool
                if (bool) {
                    this.SearchResultComponent.isShow(false)
                }
            },
            toggleShow() {
                this.show = !this.show
            },
            initUi(lyricInstance, song) {
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
                if (typeof index === "number" && this.$refs["preAllDom"]) {
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
            },
            recovery() {
                this.contentHeight = fixedHeight
                this.transform3d = "translate3d(0, " + 0 + "px, 0)"
            }
        },
        mounted() {
            this.SearchResultComponent = this.$_live_getChildComponent(this.$root, "search-result")
        }
    }
</script>

<style>
    .music-lyric-panel {
        left: 0px !important;
    }
</style>
