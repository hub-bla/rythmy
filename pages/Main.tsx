import { Button } from "react-native"
import { Login, Playlists } from "../components"
import { useAuthContext } from "../context"
import { Text } from "react-native"
import { useEffect } from "react"
export const Main: React.FC = () => {
	const { isAuthorized, refreshToken, tokenData } = useAuthContext()
	useEffect(() => {
		if (isAuthorized && tokenData.access_token !=null) {
			setInterval(() => refreshToken(), tokenData.expires_in*1000)
		}
	}, [isAuthorized])

    
	if (!isAuthorized) {
		return <Login />
	}
  
	return (
		<>
			<Playlists/>
		</>
	)
}
