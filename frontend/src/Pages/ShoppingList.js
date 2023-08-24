import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Recipe from "../Components/Recipe";
const ShoppingList = () => {
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);

  const [thisuser, setThisUser] = useState(null);

  const [shopping_list_id, setShoppingId] = useState(0);

  const getShoppingListRecipes = async (shoppingListId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/get-shopping-list?shopping_list_id=${shoppingListId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const responseData = await response.json();
      const recipes = responseData.recipes;

      console.log(recipes);

      setUserRecipes(recipes);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    }
  };
  const shoppingList = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await response.json();
      const shopping_list_id = userData.data.shopping_lists[0].id;
      setShoppingId(shopping_list_id);
      setThisUser(userData);
      getShoppingListRecipes(shopping_list_id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  };
  useEffect(() => {
    shoppingList();
  }, []);

  const handleBurgerClick = () => {
    setIsLeftDivOpen(!isLeftDivOpen);
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
      <Navbar onBurgerClick={handleBurgerClick} pagename="My Shopping List" />

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
        </div>
      </div>

      <div className="recipes-container">
        {userRecipes.map((recipe, index) => (
          <Recipe
            key={index}
            recipe={recipe}
            user={recipe.user}
            viewer={thisuser}
            is_shoppingList={true}
          />
        ))}
      </div>
    </div>
  );
};
export default ShoppingList;
