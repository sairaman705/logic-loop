import React, { useState, useEffect } from "react";
import axios from "axios";
import Blogs from "./Blogs";
import DeleteButton from "./DeleteBlogs";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import config from "../config";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px auto",
    width: "80%",
  },
  blogContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  blogImage: {
    width: "100%",
    height: "auto",
    borderRadius: "10px",
    marginBottom: "10px",
  },
}));

const UserBlogs = () => {
  const classes = useStyles();
  const [user, setUser] = useState();
  const id = localStorage.getItem("userId");

  const sendRequest = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/user/${id}`);
      return res.data; // Only return data if the request is successful
    } catch (err) {
      console.error("Error fetching user blogs:", err);
      return null; // Return null if there's an error
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      if (data) {
        setUser(data.user); // Update state only if data exists
      }
    });
  }, []);

  const handleDelete = (blogId) => {
    axios
      .delete(`${config.BASE_URL}/api/blogs/${blogId}`)
      .then(() => {
        sendRequest().then((data) => {
          if (data) {
            setUser(data.user);
          }
        });
      })
      .catch((err) => console.error("Error deleting blog:", err));
  };

  return (
    <div className={classes.container}>
      {user && user.blogs && user.blogs.length > 0 ? (
        user.blogs.map((blog, index) => (
          <div key={index} className={classes.blogContainer}>
            <Blogs
              id={blog._id}
              isUser={true}
              title={blog.title}
              description={blog.description}
              imageURL={blog.image}
              userName={user.name}
            />
            <img
              className={classes.blogImage}
              src={blog.image}
              alt={blog.title}
            />
            <DeleteButton blogId={blog._id} onDelete={handleDelete} />
          </div>
        ))
      ) : (
        <Typography variant="h6" color="textSecondary">
          No blogs found for this user.
        </Typography>
      )}
    </div>
  );
};

export default UserBlogs;
