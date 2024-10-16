import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavBar from "../../components/NavBar/NavBar";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterDrawer from "../../components/FilterDrawer/FilterDrawer";
import ResourceDetailCard from "../../components/ResourceDetailCard/ResourceDetailCard";
import ResourceList from "../../components/ResourceList/ResourceList";
import "./ResourcePage.scss";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../../config/firebase";
import NoMatchesFoundCard from "../../components/NoMatchesFoundCard/NoMatchesFoundCard";

export default function ResourcePage({
  currentUser,
  onBookmarkUpdate,
  onFilterChange,
}) {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookmarkedResources, setBookmarkedResources] = useState({});
  const [category, setCategory] = useState("All");
  const [tags, setTags] = useState([]);
  const [type, setType] = useState("All");
  const [level, setLevel] = useState("All");
  const [estDuration, setEstDuration] = useState("All");
  const [search, setSearch] = useState("");
  const [commentCounts, setCommentCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetching all resources and comments only once
  useEffect(() => {
    const getAllResourcesAndComments = async () => {
      setIsLoading(true);
      try {
        const resourcesSnapshot = await getDocs(
          collection(database, "Resources")
        );
        const commentsSnapshot = await getDocs(
          collection(database, "Comments")
        );

        const resourcesCollection = resourcesSnapshot.docs.map((doc) => {
          const resourceData = { id: doc.id, ...doc.data() };
          const resourceComments = commentsSnapshot.docs
            .filter((commentDoc) => commentDoc.data().resourceId === doc.id)
            .map((commentDoc) => ({ id: commentDoc.id, ...commentDoc.data() }));
          return {
            ...resourceData,
            comments: resourceComments,
            commentsCount: resourceComments.length,
          };
        });

        setResources(resourcesCollection);

        // Automatically selects the first resource
        if (resourcesCollection.length > 0) {
          setSelectedResource(resourcesCollection[0]);
        }

        // Initialize bookmarked resources from local storage
        const savedBookmarks =
          JSON.parse(localStorage.getItem("bookmarks")) || [];
        const bookmarkedState = savedBookmarks.reduce((acc, resource) => {
          acc[resource.id] = true;
          return acc;
        }, {});
        setBookmarkedResources(bookmarkedState);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching resources and comments: ", err);
        setIsLoading(false);
      }
    };

    getAllResourcesAndComments();
  }, []);

  const handleSelectResource = useCallback(
    (clickedId) => {
      const foundResource = resources.find(
        (resource) => resource.id === clickedId
      );
      if (foundResource) {
        setSelectedResource(foundResource);
      } else {
        console.error("Resource not found for id:", clickedId);
      }
    },
    [resources]
  );

  const handleToggleBookmarked = () => {
    if (!selectedResource) return;

    const newBookmarkedState = !bookmarkedResources[selectedResource.id];
    setBookmarkedResources((prev) => ({
      ...prev,
      [selectedResource.id]: newBookmarkedState,
    }));

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (newBookmarkedState) {
      bookmarks.push(selectedResource);
    } else {
      bookmarks = bookmarks.filter(
        (bookmark) => bookmark.id !== selectedResource.id
      );
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    onBookmarkUpdate(bookmarks);
  };

  const handleFilterChange = ({
    tags,
    discipline,
    type,
    level,
    estDuration,
  }) => {
    setTags(tags);
    setCategory(discipline === "All" || discipline === "" ? "All" : discipline);
    setType(type === "All" || type === "" ? "All" : type);
    setLevel(level === "All" || level === "" ? "All" : level);
    setEstDuration(
      estDuration === "All" || estDuration === "" ? "All" : estDuration
    );
  };

  const handleResourceUpdate = useCallback((updatedResource) => {
    setResources((prevResources) =>
      prevResources.map((resource) =>
        resource.id === updatedResource.id
          ? { ...resource, ...updatedResource }
          : resource
      )
    );
    setSelectedResource((prev) => ({ ...prev, ...updatedResource }));
  }, []);

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

    if (selectedResource && selectedResource.id === resourceId) {
      setSelectedResource((prevSelected) => ({
        ...prevSelected,
        comments: [...(prevSelected.comments || []), newComment],
        commentsCount: (prevSelected.commentsCount || 0) + 1,
      }));
    }
  }, []);
  // Filter resources based on the category, type, skill, and duration
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const currentCategory =
        category === "All" || resource.discipline === category;
      const matchesType = type === "All" || resource.type === type;
      const matchesLevel = level === "All" || resource.level === level;
      const matchesEstDuration =
        estDuration === "All" || resource.estDuration === estDuration;
      const includesSearchTerm = resource.title
        .toLowerCase()
        .includes(search.toLocaleLowerCase());

      const matchesTags =
        tags.length === 0 || 
        resource.title
        .toLowerCase()
        .includes(tags);

      return (
        matchesTags &&
        currentCategory &&
        matchesType &&
        matchesLevel &&
        matchesEstDuration &&
        includesSearchTerm
      );
    });
  }, [resources, tags, category, type, level, estDuration, search]);

  return (
    <div className="resource__container">
      <div className="resource__navbar-container">
        <NavBar
          onCategoryChange={setCategory}
          onFormSubmit={(newResource) =>
            setResources([...resources, newResource])
          }
          // onFilterChange={handleFilterChange}
          currentUser={currentUser}
        />
      </div>
      <div className="search__bar">
        <SearchBar searchTerm={search} onSearch={setSearch} />
        {isLoading && <p>Loading...</p>}
        {!isLoading && filteredResources.length > 0 ? (
          <div className="resource__container">
            <div className="resource__cards">
              <FilterDrawer onFilterChange={handleFilterChange} />

              <ResourceList
                resources={filteredResources}
                selectResource={handleSelectResource}
                activeResourceId={selectedResource?.id}
                commentCounts={commentCounts}
              />
            </div>
            <div className="resource-details__container">
              {selectedResource && (
                <ResourceDetailCard
                  selectedResource={selectedResource}
                  handleToggleBookmarked={handleToggleBookmarked}
                  savedBookmarks={Object.values(bookmarkedResources).some(
                    Boolean
                  )}
                  isBookmarked={
                    bookmarkedResources[selectedResource.id] || false
                  }
                  comments={selectedResource.comments}
                  currentUser={currentUser}
                  onResourceUpdate={handleResourceUpdate}
                  onCommentAdded={handleCommentAdded}
                />
              )}
            </div>
          </div>
        ) : (
          !isLoading && <NoMatchesFoundCard searchQueryText={search} />
        )}
      </div>
    </div>
  );
}

ResourcePage.propTypes = {
  currentUser: PropTypes.object.isRequired,
  onBookmarkUpdate: PropTypes.func.isRequired,
};
