import React, { useState } from "react";
import Avatar from "./Avatar";
import "../styles/styles.css";

const RecipeCard = ({ recipe }) => {
  const { user, name, cuisine, ingredients, images } = recipe;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="recipe-card">
      <div className="recipe-card-container">
        <div className="user-info">
          <Avatar image={user.avatar} classnaming="avatar" />
          <span className="username">{user.name}</span>
        </div>

        <div className="recipe-details">
          <h3 className="recipe-name">{name}</h3>
          <p className="cuisine">Cuisine: {cuisine}</p>

          <div className="recipe-images">
            <div className="recipe-images-container">
              <img
                src={images[currentImageIndex]}
                alt={`Recipe ${currentImageIndex}`}
              />
            </div>
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
        <div className="ingredients">
          <h4>Ingredients:</h4>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="interaction-info">
          <label className="likes-label"> 0 Likes</label>
        </div>
        <div className="interactions">
          <button className="like-button" style={{ marginLeft: "10px" }}>
            <svg
              className="interaction-svg"
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
                stroke="#fff"
                strokeWidth="2"
              />
            </svg>
          </button>
          <button className="comment-button">
            <svg
              fill="#ffffff"
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="interaction-svg"
            >
              <path d="M19,2H5A3,3,0,0,0,2,5V15a3,3,0,0,0,3,3H16.59l3.7,3.71A1,1,0,0,0,21,22a.84.84,0,0,0,.38-.08A1,1,0,0,0,22,21V5A3,3,0,0,0,19,2Zm1,16.59-2.29-2.3A1,1,0,0,0,17,16H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z" />
            </svg>
          </button>
          <button className="share-button">
            <svg
              width="25px"
              height="25px"
              viewBox="-0.5 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="interaction-svg"
            >
              <path
                d="M13.47 4.13998C12.74 4.35998 12.28 5.96 12.09 7.91C6.77997 7.91 2 13.4802 2 20.0802C4.19 14.0802 8.99995 12.45 12.14 12.45C12.34 14.21 12.79 15.6202 13.47 15.8202C15.57 16.4302 22 12.4401 22 9.98006C22 7.52006 15.57 3.52998 13.47 4.13998Z"
                stroke="#fff"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
