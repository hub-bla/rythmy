import React, { useState, useEffect, useRef } from "react"
import { Accelerometer } from "expo-sensors"
import { useCadenceContext } from "../context/CadenceContext"


const TRESHOLD = 2
export const AccelerometerData = () => {
	const [{ x, y, z }, setData] = useState({
		x: 0,
		y: 0,
		z: 0,
	})
    const {handleContextCadence} = useCadenceContext()
	const [subscription, setSubscription] = useState(null)
	const [counter, setCounter] = useState(0)

	const countRef = useRef(counter)
    if (counter!=0 && countRef.current==0) {
        counter ==1 ? setCounter(counter+1): setCounter(0)

    }
	countRef.current = counter

	const _slow = () => Accelerometer.setUpdateInterval(1000)
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
            handleContextCadence(countRef.current*6)
			console.log("CADENCE", countRef.current*6)
			setTimeout(() => {
				setCounter(0)
				countRef.current = 0
			}, 250)
		}, 10000)

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
	return (<></>
		
	)
}
