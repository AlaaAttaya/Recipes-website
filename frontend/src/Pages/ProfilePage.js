import React, { useState, useRef, useEffect } from "react";
import "../styles/styles.css";
import axios from "axios";
import Avatar from "../Components/Avatar";
import Navbar from "../Components/Navbar";

const ProfilePage = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef();
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgProfile, setErrorMsgProfile] = useState("");
  const [user, setUserProfile] = useState(null);

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

  const handleEditProfile = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/editprofile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setErrorMsgProfile("Success");
    } catch (error) {
      setErrorMsgProfile("Failed To Change Pic/Username/Name");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/changepassword",
        {
          oldpassword: oldPassword,
          newpassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const userData1 = await response.data;

      console.log(userData1);
      if (
        userData1.message ==
          "The newpassword field must be at least 8 characters." ||
        userData1.message == "Incorrect old password"
      ) {
        setErrorMsg("Failed To Change Password ");
      } else {
        setErrorMsg("Success");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Failed To Change  Password");
    }
  };

  if (!localStorage.getItem("token")) {
    window.location.replace("/");
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await response.json();

      setUserProfile(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);
  useEffect(() => {
    if (user) {
      setImage(`http://127.0.0.1:8000${user.data.image}`);
      setName(user.data.name);
      setUsername(user.data.username);
    }
  }, [user]);
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
            <input
              type="text"
              placeholder="Username"
              style={{ height: 20 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              style={{ height: 20 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="error-message">{errorMsgProfile}</label>
            <button onClick={handleEditProfile}>Save Profile</button>

            <hr style={{ marginTop: "30px", marginBottom: "30px" }}></hr>
            <label>Old Password</label>
            <input
              type="password"
              placeholder="Old Password"
              style={{ height: 20 }}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <label>New Password</label>
            <input
              type="password"
              placeholder="New Password"
              style={{ height: 20 }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleChangePassword}>Save Password</button>
            <label className="error-message">{errorMsg}</label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
