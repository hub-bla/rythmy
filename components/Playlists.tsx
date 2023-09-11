import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useAuthContext } from "../context"
import { getCurrentUserPlaylists } from "../utils/currentUser"
import { Playlist } from "../utils/currentUser"
import { useState, useEffect } from "react"
import { getSongsFromPlaylist } from "../utils"
import { usePlaylistContext, usePlaylistContextValues } from "../context/PlaylistContext"

export const Playlists: React.FC = () => {
	const { tokenData } = useAuthContext()
	const {handleSongsData} = usePlaylistContext()
	const [playlistsArrOfObj, setplaylistsArrOfObj] = useState([])
	const [selectedPlaylist, setSelectedPlaylist] = useState(null)
	const [loading, setLoading] = useState(true)

	const getPressedPlaylist = (name: string) => {
		const { href } = playlistsArrOfObj.find((playlist) => playlist.name == name)
		handleSongsData(href, tokenData.access_token)
	}

	useEffect(() => {
		getCurrentUserPlaylists(tokenData.access_token).then((data: [Playlist]) => {
			setplaylistsArrOfObj(data)
		})
	}, [])
	const playlists = playlistsArrOfObj.map((playlist: Playlist) => (
		<TouchableOpacity
			key={playlist.href}
			onPress={() => getPressedPlaylist(playlist.name)}>
			<View style={styles.playlist}>
				<Text>{playlist.name}</Text>
			</View>
		</TouchableOpacity>
	))

	return <>{playlists}</>
}

const styles = StyleSheet.create({
	playlist: {
		width: "50%",
		height: 50,
		backgroundColor: "#fca103",
		alignItems: "center",
		justifyContent: "center",
		margin: 10,
	},
})
