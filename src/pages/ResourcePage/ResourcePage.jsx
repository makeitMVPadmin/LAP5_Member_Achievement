import PropTypes from "prop-types";
import {useCallback, useMemo, useState} from "react";

import NavBar from "../../components/NavBar/NavBar";

import "./ResourcePage.scss";

import useResourceStore from "../../stores/resource-store";
import {Outlet} from "react-router-dom";
import ResourceCard from "../../components/ResourceCard/ResourceCard.jsx";
import {useGetResources} from "../../api/getResource.js";

// currentUser should be global state.
export default function ResourcePage({ currentUser, onBookmarkUpdate }) {
  // const [resources, setResources] = useState([]);
  const [bookmarkedResources, setBookmarkedResources] = useState({});
  const [category, setCategory] = useState("All");
  // const [type, setType] = useState("");
  // const [level, setLevel] = useState("");
  // const [estDuration, setEstDuration] = useState("");
  const [commentCounts, setCommentCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true); // keep

  const { currentResource, loadResources } = useResourceStore();
  
  // TEST SECTION
  const resources = useGetResources();
  console.log("all resources: ", resources);

  // const handleSelectResource = useCallback(
  //   (clickedId) => {
  //     const foundResource = resources.find(
  //       (resource) => resource.id === clickedId
  //     );
  //     if (foundResource) {
  //       setCurrentResource(clickedId);
  //     } else {
  //       console.error("Resource not found for id:", clickedId);
  //     }
  //   },
  //   [resources]
  // );

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

  // Filter resources based on the category, type, skill, and duration
  const filteredResources = useMemo(() => {
    // return resources?.filter((resource) => {
    //   const currentCategory =
    //     category === "All" || resource.discipline === category;
    //   const matchesType = type.length === 0 || type.includes(resource.type);
    //   const matchesLevel = level.length === 0 || level.includes(resource.level);
    //   const matchesEstDuration =
    //     estDuration.length === 0 || estDuration.includes(resource.estDuration);
    //   return (
    //     currentCategory && matchesType && matchesLevel && matchesEstDuration
    //   );
    // });
  }, [resources, category]);

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
                      // selectResource={selectResource}
                    />
                  );
                })
              ) : (
                <p>No resources available for this category.</p>
              )}
            </div>
          </section>
          {/*<ResourceList*/}
          {/*  resources={loadedResources}*/}
          {/*  // selectResource={handleSelectResource}*/}
          {/*  // activeResourceId={currentResource?.id}*/}
          {/*  commentCounts={commentCounts}*/}
          {/*/>*/}
        </div>
        <div className="resource-details__container">
          <Outlet/>
          {/*// TODO:*/}
          {/*// <ResourceDetailCard*/}
          {/*//   handleToggleBookmarked={handleToggleBookmarked}*/}
          {/*//   savedBookmarks={Object.values(bookmarkedResources).some(Boolean)}*/}
          {/*//   isBookmarked={bookmarkedResources[currentResource.id] || false}*/}
          {/*//   // comments={currentResource.comments}*/}
          {/*//   currentUser={currentUser}*/}
          {/*//   onCommentAdded={handleCommentAdded}*/}
          {/*// />*/}
        </div>
      </>
    </div>
  );
}

ResourcePage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  onBookmarkUpdate: PropTypes.func.isRequired,
};
