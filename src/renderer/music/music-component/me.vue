/**
 * Created by Sorrow.X on 2018/6/22.
 */
<template>
    <div class="tab-pane active">
        <h2>
            我的歌单
            <button class="btn-gradient hidden">本地音乐导入</button>
        </h2>
        <div class="tab-content">
            <div class="tab-pane active">
                <table class="music-table">
                    <colgroup>
                        <col width="30" />
                        <col />
                        <col width="150" />
                        <col width="180" />
                        <col width="70" />
                        <!--<col width="70" />-->
                    </colgroup>
                    <thead>
                        <tr>
                            <th></th>
                            <th>歌曲标题</th>
                            <th>歌手</th>
                            <th>专辑</th>
                            <th>时长</th>
                            <!--<th>下载状态</th>-->
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            :class="{selected: index === curRowIndex}"
                            v-for="(music, index) in mySongList"
                            @click="curRowIndex = index"
                            @dblclick="playOnlineMusicAndAdd(music)"
                            @contextmenu.prevent="registerMenu({ type: 'mySongList', cbs: ['play', 'del', 'clear', 'top'], id: music.id, song: music }, index)"
                        >
                            <td></td>
                            <td>{{ music.name }}</td>
                            <td>{{ music.singer }}</td>
                            <td>《{{ music.album }}》</td>
                            <td>{{ music.time }}</td>
                            <!--<td>
                                <span v-show="music.error" class="download-state fail">下载失败</span>
                                <span v-show="music.state === 1 && !music.error" class="download-state downloaded">已下载</span>
                                <span v-show="music.state === -1 && !music.error" class="download-state wait">等待下载</span>
                                <span v-show="music.state === 0 && !music.error" class="download-state ing">正在下载</span>
                            </td>-->
                        </tr>
                    </tbody>
                </table>
                <empty v-show="mySongList.length === 0" :tip="['没有歌曲，快去“推荐歌单”添加自己喜欢的歌曲吧~']"></empty>
            </div>
        </div>
    </div>
</template>

<script>
    import Empty from './empty'
    import SongMiXin from '../music-mixin/song-mixin'

    export default {
        name: "Me",
        mixins: [ SongMiXin ],
        components: { Empty }
    }
</script>
