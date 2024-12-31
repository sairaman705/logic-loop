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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("tags", formData.tags);
    data.append("thumbnail", formData.thumbnail);

    try {
      const response = await axios.post("http://localhost:8080/add-blog", data, {
        withCredentials: true, // Include credentials if necessary
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Blog added successfully:", response.data);
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  const handleCancel = () => {
    navigate("/"); 
  };

  return (
    <div className="write-page">
      <h1>Write here</h1>
      <form className="write-container" onSubmit={handleSubmit}>
        <label>Thumbnail</label>
        <input type="file" name="thumbnail" onChange={handleFileChange} />

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
