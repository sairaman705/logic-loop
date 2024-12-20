import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status

  return (
    <Router>
      <Navbar currentPage={currentPage} />
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <div>Welcome to the Home Page</div>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Sign In Route */}
        <Route
          path="/signin"
          element={<SignIn setCurrentPage={setCurrentPage} setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Sign Up Route */}
        <Route
          path="/signup"
          element={<SignUp setCurrentPage={setCurrentPage} />}
        />

        {/* Catch-All Route for 404 */}
        <Route
          path="*"
          element={<div>404 - Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
