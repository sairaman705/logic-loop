import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

function SignUp() {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userImage, setUserImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const navigate = useNavigate();

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

        if (!userName || !userEmail || !userPassword) {
            alert("All fields are required, including the profile picture.");
            return;
        }

        const payload = {
            "name" : userName,
            "email": userEmail,
            "password" : userPassword
        };
        console.log("payload : ", payload);
        try {
            const response = await axios.post("http://localhost:8080/auth/signup", payload, {
                headers: { "Content-Type": "application/json" },
            });
            if (response.data.success) {
                alert(response.data.message);
                navigate("/signin");
            } else {
                alert(response.data.message || "Signup failed. Please try again.");
            }
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
                        />
                    </div>

                    <div className="col">
                        <label>Username</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                        <label>Email</label>
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col">
                        <label>Password</label>
                        <input
                            type="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="submit-btn">
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;