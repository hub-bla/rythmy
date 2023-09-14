import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Image,
} from "react-native"
import { useAuthContext } from "../context"
import { getCurrentUserPlaylists } from "../utils/getCurrentUserPlaylists"
import { Playlist } from "../utils/getCurrentUserPlaylists"
import { useState, useEffect } from "react"
import { usePlaylistContext } from "../context/PlaylistContext"
import { Title } from "./styledComponents/Tittle"

export const Playlists: React.FC = () => {
	const { tokenData } = useAuthContext()
	const { handleSongsData } = usePlaylistContext()
	const [playlistsArrOfObj, setplaylistsArrOfObj] = useState([])

	const getPressedPlaylist = (name: string) => {
		const { href } = playlistsArrOfObj.find((playlist) => playlist.name == name)
		handleSongsData(href, tokenData.access_token)
	}

	useEffect(() => {
		getCurrentUserPlaylists(tokenData.access_token).then((data: [Playlist]) => {
			setplaylistsArrOfObj(data)
		})
	}, [])
	const playlists = playlistsArrOfObj.map((playlist: Playlist) => {
		return (
			<TouchableOpacity
				key={playlist.href}
				onPress={() => getPressedPlaylist(playlist.name)}>
				<View style={styles.playlist}>
					{playlist.images.url && (
						<Image
							source={{ uri: playlist.images.url }}
							style={{
								borderRadius: 25,
								width: 200,
								height: 200,
							}}
						/>
					)}
					<Text style={styles.playlistName} >{playlist.name}</Text>
				</View>
			</TouchableOpacity>
		)
	})

	return (
		<ScrollView
			contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
			style={styles.container}>
			<Title>Your Playlists</Title>
			{playlists}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	playlist: {
		width: 300,
		height: 300,
		backgroundColor: "#fca103",
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
		borderRadius: 25
	},
	container: {
		width: "100%",
		paddingVertical: 50,
	},

	playlistName: {
		color: "#FFF8F0",
		fontSize: 26,
		textAlign: "center",
		padding: 10
	},
})
