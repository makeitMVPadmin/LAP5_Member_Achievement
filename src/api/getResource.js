import {useQuery} from '@tanstack/react-query';
import {doc, getDoc} from "@firebase/firestore";
import {database as db} from "../config/firebase.js";


export const useGetResourceQuery = (resourceId, userId, tags) => useQuery({
	queryKey: ['resources', resourceId],
	queryFn: () => getResource(resourceId, userId, tags),
});

export const getResource =  async (resourceId, userId, tags) => {
	const resourceSnap = await getDoc(doc(db, "rf_Resources", resourceId));
	if (!resourceSnap.exists()) {
		return;
	}
	const resourceData = resourceSnap.data();

	let isBookmarked = false;
	const userSnap = await getDoc(doc(db, "rf_Users", userId));
	if (!userSnap.exists()) {
		return;
	}

	const userData = userSnap.data()
	if (userData.bm_resources.includes(resourceId)) {
		isBookmarked = true;
	}
	resourceData.isBookmarked = isBookmarked;

	let isRead = false;
	if (userData.read_resources.includes(resourceId)) {
		isRead = true;
	}
	resourceData.isRead = isRead;

	let isUpvoted = false;
	if (resourceData.upvotes?.includes(userId)) {
		isUpvoted = true;
	}
	resourceData.isUpvoted = isUpvoted;

	const resourceTags = [];
	for (const tag of tags) {
		for (const resourceTag of resourceData.tags) {
			if (tag.id === resourceTag) {
				resourceTags.push(tag)
			}
		}
	}

	// TODO: Fetch me my comments 🍵

	return { ...resourceData, tags: resourceTags };
}
