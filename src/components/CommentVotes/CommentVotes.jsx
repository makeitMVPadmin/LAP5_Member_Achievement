/*==================
    COMMENT VOTES
==================*/

import React, { useState, useEffect } from "react";
import "./CommentVotes.scss";
import { useToggleCommentUpvoteMutation } from "../../api/toggleCommentUpvote";
import { HandThumbUpIcon as LikedSolid } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as LikedOutline } from "@heroicons/react/24/outline";

function CommentVotes({ comment, currentUser }) {
  console.log("CommentVotes received props:", { comment, currentUser });
  const [upvoteCount, setUpvoteCount] = useState(comment.upvote_count || 0);
  const [upvoters, setUpvoters] = useState(comment.upvotes || []);
  const [isUpvoted, setIsUpvoted] = useState(
    comment.upvotes?.includes(currentUser.id) || false
  );
  const [isValidComment, setIsValidComment] = useState(true);

  useEffect(() => {
    if (!comment) {
      console.error("comment is undefined or null");
      setIsValidComment(false);
    }
  }, [comment, currentUser]);

  const upvoteMutation = useToggleCommentUpvoteMutation();
  const handleUpvote = () => {
    console.log("handleUpvote clicked", { comment, currentUser });
    if (!comment || !currentUser || !currentUser.id) {
      console.error("Invalid comment or currentUser");
      return;
    }

    upvoteMutation.mutate(
      {
        userId: currentUser.id,
        commentId: comment.id,
      },
      {
        onSuccess: (updatedComment) => {
          console.log("Upvote mutation successful", updatedComment);
          setUpvoteCount(updatedComment.upvote_count);
          setUpvoters(updatedComment.upvotes);
          setIsUpvoted(updatedComment.upvotes.includes(currentUser.id));
        },
      }
    );
  };

  if (!isValidComment) {
    return <span>Invalid comment ID</span>;
  }

  return (
    <section className="voting">
      <div className="voting__container">
        <div onClick={handleUpvote} className="">
          <span>
            {isUpvoted ? (
              <LikedSolid fill="#0099ff" width={24} />
            ) : (
              <LikedOutline width={24} />
            )}
          </span>
        </div>
        {upvoteCount}
      </div>
    </section>
  );
}

export default CommentVotes;
