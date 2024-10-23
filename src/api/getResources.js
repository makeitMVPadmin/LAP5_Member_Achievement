import {collection, getDocs} from "firebase/firestore";
import {database as db} from "../config/firebase.js";
import {useQuery} from "@tanstack/react-query";
import {getBookmarks} from "./getBookmarks.js";

export const useGetResources = (userId) => useQuery({
	queryKey: ['resources'],
	queryFn: () => getResources(userId)
});

const getResources = async (userId) => {
	const resourceSnap = await getDocs(collection(db, "rf_Resources"));

	if (resourceSnap.empty) {
		return;
	}

	// Prefetch me bookmarks but don't load until we have userId
	if (userId) {
		void getBookmarks(userId);
	}

	const resources = [];
	for (const doc of resourceSnap.docs) {
		const resourceData = doc.data();
		resources.push({ id: doc.id, data: resourceData })
	}
	return resources;
}
