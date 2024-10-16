// Deps
import {memo, useContext, useState} from "react";
import {Link, useParams} from "react-router-dom";

// React Context global state
import {PointsContext} from "../../PointsProvider.jsx";

// Lib & Helpers
import {useGetResource} from "../../api/index.js";

// Styling & Icons
import {BookmarkIcon as BookmarkChecked} from '@heroicons/react/24/solid';
import {BookmarkIcon as BookmarkUnchecked} from '@heroicons/react/24/outline';
import {ClockIcon} from "@heroicons/react/24/solid/index.js";
import "./ResourceDetailCard.scss";
import {useToggleBookmarkMutation} from "../../api/toggleBookmark.js";

// This will be considered a page now rendered through router
const ResourceDetailCard = ({ currentUserId }) => {
  const { resourceId } = useParams();
  const [isRead, setIsRead] = useState(false);

  // Check if the currentResource is loading or throwing an error
  const { data: currentResourceData, isLoading, isError, error: getResourceError } = useGetResource(resourceId, currentUserId);

  const mutation = useToggleBookmarkMutation(currentUserId, resourceId);
  const handleBookmarked = () => {
    mutation.mutate({
      userId: currentUserId,
      resourceId,
    });
  }

  const { addPoints } = useContext(PointsContext);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {getResourceError.message}</div>;
  
  // Now we can extract our data object if the above resolved
  const tags = currentResourceData.tags;
  console.log("CurrentResource: ", currentResourceData);

  // TODO: Ignore the below... Needs tlc
  const handleUpvotePoints = () => {
    addPoints(2);
  };

  const handleMarkAsReadPoints = () => {
    addPoints(10);
  };

  const handleBookmarkPoints = () => {
    addPoints(20);
  };
  // TODO: End of Ignore




  return (
    <>
      <section className="resource-details">
        <div className="resource-details__heading-top">
          <div className="resource-details__heading-top-container">
            <p className="resource-details__type">{currentResourceData?.type}</p>
            <div
              onClick={handleBookmarked}
              className="resource-details__saved-icon">
              {currentResourceData.isBookmarked ? <BookmarkChecked fill="#0099ff" stroke="black" /> : <BookmarkUnchecked />}
            </div>
          </div>
        </div>
        <div className="resource-details__heading-bottom">
          <h1 className="resource-details__title">{currentResourceData?.title}</h1>
        </div>
        <p className="resource-details__level">{currentResourceData?.difficulty}</p>
        <div className="resource-details__tags-container" role="list">
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <div key={tag.title} className="resource-details__tag" role="listitem">
                {tag.title}
              </div>
            ))
          ) : (
            <div>No Tags</div>
          )}
        </div>
        
        {/*UPVOTING STUFFS*/}
        <div className="resource-details__rating-timer-container">
        {/*  <div className="resource-details__rating-star-container">*/}
        {/*    <div className="resource-details__stars">*/}
        {/*      <Upvoting*/}
        {/*        onClick={handleUpvotePoints}*/}
        {/*        addPoints={addPoints}*/}
        {/*        resource={currentResource?.id}*/}
        {/*        currentUser={currentUser}*/}
        {/*        initialUpvotes={currentResource?.data.upvote_count}*/}
        {/*        initialDownvotes={currentResource?.data.downvote_count}*/}
        {/*        onVoteChange={(upvotes, downvotes) => {*/}
        {/*          updateResource(currentResource?.id, {*/}
        {/*            upvotes, downvotes*/}
        {/*          })*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        
          <div className="resource-details__timer">
            <p className="resource-details__duration">
              {currentResourceData?.duration_min} min
            </p>
            {/* Swapped a png image for hero icons. No need to add extra memory from heavy images */}
            <ClockIcon className="resource-details__timer-icon" />
          </div>
        </div>
        
        <div className="resource-details__about">
          <p className="resource-details__preview">
            {currentResourceData?.description}
          </p>
        </div>
        
        <div className="resource-details__bottom-container">
          <div className="resource-details__author-container">
            <div className="resource-details__avatar">
              <img
                id={currentResourceData?.submitter.name}
                src={currentResourceData?.submitter.profile_pic}
                alt="submitter profile picture"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="resource-details__author">
              <p className="resource-details__submission">Submitted by: </p>
              <p className="resource-details__author-name">
                {currentResourceData?.submitter.name}
              </p>
            </div>
          </div>
          <div className="resource-details__buttons-container">
            <Link
              to={currentResourceData?.url}
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
            {/*<button*/}
            {/*  className={`resource-details__button ${*/}
            {/*    isRead ? "resource-details__button--read" : ""*/}
            {/*  }`}*/}
            {/*  onClick={() => {*/}
            {/*    handleToggleRead();*/}
            {/*    if (!isRead) {*/}
            {/*      handleMarkAsReadPoints();*/}
            {/*    }*/}
            {/*  }}*/}
            {/*  aria-pressed={isRead}*/}
            {/*  aria-label={isRead ? "Read!" : "Mark as Read"}*/}
            {/*>*/}
            {/*  {isRead ? "Read!" : "Mark as Read"}*/}
            {/*</button>*/}
          </div>
        </div>
      </section>
      {/*<div className="resource-details__comments">*/}
      {/*  {currentResource?.data.comments && (*/}
      {/*    <Comments*/}
      {/*      comments={currentResource?.data.comments}*/}
      {/*      // currentUser={currentUser}*/}
      {/*      resourceId={currentResource?.id}*/}
      {/*      onCommentAdded={(resourceId, newComment) => {*/}
      {/*        if (onCommentAdded) {*/}
      {/*          onCommentAdded(resourceId, newComment);*/}
      {/*        }*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</div>*/}
    </>
  );
};

export default memo(ResourceDetailCard);
