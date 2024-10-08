import {memo, useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";

import {PointsContext} from "../../App";
import {Comments} from "../Comments/Comments";
import {Upvoting} from "../Upvoting/Upvoting";

import useResourceStore from "../../stores/resource-store";

import timerIcon from "../../assets/icons/timer.png";
import bookmarkIcon from "../../assets/icons/bookmark-svgrepo-com.svg";
import bookmarkedIcon from "../../assets/icons/bookmarked.svg";

import "./ResourceDetailCard.scss";

// ResourceDetailCard.jsx
const ResourceDetailCard = ({
  selectedResource,
  handleToggleBookmarked,
  savedBookmarks,
  isBookmarked,
  comments,
  currentUser,
  onCommentAdded,
}) => {
  // console.log("Received comments in ResourceDetailCard:", comments);

  // const [currentResource, setLocalResource] = useState(selectedResource);
  const [isRead, setIsRead] = useState(false);

  const { currentResource, updateResource } =
    useResourceStore();

  // useEffect(() => {
  //   setLocalResource(selectedResource);
  // }, [selectedResource]);

  useEffect(() => {
    const savedReadState = localStorage.getItem(currentResource.id);
    if (savedReadState) {
      setIsRead(JSON.parse(savedReadState));
    }
  }, [currentResource.id]);

  // const handleVoteChange = useCallback(
  //   (resourceId, upvotes, downvotes) => {
  //     setLocalResource(prev => {
  //       if (prev.upvote === upvotes && prev.downvote === downvotes) {
  //         return prev;
  //       }
  //       return { ...prev, upvote: upvotes, downvote: downvotes };
  //     });

  //     if (onResourceUpdate) {
  //       onResourceUpdate({
  //         ...currentResource,
  //         id: resourceId,
  //         upvote: upvotes,
  //         downvote: downvotes,
  //       });
  //     }
  //   },
  //   [currentResource, onResourceUpdate]
  // );

  const handleToggleRead = () => {
    const newReadState = !isRead;
    setIsRead(newReadState);
    localStorage.setItem(selectedResource.id, JSON.stringify(newReadState));
  };

  const { addPoints } = useContext(PointsContext);

  const handleUpvotePoints = () => {
    addPoints(2);
  };

  const handleMarkAsReadPoints = () => {
    addPoints(10);
  };

  const handleBookmarkPoints = () => {
    addPoints(20);
  };

  return (
    <>
      <section className="resource-details">
        <div className="resource-details__heading-top">
          <div className="resource-details__heading-top-container">
            <p className="resource-details__type">{currentResource.type}</p>
            <img
              src={isBookmarked ? bookmarkedIcon : bookmarkIcon}
              onClick={() => {
                handleToggleBookmarked();
                if (!isBookmarked) {
                  handleBookmarkPoints();
                }
              }}
              alt="bookmark icon"
              className="resource-details__saved-icon"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="resource-details__heading-bottom">
          <h1 className="resource-details__title">{currentResource.title}</h1>
        </div>
        <p className="resource-details__level">{currentResource.level}</p>
        <div className="resource-details__tags-container" role="list">
          {[
            currentResource.tag1,
            currentResource.tag2,
            currentResource.tag3,
            currentResource.tag4,
          ].map((tag, index) => (
            <div key={index} className="resource-details__tag" role="listitem">
              {tag}
            </div>
          ))}
        </div>

        <div className="resource-details__rating-timer-container">
          <div className="resource-details__rating-star-container">
            <div className="resource-details__stars">
              <Upvoting
                onClick={handleUpvotePoints}
                addPoints={addPoints}
                resourceId={currentResource.id}
                currentUser={currentUser}
                initialUpvotes={currentResource.upvote}
                initialDownvotes={currentResource.downvote}
                onVoteChange={(upvotes, downvotes) => {
                  updateResource(currentResource.id, {
                    upvotes, downvotes
                  })
                }}
              />
            </div>
          </div>

          <div className="resource-details__timer">
            <p className="resource-details__duration">
              {currentResource.estDuration}
            </p>
            <img
              src={timerIcon}
              alt="timer icon"
              className="resource-details__timer-icon"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="resource-details__about">
          <p className="resource-details__preview">
            {currentResource.description}{" "}
          </p>
        </div>

        <div className="resource-details__bottom-container">
          <div className="resource-details__author-container">
            <div className="resource-details__avatar" aria-hidden="true"></div>
            <div className="resource-details__author">
              <p className="resource-details__submission">Submitted by: </p>
              <p className="resource-details__author-name">
                {currentResource.name}
              </p>
            </div>
          </div>
          <div className="resource-details__buttons-container">
            <Link
              to={currentResource.url}
              key=""
              target="_blank"
              rel="noopener noreferrer"
              className="resource-details__link"
            >
              <button
                className="resource-details__resource-button"
                aria-label="Go to Resource"
              >
                Go to Resource
              </button>
            </Link>
            <button
              className={`resource-details__button ${
                isRead ? "resource-details__button--read" : ""
              }`}
              onClick={() => {
                handleToggleRead();
                if (!isRead) {
                  handleMarkAsReadPoints();
                }
              }}
              aria-pressed={isRead}
              aria-label={isRead ? "Read!" : "Mark as Read"}
            >
              {isRead ? "Read!" : "Mark as Read"}
            </button>
          </div>
        </div>
      </section>
      <div className="resource-details__comments">
        {comments && (
          <Comments
            comments={comments}
            currentUser={currentUser}
            resourceId={currentResource.id}
            onCommentAdded={(resourceId, newComment) => {
              if (onCommentAdded) {
                onCommentAdded(resourceId, newComment);
              }
            }}
          />
        )}
      </div>
    </>
  );
};

export default memo(ResourceDetailCard);
