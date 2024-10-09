import {create} from "zustand";
import {collection, doc, getDocs, updateDoc,} from "firebase/firestore";

import {database as db} from "../config/firebase";
import {getDoc} from "@firebase/firestore";

const useResourceStore = create((set, get) => ({
	resources: [],
	resourceComments: [],
	currentResource: null,
	loadResources: async () => {
		const resourceSnap = await getDocs(collection(db, "rf_Resources"));

		if (resourceSnap.empty) {
			return
		}
		
		const resources = [];

		for (const doc of resourceSnap.docs) {
			const resourceData = doc.data();
			
			const tags = []; // we have to handle cases where new resources may not have any engagement
			if (Array.isArray(resourceData.tags) && resourceData.tags.length > 0) {
				for (const tagRef of resourceData.tags) {
					const tagSnap = await getDoc(tagRef);
					tags.push(tagSnap.data());
				}
			}

			const comments = [];
			if (Array.isArray(resourceData.comments) && resourceData.comments.length > 0) {
				for (const commentsRef of resourceData.comments) {
					const commentSnap = await getDoc(commentsRef);
					comments.push(commentSnap.data());
				}
			}

			resources.push({ id: doc.id, data: { ...resourceData, tags, comments }})
		}

		set((_state) => ({
			resources,
		}));
	},
	updateResource: (id, patch) => {
		/**
		 * {upvotes: 10, dowvotes: 5}
		 * find the element with the correct ID from resources
		 * update the object with the values from the patch,
		 * update Firebase with the data, and then update the store with the data
		 */
		const resourceIdx = get().resources.findIndex((el) => id === el.id);
		const currentResource = {
			...get().resources[resourceIdx],
			...patch,
		};
		const resourcesRef = doc(db, "Resources", currentResource.id);

		let updatedResource = structuredClone(currentResource);
		delete updatedResource.id;

		updateDoc(resourcesRef, updatedResource);
		set((state) => {
			state.resources.splice(resourceIdx, 1, currentResource);
		});
	},
	getBookmarked: (newBears) => set({bears: newBears}),
	getLikes: (newBears) => set({bears: newBears}),
}));

export default useResourceStore;
