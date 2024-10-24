import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { database as db } from "../config/firebase.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleUpvoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      toggleUpvote(variables.userId, variables.resourceId),
    onMutate: async ({ resourceId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ["resources", resourceId] });

      // this only targets the detail card
      const resourceData = queryClient.getQueryData(["resources", resourceId]);
      const resource = updateResource(userId, resourceData);

      queryClient.setQueryData(["resources", resourceId], {
        ...resource,
        isUpvoted: !resource.isUpvoted,
      });
      // josh's wip below: updating the list of resources on the left after upvoting on details card
      // we are targeting the list now, not the detail card
      const resources = queryClient.getQueryData(["resources"]);
      const idx = resources.findIndex((resource) => resource.id === resourceId);
      resources[idx].data = updateResource(userId, resources[idx].data);

      console.log(resources);

      queryClient.setQueryData(["resources"], resources);

      return { resource };
    },
    onError: (err) => {
      console.log("error happened", err);
    },
  });
};

// TODO: Copy but with commentId as well
const toggleUpvote = async (userId, resourceId) => {
  console.log({ resourceId });

  const resourceRef = doc(db, "rf_Resources", resourceId);
  const resourceSnap = await getDoc(resourceRef);
  if (!resourceSnap.exists()) {
    throw new Error("Resource not found");
  }

  const resourceData = resourceSnap.data();
  const resource = updateResource(userId, resourceData);

  await updateDoc(resourceRef, {
    upvotes: resource.upvotes,
    upvotes_count: resource.upvotes_count,
  });
};

// TODO: Copy but with commentId as well
const updateResource = (userId, resource) => {
  if (!resource.upvotes) {
    resource.upvotes = [];
  }

  // We are adding/initializing upvotes_count field value here
  if (!resource.upvotes_count) {
    resource.upvotes_count = 0;
  }

  // Making it a Set over an Array so we don't have duplicates as well as faster calcs.
  // DO NOT change back to an array even though we are converting it back... it will be slower...
  const upvotesSet = new Set(resource.upvotes);
  if (!upvotesSet.has(userId)) {
    upvotesSet.add(userId);
    resource.upvotes_count += 1;
  } else {
    upvotesSet.delete(userId);
    resource.upvotes_count -= 1;
  }

  resource.upvotes = Array.from(upvotesSet);
  return resource;
};
