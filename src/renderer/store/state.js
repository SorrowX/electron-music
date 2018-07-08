/**
 * Created by Sorrow.X on 2018/6/23.
 */
 
const { loadSongInCache } = require('./cache.js')

const state = {
    mySongList: loadSongInCache({ type: 'mySongList' }), // 我的歌单数据
    audienceWaitSongList: loadSongInCache({ type: 'audienceWaitSongList' }), // 观众歌单数据(等待播放)
    audienceAlreadyPlayedSongList: loadSongInCache({ type: 'audienceAlreadyPlayedSongList' }) // 观众歌单数据(已经播放)
}

module.exports = state
