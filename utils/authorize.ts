import randomstring from "randomstring"

export const getAuthUrl: (currUrl: string) => string = (currUrl) => {
	const client_id: string = process.env.EXPO_PUBLIC_CLIENT_ID
	if (currUrl && currUrl[-1] != "/") {
		currUrl += "/"
	}
	const redirect_uri: string = currUrl
	const scope: string = process.env.EXPO_PUBLIC_SCOPE
	const state: string = randomstring.generate(16)

	const params = new URLSearchParams({
		response_type: "code",
		client_id,
		redirect_uri: redirect_uri,
		scope,
		state,
	})
	const redirectUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
	return redirectUrl
}
