import { useEffect, useState } from "react"

export const useCountUp = (target?: number) => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (target) {
				if (count < target) {
					setCount((prev) => Math.min(prev + 1, target))
				} else {
					clearInterval(intervalId)
				}
			}
		}, 10)

		return () => clearInterval(intervalId)
	}, [count, target])

	return count
}
