import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import { database } from "../config/firebase";

const useResourceStore = create(
  immer((set, get) => ({
    currentResource: null,
    resources: [],
    getResources: async () => {
      const resourcesSnapshot = await getDocs(
        collection(database, "Resources")
      );
      const commentsSnapshot = await getDocs(collection(database, "Comments"));

      set((state) => {
        state.resources = resourcesSnapshot.docs.map((doc) => {
          const resourceData = { ...doc.data(), id: doc.id };
          const resourceComments = commentsSnapshot.docs
            .filter((commentDoc) => commentDoc.data().resourceId === doc.id)
            .map((commentDoc) => ({
              ...commentDoc.data(),
              id: commentDoc.id,
            }));
          return {
            comments: resourceComments,
            commentsCount: resourceComments.length,
            ...resourceData,
          };
        });
      });

      if (!get().currentResource) {
        set((state) => {
          state.currentResource = get().resources[0];
        });
      }
    },
    setCurrentResource: (id) => {
      set((state) => {
        state.currentResource = get().resources.find((el) => id === el.id);
      });
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
      const resourcesRef = doc(database, "Resources", currentResource.id);

      let updatedResource = structuredClone(currentResource);
      delete updatedResource.id;

      updateDoc(resourcesRef, updatedResource);
      set((state) => {
        state.resources.splice(resourceIdx, 1, currentResource);
      });
    },
    getComments: () => set({ bears: 0 }),
    getBookmarked: (newBears) => set({ bears: newBears }),
    getLikes: (newBears) => set({ bears: newBears }),
  }))
);

export default useResourceStore;
