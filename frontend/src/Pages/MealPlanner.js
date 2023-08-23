import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Recipe from "../Components/Recipe";
const MealPlanner = () => {
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);

  const [recipeData, setRecipeData] = useState({
    name: "",
    cuisine: "",
    images: [],
    ingredients: [],
  });

  const handleBurgerClick = () => {
    setIsLeftDivOpen(!isLeftDivOpen);
  };
  const toggleAddRecipe = () => {
    setIsAddRecipeOpen(!isAddRecipeOpen);
  };
  const handleRecipe = () => {
    window.location.replace("/MyRecipes");
  };

  const handleHome = () => {
    window.location.replace("/Home");
  };
  const handleshoppingpage = () => {
    window.location.replace("/ShoppingList");
  };
  const handlemealplanner = () => {
    window.location.replace("/MealPlanner");
  };

  return (
    <div className="home-page">
      <Navbar onBurgerClick={handleBurgerClick} pagename="My MealPlanner" />

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
          <button className="burgerbuttons" onClick={handleshoppingpage}>
            Shopping List
          </button>
          <button className="burgerbuttons" onClick={handlemealplanner}>
            Meal Planner
          </button>
          <button className="burgerbuttons" onClick={handleRecipe}>
            My Recipes
          </button>
          <button className="burgerbuttons" onClick={toggleAddRecipe}>
            Add Recipe
          </button>
        </div>
      </div>

      <div className="recipes-container">
        {userRecipes.map((recipe, index) => (
          <Recipe key={index} recipe={recipe} user={user} viewer={user} />
        ))}
      </div>
    </div>
  );
};
export default MealPlanner;
