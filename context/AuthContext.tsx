import { createContext, useContext, useState } from "react"
import { Buffer } from "buffer"

export type TokenData = {
	refresh_token: string
	access_token: string
	expires_in: number
}

type AuthContextType = {
	isAuthorized: boolean
	getToken: (code: string, redirected_uri: string) => Promise<void>
	tokenData: TokenData
	refreshToken: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>(null)

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
	const [isAuthorized, setIsAuthorized] = useState(false)
	const [tokenData, setTokenData] = useState<TokenData | null>(null)
	const tokenRequest = {
		client_id: "45803018c87d4b2b9f95ec38e79f5a9f",
		grant_type: "authorization_code",
		secret_client: "3b5bf406c52e48e982ad9466ee22f139",
	}

	const getToken = async (code: string, redirected_uri: string) => {
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
				redirect_uri: redirected_uri,
			}).toString(),
		}

		const response = await fetch(
			"https://accounts.spotify.com/api/token",
			authOptions
		)

		response.json().then((data:TokenData) => {
			console.log("data", data)
			setTokenData({
				refresh_token: data.refresh_token,
				access_token: data.access_token,
				expires_in: data.expires_in,
			})
			setIsAuthorized(true)
		})
	}

	const refreshToken = async () => {
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
				refresh_token: tokenData.refresh_token,
				grant_type: "refresh_token",
			}).toString(),
		}

		const response = await fetch(
			"https://accounts.spotify.com/api/token",
			authOptions
		)
		console.log("Refresh token response", response)
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
	return {
		isAuthorized,
		getToken,
		tokenData,
		refreshToken,
	}
}
