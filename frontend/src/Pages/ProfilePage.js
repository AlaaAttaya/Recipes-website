import React, { useState } from "react";
import "../styles/styles.css";
import axios from "axios";
import Avatar from "../Components/Avatar";
import Navbar from "../Components/Navbar";
import PostProfile from "../Components/PostProfile";
import AddPost from "../Components/AddPost";

const ProfilePage = () => {
  if (!localStorage.getItem("token")) {
    window.location.replace("/");
  }
  const [isAddVisible, setIsAddVisible] = useState(false);

  const toggleAdd = () => {
    setIsAddVisible(!isAddVisible);
  };
  return <></>;
};

export default ProfilePage;
