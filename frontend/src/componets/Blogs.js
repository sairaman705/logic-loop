import React, { useEffect, useState } from "react";
import axios from "axios";
import Blog from "./Blog";
import config from "../config";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  const sendRequest = async () => {
    const res = await axios
      .get(`${config.BASE_URL}/api/blogs`)
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setBlogs(data.blogs);
      setFilteredBlogs(data.blogs); // Initially set filtered blogs to all blogs
    });
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    // Filter blogs based on the search query
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(query)
    );
    setFilteredBlogs(filtered);
  };

  return (
    <div>
      {/* Search Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>

      {/* Display Blogs */}
      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog, index) => (
          <Blog
            key={index}
            id={blog._id}
            isUser={localStorage.getItem("userId") === blog.user._id}
            title={blog.title}
            desc={blog.desc}
            img={blog.img}
            user={blog.user.name}
            date={new Date(blog.date).toLocaleDateString()}
          />
        ))
      ) : (
        <p>No blogs found matching the search criteria.</p>
      )}
    </div>
  );
};

export default Blogs;
