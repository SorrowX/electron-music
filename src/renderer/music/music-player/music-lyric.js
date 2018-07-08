/**
 * Created by Sorrow.X on 2018/6/22.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
}

function checkLyricData(data) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        if (
            (hasOwn(data, 'lrc') &&
            hasOwn(data['lrc'], 'lyric')) ||
            (hasOwn(data, 'tlyric') &&
            hasOwn(data['tlyric'], 'lyric'))
        ) {
            return true
        } else {
            return false
        }

    } else {
        return false
    }
}

class Lyric {
    constructor(data) {
        this.isGoOn = checkLyricData(data)
        if (!this.isGoOn) return

        this.data = data
        this.lrc = data['lrc']['lyric']
        this.tlyric = data['tlyric']['lyric']

        this.lrcMap = this.getLyricMap(this.lrc)
        this.finalLrcMap = this.convertProp(Object.assign({}, this.lrcMap))

        this.tlyricMap = this.getLyricMap(this.tlyric)
        this.finalTlyricMap = this.convertProp(Object.assign({}, this.tlyricMap))

        if (Object.keys(this.finalLrcMap).length === 0) { this.isGoOn = false }
    }

    getLyricMap(lrc) {
        let key, value, sIdx, eIdx, nsIdx
        let ret = {}
        if (!lrc || (typeof lrc !== 'string')) return ret

        while(lrc) {
            sIdx = lrc.indexOf('[')
            eIdx = lrc.indexOf(']') + 1
            if (sIdx !== -1 && eIdx !== -1) {
                key = lrc.slice(sIdx, eIdx)
                advance(eIdx)
                nsIdx = lrc.indexOf('[')
                value = lrc.slice(0, nsIdx)
                ret[key] = value.trim()
                advance(nsIdx)
            } else {
                break
            }
        }

        function advance (n) {
            lrc = lrc.substring(n)
        }
        return ret
    }

    convertProp(obj) {
        Object.keys(obj).forEach((str) => {
            if (!obj[str]) {
                delete obj[str]
            } else {
                let prop = f(str)
                if (prop) {
                    obj[prop] = obj[str]
                }
                delete obj[str]
            }
        })

        function f(str) {
            str = str.match(/^\[(\d+):(\d+)\.(\d+)/)
            if (str) {
                return Number(str[1]) * 60 * 1000 +  Number(str[2]) * 1000 +  Number(str[3])
            } else {
                return null
            }
        }
        return obj
    }

    getCurPlayLyric(audioCurTime) {
        if (!this.isGoOn) return

        let audioCurTimeMs = audioCurTime * 1000
        let arrTime = Object.keys(this.finalLrcMap)

        let i = 0, len = arrTime.length, idx
        let hasTranslate = Object.keys(this.finalTlyricMap).length > 0

        if (audioCurTimeMs === 0) {
            return {
                cur: v(this.finalLrcMap[arrTime[0]]),
                duration: parseInt(arrTime[1]) - parseInt(arrTime[0]),
                curIndex: 0
            }
        }
        if (audioCurTimeMs >= Number(arrTime[len - 1])) {
            return {
                cur: v(this.finalLrcMap[arrTime[len - 1]]),
                duration: parseInt(arrTime[len - 1]) - parseInt(arrTime[len - 2]),
                curIndex: len - 1
            }
        }
        for (; i < len; i++) {
            if (
                audioCurTimeMs >= Number(arrTime[i - 1]) &&
                audioCurTimeMs < Number(arrTime[i])
            ) {
                idx = i - 1
                break
            }
        }

        return {
            cur: v(this.finalLrcMap[arrTime[idx]]),
            duration: parseInt(arrTime[idx + 1]) - parseInt(arrTime[idx]),
            curIndex: idx
        }

        function g(prop) {
            return hasTranslate
                ? v(this.finalLrcMap[prop]) + ('\n') + v(this.finalTlyricMap[prop])
                : v(this.finalLrcMap[prop])
        }
        function v(val) {
            return typeof val === 'undefined' ? '' : val
        }
    }
}

export default Lyric
