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
        // Make sure the correct URL is used for the backend server (http://localhost:8080)
        const response = await axios.get("http://localhost:8080/check-session", {
          withCredentials: true,  // Ensure cookies are sent with the request
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
    try {
      // Before calling logout, check if the user is authenticated
      const sessionResponse = await axios.get("http://localhost:8080/check-session", {
        withCredentials: true,
      });

      if (sessionResponse.data.isAuthenticated) {
        // If authenticated, proceed with logout
        const logoutResponse = await axios.post("http://localhost:8080/logout", {}, {
          withCredentials: true,  // Send the credentials with the logout request
        });
        console.log("Logout successful:", logoutResponse.data);
        setIsAuthenticated(false);  // Update authentication status
        navigate("/");  // Redirect to home page or login page after logout
      } else {
        console.log("No active session to log out");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/Images/logo1.jpg" alt="Logo" />
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
        <div className="write-btn">
          <Link className="write" to="/write">
            <i className="bx bx-pen"></i>
            <span>Write</span>
          </Link>
        </div>
        {isAuthenticated ? (
          <>
            <div className="logout-btn" onClick={handleLogout}>
              <i className="bx bx-log-out"></i>
              <span>Logout</span>
            </div>
          </>
        ) : (
          <div className="authentication-button">
            <div>
              <Link className="signIn-btn" to="/signin">
                <span>Sign In</span>
              </Link>
            </div>
            <div>
              <Link className="signUp-btn" to="/signup">
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
