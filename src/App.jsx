import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useEffect, useState} from "react";
import Header from "./components/Header/Header.jsx";
import Home from "./pages/HomePage/HomePage.jsx";
import ResourcePage from "./pages/ResourcePage/ResourcePage.jsx";
import RewardsPage from "./pages/RewardsPage/RewardsPage.jsx";
import BookMarkedPage from "./pages/BookMarkedPage/BookMarkedPage.jsx";
import ContributionsPage from "./pages/ContributionsPage/ContributionsPage.jsx";
import {database} from "./config/firebase.js";
import {doc, getDoc} from "@firebase/firestore";
import ResourceDetailCard from "./components/ResourceDetailCard/ResourceDetailCard.jsx";
import {usePoints} from "./PointsProvider.jsx";

const App = () => {
  const [savedBookmarks, setSavedBookmarks] = useState([]);
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

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setSavedBookmarks(bookmarks);
  }, []);

  const handleBookmarkUpdate = (updatedBookmarks) => {
    setSavedBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };
  
  return (
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/resource"
                element={
                  <ResourcePage
                    onBookmarkUpdate={handleBookmarkUpdate}
                    currentUser={currentUser}
                  />
                }
              >
                <Route
                  path=":resourceId"
                  element={<ResourceDetailCard currentUserId={currentUser.id} />}
                />
              </Route>
              
              <Route
                path="/bookmarked"
                element={
                  <BookMarkedPage
                    onBookmarkUpdate={handleBookmarkUpdate}
                    bookmarkedResources={savedBookmarks}
                    currentUser={currentUser}
                  />
                }
              />
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
                    onBookmarkUpdate={handleBookmarkUpdate}
                    currentUser={currentUser}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
  );
};
export default App;
