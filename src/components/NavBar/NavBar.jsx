import trophyIcon from "../../assets/icons/nav-trophy.png";
import uploadIcon2 from "../../assets/icons/nav-folder.png";
import savedIcon from "../../assets/icons/nav-bookmark.png";
import libraryIcon from "../../assets/icons/nav-library.png";
import arrowDownIcon from "../../assets/icons/arrow-down.png";
import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SubmissionDrawer from "../../components/SubmissionForm/SubmissionDrawer";
import { SettingsIcon } from "@chakra-ui/icons";
import "./NavBar.scss";
import FilterDrawer from "../FilterDrawer/FilterDrawer";

export default function NavBar({
  onCategoryChange,
  onFormSubmit,
  onFilterChange,
  currentUser,
}) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  // const [isSortingOpen, setIsSortingOpen] = useState(false);
  const [category, setCategory] = useState("All");
  // const [types, setTypes] = useState([]);
  // const [skill, setSkill] = useState('');
  // const [tag, setTags] = useState('')

  const location = useLocation();
  const navigate = useNavigate();

  const toggleLibraryMenu = () => {
    if (typeof onCategoryChange === "function") {
      onCategoryChange(category);
    }
    setCategory("All");
    setIsLibraryOpen(!isLibraryOpen);
  };

  const handleMouseEnter = () => {
    setIsLibraryOpen(true);
  };

  const handleSelectCategory = (category) => {
    if (location.pathname !== "/resource") {
      navigate("/resource");
    }
    if (typeof onCategoryChange === "function") {
      onCategoryChange(category);
    }

    setCategory(category);
  };

  // old code blow

  // const handleSelectType = (type) => {
  //   if (location.pathname !== "/resource") {
  //     navigate("/resource");
  //   }
  //   const currentTypes = types.includes(type)
  //     ? types.filter(t => t !== type) : [...types, type]

  //   if (typeof onTypeChange === 'function') {
  //     onTypeChange(currentTypes);
  //   }

  //   setTypes(currentTypes);
  // }

  // const handleSortSkill = () => {
  //   if (typeof sortBySkill === "function") {
  //     sortBySkill();
  //   }
  // }

  // const handleSortDuration = () => {
  //   if (typeof sortByDuration === "function") {
  //     sortByDuration();
  //   }
  // }

  // old code above

  const checkLocation = () => {
    if (location.pathname !== "/resource") {
      navigate("/resource");
    }
  };

  return (
    <nav className="nav__list">
      <li
        className={`nav__item nav__item-first ${isLibraryOpen ? "active" : ""}`}
        onClick={toggleLibraryMenu}
        // onMouseEnter={handleMouseEnter}
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
        {/* <ul className="nav__sorting">
          <p className="nav__item-name">Sorting Options</p>
          <li className="nav__sorting-item nav__sorting-types">
            <p className="nav__sorting-type">Type</p>
            <div>
              <input id="article" type="checkbox" className={`nav__sorting-checkbox ${types.includes("Article") ? "active" : ""}`} onClick={() => handleSelectType("Article")} />
              <label htmlFor="article" className="nav__sorting-subitem">Article</label>
            </div>
            <div>
              <input id="blog" type="checkbox" className={`nav__sorting-checkbox ${types.includes("Blog") ? "active" : ""}`} onClick={() => handleSelectType("Blog")} />
              <label htmlFor="blog" className="nav__sorting-subitem">Blog</label>
            </div>
            <div>
              <input id="course" type="checkbox" className={`nav__sorting-checkbox ${types.includes("Course") ? "active" : ""}`} onClick={() => handleSelectType("Course")} />
              <label htmlFor="course" className="nav__sorting-subitem">Course</label>
            </div>
            <div>
              <input id="quiz" type="checkbox" className={`nav__sorting-checkbox ${types.includes("Quiz") ? "active" : ""}`} onClick={() => handleSelectType("Quiz")} />
              <label htmlFor="quiz" className="nav__sorting-subitem">Quiz</label>
            </div>
            <div>
              <input id="video" type="checkbox" className={`nav__sorting-checkbox ${types.includes("Video") ? "active" : ""}`} onClick={() => handleSelectType("Video")} />
              <label htmlFor="video" className="nav__sorting-subitem">Video</label>
            </div>
          </li>
          <li className="nav__sorting-item">
            <p className="nav__library-subitem" onClick={handleSortSkill}>Skill</p>
          </li>
          <li className="nav__sorting-item">
            <p className="nav__library-subitem" onClick={handleSortDuration}>Duration</p>
          </li>
        </ul> */}
        {/* <div className="nav__item">
          <FilterDrawer onFilterChange={onFilterChange} />
        </div> */}
      </div>

      <div className="nav__container-bottom">
        {/* replace button with submission drawer to connect  */}
        {/* <button className="nav__button">
          <img src={uploadIcon} alt="upload file icon" className="nav__icon" />
          <p className="nav__button-name">Upload Resource</p>
        </button> */}
        <SubmissionDrawer
          onFormSubmit={onFormSubmit}
          currentUser={currentUser}
        />
      </div>
    </nav>
  );
}
