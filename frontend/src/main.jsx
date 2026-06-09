import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./App.jsx";

import ApplicationDetails
  from "./pages/ApplicationDetails.jsx";

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/applications/:id"
          element={<ApplicationDetails />}
        />

      </Routes>

    </BrowserRouter>

  </StrictMode>

);
