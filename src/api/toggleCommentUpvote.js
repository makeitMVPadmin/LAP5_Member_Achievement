import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { database as db } from "../config/firebase.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleCommentUpvoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) => {
      return toggleCommentUpvote(variables.userId, variables.commentId);
    },
    onSuccess: (data, variables) => {
      const { commentId } = variables;
      const updatedComment = data;

      // Update cache
      queryClient.setQueryData(["comments", commentId], updatedComment);
    },
    onError: (err) => {
      console.log("error happened", err);
    },
  });
};

const toggleCommentUpvote = async (userId, commentId) => {
  const commentRef = doc(db, "rf_ResourceComment", commentId);
  const commentSnap = await getDoc(commentRef);
  if (!commentSnap.exists()) {
    throw new Error("Comment not found");
  }

  const commentData = commentSnap.data();
  const updatedComment = updateComment(userId, commentData);

  await updateDoc(commentRef, {
    upvotes: updatedComment.upvotes,
    upvote_count: updatedComment.upvote_count,
  });

  return updatedComment;
};

const updateComment = (userId, comment) => {
  if (!comment.upvotes) {
    comment.upvotes = [];
  }

  if (!comment.upvote_count) {
    comment.upvote_count = 0;
  }

  const upvotesSet = new Set(comment.upvotes);
  if (!upvotesSet.has(userId)) {
    upvotesSet.add(userId);
    comment.upvote_count += 1;
  } else {
    upvotesSet.delete(userId);
    comment.upvote_count -= 1;
  }

  comment.upvotes = Array.from(upvotesSet);
  return comment;
};
