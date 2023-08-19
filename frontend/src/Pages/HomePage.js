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
    <div className="home-body">
      <Navbar />
      <div className="home-content">
        <Post></Post>
      </div>
      <div className="home-profilelink">
        <div className="homepage-profilediv">
          <Avatar
            image={"../images/profilepic.png"}
            namito="HomePage-Profilepic"
          />
          <div className="userfullname-div">
            <label className="username-label">username</label>
            <label className="fullname-label">fullname</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
