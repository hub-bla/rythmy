import { createContext, useContext, useState } from "react"
import { getSongsFromPlaylist } from "../utils"

export type SongType = {
	tempo: number
	duration_ms: number
	energy: number
	key: number
	uri: string
	name: string
}
export type Songs = { [id: string]: SongType }

export type matchingTempoObj = { [key: number]: [id: string, tempo: number][] }

export type usePlaylistContextValuesType = {
	handleSongsData?: (href: string, token: string) => void
	findSuitableSong?: (key: number, to_delete?: SongType) => SongType
	isPicked?: boolean
	matchingTempoObj?: matchingTempoObj
	setIsPicked:React.Dispatch<React.SetStateAction<boolean>>
}

export const PlaylistContext = createContext<usePlaylistContextValuesType>(null)

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
	const [songs, setSongs] = useState<Songs>({})
	const [matchingTempoObj, setMatchingTempoObj] = useState<matchingTempoObj>({})
	const [isPicked, setIsPicked] = useState(false)

	const handleSongsData = (href: string, token: string) => {
		getSongsFromPlaylist(href, token).then(({ idTempoObj, songData }) => {
			setSongs(songData)
			setMatchingTempoObj(idTempoObj)
		})
		setIsPicked(true)
	}

	const findSuitableSong = (key: number, to_delete: SongType | null = null) => {
		let delete_id: string | null = null
		if (to_delete) {
			delete_id = to_delete.uri.replace("spotify:track:", "")

			const newArr = matchingTempoObj[key].filter(
				(idTempo) => idTempo[0] != delete_id
			)

			setMatchingTempoObj((prev) => {
				prev[key] = newArr
				return prev
			})
		}

		let tempoArr = delete_id
			? matchingTempoObj[key].filter((idTempo) => idTempo[0] != delete_id)
			: matchingTempoObj[key]
		let add_to_key = 10
		let change_sign = -1
		while (tempoArr && tempoArr.length < 1) {
			const new_key = key + add_to_key * change_sign
			if (Object.keys(matchingTempoObj).includes(new_key.toString()))
				tempoArr = matchingTempoObj[key + add_to_key * change_sign]
			if (change_sign > 0) add_to_key += 10
			change_sign *= -1
		}

		if (tempoArr && tempoArr.length) {
			const randomTrack = Math.floor(Math.random() * tempoArr.length)

			return songs[tempoArr[randomTrack][0]]
		}
	}

	return {
		handleSongsData,
		findSuitableSong,
		isPicked,
		matchingTempoObj,
		setIsPicked,
	}
}
