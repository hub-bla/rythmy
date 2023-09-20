import React, { useState, useEffect, useRef } from "react"
import { Accelerometer } from "expo-sensors"
import { useCadenceContext } from "../context/CadenceContext"

const TRESHOLD = 2
export const AccelerometerData:React.FC = () => {
	const [{ x, y, z }, setData] = useState({
		x: 0,
		y: 0,
		z: 0,
	})
	const {
		handleContextCadence,
		NUM_OF_MEASUREMENTS,
		MEASURE_TIME,
	} = useCadenceContext()
	const [subscription, setSubscription] = useState(null)
	const [counter, setCounter] = useState(0)

	const countRef = useRef(counter)
	if (counter != 0 && countRef.current == 0) {
		counter == 1 ? setCounter(counter + 1) : setCounter(0)
	}
	countRef.current = counter

	const _fast = () => Accelerometer.setUpdateInterval(25)
	const _subscribe = () => {
		setSubscription(Accelerometer.addListener(setData))
	}

	const _unsubscribe = () => {
		subscription && subscription.remove()
		setSubscription(null)
	}

	useEffect(() => {
		if (counter === 0) _fast()
		_subscribe()
		const logCounterInterval = setInterval(() => {
			handleContextCadence(countRef.current * NUM_OF_MEASUREMENTS)
			setTimeout(() => {
				setCounter(0)
				countRef.current = 0
			}, 250)
		}, MEASURE_TIME)

		return () => {
			clearInterval(logCounterInterval)
			_unsubscribe()
		}
	}, [])

	const magnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2))
	if (magnitude > TRESHOLD) {
		setTimeout(() => {
			setCounter(counter == null ? 0 : counter + 1)
		}, 250)
	}
	return <></>
}
