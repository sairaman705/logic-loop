import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../App";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {setUserAuth} = useContext(UserContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Send username and password
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token (optional, for further authenticated requests)
        localStorage.setItem("token", data.token);
        setUserAuth({access_token: data.token,
          user: data.user,
        });
        // Redirect to the home page
        navigate("/");
      } else {
        setError(data.message || "Sign-in failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-container">
      <h2>Sign In Page</h2>
      <div className="form-container login-page">
        <form className="row" onSubmit={handleSignIn}>
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
            <button type="submit">Sign In</button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Signin;
