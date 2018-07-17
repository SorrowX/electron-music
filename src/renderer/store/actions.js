/**
 * Created by Sorrow.X on 2018/6/23.
 */

import types from './mutation-types'
import { addSongInCache, updateSongInCache, removeSongInCache, removeAllSongInCache, moveSongInCache, setVolumeValueInCache } from './cache.js'

const addSong = function({ commit }, { type, song }) {
	commit(types.ADD_SONG, { type, song })
	addSongInCache({ type, song })
}

const updateSong = function({ commit }, { type, id, song }) {
    commit(types.UPDATE_SONG, { type, id, song })
	updateSongInCache({ type, id, song })
}

const removeSong = function({ commit }, { type, id }) {
	commit(types.REMOVE_SONG, { type, id })
	removeSongInCache({ type, id })
}

const removeAllSong = function({ commit }, { type }) {
	commit(types.REMOVE_All_SONG, { type })
	removeAllSongInCache({ type })
}

const moveSong = function({ commit }, { type, id }) {
	commit(types.MOVE_SONG, { type, id })
	moveSongInCache({ type, id })
}

const setVolumeValue = function({ commit }, { value }) {
	commit(types.SET_VOLUME_VALUE, { value })
	setVolumeValueInCache({ value })
}

export default { addSong, updateSong, removeSong, removeAllSong, moveSong, setVolumeValue }
