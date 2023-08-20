import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import Avatar from "./Avatar";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  const handleDropdownClick = () => {
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
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="navbar-container">
      <div className="logo-container">
        <span className="logo-text">RECIPE REALM</span>
      </div>
      <div className="navbar-menu">
        {user && (
          <div className="dropdown" onClick={handleDropdownClick}>
            <Avatar
              classnaming="navbar-img"
              image={`http://127.0.0.1:8000${user.data.image}`}
            />
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick="" className="btn-dropdown">
                  Profile
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
