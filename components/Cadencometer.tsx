import { View } from "react-native"
import { Image, StyleSheet, Text } from "react-native"
import { useState, useEffect } from "react"

type CadencometerProps = {
	cadence: number
}
export const Cadencometer: React.FC<CadencometerProps> = ({ cadence }) => {
	return (
		<View>
			<View style={styles.container}>
				<Image
					source={require("../assets/speedometer/speedometer.png")}
					style={styles.cadencometer}
				/>
				<Image
					source={require("../assets/speedometer/hand.png")}
					style={{
						width: 100,
						height: 100,
						objectFit: "contain",

						position: "absolute",
						bottom: "40%",
						left: "48%",
						transform: [
							{
								translateX: -1 * (100 / 2 - 10),
							},
							{
								translateY: 100 / 2 - 25,
							},
							{
								rotate: `${210 + cadence / 1.11}deg`,
							},
							{
								translateX: 100 / 2 - 10,
							},
							{
								translateY: -1 * (100 / 2 - 25),
							},
						],
					}}
				/>
				<Text>{Math.floor(cadence)}</Text>
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
		maxWidth: 300,

		height: 300,
	},


})
