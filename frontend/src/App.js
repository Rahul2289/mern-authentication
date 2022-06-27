import React from "react";
import Header from "./components/Header";
import Login from "./components/Login";
import "./App.css";
import SignUp from "./components/SignUp";
import { Routes, Route } from "react-router-dom";
import Wellcome from "./components/Wellcome";
import { useSelector } from "react-redux";
const App = () => {
  const islogedIn = useSelector((state) => state.isLogedIn);
  console.log(islogedIn);
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user" element={<Wellcome />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
