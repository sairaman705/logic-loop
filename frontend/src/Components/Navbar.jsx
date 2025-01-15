import React, { useState, useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../App";
import "./Navbar.css";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState(false); // For dropdown menu
  const { userAuth, setUserAuth } = useContext(UserContext);

  const handleSignOut = () => {
    setUserAuth(null);
    sessionStorage.removeItem("userAuth");
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/Images/logo1.jpg" alt="Logo" />
        </Link>

        {/* Search Box */}
        <div
          className={`search-box ${
            searchBoxVisibility ? "visible" : "hidden"
          }`}
        >
          <input type="text" placeholder="Search" className="search-input" />
          <i className="bx bx-search"></i>
        </div>

        {/* Navbar Actions */}
        <div className="actions">
          {/* Search Button (for mobile) */}
          <button
            className="search-toggle"
            onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}
          >
            <i className="bx bx-search"></i>
          </button>

          {userAuth ? (
            // If the user is signed in
            <div className="user-menu">
              {/* User Profile Picture */}
              <div
                className="profile-pic"
                onClick={() => setMenuVisibility(!menuVisibility)}
              >
                {/* <img src="" alt="User" /> */}
                <i class='bx bx-user-circle'></i>
              </div>

              {/* Dropdown Menu */}
              {menuVisibility && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <Link to="/write" className="dropdown-item">
                    Write
                  </Link>
                  <Link to="/dashboard" className="dropdown-item">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="dropdown-item">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // If the user is not signed in
            <>
              <Link to="/write" className="write-link">
                <i className="bx bx-pen"></i>
                <p>Write</p>
              </Link>
              <Link to="/signin" className="btn-dark sign-in">
                Sign In
              </Link>
              <Link to="/signup" className="btn-dark sign-up">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
