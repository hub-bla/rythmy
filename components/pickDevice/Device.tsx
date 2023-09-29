import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

type DeviceProps = {
	id: string
	name: string
	handleCurrentDeviceChange: (id:string, name:string) => void
}

export const Device: React.FC<DeviceProps> = ({
	id,
	name,
	handleCurrentDeviceChange,
}) => {
	return (
		<TouchableOpacity
			key={id}
			style={styles.device}
			onPress={() =>
				handleCurrentDeviceChange(id, name)
			}>
			<View>
				<Text>{name}</Text>
			</View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	device: {
		margin: 10,
	},
})
