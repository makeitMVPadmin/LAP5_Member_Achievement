import {useQuery} from "@tanstack/react-query";
import {doc, getDoc} from "@firebase/firestore";
import {database as db} from "../config/firebase.js";

export const useGetBookmarks = (userId) => useQuery({
	queryKey: ["bookmarks", userId],
	queryFn: () => getBookmarks(userId),
});

export const getBookmarks = async (userId) => {
	const userRef = doc(db, "rf_Users", userId);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		throw new Error("User not found")
	}
	

	const userData = userSnap.data();
	const resourceIds = userData.bm_resources;
	console.log("bm_resources", resourceIds);
	// fetch resource data based on user bookmarks ids
	const bookmarks = [];
	for (const resourceId of resourceIds) {
		const resourceRef = doc(db, "rf_Resources", resourceId);
		const resourceSnap = await getDoc(resourceRef);
		if (!resourceSnap.exists()) {
			throw new Error("Resource not found");
		}
		bookmarks.push({ id: resourceSnap.id, data: resourceSnap.data()});
	}
	return bookmarks;
}