import PropTypes from "prop-types";
import {useCallback, useState} from "react";

import NavBar from "../../components/NavBar/NavBar";

import "./ResourcePage.scss";

import useResourceStore from "../../stores/resource-store";
import {Outlet} from "react-router-dom";
import ResourceCard from "../../components/ResourceCard/ResourceCard.jsx";
import {useGetResources} from "../../api/getResources.js";

// currentUser should be global state.
export default function ResourcePage({ currentUser, onBookmarkUpdate }) {
  // const [resources, setResources] = useState([]);
  const [bookmarkedResources, setBookmarkedResources] = useState({});
  const [category, setCategory] = useState("All");
  const [commentCounts, setCommentCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true); // keep

  const { currentResource } = useResourceStore();
  
  // TEST SECTION
  const resources = useGetResources();
  console.log("all resources: ", resources);

  const handleToggleBookmarked = () => {
    if (!currentResource) return;

    const newBookmarkedState = !bookmarkedResources[currentResource.id];
    setBookmarkedResources((prev) => ({
      ...prev,
      [currentResource.id]: newBookmarkedState,
    }));

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (newBookmarkedState) {
      bookmarks.push(currentResource);
    } else {
      bookmarks = bookmarks.filter(
        (bookmark) => bookmark.id !== currentResource.id
      );
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    onBookmarkUpdate(bookmarks);
  };

  const handleFilterChange = ({ type, level, estDuration }) => {
    setType(type === "All" || type === "" ? [] : [type]);
    setLevel(level === "All" || level === "" ? [] : [level]);
    setEstDuration(
      estDuration === "All" || estDuration === "" ? [] : [estDuration]
    );
  };

  const handleCommentAdded = useCallback((resourceId, newComment) => {
    setResources((prevResources) =>
      prevResources.map((resource) =>
        resource.id === resourceId
          ? {
              ...resource,
              comments: [...(resource.comments || []), newComment],
              commentsCount: (resource.commentsCount || 0) + 1,
            }
          : resource
      )
    );

    if (currentResource && currentResource.id === resourceId) {
      setSelectedResource((prevSelected) => ({
        ...prevSelected,
        comments: [...(prevSelected.comments || []), newComment],
        commentsCount: (prevSelected.commentsCount || 0) + 1,
      }));
    }
  }, []);

  return (
    <div className="resource__container">
      <div className="resource__navbar-container">
        {/* Move to App.jsx to reduce redundancy */}
        <NavBar
          onCategoryChange={setCategory}
          onFormSubmit={(newResource) =>
            setResources([...resources, newResource])
          }
          onFilterChange={handleFilterChange}
          currentUser={currentUser}
        />
      </div>
      {/* This fragment remains, all else goes. */}
      <>
        <div className="resource__cards">
          {/* Give resourceList access to the store, and pass in a filter function? */}
          <section className="resourceList" aria-label="Resource List">
            <div className="resourceList__wrapper" role="list">
              {resources.data?.length > 0 ? (
                resources.data?.map((resource) => {
                  return (
                    <ResourceCard
                      key={resource.id}
                      id={resource.id}
                      resource={resource.data}
                    />
                  );
                })
              ) : (
                <p>No resources available for this category.</p>
              )}
            </div>
          </section>
        </div>
        <div className="resource-details__container">
          {/* This is a slot for the details card that shows up on the right in the Resource Library */}
          <Outlet/> 
        </div>
      </>
    </div>
  );
}

ResourcePage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  onBookmarkUpdate: PropTypes.func.isRequired,
};
