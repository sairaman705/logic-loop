import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Home from "./Pages/Home";

function App() {
  //const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Sign In Route */}
        <Route
          path="/signin"
          element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Sign Up Route */}
        <Route
          path="/signup"
          element={<SignUp />}
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