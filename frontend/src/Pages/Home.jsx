import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch blog posts from the backend
    axios.get('http://localhost:8080/')
      .then((response) => {
        console.log('Blog posts:', response.data); // Log the fetched blogs
        setBlogs(response.data);
      })
      .catch((error) => {
        console.error('Error fetching blog posts:', error);
      });
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {blogs.length === 0 ? (
        <p>No blog posts available</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="blog-post">
            <h2>{blog.title}</h2>
            <p>By {blog.author} | {blog.publishedDate}</p>
            <img src={`http://localhost:8080/uploads/${blog.image}`} alt={blog.title} width="300" />
            <p>{blog.content}</p>
            <p><strong>Category:</strong> {blog.category}</p>
            <p><strong>Tags:</strong> {blog.tags.join(', ')}</p>
            <div>
              <h3>Comments:</h3>
              {blog.comments.length > 0 ? (
                blog.comments.map((comment, index) => (
                  <div key={index}>
                    <p><strong>{comment.user}:</strong> {comment.comment}</p>
                    <p><em>{comment.date}</em></p>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
