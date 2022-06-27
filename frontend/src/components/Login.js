import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AuthActions } from "./../feature/AuthSlice";

const Login = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const sendRequest = async () => {
    const res = await axios
      .post("http://localhost:5000/api/login", {
        email: inputs.email,
        password: inputs.password,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    console.log(data);
    return data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest()
      .then(() => dispatch(AuthActions.logIn()))
      .then(() => history("/user"));
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box
        width={300}
        margin="0 auto"
        display="flex"
        flexDirection={"column"}
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h3">Login</Typography>

        <TextField
          type="email"
          value={inputs.email}
          onChange={handleChange}
          variant="outlined"
          placeholder="email"
          name="email"
          margin="normal"
        />
        <TextField
          type="password"
          value={inputs.password}
          onChange={handleChange}
          variant="outlined"
          placeholder="password"
          name="password"
          margin="normal"
        />
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Box>
    </form>
  );
};

export default Login;
