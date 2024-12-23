import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // const isHomePage = location.pathname === "/";

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <img src="/Images/logo.png" alt="Logo" />
      </Link>

      {location.pathname === "/" && (
        <div className="search-box">
          <i className="bx bx-search"></i>
          <form action="">
            <input type="text" placeholder="Search" />
          </form>
        </div>
      )}

      {/* Buttons */}
      <div className="buttons-action">
        <button className="write-btn">
          <i className="bx bx-pen"></i>
          Write
        </button>

        {isAuthenticated ? (
          <>
            {/* Logout Button */}
            <button className="logout-btn" onClick={handleLogout}>
              <i className="bx bx-log-out"></i>
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Sign In and Sign Up Buttons */}
            <div className="authentication-button">
              <Link className="signIn-btn" to="/signin">
                Sign In
              </Link>
              <Link className="signUp-btn" to="/signup">
                Sign Up
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
