import {useMutation, useQueryClient} from "@tanstack/react-query";
import {doc, getDoc} from "@firebase/firestore";
import {database as db} from "../config/firebase.js";
import {updateDoc} from "firebase/firestore";

export const useToggleReadMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (variables) => toggleRead(variables.userId, variables.resourceId),
		onMutate: async ({ resourceId }) => {
			await queryClient.cancelQueries({ queryKey: ['resources', resourceId] })

			const resource = queryClient.getQueryData(['resources', resourceId]);
			queryClient.setQueryData(['resources', resourceId], { ...resource, isRead: !resource.isRead });

			return { resource }
		},
		onError: (err) => {
			console.log("error happened", err);
		},
	})
}

const toggleRead = async (userId, resourceId) => {
	const userRef = doc(db, "rf_Users", userId);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		return;
	}

	const userData = userSnap.data()
	const readResources = userData.read_resources;

	if (!readResources.includes(resourceId)) {
		readResources.push(resourceId);
	} else {
		const index = readResources.indexOf(resourceId);
		readResources.splice(index, 1);
	}

	await updateDoc(userRef, { read_resources: readResources })
}
