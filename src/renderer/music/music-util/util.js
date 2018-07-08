function remove(arr, item){
    if (arr.length) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}

function debounce(fn, ms, ctx) {
    ms || (ms = 150)
    let last, deferTimer
    return function() {
        let context = ctx || this
        let now = +new Date(),
            args = arguments
        if (last && now < last + ms) {
            clearTimeout(deferTimer)
            deferTimer = setTimeout(function() {
                last = now
                fn.apply(context, args)
            }, ms)
        } else {
            last = now
            fn.apply(context, args)
        }
    }
}

function extendDeep(parent, child) {
    var i,
        toStr = Object.prototype.toString,
        astr = '[object Array]'

    child = child || {}

    for (i in parent) {
        if (parent.hasOwnProperty(i)) {
            if (typeof parent[i] === 'object') {
                child[i] = (toStr.call(parent[i]) === astr) ? [] : {}
                extendDeep(parent[i], child[i])
            } else {
                child[i] = parent[i]
            }
        }
    }
    return child
}

export { remove, debounce, extendDeep }