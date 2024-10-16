import {collection, getDocs} from "firebase/firestore";
import {database as db} from "../config/firebase.js";
import {useQuery} from "@tanstack/react-query";

export const useGetResources = () => useQuery({
	queryKey: ['resources'],
	queryFn: getResources
});

const getResources = async () => {
	const resourceSnap = await getDocs(collection(db, "rf_Resources"));

	if (resourceSnap.empty) {
		return
	}

	const resources = [];
	for (const doc of resourceSnap.docs) {
		const resourceData = doc.data();
		resources.push({ id: doc.id, data: resourceData })
	}
	return resources;
}
