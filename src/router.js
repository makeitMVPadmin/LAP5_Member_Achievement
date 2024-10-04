import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import ResourcePage from "./pages/ResourcePage/ResourcePage";
import BookMarkedPage from "./pages/BookMarkedPage/BookMarkedPage";
import ContributionsPage from "./pages/ContributionsPage/ContributionsPage";
import RewardsPage from "./pages/RewardsPage/RewardsPage";

function createAppRouter() {
  createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/home", //not sure here
          element: <HomePage />,
        },
        {
          path: "/resource",
          element: <ResourcePage />,
        },
        {
          path: "/contributions",
          element: <ContributionsPage />,
        },
        {
          path: "/bookmarked",
          element: <BookMarkedPage />,
        },
        {
          path: "/rewards",
          element: <RewardsPage />,
        },
      ],
    },
  ]);
}

export function AppRouter() {
  const router = createAppRouter();
  return <RouterProvider router={router} />;
}
