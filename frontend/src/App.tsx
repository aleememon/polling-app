import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/auth/NotFound";
import CreatePoll from "./pages/dashboard/CreatePoll";
import Analytics from "./pages/dashboard/Analytics";
import VotingForm from "./pages/public/VotingForm";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/dashboard/create",
      element: <CreatePoll />,
    },
    {
      path: "/dashboard/analytics/:id",
      element: <Analytics />
    },
    {
      path: "/poll/:id",
      element: <VotingForm />
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
