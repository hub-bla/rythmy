import { Login } from "../components"
import { useAuthContext } from "../context"
import { Text } from "react-native"
export const Main: React.FC = () => {
	const { isAuthorized } = useAuthContext()
	if (!isAuthorized) {
		return <Login />
	}
	return (
		<>
			<Text>Sucessfuly</Text>
		</>
	)
}
