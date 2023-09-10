import { View, Text, StyleSheet } from "react-native"
import { useAuthContext } from "../context"
import { getCurrentUserPlaylists } from "../utils/currentUser"
import { Playlist } from "../utils/currentUser"
import { useState, useEffect } from "react"
export const Playlists: React.FC = () => {
	const { tokenData } = useAuthContext()
	const [playlists, setPlaylists] = useState([])
	useEffect(() => {
		getCurrentUserPlaylists(tokenData.access_token).then((data: [Playlist]) => {
			setPlaylists(
				data.map((playlist: Playlist) => (
					<View key={playlist.href} style={styles.playlist}>
						<Text>{playlist.name}</Text>
					</View>
				))
			)
		})
	}, [])

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
