/**
 * Created by Sorrow.X on 2018/6/23.
 */

const mySongList = state => state.mySongList
const audienceWaitSongList = state => state.audienceWaitSongList
const audienceAlreadyPlayedSongList = state => state.audienceAlreadyPlayedSongList
const userVolumeVal = state => state.userVolumeVal

export default {
    mySongList,
    audienceWaitSongList,
    audienceAlreadyPlayedSongList,
    userVolumeVal
}
