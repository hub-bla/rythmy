import { useEffect } from "react"
import * as Linking from "expo-linking"
import { getAuthUrl } from "../utils"
import {
	Button,
	StyleSheet,
	Image,
	View,
	Text,
	TouchableOpacity,
} from "react-native"
import { useAuthContext } from "../context"
import { Title } from "./styledComponents/Tittle"

export const Login: React.FC = () => {
	const { getToken, isAuthorized } = useAuthContext()
	const url = Linking.useURL()

	const authUrl = getAuthUrl(url)

	useEffect(() => {
		const decodeUrl: () => void = () => {
			const temp_url: URL = new URL(url)
			const { searchParams } = temp_url
			const code: string = decodeURIComponent(searchParams.get("code"))
			if (code != "null" && !isAuthorized) {
				console.log("URLLL", url.split("?")[0])
				getToken(code, url.split("?")[0])
			}
		}
		if (url != null) {
			decodeUrl()
		}
	}, [url])
	return (
		<View style={style.container}>
			<Title>Keep the beat</Title>
			<View style={style.containerRunningBoombox}>
				<TouchableOpacity
					onPress={() => {
						Linking.openURL(authUrl)
					}}
					style={style.imageContainer}>
					<Text style={style.runningText}>Start Running</Text>
					<Image
						source={require("../assets/BoomboxButton/boombox.png")}
						style={style.boombox}
					/>
				</TouchableOpacity>
				<Image source={require("../assets/BoomboxButton/legs.png")} style={style.legs} />
			</View>
		</View>
	)
}

const style = StyleSheet.create({
	container: {
		width: "100%",
		height: "60%",
		display: "flex",
		justifyContent: "space-evenly",
		alignItems: "center",
		flexDirection: "column",
	},
	containerRunningBoombox: {
		display: "flex",
		alignItems: "center",
		flexDirection: "column",
	},

	imageContainer: {
		position: "relative",
	},
	legs: {
		maxHeight: 205,
		maxWidth: 210,
	},
	boombox: {
		width: 305,
		height: 150,
		zIndex: -1,
	},
	runningText: {
		width: 110,
		fontSize: 26,
		textAlign: "center",
		color: "#FFF8F0",
		position: "absolute",
		top: 60,
		left: 100,
	},
})
