import React, { useState, useEffect } from "react";
import "../styles/styles.css";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Recipe from "../Components/Recipe";
const MyRecipe = () => {
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

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);

  const saveRecipe = async () => {
    try {
      const formData = new FormData();
      formData.append("name", recipeData.name);
      formData.append("cuisine", recipeData.cuisine);

      images.forEach((image) => {
        console.log(image);
        formData.append(`image_urls[]`, image);
      });

      const ingredientsAsStrings = ingredients.map((ingredient) =>
        JSON.stringify(ingredient)
      );

      ingredientsAsStrings.forEach((ingredient) => {
        formData.append("ingredients[]", ingredient);
      });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/createrecipe",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Recipe saved:", response.data);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };
  const addIngredientField = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleAddImage = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
    setCurrentImageIndex(0);
  };
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

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
      <Navbar onBurgerClick={handleBurgerClick} pagename="My Recipes" />

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
          <button className="burgerbuttons" onClick={toggleAddRecipe}>
            Add Recipe
          </button>
        </div>
      </div>
      {isAddRecipeOpen && (
        <div className="add-recipe-overlay">
          <div className="add-recipe-container">
            <button
              className="addrecipe-close-button"
              onClick={toggleAddRecipe}
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="form-group-container">
              <div className="form-group">
                <label htmlFor="recipeName" className="recipeNamelabel">
                  Name:
                </label>
                <input
                  type="text"
                  id="recipeName"
                  name="name"
                  placeholder="Enter recipe name"
                  onChange={(e) => handleInputChange(e, "name")}
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipeCuisine" className="recipeCuisinelabel">
                  Cuisine:
                </label>
                <input
                  type="text"
                  id="recipeCuisine"
                  name="cuisine"
                  placeholder="Enter cuisine"
                  onChange={(e) => handleInputChange(e, "cuisine")}
                />
              </div>

              <div className="recipe-images">
                <div className="recipe-images-container">
                  {images.length > 0 ? (
                    <img
                      src={URL.createObjectURL(images[currentImageIndex])}
                      alt={`Recipe ${currentImageIndex}`}
                    />
                  ) : (
                    <label style={{ marginLeft: "0px" }}>No Images</label>
                  )}
                </div>
                <div className="image-navigation">
                  <button className="image-nav-button" onClick={prevImage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button className="image-nav-button" onClick={nextImage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="form-group form-group-images">
                <label htmlFor="recipeImages" style={{ marginRight: "10px" }}>
                  Images:
                </label>
                <input
                  type="file"
                  id="recipeImages"
                  name="images"
                  multiple
                  accept="image/*"
                  style={{ color: "white", backgroundColor: "#ff3e3e" }}
                  onChange={handleAddImage}
                />
              </div>

              <div className="form-group">
                <label htmlFor="recipeIngredients">Ingredients:</label>
                <div>
                  {ingredients.map((ingredient, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        placeholder={`Ingredient ${index + 1}`}
                        value={ingredient.name}
                        onChange={(e) =>
                          handleIngredientChange(index, "name", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={(e) =>
                          handleIngredientChange(
                            index,
                            "amount",
                            e.target.value
                          )
                        }
                      />
                      <button
                        type="button"
                        className="button-ingredient removebutton"
                        onClick={() => removeIngredient(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="button-ingredient"
                    onClick={addIngredientField}
                  >
                    Add Ingredient
                  </button>
                </div>
              </div>
              <div className="form-group" style={{ marginLeft: "10px" }}>
                <button
                  type="button"
                  className="button-ingredient"
                  onClick={saveRecipe}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="recipes-container">
        <button onClick={toggleAddRecipe} className="add-recipe">
          Add Recipe
        </button>
        {userRecipes.map((recipe, index) => (
          <Recipe key={index} recipe={recipe} user={user} />
        ))}
      </div>
    </div>
  );
};
export default MyRecipe;
