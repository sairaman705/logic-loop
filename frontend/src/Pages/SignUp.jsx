import React, { useState } from "react";
import axios from "axios";
import "./SignUp.css";

function SignUp({ setCurrentPage }) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!userName || !userEmail || !userPassword || !userImage) {
      alert("All fields are required, including the profile picture.");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("username", userName);
    formData.append("email", userEmail);
    formData.append("password", userPassword);
    formData.append("image", userImage);

    try {
      const response = await axios.post("http://localhost:8080/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("User registered successfully. SignIn");
      setCurrentPage("login"); // Redirect or handle login page
    } catch (error) {
      console.error(error);
      alert("Error in Registering. Please try again.");
    }
  };

  return (
    <div className="main-container">
      <h2>Sign Up</h2>
      <div className="form-container sign-up-page">
        <form onSubmit={handleSubmit} className="row">
          {/* Profile Image Upload */}
          <div className="image-upload">
            <label htmlFor="file-input">
              {previewImage ? (
                <img src={previewImage} alt="Profile" className="profile-pic" />
              ) : (
                <i className="bx bx-user-plus"></i>
              )}
            </label>
            <input
              id="file-input"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          {/* Username Input */}
          <div className="col">
            <label>Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="col">
            <label>Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="col">
            <label>Password</label>
            <input
              type="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="submit-btn">
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
