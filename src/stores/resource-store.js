import { create } from "zustand";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import { database as db } from "../config/firebase";

const useResourceStore = create((set, get) => ({
  resources: [],
  resourceComments: [],
  currentResource: null,
  loadResources: async () => {
    const resourceSnap = await getDocs(collection(db, "rf_Resources"));
    if (resourceSnap) {
      let resources = [];

      resourceSnap.forEach((res) => {
        // Right now, reference fields are not being loaded,
        // They need getDoc or getDocs run on them.
        resources.push({
          id: res.id,
          data: res.data(),
        });
      });

      set((_state) => ({
        resources,
      }));
    }
  },
  getResourceComments: async (id) => {
    const commentQuery = query(
      collection(db, "rf_ResourceComment"),
      where("resource", "==", id)
    );
    const commentSnap = await getDocs(commentQuery);

    if (commentSnap) {
      set((_state) => ({
        resourceComments: commentSnap.map((comment) => ({
          id: comment.id,
          data: comment.data(),
        })),
      }));
    }
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
  getBookmarked: (newBears) => set({ bears: newBears }),
  getLikes: (newBears) => set({ bears: newBears }),
}));

export default useResourceStore;
