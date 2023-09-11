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
	const [currentSong, setCurrentSong] = useState(null)
	const [devices, setDevices] = useState([])
	const [currentDevice, setCurrDevice] = useState(null)
	const getDevices = async (token: string) => {
		await (
			await fetch(`https://api.spotify.com/v1/me/player/devices`, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
		)
			.json()
			.then((data) => {
				console.log("DATA", typeof data)
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
        console.log(song.uri)
        console.log(currentDevice)
		if (currentSong != song && currentDevice) {
            //add to queue
			
			await fetch(
				`https://api.spotify.com/v1/me/player/queue?uri=${song.uri}&device_id=${currentDevice.id}`,
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + token,
					},
				}
			)

			//skip to added track
			await fetch(`https://api.spotify.com/v1/me/player/next`, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + token,
				},
				body: new URLSearchParams({
					device_id: currentDevice.id,
				}).toString(),
			})
            setCurrentSong(song)
		}
	}

	return { getDevices, devices, setCurrDevice, currentDevice, playSong }
}
