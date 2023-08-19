import React, { useState } from "react";
import "../styles/styles.css";
import Avatar from "./Avatar";

const Users = () => {
  return (
    <div className="homepage-profilediv">
      <Avatar
        image={require("../assets/images/profilepic.png").default}
        namito="HomePage-Profilepic"
      />
      <div className="userfullname-div">
        <label className="username-label">username</label>
        <label className="fullname-label">fullname</label>
      </div>
      <div className="followbtn-div">
        <button className="followbtn">Follow</button>
      </div>
    </div>
  );
};
export default Users;
