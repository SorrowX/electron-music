/**
 * Created by Sorrow.X on 2018/6/23.
 */
import { remove } from '../music/music-util/util'
import { local, session } from '../music/music-util/storage'

/*
 * 往缓存歌曲列表数组中添加一首歌或者多首歌曲
 * params: obj: {
 *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList',
 *             song: 歌曲对象|数组歌曲对象
 *         }
*/
export function addSongInCache({ type, song }) {
    let arr = local.getItem(type, [])
    if (Array.isArray(song)) {
        arr = arr.concat(song)
    } else if (Object.prototype.toString.call(song) === "[object Object]") {
        arr.push(song)
    }
    local.setItem(type, arr)
    return arr
}

/*
 * 更新缓存歌曲列表数组中的一首歌
 * params: obj: {
 *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList',
 *             id: '歌曲对象中的id',
 *             song: 歌曲对象
 *         }
*/
export function updateSongInCache({ type, id, song }) {
    let arr = local.getItem(type, [])

    let i = arr.findIndex(obj => {
        return obj.id === id
    })
    let def = arr[i]
    if (!def) return

    for (let prop in song) {
        if (song.hasOwnProperty(prop) && typeof song[prop] !== "function") {
            def[prop] = song[prop]
        }
    }
    local.setItem(type, arr)
    return arr
}

/*
 * 移除缓存歌曲列表数组中的一首歌或者多首歌曲
 * params: obj: {
 *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList',
 *             id: '歌曲对象中的id|或者数组id',
 *         }
*/
export function removeSongInCache({ type, id }) {
    let arr = local.getItem(type, [])

    if (typeof id === "string" || typeof id === "number") {
        removeItem(arr, id)
    } else if (Array.isArray(id)) {
        id.forEach(i => {
            removeItem(arr, i)
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

    local.setItem(type, arr)
    return arr
}

/*
 * 清空歌曲列表数组中所有的歌曲
 * params: obj: {
 *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList'
 *         }
*/
export function removeAllSongInCache({ type }) {
    return local.setItem(type, [])
}

/*
 * 载入缓存歌曲列表数组中所有数据
*/
export function loadSongInCache({ type }) {
    return local.getItem(type, [])
}

/*
 * 根据musicId把一首歌移动到数组顶部
 * params: obj: {
 *             type: 'mySongList'|'audienceWaitSongList'|'audienceAlreadyPlayedSongList',
 *             id: '歌曲对象中的id'
 *         }
*/
export function moveSongInCache({ type, id }) {
    let arr = local.getItem(type, [])

    let a = removeItem(arr, id)
    let item = Array.isArray(a) && a[0]
    if (item) {
        arr.unshift(item)
    }

    function removeItem(arr, id) {
        let i = arr.findIndex(obj => {
            return obj.id === id
        })

        if (i !== -1) {
            return remove(arr, arr[i])
        }
    }

    local.setItem(type, arr)
    return arr
}

export function setVolumeValueInCache({ value }) {
    return local.setItem('volumeValue', value)
}

export function getVolumeValueInCache() {
    return local.getItem('volumeValue', 100)
}