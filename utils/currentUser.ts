type CurrentUser = {
	id: string
}

export type Playlist = {
	href: string
	name: string
	picked: boolean
}

export const getCurrentUserPlaylists: (
	token: string
) => Promise<[Playlist]> = async (token: string) => {
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
	const playlists: [Playlist] = playlist_response.items.map(
		(playlist: Playlist) => {
			const { name, href } = playlist
			return {
				name: name,
				href: href + "/tracks?limit=50",
				picked: false,
			}
		}
	)
	return playlists
}
