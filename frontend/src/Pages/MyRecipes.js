import React, { useState, useRef, useEffect } from "react";
import "../styles/styles.css";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Recipe from "../Components/Recipe";
const MyRecipe = () => {
  const sampleRecipe = {
    user: {
      avatar: "user-avatar.jpg",
      name: "John Doe",
    },
    name: "Delicious Pasta",
    cuisine: "Italian",
    ingredients: ["Pasta", "Tomato Sauce", "Parmesan"],
    images: [
      require("../assets/images/profilepic.png"),
      require("../assets/images/RECIPEREALM.svg"),
    ],
  };

  return (
    <div className="home-page">
      <Recipe recipe={sampleRecipe} />
    </div>
  );
};
export default MyRecipe;
