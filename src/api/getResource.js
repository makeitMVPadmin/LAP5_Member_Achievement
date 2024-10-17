import {doc, getDoc} from "@firebase/firestore";
import {database as db} from "../config/firebase.js";
import {useQuery} from "@tanstack/react-query";

export const useGetResource = (resourceId, userId) => useQuery({
	queryKey: ['resources', resourceId],
	queryFn: () => getResource(resourceId, userId),
});

const getResource = async (resourceId, userId) => {
	const resourceRef = doc(db, "rf_Resources", resourceId);
	const resourceSnap = await getDoc(resourceRef);
	if (!resourceSnap.exists()) {
		return;
	}

	const userRef = doc(db, "rf_Users", userId);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		return;
	}

	const resourceData = resourceSnap.data();
	const userData = userSnap.data();

	console.log("my bookmarks", userData.bm_resources, resourceId);

	let isBookmarked = false;
	if (userData.bm_resources.includes(resourceId)) {
		isBookmarked = true;
	}
	resourceData.isBookmarked = isBookmarked;

	let isRead = false;
	if (userData.read_resources.includes(resourceId)) {
		isRead = true;
	}
	resourceData.isRead = isRead;

	const tagRefs = resourceData.tags;
	if (!Array.isArray(tagRefs) || tagRefs.length <= 0) {
		return resourceData;
	}

	const tags = await getTags(tagRefs);

	return { ...resourceData, tags };
}


const getTags = async (tagRefs) => {
	return await Promise.all(tagRefs.map(async (tagRef) => {
		const tagSnap = await getDoc(tagRef);
		return tagSnap.data();
	}));
	
		// if (!tagSnap.exists()) {
		// 	console.log("No tag(s) found.");
		// 	return [];
		// }
}