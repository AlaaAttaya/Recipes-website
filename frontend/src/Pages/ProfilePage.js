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
  return (
    <>
      <div className="home-body">
        <Navbar />
        <div className="profilepage-div">
          <div className="profilepage-container">
            <div className="homepage-profilediv">
              <Avatar
                image={require("../assets/images/RECIPEREALM.svg").default}
                namito="ProfilePage-Profilepic"
              />
              <div className="userfullnameprofile-div">
                <label className="usernameprofile-label">username</label>
                <label className="fullnameprofile-label">fullname</label>
              </div>
              <div className="postsbtnprofile">
                <svg
                  aria-label=""
                  color="rgb(0, 0, 0)"
                  fill="rgb(0, 0, 0)"
                  height="12"
                  role="img"
                  viewBox="0 0 24 24"
                  width="12"
                >
                  <rect
                    fill="none"
                    height="18"
                    stroke="currentColor"
                    width="18"
                    x="3"
                    y="3"
                  ></rect>
                  <line
                    fill="none"
                    stroke="currentColor"
                    x1="9.015"
                    x2="9.015"
                    y1="3"
                    y2="21"
                  ></line>
                  <line
                    fill="none"
                    stroke="currentColor"
                    x1="14.985"
                    x2="14.985"
                    y1="3"
                    y2="21"
                  ></line>
                  <line
                    fill="none"
                    stroke="currentColor"
                    x1="21"
                    x2="3"
                    y1="9.015"
                    y2="9.015"
                  ></line>
                  <line
                    fill="none"
                    stroke="currentColor"
                    x1="21"
                    x2="3"
                    y1="14.985"
                    y2="14.985"
                  ></line>
                </svg>
                <label>&nbsp;Posts</label>
              </div>
              <div className="addpost">
                <button className="addbtn" onClick={toggleAdd}>
                  Add
                </button>
              </div>
            </div>

            <div>
              <div className="profilepageposts-add">
                {isAddVisible && (
                  <div>
                    <h1>Add Post</h1>
                    <AddPost />

                    <hr></hr>
                  </div>
                )}
              </div>
            </div>
            <div className="profilepageposts-container">
              <PostProfile />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
