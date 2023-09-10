import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import { AuthContext, useAuthContextValues } from "./context"
import { Main } from "./pages"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import 'react-native-url-polyfill/auto';
const queryClient = new QueryClient()

export default function App() {
	return (
		<View style={styles.container}>
			<QueryClientProvider client={queryClient}>
				<AuthContext.Provider value={useAuthContextValues()}>
					<Main />
				</AuthContext.Provider>
			</QueryClientProvider>
			<StatusBar style='auto' />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
})
