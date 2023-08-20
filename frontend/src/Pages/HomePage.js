import React, { useState } from "react";
import "../styles/styles.css";
import axios from "axios";
import Avatar from "../Components/Avatar";
import Navbar from "../Components/Navbar";
import Post from "../Components/Post";

const HomePage = () => {
  if (!localStorage.getItem("token")) {
    window.location.replace("/");
  }
  return (
    <>
      <div className="home-body">
        <Navbar />
      </div>
    </>
  );
};

export default HomePage;
