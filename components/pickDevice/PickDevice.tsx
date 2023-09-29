import { DeviceDataType, useAuthContext, usePlayerContext } from "../../context"
import { Button, Title } from "../styledComponents"
import { Device } from "./Device"

type PickDeviceProps = {
	devicesArr: DeviceDataType[]
    handleCurrentDeviceChange: (id:string, name:string) => void
}

export const PickDevice: React.FC<PickDeviceProps> = ({ devicesArr, handleCurrentDeviceChange }) => {
	const { getDevices } = usePlayerContext()
	const { tokenData } = useAuthContext()
	const devices = devicesArr.map((device) => {
		return (
			<Device
				id={device.id}
				name={device.name}
				handleCurrentDeviceChange={handleCurrentDeviceChange}
			/>
		)
	})
	return (
		<>
			<Title>Pick device</Title>
			{devices}
			<Button
				title='Refresh'
				onPress={() => {
					getDevices(tokenData.access_token)
				}}
			/>
		</>
	)
}
