import React, { useState } from "react";
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = new FormData();
  //   data.append("title", formData.title);
  //   data.append("content", formData.description);
  //   data.append("tags", formData.tags);
  //   data.append("thumbnail", formData.thumbnail);

  //   try {
  //     const response = await axios.post("http://localhost:8080/write", data, {
  //       withCredentials: true, // Include credentials if necessary
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token for authentication
  //       },
  //     });
  //     console.log("Blog added successfully:", response.data);
  //     navigate("/"); // Redirect to home page
  //   } catch (error) {
  //     console.error("Error adding blog:", error.response?.data || error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
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
    data.append("tags", formData.tags.split(",").map(tag => tag.trim())); // Convert tags to an array
    data.append("thumbnail", formData.thumbnail);
  
    try {
      const response = await axios.post("http://localhost:8080/write", data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      alert("Blog added successfully!");
      navigate("/"); // Redirect to home page
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
