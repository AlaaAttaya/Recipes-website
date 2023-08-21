import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Recipe from "../Components/Recipe";
const MyRecipe = () => {
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const handleBurgerClick = () => {
    setIsLeftDivOpen(!isLeftDivOpen);
  };

  const handleRecipe = () => {
    window.location.replace("/MyRecipes");
  };

  const handleHome = () => {
    window.location.replace("/Home");
  };

  const fetchUserRecipes = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user/getrecipes",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const recipes = response.data.recipes;
      const user = response.data.user;

      setUser(user);
      setUserRecipes(recipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  useEffect(() => {
    fetchUserRecipes();
  }, []);

  return (
    <div className="home-page">
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
          <button className="burgerbuttons" onClick={handleRecipe}>
            My Recipes
          </button>
        </div>
      </div>
      <div className="recipes-container">
        {userRecipes.map((recipe, index) => (
          <Recipe key={index} recipe={recipe} user={user} />
        ))}
      </div>
    </div>
  );
};
export default MyRecipe;
