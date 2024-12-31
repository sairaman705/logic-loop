import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { SessionProvider } from "./UserAuth";
import Navbar from "./Components/Navbar";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import WritePage from "./WritePage";
import Home from "./Pages/Home";

function App() {
  const LocationBasedNavbar = ({ children }) => {
    const location = useLocation();
    return (
      <>
        {/* Render Navbar only if not on the Write page */}
        {location.pathname !== "/write" && <Navbar />}
        {children}
      </>
    );
  };

  return (
    <SessionProvider>
      <Router>
        <LocationBasedNavbar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/write" element={<WritePage />} />
            
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </LocationBasedNavbar>
      </Router>
    </SessionProvider>
  );
}

export default App;
