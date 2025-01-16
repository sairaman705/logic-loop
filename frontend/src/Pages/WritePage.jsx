import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WritePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    thumbnail: null,
  });

  const navigate = useNavigate();

  // Check if the user is logged in (i.e., token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");  
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      thumbnail: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const authorName = localStorage.getItem("name");
    console.log("Retrieved name from localStorage:", authorName);
    console.log("Token:", token);
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    if (formData.thumbnail && !formData.thumbnail.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.description);
    data.append("tags", formData.tags.split(",").map(tag => tag.trim())); 
    data.append("thumbnail", formData.thumbnail);
    data.append("author", authorName);  
    data.append("date", new Date().toISOString());  

    try {
      const response = await axios.post("http://localhost:8080/auth/write", data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Blog added successfully!");
      navigate("/"); 
    } catch (error) {
      console.error("Error adding blog:", error.response?.data || error.message);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="write-page">
      <h1>Write a New Blog</h1>
      <form className="write-container" onSubmit={handleSubmit}>
        <label>Thumbnail (Image)</label>
        <input type="file" name="thumbnail" onChange={handleFileChange} required />

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        ></textarea>

        <label>Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
        />

        <div className="buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default WritePage;
