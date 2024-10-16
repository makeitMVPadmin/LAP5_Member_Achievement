import {useMutation, useQueryClient} from "@tanstack/react-query";
import {doc, getDoc} from "@firebase/firestore";
import {database as db} from "../config/firebase.js";
import {updateDoc} from "firebase/firestore";

export const useToggleBookmarkMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables) => toggleBookmark(variables.userId, variables.resourceId),
		onMutate: async ({ resourceId, userId }) => {
			await queryClient.cancelQueries({ queryKey: ['resources', resourceId] })

			const bookmarks = queryClient.getQueryData(['bookmarks', userId]);
			const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== resourceId);
			queryClient.setQueryData(['bookmarks', userId], updatedBookmarks);
			
			const resource = queryClient.getQueryData(['resources', resourceId]);
			queryClient.setQueryData(['resources', resourceId], { ...resource, isBookmarked: !resource.isBookmarked });
			
			return { resource }
		},
		onError: (err) => {
			console.log("error happened", err);
		},
	})
}

const toggleBookmark = async (userId, resourceId) => {
	const userRef = doc(db, "rf_Users", userId);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		return;
	}

	const userData = userSnap.data()
	const bookmarks = userData.bm_resources;

	if (!bookmarks.includes(resourceId)) {
		bookmarks.push(resourceId);
	} else {
		const index = bookmarks.indexOf(resourceId);
		bookmarks.splice(index, 1);
	}

	await updateDoc(userRef, { bm_resources: bookmarks })
}
