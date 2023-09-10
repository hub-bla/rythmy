import randomstring from "randomstring"

export const getAuthUrl: (currUrl: string) => string = (currUrl) => {
	const client_id: string = "45803018c87d4b2b9f95ec38e79f5a9f"
	if (currUrl && currUrl[-1] != "/") {
		currUrl += "/"
	}
	console.log("re", currUrl)
	const redirect_uri: string = currUrl
	const scope: string =
		"playlist-read-private user-read-private user-read-email user-read-playback-state user-modify-playback-state app-remote-control"
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
