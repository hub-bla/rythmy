import { useState, useEffect } from "react"
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native"
import { usePlaylistContext } from "../context/PlaylistContext"
import { useAuthContext } from "../context"
import { usePlayerContext } from "../context/PlayerContext"
import { Pedometer } from "expo-sensors"

export const RunPage: React.FC = () => {
	const { findSuitableSong, isPicked, deleteSong, matchingTempoObj } = usePlaylistContext()
	const {
		getDevices,
		devices,
		setCurrDevice,
		currentDevice,
		playSong,
		pausePlayer,
		handleEndOfSong,
	} = usePlayerContext()
	const { tokenData } = useAuthContext()

	const [currentStepCount, setCurrentStepCount] = useState(0)
	const [currentSong, setCurrentSong] = useState(null)
	const [isPaused, setIsPaused] = useState(false)
	const [currentKey, setCurrentKey] = useState(null)
	useEffect(() => {
		if (isPicked && currentDevice) {
			const interval = setInterval(() => {
				const start = new Date()
				const end = new Date()
				start.setSeconds(end.getSeconds() - 5)
				Pedometer.getStepCountAsync(start, end).then((result) => {
					const cadence = result.steps * 12
					const key =
						Math.floor(cadence / 10) * 10 < 90
							? 90
							: Math.floor(cadence / 10) * 10

					console.log("CADENCE", cadence)
					console.log("CURRENT SONG", currentSong)
					console.log("KEY", currentSong ? currentSong.key : null)
					console.log("PAUSED", isPaused)
					if (cadence == 0) {
						// console.log("CADENCE", cadence)
						pausePlayer(tokenData.access_token).then()
						// setIsPaused(true)
						setCurrentSong(null)
					} else if (currentSong && currentSong.key == key) {
						const { duration_ms } = currentSong
						handleEndOfSong(tokenData.access_token).then((progress_ms) => {
							const last_ms = duration_ms - progress_ms
							console.log("Last_ms", last_ms)
							if (last_ms <= 5000) {
								console.log("END")
								setTimeout(() => {
									deleteSong()
									const song = findSuitableSong(key, currentSong)
									console.log("PICKED SONG", song)
									if (song){
										playSong(song, tokenData.access_token).then()
									}
									setCurrentSong(song)

									
								}, last_ms)
							}
						})
					} else {
						//check position of song
						const song = findSuitableSong(key)
						if (song && currentSong && currentSong.key != song.key) {
							playSong(song, tokenData.access_token).then()
							setCurrentSong(song)
							// setIsPaused(false)
						} else if (song && !currentSong) {
							playSong(song, tokenData.access_token).then()
							setCurrentSong(song)
							// setIsPaused(false)
						}
					}
					setCurrentStepCount(cadence)
				})
			}, 5000)
			return () => clearInterval(interval)
		}
	}, [isPicked, currentDevice, currentStepCount, currentSong, matchingTempoObj])

	useEffect(() => {
		getDevices(tokenData.access_token)
	}, [])
	const devicesArr = devices.map((device) => {
		return (
			<TouchableOpacity
				key={device.id}
				style={styles.device}
				onPress={() =>
					setCurrDevice({
						id: device.id,
						name: device.name,
					})
				}>
				<View>
					<Text>{device.name}</Text>
				</View>
			</TouchableOpacity>
		)
	})

	return (
		<>
			{!currentDevice ? (
				<>
					<Text>Pick device</Text>
					{devicesArr}
				</>
			) : (
				<>
					<Text>Current device: {currentDevice.name}</Text>
					<View>
						<Text>Walk! And watch this go up: {currentStepCount}</Text>
					</View>
				</>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	device: {
		height: 50,
	},
})
