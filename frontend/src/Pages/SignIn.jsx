import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useSession} from "../UserAuth";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated } = useSession();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDetails = {
      username,
      password,
    };

    try {
      const response = await axios.post("http://localhost:8080/signin", userDetails);
      if (response.status === 200) {
        alert("Login successful");
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Error Details:", error);
      if (error.response) {
        console.log("Backend Error Response:", error.response.data);
        if (error.response.status === 401) {
          alert("Invalid username or password");
        } else {
          alert("Error during login: " + error.response.data);
        }
      } else {
        alert("Could not connect to the server. Please try again later.");
      }
    }
  };

  return (
    <div className="main-container">
      <h2>Sign In Page</h2>
      <div className="form-container login-page">
        <form className="row" onSubmit={handleSubmit}>
          <div className="col">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="col">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="submit-btn">
            <button>Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;