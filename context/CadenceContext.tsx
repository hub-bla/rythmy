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
	
	const MEASURE_TIME = 10000 //in milisecond
	const NUM_OF_MEASUREMENTS = 60 / (MEASURE_TIME / 1000)

	const handleContextCadence = (newCadence: number) => {
		setContextCadence(newCadence)
	}



	const mean = (cadenceArr) => {
		const sum = cadenceArr.reduce((partialSum, a) => partialSum + a, 0);
		const meanResult = sum /cadenceArr.length
		return meanResult
	}

	const std = (cadenceArr) => {
		const arrMean = mean(cadenceArr)
		const sum = cadenceArr.reduce((partialSum, a) => partialSum + Math.pow(a - arrMean, 2), 0);
		const stdResult = Math.sqrt(sum/(cadenceArr.length-1))
		return stdResult
	}

	return {
		handleContextCadence,
		contextCadence,
		NUM_OF_MEASUREMENTS,
		MEASURE_TIME,
		mean,
		std
	}
}
