import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import { AuthContext, useAuthContextValues } from "./context"
import { Main } from "./pages"
import "react-native-url-polyfill/auto"
import {
	PlaylistContext,
	usePlaylistContextValues,
} from "./context/PlaylistContext"
import { PlayerContext, usePlayerContextValues } from "./context/PlayerContext"
export default function App() {
	return (
		<View style={styles.container}>
			<AuthContext.Provider value={useAuthContextValues()}>
				<PlaylistContext.Provider value={usePlaylistContextValues()}>
					<PlayerContext.Provider value={usePlayerContextValues()}>
						<Main />
					</PlayerContext.Provider>
				</PlaylistContext.Provider>
			</AuthContext.Provider>
			<StatusBar style='auto' />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF8F0",
		alignItems: "center",
		justifyContent: "center",
	},
})
