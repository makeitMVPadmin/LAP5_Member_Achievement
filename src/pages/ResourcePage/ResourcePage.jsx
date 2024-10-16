// Deps
import {useState} from "react";
import {Outlet} from "react-router-dom";

// Lib & Helpers
import {useGetResources} from "../../api/index.js";

// Components & Styling
import NavBar from "../../components/NavBar/NavBar";
import ResourceCard from "../../components/ResourceCard/ResourceCard.jsx";
import "./ResourcePage.scss";

// currentUser should be global state.
export default function ResourcePage({ currentUser }) {
  const [isLoading, setIsLoading] = useState(true); // keep

  // START: Test Section
  const resources = useGetResources();
  console.log("all resources: ", resources);
  // END: Test Section

  // const handleFilterChange = ({ type, level, estDuration }) => {
  //   setType(type === "All" || type === "" ? [] : [type]);
  //   setLevel(level === "All" || level === "" ? [] : [level]);
  //   setEstDuration(
  //     estDuration === "All" || estDuration === "" ? [] : [estDuration]
  //   );
  // };

  // const handleCommentAdded = useCallback((resourceId, newComment) => {
  //   setResources((prevResources) =>
  //     prevResources.map((resource) =>
  //       resource.id === resourceId
  //         ? {
  //             ...resource,
  //             comments: [...(resource.comments || []), newComment],
  //             commentsCount: (resource.commentsCount || 0) + 1,
  //           }
  //         : resource
  //     )
  //   );
  //
  //   if (currentResource && currentResource.id === resourceId) {
  //     setSelectedResource((prevSelected) => ({
  //       ...prevSelected,
  //       comments: [...(prevSelected.comments || []), newComment],
  //       commentsCount: (prevSelected.commentsCount || 0) + 1,
  //     }));
  //   }
  // }, []);

  return (
    <div className="resource__container">
      <div className="resource__navbar-container">
        {/* Move to App.jsx to reduce redundancy */}
        <NavBar
          // onCategoryChange={setCategory}
          onFormSubmit={(newResource) =>
            setResources([...resources, newResource])
          }
          // onFilterChange={handleFilterChange}
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
                      url={`/resource/${resource.id}`}
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
