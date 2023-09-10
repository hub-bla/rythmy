import { FC, useEffect, useState } from "react"
import * as Linking from "expo-linking"
import { getAuthUrl } from "../utils"
import { Button } from "react-native"
import { useAuthContext } from "../context"

export const Login: React.FC = () => {
	const { getToken, setInitUrl, isAuthorized } = useAuthContext()
	let url = Linking.useURL()

	const authUrl = getAuthUrl(url)

	useEffect(() => {
		const decodeUrl: () => void = () => {
			const temp_url: URL = new URL(url)
			const { searchParams } = temp_url
			const code: string = decodeURIComponent(searchParams.get("code"))
			// console.log(code, "code")
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
		<>
			<Button
				onPress={() => {
					Linking.openURL(authUrl)
				}}
				title='Authorize with Spotify'
			/>
		</>
	)
}
