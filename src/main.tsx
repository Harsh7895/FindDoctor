import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from 'sonner';
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage.tsx";
import FindDoctorPage from "./pages/FindDoctor.tsx";
import LoginPage from "./pages/Login.tsx";
import SignupPage from "./pages/SignUp.tsx";
import UserProfile from "./pages/UserProfile.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/doctor/:id" element={<FindDoctorPage />} />
          <Route 
            path="/find-doctor" 
            element={
              <ProtectedRoute>
                <FindDoctorPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>
);
