import { createContext, useContext, useState } from "react"
import { Buffer } from "buffer"
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

	const getToken = async (code, redirected_url) => {
		const params = new URLSearchParams({
			code: code,
			redirect_uri: redirected_url,
			grant_type: tokenRequest.grant_type,
		})

		const redirectUrl = `https://accounts.spotify.com/api/token`

		const buff = Buffer.from(
			tokenRequest.client_id + ":" + tokenRequest.secret_client
		).toString("base64")

		const response = await fetch(redirectUrl, {
			method: "POST",
			headers: {
				Authorization: "Basic " + buff,
			},
			body: params,
		})
		response.json().then((data) => {
			setTokenData({
				refresh_token: data.refresh_token,
				access_token: data.access_token,
				expires_in: data.expires_in,
			})
			setIsAuthorized(true)
		})
	}

	return { isAuthorized, getToken, tokenRequest, tokenData, setInitUrl }
}
