import { useState, useEffect } from "react"
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native"
import { usePlaylistContext } from "../context/PlaylistContext"
import { useAuthContext } from "../context"
import { usePlayerContext } from "../context/PlayerContext"
import { Pedometer } from "expo-sensors"
export const RunPage: React.FC = () => {
	const { findSuitableSong, isPicked, matchingTempoArr } = usePlaylistContext()
	const { tokenData } = useAuthContext()
	const { getDevices, devices, setCurrDevice, currentDevice, playSong } =
		usePlayerContext()
	const [counter, setCounter] = useState(0)
	const [isPedometerAvailable, setIsPedometerAvailable] = useState(false)
	const [pastStepCount, setPastStepCount] = useState(0)
	const [currentStepCount, setCurrentStepCount] = useState(0)
	const [currentSong, setCurrentSong] = useState(null)
	const add = () => {
		setCounter((prev) => {
			const song = findSuitableSong(prev + 5)

			playSong(song, tokenData.access_token)
			return prev + 5
		})
	}

	const subtract = () => {
		if (counter > 0) {
			setCounter((prev) => {
				const song = findSuitableSong(prev - 5)
				playSong(song, tokenData.access_token)
				return prev - 5
			})
		}
	}
	useEffect(() => {
		// if (!isPedometerAvailable) {
		// 	Pedometer.isAvailableAsync().then(() => {setIsPedometerAvailable(true)});
		// }
		if (isPicked && currentDevice) {
			const interval = setInterval(() => {
				const start = new Date()
				const end = new Date()
				start.setSeconds(end.getSeconds() - 10)
				Pedometer.getStepCountAsync(start, end).then((result) =>
					setCurrentStepCount((prevStepCount) => {
						if (
							prevStepCount - 10 > result.steps * 12 ||
							prevStepCount + 10 < result.steps * 12
						) {
							const song = findSuitableSong(result.steps * 12)
							console.log("TO CHANGE", song)
							console.log("CURRENT SONG", currentSong)
							if (currentSong != song) {
								playSong(song, tokenData.access_token).then()
								setCurrentSong(song)
							}
						}
						return result.steps * 12
					})
				)
			}, 5000)
			return () => clearInterval(interval)
		}
	}, [isPicked, currentDevice, currentSong])
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
			<Text>{counter}</Text>
			<Button title='+1' onPress={add} />
			<Button title='-1' onPress={subtract} />
		</>
	)
}

const styles = StyleSheet.create({
	device: {
		height: 50,
	},
})
