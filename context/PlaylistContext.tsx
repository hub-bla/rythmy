import { createContext, useContext, useState } from "react"
import { getSongsFromPlaylist } from "../utils"

export const PlaylistContext = createContext(null)

export const usePlaylistContext = () => {
	const context = useContext(PlaylistContext)

	if (!context) {
		throw new Error(
			"PlaylistContext must be used within PlaylistContext.Provider"
		)
	}
	return context
}

export const usePlaylistContextValues = () => {
	const [songs, setSongs] = useState({})
	const [matchingTempoObj, setMatchingTempoObj] = useState({})
	const [isPicked, setIsPicked] = useState(false)

	const handleSongsData = (href: string, token: string) => {
		getSongsFromPlaylist(href, token).then(({ idTempoObj, songData }) => {
			setSongs(songData)
			setMatchingTempoObj(idTempoObj)
		})
		setIsPicked(true)
	}

	const findSuitableSong = (key: number, to_delete = null) => {
		let delete_id = null
		if (to_delete) {
			delete_id = to_delete.uri.replace("spotify:track:","")
			const newArr = matchingTempoObj[key].filter(
				(idTempo) => idTempo[0] != delete_id
			)
			setMatchingTempoObj((prev) => {
				prev[key] = newArr
				return prev
			})

		}
		console.log(delete_id)
		const tempoArr = delete_id
			? matchingTempoObj[key].filter((idTempo) => idTempo[0] != delete_id)
			: matchingTempoObj[key]
		console.log(tempoArr)

		if (tempoArr.length) {
			const randomTrack = Math.floor(Math.random() * tempoArr.length)

			return songs[tempoArr[randomTrack][0]]
		}
	}

	const deleteSong = (id: string) => {
		setMatchingTempoObj((prevMatchingTempoObj) => {
			delete prevMatchingTempoObj[id]
			return prevMatchingTempoObj
		})
	}
	return { handleSongsData, findSuitableSong, isPicked, deleteSong, matchingTempoObj }
}
