import { Box, Button, TextField, Typography, Snackbar, Alert } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";
import config from "../config";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success"); // 'success' or 'error'
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const sendRequest = async (type = "login") => {
    try {
      const res = await axios.post(`${config.BASE_URL}/api/users/${type}`, {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
      });
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error(err.response?.data?.message || "Login Error, Please Try Aggain with Correct Details");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Input Validation
    if (isSignup && !inputs.name.trim()) {
      setMessage("Name is required for signup!");
      setSeverity("error");
      setOpen(true);
      return;
    }
    if (!inputs.email.trim()) {
      setMessage("Email is required!");
      setSeverity("error");
      setOpen(true);
      return;
    }
    if (!inputs.password.trim()) {
      setMessage("Password is required!");
      setSeverity("error");
      setOpen(true);
      return;
    }

    if (isSignup) {
      sendRequest("signup")
        .then((data) => {
          localStorage.setItem("userId", data.user._id);
          dispatch(authActions.login());
          setMessage("Signup successful!");
          setSeverity("success");
          setOpen(true);
          navigate("/login");
        })
        .catch((err) => {
          setMessage(err.message || "Signup failed!");
          setSeverity("error");
          setOpen(true);
        });
    } else {
      sendRequest()
        .then((data) => {
          localStorage.setItem("userId", data.user._id);
          dispatch(authActions.login());
          setMessage("Login successful!");
          setSeverity("success");
          setOpen(true);
          navigate("/blogs");
        })
        .catch((err) => {
          setMessage(err.message || "Login failed!");
          setSeverity("error");
          setOpen(true);
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          maxWidth={400}
          display="flex"
          flexDirection={"column"}
          alignItems="center"
          justifyContent={"center"}
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin="auto"
          marginTop={5}
          borderRadius={5}
        >
          <Typography variant="h2" padding={3} textAlign="center">
            {isSignup ? "Signup" : "Login"}
          </Typography>
          {isSignup && (
            <TextField
              name="name"
              onChange={handleChange}
              value={inputs.name}
              placeholder="Name"
              margin="normal"
              required
            />
          )}
          <TextField
            name="email"
            onChange={handleChange}
            value={inputs.email}
            type={"email"}
            placeholder="Email"
            margin="normal"
            required
          />
          <TextField
            name="password"
            onChange={handleChange}
            value={inputs.password}
            type={"password"}
            placeholder="Password"
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ borderRadius: 3, marginTop: 3 }}
            color="warning"
          >
            Submit
          </Button>
          <Button
            onClick={() => setIsSignup(!isSignup)}
            sx={{ borderRadius: 3, marginTop: 3 }}
          >
            Change To {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
      {/* Snackbar for Alerts */}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
