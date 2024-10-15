import {createContext, useContext, useEffect, useState} from "react";

export const PointsContext = createContext();



export function PointsProvider({children}) {
	const [points, setPoints] = useState(() => {
		const savedPoints = localStorage.getItem("points");
		if (savedPoints === null) {
			localStorage.setItem("points", 600);
			return 600;
		}
		const parsedPoints = parseInt(savedPoints, 10);
		// console.log("Saved Points:", savedPoints);
		return !isNaN(parsedPoints) ? parsedPoints : 600;
	});

	useEffect(() => {
		localStorage.setItem("points", points);
	}, [points]);

	const addPoints = (amount) => {
		setPoints((prevPoints) => {
			const newPoints = prevPoints + amount;
			localStorage.setItem("points", newPoints);
			return newPoints;
		});
	};

	const deductPoints = (amount) => {
		setPoints((prevPoints) => {
			const newPoints = Math.max(prevPoints - amount, 0);
			localStorage.setItem("points", `${newPoints}`);
			// console.log("Deducting Points:", newPoints);
			return newPoints;
		});
	};

	const handlePointsChange = (newPoints) => {
		localStorage.setItem("points", newPoints);
		setPoints(newPoints);
	};

	return (
		<PointsContext.Provider
			value={{
				points,
				setPoints,
				addPoints,
				deductPoints,
				handlePointsChange,
			}}
		>{children}</PointsContext.Provider>
	)
}

export const usePoints = () => {
	const context = useContext(PointsContext);
	if (!context) {
		throw new Error("Cannot find points provider...");
	}
	return context;
}