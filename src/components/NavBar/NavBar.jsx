import trophyIcon from "../../assets/icons/nav-trophy.png";
import uploadIcon2 from "../../assets/icons/nav-folder.png";
import savedIcon from "../../assets/icons/nav-bookmark.png";
import libraryIcon from "../../assets/icons/nav-library.png";
import arrowDownIcon from "../../assets/icons/arrow-down.png";
import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SubmissionDrawer from "../../components/SubmissionForm/SubmissionDrawer";
import "./NavBar.scss";
import FilterDrawer from "../FilterDrawer/FilterDrawer";

export default function NavBar({
  onCategoryChange, // TODO: Should be removed
  onFormSubmit,
  onFilterChange,
  currentUser,
}) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [category, setCategory] = useState("All");

  const location = useLocation();
  const navigate = useNavigate();

  // TODO: This is the dropdown menu for "Learning Library"
  // Probably should be removed in place of "Learning Hub" Tag Filters
  const toggleLibraryMenu = () => {
    if (typeof onCategoryChange === "function") {
      onCategoryChange(category);
    }
    setCategory("All");
    setIsLibraryOpen(!isLibraryOpen);
  };

  // TODO: Remove
  const handleSelectCategory = (category) => {
    if (location.pathname !== "/resource") {
      navigate("/resource");
    }
    if (typeof onCategoryChange === "function") {
      onCategoryChange(category);
    }

    setCategory(category);
  };
  // TODO: Remove
  const checkLocation = () => {
    if (location.pathname !== "/resource") {
      navigate("/resource");
    }
  };

  // TODO: Double check stateful values and cleanup after unnecessary state is removed
  return (
    <nav className="nav__list">
      <li
        className={`nav__item nav__item-first ${isLibraryOpen ? "active" : ""}`}
        onClick={toggleLibraryMenu}
      >
        <div className="nav__item-wrapper">
          <img
            src={libraryIcon}
            alt="library books icon"
            className="nav__icon"
          />
          <p className="nav__item-name" onClick={checkLocation}>
            Learning Library
          </p>
        </div>
        <img
          src={arrowDownIcon}
          alt="arrow down icon"
          className="nav__icon nav__icon-arrow-down"
        />
      </li>
      {isLibraryOpen && (
        <ul className="nav__library-sublist">
          <li
            className={`nav__library-subitem ${
              category === "Software Engineering" ? "active" : ""
            }`}
            onClick={() => handleSelectCategory("Software Engineering")}
          >
            Software Engineering
          </li>
          <li
            className={`nav__library-subitem ${
              category === "UX/UI Design" ? "active" : ""
            }`}
            onClick={() => handleSelectCategory("UX/UI Design")}
          >
            UX/UI Design
          </li>
          <li
            className={`nav__library-subitem ${
              category === "Product" ? "active" : ""
            }`}
            onClick={() => handleSelectCategory("Product")}
          >
            Product Management
          </li>
          <li
            className={`nav__library-subitem ${
              category === "Data Science" ? "active" : ""
            }`}
            onClick={() => handleSelectCategory("Data Science")}
          >
            Data Science
          </li>
        </ul>
      )}
      <div className="nav__container-top">
        <NavLink to="/contributions">
          <li className="nav__item">
            <img
              src={uploadIcon2}
              alt="upload file icon"
              className="nav__icon"
            />
            <p className="nav__item-name">Contributions</p>
          </li>
        </NavLink>
        <NavLink to="/bookmarked">
          <li className="nav__item">
            <img
              src={savedIcon}
              alt="saved bookmark icon"
              className="nav__icon"
            />
            <p className="nav__item-name">Bookmarked</p>
          </li>
        </NavLink>
        <NavLink to="/rewards">
          <li className="nav__item">
            <img src={trophyIcon} alt="trophy icon" className="nav__icon" />
            <p className="nav__item-name">Rewards</p>
          </li>
        </NavLink>
        <div className="nav__item">
          <FilterDrawer onFilterChange={onFilterChange} />
        </div>
      </div>
      <div className="nav__container-bottom">
        <SubmissionDrawer
          onFormSubmit={onFormSubmit}
          currentUser={currentUser}
        />
      </div>
    </nav>
  );
}
