import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create context
const userAuth = createContext();

// SessionProvider to manage authentication state
export const SessionProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to prevent rendering before session check

  // Check session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await axios.get("http://localhost:8080/check-session", {
          withCredentials: true, // Include cookies with requests
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.log("Session error: ", error);
        setIsAuthenticated(false); // Set as not authenticated if there's an error
      } finally {
        setLoading(false); // Set loading to false after the check is complete
      }
    };
    initializeSession();
  }, []);


  return (
    <userAuth.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {!loading && children} {/* Render children only after loading is complete */}
    </userAuth.Provider>
  );
};

// Custom hook to access session data
export const useSession = () => useContext(userAuth);
