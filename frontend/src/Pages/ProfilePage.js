import React, { useState, useRef } from "react";
import "../styles/styles.css";
import axios from "axios";
import Avatar from "../Components/Avatar";
import Navbar from "../Components/Navbar";

const ProfilePage = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef();
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(false);

  const handleHome = () => {
    window.location.replace("/Home");
  };

  const handleBurgerClick = () => {
    setIsLeftDivOpen(!isLeftDivOpen);
  };

  const handleImageClick = () => {
    imageInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
      setImageFile(selectedImage);
    }
  };

  if (!localStorage.getItem("token")) {
    window.location.replace("/");
  }

  return (
    <>
      <div className="editProfile ">
        <Navbar onBurgerClick={handleBurgerClick} />
        <div
          className="burger-open-div"
          style={{ display: isLeftDivOpen ? "block" : "none" }}
        >
          <button className="burger-close-btn" onClick={handleBurgerClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="burgermenu-buttons-wrapper">
            <span className="logo-text burger-span" onClick={handleHome}>
              RECIPE REALM
            </span>
            <button className="burgerbuttons" onClick={handleHome}>
              {" "}
              Home{" "}
            </button>
            <button className="burgerbuttons">Shopping List</button>
            <button className="burgerbuttons">Meal Planner</button>
            <button className="burgerbuttons">My Recipes</button>
          </div>
        </div>
        <div className="profile-container-wrapper">
          <div className="profile-container">
            <div className="img-container">
              <div
                onClick={handleImageClick}
                style={{ cursor: "pointer", width: "150px" }}
              >
                <Avatar
                  image={image || require("../assets/images/profilepic.png")}
                  classnaming="circle-img"
                />
              </div>

              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none", cursor: "pointer" }}
              />
            </div>
            <label>Username</label>
            <input type="text" placeholder="UserName" style={{ height: 20 }} />
            <label>Name</label>
            <input type="text" placeholder="Name" style={{ height: 20 }} />
            <button>Save</button>

            <hr style={{ marginTop: "30px", marginBottom: "30px" }}></hr>
            <label>Old Password</label>
            <input
              type="password"
              placeholder="Old Password"
              style={{ height: 20 }}
            />
            <label>New Password</label>
            <input
              type="password"
              placeholder="New Password"
              style={{ height: 20 }}
            />
            <button>Save</button>
            <label className="error-message"></label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
