import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/public/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/auth/NotFound";
import CreatePoll from "./pages/dashboard/CreatePoll";
import Analytics from "./pages/dashboard/Analytics";
import VotingForm from "./pages/public/VotingForm";
import PublicPolls from "./pages/public/PublicPolls";
import ProtectedRoute from "./pages/protected-route-outlet/ProtectedRoute";
const router = createBrowserRouter([
  {
    // Public Access Paths
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
    path: "/poll/:id",
    element: <VotingForm />,
  },
  {
    path: "/public-polls",
    element: <PublicPolls />,
  },

  // 🛡️ Guard Gate Wrapper Layout
  {
    element: <ProtectedRoute />,
    children: [
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
        element: <Analytics />,
      },
    ],
  },

  // 404 Fallback Path Routing
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => {
  // Clear out the orphaned `<Routes>` wrappers and use the router provider config injection
  return (
    <>
      <RouterProvider router={router} />

      <Toaster theme="dark" position="bottom-right" closeButton richColors />
    </>
  );
};

export default App;
