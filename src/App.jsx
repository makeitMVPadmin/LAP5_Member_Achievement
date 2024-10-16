// Deps
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";

// Lib & Helpers
import {database} from "./config/firebase.js";
import {doc, getDoc} from "@firebase/firestore";

// Providers
import {usePoints} from "./PointsProvider.jsx";

// Components
import Header from "./components/Header/Header.jsx";
import Home from "./pages/HomePage/HomePage.jsx";
import ResourcePage from "./pages/ResourcePage/ResourcePage.jsx";
import RewardsPage from "./pages/RewardsPage/RewardsPage.jsx";
import BookMarkedPage from "./pages/BookMarkedPage/BookMarkedPage.jsx";
import ContributionsPage from "./pages/ContributionsPage/ContributionsPage.jsx";
import ResourceDetailCard from "./components/ResourceDetailCard/ResourceDetailCard.jsx";

const App = () => {
  const [currentUser, setCurrentUser] = useState({});
  const {points, handlePointsChange} = usePoints();

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        // Assuming you have a way to get the user ID, replace `userId` with actual user ID.
        const userId = "FkqIKqqKWQj7hB3MfdBq"; // Replace with actual user ID logic
        const userDoc = doc(database, "rf_Users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setCurrentUser({ id: userDoc.id, ...userSnapshot.data() });
        } else {
          // console.log("No such user!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);
  
  return (
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/resource"
                element={<ResourcePage currentUser={currentUser} />}
              >
                <Route path=":resourceId" element={<ResourceDetailCard currentUserId={currentUser.id} />} />
              </Route>
              <Route
                path="/bookmarked"
                element={
                  <BookMarkedPage currentUser={currentUser} />}
              >
                <Route path=":resourceId" element={<ResourceDetailCard currentUserId={currentUser.id} />} />
              </Route>
              <Route
                path="/rewards"
                element={
                  <RewardsPage
                    points={points}
                    onPointsChange={handlePointsChange}
                  />
                }
              />
              <Route
                path="/contributions"
                element={
                  <ContributionsPage
                    // onBookmarkUpdate={handleBookmarkUpdate}
                    currentUser={currentUser}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
  );
};
export default App;
