import { PropsWithChildren } from "react"
import { StyleSheet, Text } from "react-native"



export const Title:React.FC<PropsWithChildren> = ({ children }) => {
	return <Text style={styles.title} >{children}</Text>
}

const styles = StyleSheet.create({
	title: {
		fontSize: 50,
		fontWeight: "bold",
	},
})
