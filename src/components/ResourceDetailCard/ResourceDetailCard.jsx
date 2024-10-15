import {memo, useContext, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";

import {PointsContext} from "../../PointsProvider.jsx";

import useResourceStore from "../../stores/resource-store";

// Styling & Icons
import {BookmarkIcon as BookmarkChecked} from '@heroicons/react/24/solid';
import {BookmarkIcon as BookmarkUnchecked} from '@heroicons/react/24/outline';
import {ClockIcon} from "@heroicons/react/24/solid/index.js";
import "./ResourceDetailCard.scss";
import {getDoc} from "@firebase/firestore";


// This will be considered a page now rendered through router
const ResourceDetailCard = ({
  // selectedResource,
  // handleToggleBookmarked,
  // savedBookmarks,
  // isBookmarked,
  // comments,
  // currentUser,
  // onCommentAdded,
}) => {

  const [isRead, setIsRead] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { id } = useParams();
  const { getResource, resources } = useResourceStore();
  const currentResource = getResource(id);
  console.log("CurrentResource: ", currentResource);
  // console.log("CurrentResource Submitter: ", currentResource?.data.submitter);
  
  // useEffect(() => {
  //   if (currentResource) {
  //     const savedReadState = localStorage.getItem(currentResource.id);
  //     if (savedReadState) {
  //       setIsRead(JSON.parse(savedReadState));
  //     }
  //   }
  // }, [currentResource]);
  
  // TODO: Extract to react query
  const [tags, setTags] = useState([]);
  useEffect(() => {
    try {
      const getResourceTags = async () => {
        const tags = [];
        for (const tagRef of currentResource?.data.tags) {
          const tagSnap = await getDoc(tagRef);
          tags.push(tagSnap.data());
        }
        console.log("tags", tags)
        setTags(tags);
      }
      getResourceTags();
    } catch (error) {
      console.error(error);
    }
  }, [currentResource]);
  
  const handleBookmarked = () => {
    setIsBookmarked(!isBookmarked);
  }

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
  

  // return (
  //   <div>{id}</div>
  // )
  return (
    <>
      <section className="resource-details">
        <div className="resource-details__heading-top">
          <div className="resource-details__heading-top-container">
            <p className="resource-details__type">{currentResource?.data.type}</p>
            <div
              onClick={handleBookmarked}
              className="resource-details__saved-icon">
              {isBookmarked ? <BookmarkChecked fill="#0099ff" stroke="black" /> : <BookmarkUnchecked />}
            </div>
          </div>
        </div>
        <div className="resource-details__heading-bottom">
          <h1 className="resource-details__title">{currentResource?.data.title}</h1>
        </div>
        <p className="resource-details__level">{currentResource?.data.difficulty}</p>
        <div className="resource-details__tags-container" role="list">
          {tags.map((tag) => (
            <div key={tag.title} className="resource-details__tag" role="listitem">
              {tag.title}
            </div>
          ))}
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
              {currentResource?.data.duration_min} min
            </p>
            {/* Swapped a png image for hero icons. No need to add extra memory from heavy images */}
            <ClockIcon className="resource-details__timer-icon" />
          </div>
        </div>
        
        <div className="resource-details__about">
          <p className="resource-details__preview">
            {currentResource?.data.description}
          </p>
        </div>
        
        <div className="resource-details__bottom-container">
          <div className="resource-details__author-container">
            <div className="resource-details__avatar">
              <img
                id={currentResource?.data.submitter.name}
                src={currentResource?.data.submitter.profile_pic}
                alt="submitter profile picture"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="resource-details__author">
              <p className="resource-details__submission">Submitted by: </p>
              <p className="resource-details__author-name">
                {currentResource?.data.submitter.name}
              </p>
            </div>
          </div>
          <div className="resource-details__buttons-container">
            <Link
              to={currentResource?.url}
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
