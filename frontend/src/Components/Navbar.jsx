import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useSession } from "../UserAuth";
import axios from "axios";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useSession();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:8080/check-session", {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking session:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, [setIsAuthenticated]);

  const handleLogout = async () => {
    if (!isAuthenticated) {
      console.log("No active session to log out");
      return;
    }

    try {
      await axios.post("http://localhost:8080/logout", null, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
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

      <div className="buttons-action">
        <button className="write-btn">
          <Link className="write" to="/write">
            <i className="bx bx-pen"></i>
            Write
          </Link>
        </button>
        {isAuthenticated ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="bx bx-log-out"></i>
              Logout
            </button>
          </>
        ) : (
          <div className="authentication-button">
            <Link className="signIn-btn" to="/signin">
              Sign In
            </Link>
            <Link className="signUp-btn" to="/signup">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
