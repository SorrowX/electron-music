/**
 * Created by Sorrow.X on 2018/6/23.
 */
 
import { loadSongInCache, getVolumeValueInCache } from './cache.js'

const state = {
    mySongList: loadSongInCache({ type: 'mySongList' }), // 我的歌单数据
    audienceWaitSongList: loadSongInCache({ type: 'audienceWaitSongList' }), // 观众歌单数据(等待播放)
    audienceAlreadyPlayedSongList: loadSongInCache({ type: 'audienceAlreadyPlayedSongList' }), // 观众歌单数据(已经播放)
    userVolumeVal: getVolumeValueInCache() // 音量大小 (0 - 100)
}

export default state
