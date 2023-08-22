import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import Avatar from "./Avatar";

const Navbar = ({ onBurgerClick, pagename }) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [burgermenuOpen, setburgermenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };
  const handleHome = () => {
    window.location.replace("/Home");
  };

  const handleProfile = () => {
    window.location.replace("/Profile");
  };

  const handleBurgerClick = () => {
    setburgermenuOpen(!burgermenuOpen);
    onBurgerClick();
  };

  const handleAvatarClick = () => {
    setMenuOpen(!menuOpen);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await response.json();

      setUser(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="navbar-container">
      <div className="burger-icon" onClick={handleBurgerClick}>
        <div className="burger-line" />
        <div className="burger-line" />
        <div className="burger-line" />
      </div>
      <div className="logo-container">
        <span
          className="logo-text"
          onClick={handleHome}
          style={{ cursor: "pointer" }}
        >
          RECIPE REALM<br></br>
        </span>
        <span className="logo-text" style={{ fontSize: "18px" }}>
          {pagename}
        </span>
      </div>
      <div className="navbar-menu">
        {user && (
          <div className="dropdown" onClick={handleAvatarClick}>
            <Avatar
              classnaming="navbar-img"
              image={`http://127.0.0.1:8000${user.data.image}`}
            />
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={handleProfile} className="btn-dropdown">
                  Settings
                </button>
                <button onClick={handleLogout} className="btn-dropdown">
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
