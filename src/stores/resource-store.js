import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { collection, getDocs } from "firebase/firestore";

import { database } from "../config/firebase";

const useResourceStore = create(
  immer((set, get) => ({
    currentResource: {},
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
    },
    getCurrentResource: (id) => get().resources.find((el) => id === el.id),
    setCurrentResource: (resource) =>
      set((state) => (state.currentResource = resource)),
    getComments: () => set({ bears: 0 }),
    getBookmarked: (newBears) => set({ bears: newBears }),
    getLikes: (newBears) => set({ bears: newBears }),
  }))
);

export default useResourceStore;
