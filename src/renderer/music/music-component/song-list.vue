/**
 * Created by Sorrow.X on 2018/6/23.
 */
<template>
    <table class="music-table">
        <colgroup>
            <col width="40" />
            <col />
            <col width="40" />
            <col width="120" />
            <col width="170" />
            <col width="70" />
        </colgroup>
        <thead>
            <tr>
                <th></th>
                <th>歌曲标题</th>
                <th></th>
                <th>歌手</th>
                <th>专辑</th>
                <th>时长</th>
            </tr>
        </thead>
        <tbody>
            <tr
                :class="{selected: index === curRowIndex}"
                v-for="(song, index) in songList"
                @click="curRowIndex = index"
                @dblclick="playOnlineMusic(song)"
            >
                <td></td>
                <td>{{ song.name }}</td>
                <td class="btn-collect-cell">
                    <Tooltip content="添加到我的歌单" placement="right" :delay="1000">
                        <button class="btn-collect" @click.stop="collectSong(song)" @dblclick.stop></button>
                    </Tooltip>
                </td>
                <td>{{ song.singer }}</td>
                <td>《{{ song.album }}》</td>
                <td>{{ song.time }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import SongMiXin from '../music-mixin/song-mixin'

    export default {
        name: "SongList",
        mixins: [ SongMiXin ],
        props: {
            songList: {
                type: Array,
                default: [] // 对象数组 {album, id, name, playSrc, singer, size, time}
            }
        }
    }
</script>
