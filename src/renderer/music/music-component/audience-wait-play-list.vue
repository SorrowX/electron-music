/**
 * Created by Sorrow.X on 2018/6/26.
 */
<template>
    <div class="tab-pane active">
        <table class="music-table">
            <colgroup>
                <col width="30" />
                <col width="170"/>
                <col width="170" />
                <col />
                <col width="140" />
            </colgroup>
            <thead>
                <tr>
                    <th></th>
                    <th>歌曲标题</th>
                    <th style="width: 200px;">歌手</th>
                    <th>点歌观众</th>
                    <th>点歌时间</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    :class="{selected: curRowIndex === index}"
                    v-for="(song, index) in songList"
                    @click="curRowIndex = index"
                    @dblclick="playOnlineMusicAndRemove(song)"
                    @contextmenu.prevent="registerMenu({ type: 'audienceWaitSongList', cbs: ['play', 'del', 'clear', 'top'], id: song.id, song: song }, index)">
                    <td></td>
                    <td>{{ song.name }}</td>
                    <td>{{ song.singer }}</td>
                    <td>{{ song.chooseSongUserName }}</td>
                    <td>{{ song.chooseSongTime }}</td>
                </tr>
            </tbody>
        </table>
        <empty :show="songList.length === 0" :tip="['观众歌单没有等待播放的歌曲', '点歌方法：在直播页面发送弹幕“点歌，歌名”完成点歌，赶快告诉您的粉丝吧']"></empty>
    </div>
</template>

<script>
    import Empty from './empty'
    import SongMiXin from '../music-mixin/song-mixin'

    export default {
        name: 'AudienceWaitPlayList',
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
        data: function () {
            return {
            }
        }
    }
</script>