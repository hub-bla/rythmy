import { createContext, useContext, useState } from "react"
import { SongType } from "./PlaylistContext"

export type Device = {
	id: string
	name: string
}

export type PlayerContextType ={
	getDevices: (token:string) => Promise<void>,
	devices: Device[],
	playSong:  (song: SongType, token: string, currentDevice:Device) => Promise<void>,
	pausePlayer: (token:string, currentDevice:Device) => Promise<void>,
	handleEndOfSong: (token:string) => Promise<number>,
}


type PlaybackStateType = {
	progress_ms: number
}

export const PlayerContext = createContext<PlayerContextType>(null)

export const usePlayerContext = () => {
	const context = useContext(PlayerContext)
	if (!context) {
		throw new Error("PlayerContext must be used within PlayerContext.Provider")
	}
	return context
}





export const usePlayerContextValues = () => {
	const [devices, setDevices] = useState<Device[]>([])
	

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
				setDevices(
					data.devices.map((device: Device) => {
						return {
							id: device.id,
							name: device.name,
						}
					})
				)
			})
	}

	const playSong = async (song: SongType, token: string, currentDevice:Device) => {
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

	const pausePlayer = async (token:string, currentDevice:Device) => {
		if (currentDevice) {
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

	const handleEndOfSong = async (token:string) => {
		const data:PlaybackStateType = await (
			await fetch(`https://api.spotify.com/v1/me/player`, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
		).json()

		return data.progress_ms
	}
	return {
		getDevices,
		devices,
		playSong,
		pausePlayer,
		handleEndOfSong,
	}
}
