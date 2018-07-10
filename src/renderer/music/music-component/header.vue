/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <header>
            <h1>
                <i class="icon-win-music"></i>
                爱听音乐
            </h1>

            <div class="search">
                <input v-model="keywords" type="text" placeholder="搜索音乐、歌单" @keyup.enter="showSearchResultComponent"/>
                <button class="icon-search" @click="showSearchResultComponent"></button>
            </div>
            <div class="win-controls">
                <button class="btn-minimize" @click="$minWin()"></button>
                <button class="btn-close" ref="btnClose" @click="$closeWin()"></button>
            </div>
        </header>
</template>

<script>
    export default {
        name: 'MusicHeader',
        data() {
            return {
                keywords: ''
            }
        },
        watch: {
            keywords(newVal, oldVal) {
                if (newVal !== oldVal && newVal.trim() !== '') {
                    this.$emit('search-keywords', newVal.trim())
                }
            }
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
