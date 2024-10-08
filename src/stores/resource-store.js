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
		if (!resourceSnap) {
			return
		}

		// I once was a nice piece of code...
		// Then I took a firebase/firestore arrow to the knee
		// let resources = [];
		// resourceSnap.forEach((res) => {
		// 	resources.push({
		// 		id: res.id,
		// 		data: res.data(),
		// 	});
		// });

		// I'm sorry 😢 I know it's ugly but blame firebase for now.
		const resources = await Promise.all(
				resourceSnap.docs.map(async (doc) => {
					const resourceData = doc.data();
					// this gets the field/attribute on rf_Resources document
					const tags = await Promise.all(
						resourceData.tags.map(async (tagRef) => {
							const tagsSnap = await getDoc(tagRef)
							return tagsSnap.data();
					}))
					// const tagsSnap = await getDocs(tagsRef);
					// const tags = tagsSnap.docs.map(async (doc) => {
					// 	return {...doc.data()}
					// })
					return {id: doc.id, data: { ...resourceData, tags } };
				}))

		set((_state) => ({
			resources,
		}));
	},
	// getResourceComments: async (id) => {
	// 	const commentQuery = query(
	// 		collection(db, "rf_ResourceComment"),
	// 		where("resource", "==", id)
	// 	);
	// 	const commentSnap = await getDocs(commentQuery);
	//
	// 	if (commentSnap) {
	// 		set((_state) => ({
	// 			resourceComments: commentSnap.map((comment) => ({
	// 				id: comment.id,
	// 				data: comment.data(),
	// 			})),
	// 		}));
	// 	}
	// },
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
