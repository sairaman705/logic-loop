import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from "../App";

function Signin() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {setUserAuth} = useContext(UserContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save the token (optional, for further authenticated requests)
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name)
        console.log("name stored in lpcal storage", data.name);

        setUserAuth({
          access_token: data.token,
          user: data.userName,
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
            <label>Email</label>  
            <input
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
