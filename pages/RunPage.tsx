import { useState, useEffect } from "react"
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	Animated,
} from "react-native"
import { usePlaylistContext } from "../context/PlaylistContext"
import { useAuthContext } from "../context"
import { Device, usePlayerContext } from "../context/PlayerContext"
import { Pedometer } from "expo-sensors"
import { Cadencometer } from "../components/Cadencometer"
import { Button } from "../components/styledComponents/Button"
import { Title } from "../components/styledComponents/Tittle"
export const RunPage: React.FC = () => {
	const { findSuitableSong, isPicked } = usePlaylistContext()

	const { getDevices, devices, playSong, pausePlayer, handleEndOfSong } =
		usePlayerContext()

	const { tokenData } = useAuthContext()
	const [currentDevice, setCurrDevice] = useState<Device>(null)
	const [currentCadence, setCurrentCadence] = useState(0)
	const [currentSong, setCurrentSong] = useState(null)
	const [prevCadence, setPrevCadence] = useState(0)

	useEffect(() => {
		if (isPicked && currentDevice) {
			const interval = setInterval(() => {
				const measureTime = 15
				const start = new Date()
				const end = new Date()
				start.setSeconds(end.getSeconds() - measureTime)
				Pedometer.getStepCountAsync(start, end).then((result) => {
					const cadence = result.steps * (60/measureTime)
					const key =
						Math.floor(cadence / 10) * 10 < 90
							? 90
							: Math.floor(cadence / 10) * 10

					console.log("CADENCE", cadence)
					console.log("CURRENT SONG", currentSong)
					console.log("KEY", currentSong ? currentSong.key : null)
					if (cadence == 0) {
						pausePlayer(tokenData.access_token, currentDevice).then()
						setCurrentSong(null)
					} else if (currentSong && currentSong.key == key) {
						const { duration_ms } = currentSong
						handleEndOfSong(tokenData.access_token).then((progress_ms) => {
							const last_ms = duration_ms - progress_ms
							console.log("Last_ms", last_ms)
							if (last_ms <= 5000) {
								console.log("END")
								setTimeout(() => {
									const song = findSuitableSong(key, currentSong)
									console.log("PICKED SONG", song)
									if (song) {
										playSong(song, tokenData.access_token, currentDevice).then()
									}
									setCurrentSong(song)
								}, last_ms)
							}
						})
					} else {
						const song = findSuitableSong(key)
						if (song && currentSong && currentSong.key != song.key) {
							playSong(song, tokenData.access_token, currentDevice).then()
							setCurrentSong(song)
						} else if (song && !currentSong) {
							playSong(song, tokenData.access_token, currentDevice).then()
							setCurrentSong(song)
						}
					}

					setPrevCadence(currentCadence)
					setCurrentCadence(cadence)
				})
			}, 5000)
			return () => clearInterval(interval)
		}
	}, [isPicked, currentDevice, currentCadence, currentSong])

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
					<Title>Pick device</Title>
					{devicesArr}
					<Button
						title='Refresh'
						onPress={() => {
							getDevices(tokenData.access_token)
						}}
					/>
				</>
			) : (
				<>
					<View style={styles.deviceContainer}>
						<Text style={styles.deviceText}>Current device:</Text>
						<Text style={styles.deviceText}>{currentDevice.name}</Text>
						<Button
							title='Change device'
							onPress={() => {
								setCurrDevice(null)
							}}
						/>
					</View>
					<Cadencometer cadence={currentCadence} prevCadence={prevCadence} />
				</>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	device: {
		// height: 50,
		margin:10,
	},
	
	pageContainer: {
		alignItems: "center",
		justifyContent: "space-evenly",
		height: "100%",
		width: "100%",
	},
	deviceContainer: {
		alignItems: "center",
		margin: 20,
	},
	deviceText: {
		fontWeight: "bold",
		fontSize: 22,
		margin: 10,
		textAlign: "center",
	},
})
