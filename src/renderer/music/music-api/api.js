import axios from 'axios'

const DOMAIN = 'http://120.92.94.109:3000'

function getData(url) {
    return axios.get(url)
}

export default class Api {
    /**
     * 获取热门歌单
     */
    static get_top_playlist() {
        const api = "/top/playlist"
        const url = `${DOMAIN}${api}`
        const params = "limit=300&order=hot"
        const requestUrl = `${url}?${params}`
        return getData(requestUrl).then(response => {
            const { data } = response
            return data
        })
    }

    /**
     * 获取热门歌曲
     */
    static get_top_musiclist(flag /*0 新歌   1 热歌*/) {
        const api = "/top/list"
        const url = `${DOMAIN}${api}`
        const params = `idx=${flag}`
        const requestUrl = `${url}?${params}`
        return getData(requestUrl).then(response => {
            const { data } = response
            return data
        })
    }

    /**
     * 通过歌单ID获取歌曲列表
     */
    static get_musiclist_by_playlistid(id) {
        const api = "/playlist/detail"
        const url = `${DOMAIN}${api}`
        const params = `id=${id}`
        const requestUrl = `${url}?${params}`
        return getData(requestUrl).then(response => {
            const { data } = response
            return data
        })
    }

    /**
     * 通过歌曲ID获取歌曲URL相关信息
     */
    static get_musicurl_by_musicid(id) {
        //id也可以是多个id逗号隔开字符串

        const api = "/music/url"
        const url = `${DOMAIN}${api}`
        const params = `id=${id}`
        const requestUrl = `${url}?${params}`
        return getData(requestUrl).then(response => {
            const { data } = response
            return data
        })
    }

    /**
     * 通过歌曲ID获取歌曲详情
     */
    static get_musicdetail_by_musicid(id) {
        const api = "/song/detail"
        const url = `${DOMAIN}${api}`
        const params = `ids=${id}`
        const requestUrl = `${url}?${params}`
        return getData(requestUrl).then(response => {
            const { data } = response
            return data
        })
    }

    /**
     * 通过歌曲ID获取歌词
     */
    static get_music_lyric_by_musicid(id) {
        const api = "/lyric"
        const url = `${DOMAIN}${api}`
        const params = `id=${id}`
        const requestUrl = `${url}?${params}`
        return getData(requestUrl).then(response => {
            const { data } = response
            return data
        })
    }

    /**
     * 搜索歌曲和歌单
     */
    static search_music_by_keywords(keywords) {
        const api = "/search"
        const url = `${DOMAIN}${api}`
        const params = `keywords=${keywords}&type=1`
        const requestUrl = `${url}?${params}&limit=60`
        return getData(requestUrl).then(response => {
            const { data } = response
            return data
        })
    }

    static search_playlist_by_keywords(keywords) {
        const api = "/search"
        const url = `${DOMAIN}${api}`
        const params = `keywords=${keywords}&type=1000`
        const requestUrl = `${url}?${params}&limit=30`
        return getData(requestUrl).then(response => {
            const { data } = response
            return data
        })
    }
}
