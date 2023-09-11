import { useState, useEffect } from "react"
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native"
import { usePlaylistContext } from "../context/PlaylistContext"
import { useAuthContext } from "../context"
import { usePlayerContext } from "../context/PlayerContext"

export const RunPage: React.FC = () => {
	const { findSuitableSong } = usePlaylistContext()
	const { tokenData } = useAuthContext()
	const { getDevices, devices, setCurrDevice, currentDevice, playSong } =
		usePlayerContext()
	const [counter, setCounter] = useState(0)

	const add = () => {
		setCounter((prev) => {
			const song = findSuitableSong(prev + 5)
            console.log(song)
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
		getDevices(tokenData.access_token)
	}, [])

	const devicesArr = devices.map((device) => {
		return (
			<TouchableOpacity
				key={device.id}
				style={styles.device}
				onPress={() => setCurrDevice(
                    {
                    id: device.id, 
                    name:device.name
                }
                    )}>
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
