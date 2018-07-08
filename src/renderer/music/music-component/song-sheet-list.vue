/**
 * Created by Sorrow.X on 2018/6/23.
 */
<template>
    <table class="music-table">
            <colgroup>
                <col width="30">
                <col width="50">
                <col>
                <col width="40">
                <col width="100">
                <col width="100">
            </colgroup>
            <tbody>
                <tr v-for="(sheet, index) in songSheetList" @click="showRecommendDetailsComponent(sheet)">
                    <td></td>
                    <td>
                        <img
                            class="album-cover"
                            :src="sheet.coverImgUrl + '?param=40x40'"
                            width="40"
                            height="40"
                            draggable="false"
                            :onerror="defaultPlayListCover"
                        />
                    </td>
                    <td>{{ sheet.name }}</td>
                    <td @click.stop="addToMySongSheet(sheet.id)">
                        <button class="btn-collect"></button>
                    </td>
                    <td>{{ sheet.trackCount }}首</td>
                    <td>收听：{{ calcPlayCount(sheet.playCount) }}</td>
                </tr>
            </tbody>
        </table>
</template>

<script>
    import { getRecommendSongSheetDetails } from '../music-api/music-api'
    import SongMiXin from '../music-mixin/song-mixin'
    
    export default {
        name: 'SongSheetList',
        mixins: [SongMiXin],
        props: {
            songSheetList: {
                type: Array,
                default: function () {
                    return [] // 对象数组 {coverImgUrl, name, playCount, id, trackCount}
                }
            }
        },
        data: function () {
            return {
                defaultPlayListCover: "this.src='../../../static/img/default-play-list-cover_40x40.png'"
            }
        },
        methods: {
            calcPlayCount(num) {
                if (num >= 10000) {
                    return Math.floor(num / 10000) + '万'
                } else {
                    return num
                }
            },
            showRecommendDetailsComponent(songSheet) {
                this.detailsComp.showComp(songSheet.id)
            }
        },
        mounted() {
            this.detailsComp = this.$_live_getChildComponent(this.$root, 'recommend-song-sheet-details')
            this.cacheSongSheet = {}
        }
    }
</script>