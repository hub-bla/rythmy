type CurrentUser = {
	id: string
}

type ImageData = {
	width: number
	height: number
	url: string
}

export type Playlist = {
	href: string
	name: string
	picked: boolean
	images:
		| {
				url: string
				width: number
				height: number
		  }
		| undefined
}

export const getCurrentUserPlaylists: (
	token: string
) => Promise<Playlist[]> = async (token: string) => {
	const currentUserData: CurrentUser = await (
		await fetch("https://api.spotify.com/v1/me", {
			headers: {
				Authorization: "Bearer " + token,
			},
		})
	).json()
	const playlist_response = await (
		await fetch(
			`https://api.spotify.com/v1/users/${currentUserData.id}/playlists`,
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		)
	).json()
	const playlists: Playlist[] = playlist_response.items.map(
		(playlist: Playlist) => {
			const { name, href, images } = playlist
			return {
				name: name,
				href: href + "/tracks?limit=50",
				images: {
					url: images[0]?.url,
					width: images[0]?.width,
					height: images[0]?.height,
				},
				picked: false,
			}
		}
	)
	return playlists
}
