import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import MyRecipesPage from "./Pages/MyRecipes";
import ShoppingList from "./Pages/ShoppingList";
import MealPlanner from "./Pages/MealPlanner";
import "./styles/App.css";
import "./styles/styles.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/MealPlanner" element={<MealPlanner />} />
            <Route path="/ShoppingList" element={<ShoppingList />} />
            <Route path="/MyRecipes" element={<MyRecipesPage />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
