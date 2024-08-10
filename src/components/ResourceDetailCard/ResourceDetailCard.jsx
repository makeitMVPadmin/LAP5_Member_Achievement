import "./ResourceDetailCard.scss";
import timerIcon from "../../assets/icons/timer.png";
import bookmarkIcon from "../../assets/icons/bookmark-svgrepo-com.svg";
import bookmarkedIcon from "../../assets/icons/bookmarked.svg";
import Upvoting from "../Upvoting/Upvoting";
import { Link } from "react-router-dom";
import { Comments } from "../Comments/Comments";
import React, { useState, useEffect } from "react";

// ResourceDetailCard.jsx
const ResourceDetailCard = (({
  selectedResource,
  handleToggleBookmarked,
  savedBookmarks,
  isBookmarked,
  comments,
  currentUser,
  onResourceUpdate,
  onCommentAdded,
}) => {
  console.log("Received comments in ResourceDetailCard:", comments);

  const [localResource, setLocalResource] = useState(selectedResource);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    setLocalResource(selectedResource);
  }, [selectedResource]);

  useEffect(() => {
    const savedReadState = localStorage.getItem(selectedResource.id);
    if (savedReadState) {
      setIsRead(JSON.parse(savedReadState));
    }
  }, [selectedResource.id]);

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
  //         ...localResource,
  //         id: resourceId,
  //         upvote: upvotes,
  //         downvote: downvotes,
  //       });
  //     }
  //   },
  //   [localResource, onResourceUpdate]
  // );

  const handleToggleRead = () => {
    const newReadState = !isRead;
    setIsRead(newReadState);
    localStorage.setItem(selectedResource.id, JSON.stringify(newReadState));
  };

  return (
    <>
      <section className="resource-details">
        <div className="resource-details__heading-top">
          <div className="resource-details__heading-top-container">
            <p className="resource-details__type">{localResource.type}</p>
            <img
              src={isBookmarked ? bookmarkedIcon : bookmarkIcon}
              onClick={handleToggleBookmarked}
              alt="bookmark icon"
              className="resource-details__saved-icon"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="resource-details__heading-bottom">
          <h1 className="resource-details__title">
            {localResource.title}
          </h1>
        </div>
        <p className="resource-details__level">{localResource.level}</p>
        <div className="resource-details__tags-container" role="list">
          {[
            localResource.tag1,
            localResource.tag2,
            localResource.tag3,
            localResource.tag4,
          ].map((tag, index) => (
            <div
              key={index}
              className="resource-details__tag"
              role="listitem"
            >
              {tag}
            </div>
          ))}
        </div>

        <div className="resource-details__rating-timer-container">
          <div className="resource-details__rating-star-container">
            <div className="resource-details__stars">
              <Upvoting
                resourceId={localResource.id}
                currentUser={currentUser}
                initialUpvotes={localResource.upvote}
                initialDownvotes={localResource.downvote}
                onVoteChange={(upvotes, downvotes) => {
                  setLocalResource(prev => ({
                    ...prev,
                    upvote: upvotes,
                    downvote: downvotes,
                  }));
                  if (onResourceUpdate) {
                    onResourceUpdate({
                      ...localResource,
                      upvote: upvotes,
                      downvote: downvotes,
                    });
                  }
                }}
              />
            </div>
          </div>

          <div className="resource-details__timer">
            <p className="resource-details__duration">
              {localResource.estDuration}
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
            {localResource.description}{" "}
          </p>
        </div>

        <div className="resource-details__bottom-container">
          <div className="resource-details__author-container">
            <div
              className="resource-details__avatar"
              aria-hidden="true"
            ></div>
            <div className="resource-details__author">
              <p className="resource-details__submission">Submitted by: </p>
              <p className="resource-details__author-name">
                {localResource.name}
              </p>
            </div>
          </div>
          <div className="resource-details__buttons-container">
            <Link
              to={localResource.url}
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
              className={`resource-details__button ${isRead ? "resource-details__button--read" : ""
                }`}
              onClick={handleToggleRead}
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
            resourceId={localResource.id}
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
});

export default React.memo(ResourceDetailCard);