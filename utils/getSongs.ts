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

export const getSongsFromPlaylist = async (
	href: string,
	token: string,
) => {
	const PlaylistData = await (
		await fetch(href, {
			headers: {
				Authorization: "Bearer " + token,
			},
		})
	).json()

	const songData = {}
	PlaylistData.items.map((song: SongData) => {
		const { name, artists, id, uri } = song.track
		const artist: string = artists[0].name
		
		songData[id] = {
			name: artist + "-" + name,
			uri
		}
	})
	let n = Object.keys(songData).length
	const songIds: string[][] = []

	for (let i = 0; i < n; ) {
		const chunk = Object.keys(songData).slice(i, i + 100)
		songIds.push(chunk)
		i += 100
	}

    let idTempoArr:[string, number][] = []

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
				//it data is returned in the same order as was the requested
				for (let i = 0; i < songs.length; i++) {
					const { tempo, duration_ms, energy, id } = songs[i]

					
					songData[id] = {
						tempo: tempo < 100 ? tempo*2 : tempo,
						duration_ms,
						energy,
						...songData[id],
					}
                    idTempoArr.push([id, tempo < 100 ? tempo*2 : tempo])
				}
			})
			.catch((err) => console.log(err))
            idTempoArr = idTempoArr.sort((a, b) => b[1]- a[1])
	}
    console.log("check")
    return {idTempoArr, songData}
}
