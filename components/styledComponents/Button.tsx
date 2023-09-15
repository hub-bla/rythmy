import { Pressable, StyleSheet, Text } from "react-native"

type ButtonProps = {
	title: string
	onPress: () => void
}

export const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
	return (
		<Pressable onPress={onPress} style={styles.button}>
			<Text style={styles.title}>{title}</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#D1392F",
		width: 150,
		height: 50,
		alignContent: "center",
        justifyContent:'center',
        borderRadius: 10,
        margin:10,
	},
	title: {
		color: "#FFF8F0",
		textAlign: "center",
        fontWeight:'bold'
	},
})
