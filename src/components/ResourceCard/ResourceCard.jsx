import React from "react";
import timerIcon from "../../assets/icons/timer.png";
import "./ResourceCard.scss";
import upvoteImg from "../../assets/images/upvote.png";
import commentsImg from "../../assets/images/comments.png";

export default function ResourceCard({
  id,
  resource,
  selectResource,
  isActive
}) {
  const handleClickCard = () => {
    selectResource(id);
  };
  
  return (
    <section
      className={`resource ${isActive ? "resource--active" : ""}`}
      onClick={handleClickCard}
      tabIndex="0"
      role="button"
      aria-pressed={isActive ? "true" : "false"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClickCard();
        }
      }}
    >
      <div className="resource__heading-top">
        <div className="resource__heading-top-container">
          <p className="resource__type">{resource?.type}</p>
        </div>
      </div>
      <div className="resource__heading-bottom">
        <h1 className="resource__title">{resource?.title}</h1>
        <div className="resource__icons-container">
          <div className="resource__icons resource__icons-img-upvote">
            <img
              className="resource__icons-img"
              // TODO: replace with hero-icon
              src={upvoteImg}
              alt="upvote icon"
            />
            <p className="resource__upvotes-total">{resource?.upvote_count}</p>
          </div>
          <div className="resource__icons">
            <img
              className="resource__icons-img"
              // TODO: replace with hero-icon
              src={commentsImg}
              alt="comments icon"
            />
            <p className="resource__comments-total">
              {resource?.comments?.length ?? 0}
            </p>
          </div>
          <div className="resource__timer">
            <img
              // TODO: replace with hero-icon
              src={timerIcon}
              alt="timer icon"
              className="resource__timer-icon"
              aria-hidden="true"
            />
            <p className="resource__duration">{resource?.duration_min}</p>
          </div>
        </div>
      </div>
      <p className="resource__level">{resource?.difficulty}</p>
    </section>
  );
}
