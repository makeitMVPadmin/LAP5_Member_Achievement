// Deps
import React from "react";
import {Outlet} from "react-router-dom";

// Lib & Helpers
import {useGetBookmarks} from "../../api/index.js";

// Components & Styling
import NavBar from "../../components/NavBar/NavBar";
import ResourceCard from "../../components/ResourceCard/ResourceCard.jsx";
import "./BookMarkedPage.scss";

export default function BookMarkedPage({ currentUser }) {
  const { data: bookmarks } = useGetBookmarks(currentUser.id);
  
  return (
    <div className="resource__container">
      <div className="resource__navbar-container">
        {/* Move to App.jsx to reduce redundancy */}
        <NavBar
          // onCategoryChange={setCategory}
          // onFilterChange={handleFilterChange}
          currentUser={currentUser}
        />
      </div>
      <div className="resource__cards">
        <section className="resourceList" aria-label="Resource List">
          <div className="resourceList__wrapper" role="list">
            {bookmarks?.length > 0 ? (
              bookmarks?.map((bookmark) => {
                return (
                  <ResourceCard
                    key={bookmark.id}
                    id={bookmark.id}
                    resource={bookmark}
                    url={`/bookmarked/${bookmark.id}`}
                  />
                );
              })
            ) : (
              <p>No bookmarks available.</p>
            )}
          </div>
        </section>
      </div>
      <div className="resource-details__container">
        {/* This is a slot for the details card that shows up on the right in the Resource Library */}
         <Outlet />
      </div>
    </div>
  );
}
