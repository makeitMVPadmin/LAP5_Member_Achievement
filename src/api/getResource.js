import {collection, getDocs} from "firebase/firestore";
import {database as db} from "../config/firebase.js";
import {useQuery} from "@tanstack/react-query";
import {getDoc} from "@firebase/firestore";

const getResources = async () => {
	const resourceSnap = await getDocs(collection(db, "rf_Resources"));

	if (resourceSnap.empty) {
		return
	}

	const resources = [];

	for (const doc of resourceSnap.docs) {
		const resourceData = doc.data();

		// TODO: Cleanup
		// submitter is a user who SUBMITTED a resource
		// let submitter = null;
		// if (resourceData.submitter) {
		// 	const submitterSnap = await getDoc(resourceData.submitter);
		// 	if (submitterSnap.exists()) {
		// 		submitter = submitterSnap.data();
		// 	}
		// }
		//
		// const tags = []; // we have to handle cases where new resources may not have any engagement
		// if (Array.isArray(resourceData.tags) && resourceData.tags.length > 0) {
		// 	for (const tagRef of resourceData.tags) {
		// 		const tagSnap = await getDoc(tagRef);
		// 		tags.push(tagSnap.data());
		// 	}
		// }
		//
		// const comments = [];
		// if (Array.isArray(resourceData.comments) && resourceData.comments.length > 0) {
		// 	for (const commentsRef of resourceData.comments) {
		// 		const commentSnap = await getDoc(commentsRef);
		// 		comments.push(commentSnap.data());
		// 	}
		// }

		resources.push({ id: doc.id, data: resourceData })
	}
	return resources;
}

// TODO: Extract
const getResource = async (resourceId) => {
	const resourceSnap = await getDoc(collection(db, "rf_Resources", resourceId));
	if (!resourceSnap.exists()) {
		return null;
	}
	return resourceSnap.data();
}

export const useGetResources = () => useQuery({queryKey: ['resources'], queryFn: getResources})
