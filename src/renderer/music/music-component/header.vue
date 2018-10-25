/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <header :style="headerCompStyle['headerTagStyle']">
            <h1>
                <i class="icon-win-music"></i>
                爱听音乐
            </h1>

            <div class="search">
                <input 
                    :style="headerCompStyle['inputTagStyle']" 
                    v-model="keywords" 
                    type="text" 
                    placeholder="搜索音乐、歌单" 
                    @keyup.enter="showSearchResultComponent"
                />
                <button class="icon-search" @click="showSearchResultComponent"></button>
            </div>
            <div class="win-controls">
                <button class="btn-minimize" @click="$minWin()"></button>
                <button class="btn-close" ref="btnClose" @click="$closeWin()"></button>
            </div>
        </header>
</template>

<script>
    let defaultStyle = {
        headerTagStyle: {
            background: '#242330'
        },
        inputTagStyle: {
            background: '#191822',
            border: 'solid 1px #1d1c27'
        }
    }

    let changeStyle = {
        headerTagStyle: {
            background: '#242330'
        },
        inputTagStyle: {
            background: '#191822'
        }
    }

    export default {
        name: 'MusicHeader',
        data() {
            return {
                keywords: '',
                headerCompStyle: defaultStyle
            }
        },
        watch: {
            keywords(newVal, oldVal) {
                if (newVal !== oldVal && newVal.trim() !== '') {
                    this.$emit('search-keywords', newVal.trim())
                }
            }
        },
        created() {
            this.$root.$on('header-change-style', (original, styleObj) => {
                if (original) {
                    this.headerCompStyle = defaultStyle
                } else {
                    this.headerCompStyle = styleObj
                }
            })
        },
        methods: {
            showSearchResultComponent() {
                if (this.keywords.trim() !== '') {
                    this.searchResultComponent.showAndSearch()
                }
            }
        },
        mounted() {
            this.searchResultComponent = this.$_live_getChildComponent(this.$root, "search-result")
        }
    }
</script>

<style>
    /* CSS */
</style>
