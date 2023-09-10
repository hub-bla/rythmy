import { StatusBar } from "expo-status-bar"
import {  StyleSheet,  View } from "react-native"
import { AuthContext, useAuthContextValues } from "./context"
import { Main } from "./pages"

export default function App() {
  
	return (
		<View style={styles.container}>
      <AuthContext.Provider value={useAuthContextValues()}>
        <Main />
      </AuthContext.Provider>
      
			
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
