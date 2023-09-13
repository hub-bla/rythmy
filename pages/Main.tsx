import { Button } from "react-native"
import { Login, Playlists } from "../components"
import { useAuthContext } from "../context"
import { Text } from "react-native"
import { useEffect } from "react"
import { usePlaylistContext } from "../context/PlaylistContext"
import { RunPage } from "./RunPage"
export const Main: React.FC = () => {
	const { isAuthorized, refreshToken, tokenData } = useAuthContext()
	const { isPicked } = usePlaylistContext()
	useEffect(() => {
		if (isAuthorized && tokenData.access_token != null) {
			setInterval(() => refreshToken(), tokenData.expires_in * 1000)
		}
	}, [isAuthorized])

	if (!isAuthorized) {
		return <Login />
	}

	if (isPicked) {
		return <RunPage />
	}
	return (
		<>
			<Playlists />
		</>
	)
}
