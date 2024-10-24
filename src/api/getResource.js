import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { database as db } from "../config/firebase.js";
import { useQuery } from "@tanstack/react-query";

export const useGetResource = (resourceId, userId) =>
  useQuery({
    queryKey: ["resources", resourceId],
    queryFn: () => getResource(resourceId, userId),
  });

const getResource = async (resourceId, userId) => {
  const resourceRef = doc(db, "rf_Resources", resourceId);
  const resourceSnap = await getDoc(resourceRef);
  if (!resourceSnap.exists()) {
    return;
  }

  console.log("my resource snap", resourceSnap.data());

  const userRef = doc(db, "rf_Users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    return;
  }

  const resourceData = resourceSnap.data();
  const userData = userSnap.data();

  console.log("my bookmarks", userData.bm_resources, resourceId);

  let isBookmarked = false;
  if (userData.bm_resources.includes(resourceId)) {
    isBookmarked = true;
  }
  resourceData.isBookmarked = isBookmarked;

  let isRead = false;
  if (userData.read_resources.includes(resourceId)) {
    isRead = true;
  }
  resourceData.isRead = isRead;

  let isUpvoted = false;
  if (resourceData.upvotes?.includes(userId)) {
    isUpvoted = true;
  }
  resourceData.isUpvoted = isUpvoted;

  const tagRefs = resourceData.tags;
  if (!Array.isArray(tagRefs) || tagRefs.length <= 0) {
    return resourceData;
  }

  // TODO: Fetch me my comments 🍵
  const commentIds = resourceData.comments;
  const comments = await getComments(commentIds);

  const tags = await getTags(tagRefs);

  return { ...resourceData, tags, comments };
};

const getTags = async (tagRefs) => {
  return await Promise.all(
    tagRefs.map(async (tagRef) => {
      const tagSnap = await getDoc(tagRef);
      return tagSnap.data();
    })
  );

  // if (!tagSnap.exists()) {
  // 	console.log("No tag(s) found.");
  // 	return [];
  // }
};

const getComments = async (commentIds) => {
  console.log("my comment ids", commentIds);
  return await Promise.all(
    commentIds.map(async (commentId) => {
      const commentRef = doc(db, "rf_ResourceComment", commentId);
      const commentSnap = await getDoc(commentRef);

      return {
        id: commentId,
        ...commentSnap.data(),
      };
    })
  );
};

export const addCommentToResource = async (resourceId, commentId) => {
  const resourceRef = doc(db, "rf_Resources", resourceId);
  const resourceSnap = await getDoc(resourceRef);
  const resourceData = resourceSnap.data();
  const resourceExistingComments = resourceData.comments || [];

  resourceExistingComments.push(commentId);

  await updateDoc(resourceRef, { comments: resourceExistingComments });
};
