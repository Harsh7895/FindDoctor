import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage.tsx";
import FindDoctorPage from "./FindDoctor.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/find-doctor" element={<FindDoctorPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
