import { View } from "react-native"
import { Image, StyleSheet, Text } from "react-native"
import { useState, useEffect } from "react"
import { Animated } from "react-native"

type CadencometerProps = {
	cadence: number
	prevCadence: number
}

const RATIO: number = 1.11
const BASE_POSITION: number = 210
const HAND_WIDTH: number = 100
const HAND_HEIGHT: number = 100
const ROTATE_POINT_X = HAND_WIDTH / 2 - 10
const ROTATE_POINT_Y = HAND_HEIGHT / 2 - 25

const Hand: React.FC<CadencometerProps> = ({ cadence, prevCadence }) => {
	const rotateValue = useState(
		new Animated.Value(BASE_POSITION + prevCadence / RATIO)
	)[0]

	Animated.timing(rotateValue, {
		toValue: BASE_POSITION + cadence / RATIO,
		duration: 500,
		useNativeDriver: true,
	}).start()

	const interpolatedRotationValue = rotateValue.interpolate({
		inputRange: [0, 360],
		outputRange: ["0deg", "360deg"],
	})
	return (
		<Animated.Image
			source={require("../assets/speedometer/hand.png")}
			style={{
				width: HAND_WIDTH,
				height: HAND_HEIGHT,
				objectFit: "contain",
				position: "absolute",
				bottom: "40%",
				left: "48%",
				transform: [
					{
						translateX: -1 * ROTATE_POINT_X,
					},
					{
						translateY: ROTATE_POINT_Y,
					},
					{
						rotate: interpolatedRotationValue,
					},
					{
						translateX: ROTATE_POINT_X,
					},
					{
						translateY: -1 * ROTATE_POINT_Y,
					},
				],
			}}
		/>
	)
}

export const Cadencometer: React.FC<CadencometerProps> = ({
	cadence,
	prevCadence,
}) => {
	return (
		<View>
			<View style={styles.container}>
				<Image
					source={require("../assets/speedometer/speedometer.png")}
					style={styles.cadencometer}
				/>
				<Hand cadence={cadence} prevCadence={prevCadence} />
				<Text style={styles.accurateCadence}>{Math.floor(cadence)}</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		maxWidth: 300,
		height: 300,
	},
	cadencometer: {
		objectFit: "cover",
		maxWidth: 300,

		height: 300,
	},

	accurateCadence: {
		width: 100,
		height: 50,
		textAlign: "center",
		position: "absolute",
		fontWeight: "bold",
		top: "70%",
		left: "35%",
		fontSize: 32,
		zIndex: 999,
	},
})
