/*==================
    COMMENT VOTES
==================*/

import React, { useState, useEffect } from "react";
import "./CommentVotes.scss";
import { database } from "../../config/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import ThumbIcon from "../../assets/icons/thumbsUpComments.svg";
import ThumbIconActive from "../../assets/icons/thumbsUpCommentsActive.svg";

function CommentVotes({ commentId, currentUser }) {
  // console.log("CommentVotes received props:", { commentId, currentUser });
  const [upvotes, setUpvotes] = useState(0);
  const [voteStatus, setVoteStatus] = useState(null);
  const [isValidComment, setIsValidComment] = useState(true);

  // console.log("CommentVotes render. commentId:", commentId, "currentUser:", currentUser);

  useEffect(() => {
    // console.log("CommentVotes useEffect. commentId:", commentId);

    if (!commentId) {
      console.error("commentId is undefined or null");
      setIsValidComment(false);
      return;
    }

    const fetchCommentData = async () => {
      const commentRef = doc(database, "Comments", commentId);
      try {
        const commentDoc = await getDoc(commentRef);
        if (commentDoc.exists()) {
          const commentData = commentDoc.data();
          if (Array.isArray(commentData.likedByUser)) {
            const hasLiked = commentData.likedByUser.includes(currentUser.id);
            setVoteStatus(hasLiked ? "upvoted" : null);
            setUpvotes(commentData.likes || 0);
          } else {
            console.error(
              "likedByUser is not an array:",
              commentData.likedByUser
            );
          }
        } else {
          console.error("No such document!");
          setIsValidComment(false);
        }
      } catch (error) {
        console.error("Error fetching comment data:", error);
        setIsValidComment(false);
      }
    };

    fetchCommentData();
  }, [commentId, currentUser]);

  const handleUpvote = async () => {
    if (!commentId || !currentUser || !currentUser.id) {
      console.error("Invalid commentId or currentUser");
      return;
    }
    const commentRef = doc(database, "Comments", commentId);
    const userId = currentUser.id;

    try {
      const docSnap = await getDoc(commentRef);

      if (!docSnap.exists()) {
        console.error("Comment document does not exist");
        return;
      }

      if (voteStatus === "upvoted") {
        await updateDoc(commentRef, {
          likedByUser: arrayRemove(userId),
          likes: upvotes - 1,
        });
        setUpvotes((prevUpvotes) => prevUpvotes - 1);
        setVoteStatus(null);
      } else {
        await updateDoc(commentRef, {
          likedByUser: arrayUnion(userId),
          likes: upvotes + 1,
        });
        setUpvotes((prevUpvotes) => prevUpvotes + 1);
        setVoteStatus("upvoted");
      }
    } catch (error) {
      console.error("Error updating upvote: ", error);
    }
  };

  if (!isValidComment) {
    return <span>Invalid comment ID</span>;
  }

  return (
    <section className="voting">
      <div className="voting__container">
        <img
          src={voteStatus === "upvoted" ? ThumbIconActive : ThumbIcon}
          alt="Thumb up"
          className={`voting__thumb voting__thumb--up ${
            voteStatus === "upvoted" ? "voting__thumb--active" : ""
          }`}
          onClick={handleUpvote}
        />
        {upvotes}
      </div>
    </section>
  );
}

export default CommentVotes;
