import { createContext, useContext, useState } from "react"

export const PlayerContext = createContext(null)

export const usePlayerContext = () => {
	const context = useContext(PlayerContext)
	if (!context) {
		throw new Error("PlayerContext must be used within PlayerContext.Provider")
	}
	return context
}

export const usePlayerContextValues = () => {
	const [devices, setDevices] = useState([])
	const [currentDevice, setCurrDevice] = useState(null)
	const getDevices = async (token:string) => {
		await (
			await fetch(`https://api.spotify.com/v1/me/player/devices`, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
		)
			.json()
			.then((data) => {
				setDevices(
					data.devices.map((device) => {
						return {
							id: device.id,
							name: device.name,
						}
					})
				)
			})
	}

	const playSong = async (song, token) => {
		if (currentDevice) {
			//add to queue
			await fetch(
				`https://api.spotify.com/v1/me/player/queue?uri=${song.uri}&device_id=${currentDevice.id}`,
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			).catch((err) => console.log("ERROR", err))

			//skip to added track
			await fetch(`https://api.spotify.com/v1/me/player/next`, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + token,
				},
				body: new URLSearchParams({
					device_id: currentDevice.id,
				}).toString(),
			}).catch((err) => console.log("ERROR", err))
		}
	}

	const pausePlayer = async (token) => {
		if (currentDevice){
			await fetch(`https://api.spotify.com/v1/me/player/pause`, {
				method: "PUT",
				headers: {
					Authorization: "Bearer " + token,
					body: new URLSearchParams({
						device_id: currentDevice.id,
					}).toString(),
				},
			})
		}
	}


	const handleEndOfSong = async (token) => {
		const {progress_ms} = await (await fetch(`https://api.spotify.com/v1/me/player`, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})).json()

		return progress_ms
		
	}
	return {
		getDevices,
		devices,
		setCurrDevice,
		currentDevice,
		playSong,
		pausePlayer,
		handleEndOfSong
	}
}
