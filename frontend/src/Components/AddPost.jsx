import React, { useState } from "react";
import "../styles/styles.css";
import Avatar from "./Avatar";

const AddProfile = () => {
  return (
    <div className="post-wrapper">
      <div className="post-image">
        <img
          className=""
          src={require("../assets/images/RECIPEREALM.svg").default}
          alt="post_img"
          style={{ width: "300px", height: "300px" }}
        />
      </div>
    </div>
  );
};
export default AddProfile;
