import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Todo : Import all components
import Username from "./components/Username";
import Register from "./components/Register";
import Password from "./components/Password";
import Profile from "./components/Profile";
import Recovery from "./components/Recovery";
import Reset from "./components/Reset";
import PageNotFound from "./components/PageNotFound";

// Todo : auth middleware
import { AuthorizeUser, ProtectRoute } from "./middleware/auth";

// Todo : root routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Username />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/password",
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },
  {
    path: "/recovery",
    element: (
      <ProtectRoute>
        <Recovery />
      </ProtectRoute>
    ),
  },
  {
    path: "/reset",
    element: (
      <ProtectRoute>
        <Reset />
      </ProtectRoute>
    ),
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
