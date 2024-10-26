import {useQuery} from "@tanstack/react-query";
import {collection, getDocs} from "@firebase/firestore";
import {database as db} from "../config/firebase.js";

export const useGetTagsQuery = () => useQuery({
	queryKey: ["tags"],
	queryFn: getTags
})


const getTags = async () => {
	const tagSnap = await getDocs(collection(db, "rf_ResourceTag"))
	if (tagSnap.empty) {
		return [];
	}

	const tags = [];
	for (const doc of tagSnap.docs) {
		const tagData = doc.data();
		tags.push({ id: doc.id, title: tagData.title });
	}

	return tags;
}


