import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
axios.defaults.withCredentials = true;

let firstRender = true;

const Wellcome = () => {
  const [user, setUser] = useState();

  const refreshToken = async () => {
    const res = await axios
      .get("http://localhost:5000/api/refresh", { withCredentials: true })
      .catch((err) => console.log(err));
    const data = await res.data;
    return data;
  };

  const sendRequest = async () => {
    const res = await axios
      .get("http://localhost:5000/api/user", {
        withCredentials: true,
      })
      .catch((err) => console.log(err));
    const data = await res.data;
    console.log(data);
    return data;
  };
  useEffect(() => {
    if (firstRender) {
      firstRender = false;

      sendRequest().then((data) => setUser(data.user));
    }
    let interval = setInterval(() => {
      refreshToken().then((data) => setUser(data.user));
    }, 1000 * 5);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {user && (
        <Typography variant="h5" textAlign="center" fontWeight="600">
          Wellcome:<span style={{ fontWeight: "500" }}>{user.name}</span>{" "}
        </Typography>
      )}
    </div>
  );
};

export default Wellcome;
