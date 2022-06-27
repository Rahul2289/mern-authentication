import React, { useState } from "react";
import { AppBar, Box, Toolbar, Typography, Tab, Tabs } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { AuthActions } from "./../feature/AuthSlice";
axios.defaults.withCredentials = true;
const Header = () => {
  const dispatch = useDispatch();
  const islogedIn = useSelector((state) => state.isLogedIn);
  const [value, setValue] = useState();

  const sendLogoutRequest = async () => {
    const res = await axios.post("http://localhost:5000/api/logout", {
      withCredentials: true,
    });
    if (res.status === 200) {
      return res;
    }
    return new Error("unable to logout");
  };

  const handleLogout = () => {
    sendLogoutRequest().then(() => dispatch(AuthActions.Logout()));
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Typography>mernAuth</Typography>
          <Box sx={{ marginLeft: "auto" }}>
            <Tabs
              indicatorColor="secondary"
              onChange={(e, val) => {
                setValue(val);
              }}
              value={value}
              textColor="inherit"
            >
              {!islogedIn && (
                <>
                  <Tab to="/login" LinkComponent={Link} label="Login" />
                  <Tab to="/signup" LinkComponent={Link} label="Signup" />{" "}
                </>
              )}
              {islogedIn && (
                <Tab
                  onClick={handleLogout}
                  to="/"
                  LinkComponent={Link}
                  label="Logout"
                />
              )}
            </Tabs>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default Header;
