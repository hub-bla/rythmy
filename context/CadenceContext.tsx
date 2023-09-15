import { createContext, useContext, useState } from "react"

export const CadenceContext = createContext(null)

export const useCadenceContext = () => {
	const context = useContext(CadenceContext)
	if (!context)
		throw new Error(
			"CadenceContext must be used withing CadenceContext.Provider"
		)
	return context
}

export const useCadenceContextValues = () => {
	const [contextCadence, setContextCadence] = useState(0)

	const handleContextCadence = (newCadence: number) => {
		setContextCadence(newCadence)
	}

	return { handleContextCadence, contextCadence }
}
