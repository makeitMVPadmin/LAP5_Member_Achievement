/*===============
    UPVOTING
===============*/
// src/components/Upvoting/Upvoting.jsx

import { useState, useEffect, useCallback, useContext, memo } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";

import { PointsContext } from "../../App";
import useResourceStore from "../../stores/resource-store";

import ThumbIcon from "../../assets/icons/thumbsUpComments.svg";
import ThumbIconActive from "../../assets/icons/thumbsUpCommentsActive.svg";
import "./Upvoting.scss";

const Upvoting = memo(
  ({
    resourceId,
    currentUser,
    initialUpvotes,
    initialDownvotes,
    onVoteChange,
  }) => {
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [voteStatus, setVoteStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const db = getFirestore();

    const { currentResource, updateResource } = useResourceStore();

    useEffect(() => {
      const fetchVoteStatus = async () => {
        if (!currentUser || !resourceId) return;

        try {
          const docRef = doc(db, "Resources", resourceId.toString());
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUpvotes(data.upvote || 0);
            setDownvotes(data.downvote || 0);

            if (data.likedByUser && data.likedByUser.includes(currentUser.id)) {
              setVoteStatus("upvote");
            } else if (
              data.downvotedByUsers &&
              data.downvotedByUsers.includes(currentUser.id)
            ) {
              setVoteStatus("downvote");
            } else {
              setVoteStatus(null);
            }
          }
        } catch (error) {
          console.error("Error fetching vote status:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchVoteStatus();
    }, [resourceId, currentUser, db]);

    const handleVote = useCallback(
      async (voteType) => {
        if (isLoading || !currentUser || !resourceId) {
          return;
        }

        setIsLoading(true);
        const userId = currentUser.id;
        const docRef = doc(db, "Resources", resourceId.toString());

        try {
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            console.error("Document does not exist:", resourceId);
            return;
          }

          const currentData = docSnap.data();
          let updates = {};

          if (currentData?.likedByUser?.includes(userId)) {
            //
          }

          if (currentData?.downvotedByUsers?.includes(userId)) {
            //
          }

          if (voteType === "upvote") {
            if (
              currentData.likedByUser &&
              currentData.likedByUser.includes(userId)
            ) {
              updates = {
                upvote: increment(-1),
                likedByUser: arrayRemove(userId),
              };
            } else {
              updates = {
                upvote: increment(1),
                likedByUser: arrayUnion(userId),
                downvotedByUsers: arrayRemove(userId),
              };
              if (
                currentData.downvotedByUsers &&
                currentData.downvotedByUsers.includes(userId)
              ) {
                updates.downvote = increment(-1);
              }
            }
          } else if (voteType === "downvote") {
            if (
              currentData.downvotedByUsers &&
              currentData.downvotedByUsers.includes(userId)
            ) {
              updates = {
                downvote: increment(-1),
                downvotedByUsers: arrayRemove(userId),
              };
            } else {
              updates = {
                downvote: increment(1),
                downvotedByUsers: arrayUnion(userId),
                likedByUser: arrayRemove(userId),
              };
              if (
                currentData.likedByUser &&
                currentData.likedByUser.includes(userId)
              ) {
                updates.upvote = increment(-1);
              }
            }
          }

          // await updateDoc(docRef, updates);

          const updatedDocSnap = await getDoc(docRef);
          const updatedData = updatedDocSnap.data();

          setUpvotes(updatedData.upvote || 0);
          setDownvotes(updatedData.downvote || 0);
          setVoteStatus(
            updatedData.likedByUser?.includes(currentUser.id)
              ? "upvote"
              : updatedData.downvotedByUsers?.includes(currentUser.id)
              ? "downvote"
              : null
          );

          if (onVoteChange) {
            onVoteChange(updatedData.upvote || 0, updatedData.downvote || 0);
          }
        } catch (error) {
          console.error("Error updating vote:", error);
        } finally {
          setIsLoading(false);
        }
      },
      [isLoading, currentUser, resourceId, db, onVoteChange]
    );

    const handleUpvote = useCallback(async () => {
      if (currentResource?.likedByUsers?.includes(currentUser.id)) {
        updateResource(currentResource.id, {
          likedByUsers:
            currentResource.likedByUsers.toFiltered(
              (id) => id !== currentUser.id
            ) || [],
        });
      } else {
        updateResource(currentResource.id, {
          likedByUsers: [
            currentUser.id,
            ...(currentResource?.likedByUsers || []),
          ],
          downvotedByUsers:
            currentResource?.downvotedByUsers?.filter(
              (id) => id !== currentUser.id
            ) || [],
        });
      }
    }, [isLoading, currentUser, currentResource]);

    const handleDownvote = useCallback(async () => {
      if (currentResource?.downvotedByUsers?.includes(currentUser.id)) {
        updateResource(currentResource.id, {
          downvotedByUsers:
            currentResource?.downvotedByUsers?.filter(
              (id) => id !== currentUser.id
            ) || [],
        });
      } else {
        updateResource(currentResource.id, {
          downvotedByUsers: [
            currentUser.id,
            ...(currentResource?.downvotedByUsers || []),
          ],
          likedByUsers:
            currentResource?.likedByUsers?.toFiltered(
              (id) => id !== currentUser.id
            ) || [],
        });
      }
    }, [isLoading, currentUser, currentResource]);

    const { addPoints } = useContext(PointsContext);

    const handleUpvotePoints = () => {
      addPoints(2);
    };

    return (
      <div className="voting">
        <div className="voting__container">
          <img
            src={voteStatus === "upvote" ? ThumbIconActive : ThumbIcon}
            alt="Thumb up"
            className={`voting__thumb voting__thumb--up ${
              voteStatus === "upvote" ? "voting__thumb--active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleUpvote();
            }}
          />
          <span className="voting__count">
            {currentResource?.likedByUsers?.length || 0}
          </span>
        </div>
        <div className="voting__container">
          <img
            src={voteStatus === "downvote" ? ThumbIconActive : ThumbIcon}
            alt="Thumb down"
            className={`voting__thumb voting__thumb--down ${
              voteStatus === "downvote" ? "voting__thumb--active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleUpvote();
            }}
          />
          <span className="voting__count">
            {currentResource?.dislikedByUsers?.length || 0}
          </span>
        </div>
      </div>
    );
  }
);

export { Upvoting };
