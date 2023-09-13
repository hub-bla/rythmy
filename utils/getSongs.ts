import { Songs, matchingTempoObj } from "../context/PlaylistContext"

type Artist = {
	name: string
}

type SongData = {
	track: {
		name: string
		id: string
		artists: Artist[]
		uri: string
	}
}

type SongFeature = {
	id: string
	tempo: number
	energy: number
	duration_ms: number
}

type SongsFeaturesData = {
	audio_features: SongFeature[]
}

export const getSongsFromPlaylist = async (href: string, token: string) => {
	const PlaylistData = await (
		await fetch(href, {
			headers: {
				Authorization: "Bearer " + token,
			},
		})
	).json()

	const songData:Songs = {}
	PlaylistData.items.map((song: SongData) => {
		const { name, artists, id, uri } = song.track
		const artist: string = artists[0].name

		songData[id] = {
			name: artist + "-" + name,
			uri,
			tempo: null,
			duration_ms:null,
			energy:null,
			key:null,
		}
	})

	const n = Object.keys(songData).length
	const songIds: string[][] = []

	for (let i = 0; i < n; ) {
		const chunk = Object.keys(songData).slice(i, i + 100)
		songIds.push(chunk)
		i += 100
	}

	let idTempoObj: matchingTempoObj = {}
	for (let i = 90; i < 210; ) {
		idTempoObj[i] = []
	
		i += 10
	}

	for (let i = 0; i < songIds.length; i++) {
		const chunk = songIds[i].join(",")
		await (
			await fetch(`https://api.spotify.com/v1/audio-features?ids=${chunk}`, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
		)
			.json()
			.then((data: SongsFeaturesData) => {
				const { audio_features: songs } = data
				
				for (let i = 0; i < songs.length; i++) {
					const { tempo, duration_ms, energy, id } = songs[i]

					const correctTempo = tempo < 90 ? tempo * 2 : tempo
					const key = Math.floor(correctTempo / 10) * 10
					songData[id] = {
						...songData[id],
						tempo: tempo < 90 ? tempo * 2 : tempo,
						duration_ms,
						energy,
						key,
					}
					idTempoObj[key].push([id, correctTempo])
				}
			})
			.catch((err) => console.log(err))
	}


	return { idTempoObj, songData }
}
