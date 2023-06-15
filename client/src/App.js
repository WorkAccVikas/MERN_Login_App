import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Todo : root routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Root Route</div>,
  },
  {
    path: "/register",
    element: <div>Register Route</div>,
  },
]);

function App() {
  return (
    <main>
      <RouterProvider router={router}/>
    </main>
  );
}

export default App;
