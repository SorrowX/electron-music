/**
 * Created by Sorrow.X on 2018/6/23.
 */

import { extendDeep } from '../music-util/util'
import Api from './api'

const caclTimeError = '-- : --'

/**
 * 获取热门|新歌歌曲
 * @param {number} tag   0: 新歌 1: 热歌
 */
function getTopMusicList(tag) {
    return Api.get_top_musiclist(tag)
}

/**
 * 通过歌曲ID获取歌曲URL相关信息(id也可以是多个id逗号隔开字符串)
 * @param {number|string} id   eg: 440208476 或者 440208476,569214126
 */
function getMusicUrlByMusicId(id) {
    return Api.get_musicurl_by_musicid(id)
}

/**
 * 通过歌曲ID获取歌曲歌词相关信息
 * @param {number|string} id   eg: 440208476
 */
function getMusicLyricByMusicId(id) {
    return Api.get_music_lyric_by_musicid(id)
}

/**
 * 通过歌曲ID获取歌曲详情
 * @param {number|string} id   eg: 440208476
 */
function getMusicDetailByMusicid(id) {
    return Api.get_musicdetail_by_musicid(id)
}

/**
 * 获取热门|新歌列表
 * @param {number} tag   0: 新歌列表 1: 热歌列表
 */
async function getMusicListResult(tag) {
    let musicList = []
    let idStr = []
    let topMusicListRet = await getTopMusicList(tag)
    if (topMusicListRet.code === 200) {
        let trackIds = topMusicListRet['playlist']['trackIds']
        let tracks = topMusicListRet['playlist']['tracks']
        musicList = new Array(trackIds.length)
        trackIds.forEach((obj, index) => {
            musicList[index] = {
                id: obj.id
            }
            idStr.push(obj.id)
        })
        tracks.forEach((obj, index) => {
            musicList[index]['name'] = obj.name
            musicList[index]['size'] = obj['h'] && obj['h']['size']
            musicList[index]['album'] = obj['al'] && obj['al']['name']
            musicList[index]['singer'] = obj['ar'] && obj['ar'][0] && obj['ar'][0]['name']
            musicList[index]['state'] = -1
            musicList[index]['error'] = null
            musicList[index]['localLyricSrc'] = ''
            musicList[index]['lyricObjData'] = null
        })
        idStr = idStr.join(',')
    }

    let musicUrlRet = await getMusicUrlByMusicId(idStr)
    if (musicUrlRet.code === 200) {
        musicUrlRet.data.forEach((obj, index) => {
            let m = findArrItemById(musicList, obj.id)
            m['playSrc'] = obj['url']
            m['sparePlaySrc'] = `http://music.163.com/song/media/outer/url?id=${obj['id']}.mp3`
            m['time'] = calcTime((obj['size'] * 8) / obj['br'])
        })
    } else {
        idStr = idStr.split(',')
        musicList.forEach((obj, index) => {
            obj['playSrc'] = `http://music.163.com/song/media/outer/url?id=${obj['id']}.mp3`
            obj['sparePlaySrc'] = `http://music.163.com/song/media/outer/url?id=${obj['id']}.mp3`
            obj['time'] = ''
        })
    }
    return musicList
}

export async function getMusicList(tag, timeout) {
    return Promise.race([
        getMusicListResult(tag),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                return reject('getMusicList api request timeout')
            }, timeout || 15 * 1000)
        })
    ])
}

function calcTime(second) {
    let m = Math.floor(second / 60)
    let s = Math.floor(second % 60)

    let min = cover(m)
    let sec = cover(s)
    if (isNaN(min) || isNaN(sec)) {
        return caclTimeError
    } else {
        return cover(m) + ':' + cover(s) 
    }

    function cover(v) {
        return String(v).length === 1 ? '0' + v : String(v)
    }
}

/**
 * 获取热门歌单
 */
function getTopPlayListResult() {
    return Api.get_top_playlist()
}

export async function getTopPlayList(timeout) {
    return Promise.race([
        getTopPlayListResult(),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                return reject('getTopPlayList api request timeout')
            }, timeout || 15 * 1000)
        })
    ])
}

/**
 * 通过歌单ID获取歌曲列表
 * @param {number} id   eg: 440208476
 */
function getMusicListByPlayListId(id) {
    return Api.get_musiclist_by_playlistid(id)
}

async function getRecommendSongSheetDetailsResult(id) {
    let result = {}
    let musicList = []
    let idStr = []

    let ret = await getMusicListByPlayListId(id)

    if (ret.code === 200) {
        let trackIds = ret['playlist']['trackIds']
        let tracks = ret['playlist']['tracks']
        musicList = new Array(trackIds.length)
        trackIds.forEach((obj, index) => {
            musicList[index] = {
                id: obj.id
            }
            idStr.push(obj.id)
        })
        tracks.forEach((obj, index) => {
            musicList[index]['name'] = obj.name
            musicList[index]['size'] = obj['h'] && obj['h']['size']
            musicList[index]['album'] = obj['al'] && obj['al']['name']
            musicList[index]['singer'] = obj['ar'] && obj['ar'][0] && obj['ar'][0]['name']
            musicList[index]['state'] = -1
            musicList[index]['error'] = null
            musicList[index]['localLyricSrc'] = ''
            musicList[index]['lyricObjData'] = null
        })
        idStr = idStr.join(',')
        result.songSheetName = ret['playlist']['name']
        result.description = ret['playlist']['description']
        result.coverImgUrl = ret['playlist']['coverImgUrl']
    }

    let musicUrlRet = await getMusicUrlByMusicId(idStr)
    if (musicUrlRet.code === 200) {
        musicUrlRet.data.forEach((obj, index) => {
            let m = findArrItemById(musicList, obj.id)
            m['playSrc'] = obj['url']
            m['sparePlaySrc'] = `http://music.163.com/song/media/outer/url?id=${obj['id']}.mp3`
            m['time'] = calcTime((obj['size'] * 8) / obj['br'])
        })
    }
    result.musicList = musicList
    
    return result
}

export async function getRecommendSongSheetDetails(id, timeout) {
    return Promise.race([
        getRecommendSongSheetDetailsResult(id),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                return reject('getTopPlayList api request timeout')
            }, timeout || 15 * 1000)
        })
    ])
}

/**
 * 搜索歌曲根据关键词
 */
function searchMusicByKeywords(keywords) {
    return Api.search_music_by_keywords(keywords)
}

/**
 * 搜索歌单根据关键词
 */
function searchPlayListByKeywords(keywords) {
    return Api.search_playlist_by_keywords(keywords)
}

/**
 * 关键词获取歌曲和和歌单
 */
async function searchMusicResult(keywords) {
    let ret = {
        songInfo: [],
        songSheetInfo: []
    }
    let songInfo = await searchMusicByKeywords(keywords)
    if (songInfo.code === 200) {
        ret.songInfo = await changeMusicList(songInfo.result.songs)
    }

    let sheetInfo = await searchPlayListByKeywords(keywords)
    if (sheetInfo.code === 200) {
        ret.songSheetInfo = sheetInfo.result.playlists
    }
    
    return ret
}

export async function searchResult(keywords, timeout) {
    return Promise.race([
        searchMusicResult(keywords),
        new Promise(function (resolve, reject) {
            setTimeout(() => reject(new Error('searchResult request timeout')), timeout || 15 * 1000)
        })
    ])
}

async function changeMusicList(songs) {
    if (Array.isArray(songs)) {
        
        let musicList = []
        let idStr = []
        
        musicList = new Array(songs.length)
        songs.forEach((obj, index) => {
            musicList[index] = {
                id: obj.id,
                name: obj.name,
                album: obj['album']['name'],
                singer: obj['artists'][0]['name'],
                state: -1,
                error: null,
                localLyricSrc: '',
                lyricObjData: null
            }
            idStr.push(obj.id)
        })
        idStr = idStr.join(',')
        
        let musicUrlRet = await getMusicUrlByMusicId(idStr)
        if (musicUrlRet.code === 200) {
            musicUrlRet.data.forEach((obj, index) => {
                let m = findArrItemById(musicList, obj.id)
                m['playSrc'] = obj['url']
                m['sparePlaySrc'] = `http://music.163.com/song/media/outer/url?id=${obj['id']}.mp3`
                m['time'] = calcTime((obj['size'] * 8) / obj['br'])
            })
        }
        return musicList
    } else {
        return []
    }
}

function findArrItemById(arr, id) {
    let i = arr.findIndex((obj) => {
        return obj.id === id
    })
    return arr[i]
}



/**
 * 根据用户点的歌曲取出一首歌
 */
export async function getOneSong(keywords) {
    let result = []
    let songInfo = await searchMusicByKeywords(keywords)
    if (songInfo.code === 200) {
        result = await changeMusicList(songInfo.result.songs)
    }
    return getAvailableSong(result)
}

function getAvailableSong(arr) {
    let song = null
    let len = arr.length, i
    for (i = 0; i < len; i++) {
        let obj = arr[i]
        if (obj['playSrc'] !== null) {
            obj['sparePlaySrc'] = `http://music.163.com/song/media/outer/url?id=${obj['id']}.mp3`
            song = obj
            break
        }
    }
    if (!song) { song = arr[0] }
    return song
}

/**
 * 根据用户点的歌曲的id，来获取歌词和音乐地址
 */
export async function getSongInfoById(id, song = {}) {
    song = extendDeep(song) // 防止修改了vuex存储中心的数据
    
    let musicRet = await getMusicUrlByMusicId(id)
    if (musicRet.code === 200) {
        let obj = musicRet['data'][0]
        song['playSrc'] = obj['url']
        song['sparePlaySrc'] = `http://music.163.com/song/media/outer/url?id=${id}.mp3`
        song['time'] = calcTime((obj['size'] * 8) / obj['br'])
        song['needRemove'] = true
    } else {
        song['playSrc'] = `http://music.163.com/song/media/outer/url?id=${id}.mp3`
        song['sparePlaySrc'] = `http://music.163.com/song/media/outer/url?id=${id}.mp3`
        song['time'] = ''
        song['needRemove'] = true
    }

    let musicInfo = await getMusicDetailByMusicid(id)
    try {
        song['picUrl'] = musicInfo['songs'][0]['al']['picUrl']
    } catch(e) {
        song['picUrl'] = ''
    }

    let lyricRet = await getMusicLyricByMusicId(id)
    if (lyricRet.code === 200) {
        song['lyricObjData'] = lyricRet
    } else {
        song['lyricObjData'] = null
    }

    return song
}
