import { Login, Playlists } from "../components"
import { useAuthContext } from "../context"
import { useEffect } from "react"
import { usePlaylistContext } from "../context/PlaylistContext"
import { RunPage } from "./RunPage"
export const Main: React.FC = () => {
	const { isAuthorized, refreshToken, tokenData } = useAuthContext()
	const { isPicked } = usePlaylistContext()
	useEffect(() => {
		if (isAuthorized && tokenData.access_token != null) {
			const interval = setInterval(
				() => refreshToken(),
				tokenData.expires_in * 1000
			)
			return () => clearInterval(interval)
		}
	}, [isAuthorized])

	if (!isAuthorized) {
		return (
			<>
				<Login />
			</>
		)
	}

	if (isPicked) {
		return <RunPage />
	}
	return <Playlists />
}
