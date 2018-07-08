/**
 * Created by Sorrow.X on 2018/6/23.
 */

const types = require("./mutation-types")
const { remove } = require("../music/music-util/util")

const mutations = {
    /*
     * 往歌曲列表数组中添加一首歌或者多首歌曲
     * params: obj: {
     *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList',
     *             song: 歌曲对象|数组歌曲对象
     *         }
    */
    [types.ADD_SONG](state, { type, song }) {
        if (Array.isArray(song)) {
            let arr = state[type].slice(0)
            arr = arr.concat(song)
            state[type] = arr
        } else if (Object.prototype.toString.call(song) === "[object Object]") {
            state[type].push(song)
        }
    },

    /*
     * 更新歌曲列表数组中的一首歌
     * params: obj: {
     *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList',
     *             id: '歌曲对象中的id',
     *             song: 歌曲对象
     *         }
    */
    [types.UPDATE_SONG](state, { type, id, song }) {
        state[type].forEach(music => {
            if (music.id === id) {
                for (let prop in song) {
                    if (song.hasOwnProperty(prop) && typeof song[prop] !== "function") {
                        music[prop] = song[prop]
                    }
                }
            }
        })
    },

    /*
     * 移除歌曲列表数组中的一首歌或者多首歌曲
     * params: obj: {
     *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList',
     *             id: '歌曲对象中的id|或者数组id',
     *         }
    */
    [types.REMOVE_SONG](state, { type, id }) {
        if (typeof id === "string" || typeof id === "number") {
            removeItem(state[type], id)
        } else if (Array.isArray(id)) {
            id.forEach(i => {
                removeItem(state[type], i)
            })
        }

        function removeItem(arr, id) {
            let i = arr.findIndex(obj => {
                return obj.id === id
            })

            if (i !== -1) {
                remove(arr, arr[i])
            }
        }
    },

    /*
     * 清空歌曲列表数组中所有的歌曲
     * params: obj: {
     *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList'
     *         }
    */
    [types.REMOVE_All_SONG](state, { type }) {
        state[type] = []
    },

    /*
     * 根据musicId把一首歌移动到数组顶部
     * params: obj: {
     *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList',
     *             id: '歌曲对象中的id'
     *         }
    */
    [types.MOVE_SONG](state, { type, id }) {
        let arr = removeItem(state[type], id)
        let item = Array.isArray(arr) && arr[0]
        state[type].unshift(item)

        function removeItem(arr, id) {
            let i = arr.findIndex(obj => {
                return obj.id === id
            })

            if (i !== -1) {
                return remove(arr, arr[i])
            }
        }
    }
}

export default mutations
