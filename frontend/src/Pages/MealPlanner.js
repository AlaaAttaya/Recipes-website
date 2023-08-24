import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Recipe from "../Components/Recipe";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MealPlanner = () => {
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [user, setUser] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);
  const [showrecipes, setShowRecipes] = useState(false);
  const [recipeselected, setRecipeSelected] = useState(false);
  const [mealPlanData, setMealPlanData] = useState(null);

  const Date_Click_Fun = (date) => {
    setSelectedDate((prevSelectedDate) => {
      if (
        prevSelectedDate &&
        prevSelectedDate.toDateString() === date.toDateString()
      ) {
        return null;
      } else {
        return date;
      }
    });
  };
  const handleRecipeDeletion = async (dayId, recipeId) => {
    try {
      const response = await axios.delete(
        "http://127.0.0.1:8000/api/user/meal-plans/remove-recipe-from-day",
        {
          data: {
            meal_plan_id: user.data.meal_plans[0].id,
            day_id: dayId,
            recipe_id: recipeId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const message = response.data.message;
      console.log(message);
      window.location.reload();
    } catch (error) {
      console.error("Error removing recipe from day:", error);
    }
  };
  const addRecipeToDay = async (dayId, recipeId, mealType) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/meal-plans/add-recipe-to-day",
        {
          meal_plan_id: user.data.meal_plans[0].id,
          day_id: dayId,
          recipe_id: recipeId,
          meal_type: mealType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedDay = response.data;

      console.log("Recipe added to day:", updatedDay);
      window.location.reload();
    } catch (error) {
      console.error("Error adding recipe to day:", error);
    }
  };
  const addDayToMealPlan = async (date, recipe_id, meal_type) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/meal-plans/add-day",
        {
          meal_plan_id: user.data.meal_plans[0].id,
          date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const newDay = response.data.day;
      console.log("datesent", date);
      console.log("newDay", newDay);
      addRecipeToDay(newDay.id, recipe_id, meal_type);
      console.log("New day added:", newDay);
    } catch (error) {
      console.error("Error adding day to meal plan:", error);
    }
  };
  const handleRecipeButtonClick = (recipe) => {
    setRecipeSelected(recipe);
    closeSearchRecipes();
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
      setMealPlanData(userData.data.meal_plans[0]);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSearch = async (value) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/user/searchbyname?name=${value}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const recipes = response.data.recipes.data;
      setUserRecipes(recipes);
    } catch (error) {
      console.error("Error searching by name:", error);
    }
  };
  const handleshowRecipes = () => {
    setShowRecipes(true);
  };
  const closeSearchRecipes = () => {
    setShowRecipes(false);
  };
  const Event_Data_Update = (event) => {
    setEventName(event.target.value);
  };

  const Create_Event_Fun = () => {
    if (selectedDate && eventName && recipeselected) {
      addDayToMealPlan(selectedDate, recipeselected.id, eventName);

      setSelectedDate(null);
      setEventName("");

      setRecipeSelected(null);
    }
  };

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
      <Navbar onBurgerClick={handleBurgerClick} pagename="My Meal Planner" />

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
      <div className="meal-planner-container">
        <div className="app">
          <div className="container">
            <div className="calendar-container">
              <Calendar
                value={selectedDate}
                onClickDay={Date_Click_Fun}
                tileClassName={({ date }) =>
                  selectedDate &&
                  date.toDateString() === selectedDate.toDateString()
                    ? "selected"
                    : events.find(
                        (event) =>
                          event.date.toDateString() === date.toDateString()
                      )
                    ? "event-marked"
                    : mealPlanData &&
                      mealPlanData.days &&
                      mealPlanData.days.some(
                        (day) =>
                          new Date(day.date).toDateString() ===
                          date.toDateString()
                      )
                    ? "meal-plan-day"
                    : ""
                }
              />
            </div>
            <div className="event-container">
              {selectedDate && (
                <div className="event-form">
                  <h2> Create Meal Plan </h2>
                  <p> Selected Date: {selectedDate.toDateString()} </p>
                  <label htmlFor="mealtype">Meal Type</label>
                  <input
                    name="mealtype"
                    type="text"
                    placeholder="Meal Type"
                    value={eventName}
                    onChange={Event_Data_Update}
                    className="event-input"
                  />
                  {recipeselected && (
                    <div style={{ pointerEvents: "none" }}>
                      {console.log("thisisitss", recipeselected)}
                      <Recipe
                        recipe={recipeselected}
                        user={recipeselected.user}
                        viewer={recipeselected.user}
                      />
                    </div>
                  )}
                  <br></br>
                  <button
                    type="button"
                    className="create-btn-event"
                    onClick={handleshowRecipes}
                  >
                    Pick Meal
                  </button>
                  <button
                    className="create-btn-event"
                    onClick={Create_Event_Fun}
                    style={{ marginLeft: "10px" }}
                  >
                    ADD
                  </button>
                  <br></br>
                </div>
              )}
              {selectedDate && mealPlanData && mealPlanData.days && (
                <div className="event-list">
                  <h2> My Meal Plans</h2>
                  <div className="event-cards">
                    {mealPlanData.days.map((day) =>
                      new Date(day.date).toDateString() ===
                      selectedDate.toDateString() ? (
                        <div key={day.id} className="event-card">
                          <div className="event-card-header">
                            <div className="event-actions">
                              {day.recipes.map((recipe, index) => (
                                <>
                                  <br></br>
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Meal Type: &nbsp;
                                    {recipe.pivot.meal_type}
                                  </span>
                                  <Recipe
                                    key={index}
                                    recipe={recipe}
                                    user={recipe.user}
                                    viewer={user}
                                  />
                                  <button
                                    key={recipe.id}
                                    className="delete-btn-event"
                                    onClick={() =>
                                      handleRecipeDeletion(day.id, recipe.id)
                                    }
                                  >
                                    Delete Recipe
                                  </button>
                                </>
                              ))}
                            </div>
                          </div>
                          <div className="event-card-body">
                            {day.recipes.map((recipe) => (
                              <p key={recipe.id} className="event-title">
                                {recipe.title}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
            {showrecipes && (
              <div className="search-recipes">
                <div className="search-recipes-container">
                  <button
                    className="burger-close-btn"
                    onClick={closeSearchRecipes}
                  >
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
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <div className="Searchrecipes">
                    <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                        onKeyUp={(e) => handleSearch(e.target.value)}
                      />
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
                        className="search-icon"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    {userRecipes.map((recipe, index) => (
                      <button
                        onClick={() => handleRecipeButtonClick(recipe)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        value={recipe}
                      >
                        <Recipe
                          key={index}
                          recipe={recipe}
                          user={recipe.user}
                          viewer={user}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
