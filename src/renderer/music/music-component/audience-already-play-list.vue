/**
 * Created by Sorrow.X on 2018/6/26.
 */
<template>
    <div class="tab-pane active">
        <table class="music-table">
            <colgroup>
                <col width="30" />
                <col width="200" />
                <col width="200" />
                <col width="70" />
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th>歌曲标题</th>
                    <th>歌手</th>
                    <th>时长</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    :class="{selected: curRowIndex === index}"
                    v-for="(song, index) in calcSongList"
                    @dblclick="playOnlineMusic(song)"
                    @click="curRowIndex = index"
                    @contextmenu.prevent="registerMenu({ type: 'audienceAlreadyPlayedSongList', cbs: ['play', 'del', 'clear'], id: song.id, song: song }, index)">
                    <td></td>
                    <td>{{ song.name }}</td>
                    <td>{{ song.singer }}</td>
                    <td>{{ song.time }}</td>
                </tr>
            </tbody>
        </table>
        <empty :show="calcSongList.length === 0" :tip="['没有播放记录']"></empty>
    </div>
</template>

<script>
    import Empty from './empty'
    import SongMiXin from '../music-mixin/song-mixin'

    export default {
        name: 'AudienceAlreadyPlayList',
        mixins: [SongMiXin],
        components: { Empty },
        props: {
            songList: {
                type: Array,
                default: function () {
                    return [] // 对象数组 { name, singer, chooseSongUserName, chooseSongTime, time, id, lyricObjData, playSrc }
                }
            }
        },
        computed: {
            calcSongList() {
                let arr = this.songList.slice(0)
                return arr.reverse()
            }
        }
    }
</script>