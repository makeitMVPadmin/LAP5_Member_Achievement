import "./HomePage.scss";
import Onboarding from "../../components/Onboarding/Onboarding";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import blueWaveImg from "../../assets/images/blue-wave.png";
import Instructions from "../../components/Instructions/Instructions";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); //
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [type, setType] = useState([]);
  const [activeResourceId, setActiveResourceId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // TODO: should be removed
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("hasSeenOnboardingModal");

    if (!hasSeenModal) {
      setIsModalOpen(true);
    } else {
      setOnboardingCompleted(true);
    }
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
    sessionStorage.setItem("hasSeenOnboardingModal", "true");
    setOnboardingCompleted(true);
  };

  // TODO: This is the form submission for "Upload Resource"
  const handleFormSubmit = (newResource) => {
    const updatedResources = [...resources, newResource];
    setResources(updatedResources);
    localStorage.setItem("resources", JSON.stringify(updatedResources));
    console.log("Updated Resources:", updatedResources);

    if (!selectedResource) {
      setSelectedResource(newResource);
      setActiveResourceId(newResource.id);
    }
  };

  const sortSkill = () => {
    setSortField("skill");
    setSortAscending(!sortAscending);
  };

  const sortDuration = () => {
    setSortField("duration");
    setSortAscending(!sortAscending);
  };

  return (
    <div className="homepage">
      <img
        className="homepage__img"
        src={blueWaveImg}
        alt="blue wave background"
      />
      <div className="resource__navbar-container">
        <NavBar
          onTypeChange={setType}
          onCategoryChange={setCategory} // TODO: Should be removed
          onFormSubmit={handleFormSubmit}
          sortBySkill={sortSkill}
          sortByDuration={sortDuration}
        />
      </div>
      <Onboarding
        isOpen={isModalOpen}
        onClose={handleModalClose}
        style={{
          transform: "translate(-50%, -50%)",
          width: "40rem",
        }}
      />
      <div>
        <h1 className="homepage__title">
          Welcome to the Communiti Resource Library
        </h1>
        <div>{onboardingCompleted && <Instructions />}</div>
      </div>
    </div>
  );
};

export default HomePage;
