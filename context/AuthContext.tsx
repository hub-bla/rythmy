import { createContext, useContext, useState } from "react"
import { Buffer } from "buffer"
import axios from "axios"
export const AuthContext = createContext(null)

type TokenData = {
	refresh_token: string
	access_token: string
	expires_in: string
}

export const useAuthContext = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error(
			"useAuthContext must be used within useAuthContext.Provider"
		)
	}
	return context
}

export const useAuthContextValues = () => {
	const [initUrl, setInitUrl] = useState("")
	const [isAuthorized, setIsAuthorized] = useState(false)
	const [tokenRequest, setTokenRequest] = useState({
		client_id: "45803018c87d4b2b9f95ec38e79f5a9f",
		grant_type: "authorization_code",
		secret_client: "3b5bf406c52e48e982ad9466ee22f139",
	})
	const [tokenData, setTokenData] = useState<TokenData | null>(null)
	const changeTokenRequest = (code, uri) => {
		setTokenRequest((prev_token) => {
			return {
				code: code,
				redirect_uri: uri,
				...prev_token,
			}
		})
	}
	//dosent work
	const getToken: (arg1: string, arg2: string) => void = async (
		code,
		redirected_url
	) => {
		console.log(`CODE: ${code}`)
		console.log(`REDIRECTED: ${redirected_url}`)
		

		const authOptions = {
			method: "POST",
			headers: {
				Authorization:
					"Basic " +
					Buffer.from(
						tokenRequest.client_id + ":" + tokenRequest.secret_client
					).toString("base64"),
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code: code,
				redirect_uri: redirected_url,
			}).toString(),
		}

		const response = await fetch(
			"https://accounts.spotify.com/api/token",
			authOptions
		)

		response.json().then((data) => {
			console.log("data", data)
			setTokenData({
				refresh_token: data.refresh_token,
				access_token: data.access_token,
				expires_in: data.expires_in,
			})
			setIsAuthorized(true)
		})
	}

	const refreshToken: () => void = async () => {
		const params = new URLSearchParams({
			refresh_token: tokenData.refresh_token,
			grant_type: "refresh_token",
		})

		const buff = Buffer.from(
			tokenRequest.client_id + ":" + tokenRequest.secret_client
		).toString("base64")

		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				Authorization: "Basic " + buff,
			},
			body: params,
		})

		response.json().then((data) => {
			setTokenData((prevTokenData) => {
				console.log(data.access_token)
				return {
					...prevTokenData,
					access_token: data.access_token,
					expires_in: data.expires_in,
				}
			})
		})
	}
	console.log(tokenData)
	return {
		isAuthorized,
		getToken,
		tokenRequest,
		tokenData,
		setInitUrl,
		refreshToken,
	}
}
