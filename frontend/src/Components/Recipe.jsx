import React, { useState } from "react";
import Avatar from "./Avatar";
import "../styles/styles.css";

import axios from "axios";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

const RecipeCard = ({ recipe, user, viewer, is_shoppingList }) => {
  const {
    name,
    cuisine,
    ingredients,
    images,
    likes_count,
    comments_count,
    user_liked,
  } = recipe;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [is_user_liked, setUserLiked] = useState(user_liked);
  const recipeUrl = `http://127.0.0.1:3000/Home`;
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(recipe.comments);
  const [displaylabel, setDisplayLabel] = useState("");
  console.log("viewer", viewer);
  const addComment = async () => {
    if (newComment.trim() === "") {
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/user/comment",
        {
          recipe_id: recipe.id,
          body: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newCommentObj = {
        body: newComment,
        user: {
          image:
            viewer.data &&
            viewer.data.image !== undefined &&
            viewer.data.image !== ""
              ? viewer.data.image
              : user.image,
          username:
            viewer.data && viewer.data.username !== undefined
              ? viewer.data.username
              : user.username,
        },
      };

      setComments((prevComments) => prevComments.concat(newCommentObj));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  const editRecipe = () => {};
  const addRecipeToShoppingList = async (recipeId, shoppingListId) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/user/shopping-lists/add-recipe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            recipe_id: recipeId,
            shopping_list_id: shoppingListId,
          }),
        }
      );

      const responseData = await response.json();
      setDisplayLabel(responseData.message + " ");
    } catch (error) {
      console.error("Error adding recipe to shopping list:", error);
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
      addRecipeToShoppingList(recipe.id, shopping_list_id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  };

  const RemovalShoppingList = async (shopping_list_id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/user/shopping-lists/remove-recipe?shopping_list_id=${shopping_list_id}&recipe_id=${recipe.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error removing recipe from shopping list:", error);
    }
  };

  const RemoveshoppingList = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const userData = await response.json();
      const shopping_list_id = userData.data.shopping_lists[0].id;
      RemovalShoppingList(shopping_list_id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      localStorage.removeItem("token");
      window.location.replace("/");
    }
  };

  const openShareMenu = () => {
    setShowShareMenu(true);
  };

  const closeShareMenu = () => {
    setShowShareMenu(false);
  };

  const handleLike = async () => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/user/like`,
        { recipe_id: recipe.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserLiked(true);
    } catch (error) {
      console.error("Error liking recipe:", error);
    }
  };
  const handleUnlike = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/user/unlike?recipe_id=${recipe.id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserLiked(false);
    } catch (error) {
      console.error("Error unliking recipe:", error);
    }
  };

  const removeRecipe = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/user/deleterecipe?recipe_id=${recipe.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error removing recipe:", error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  console.log("recipeee", images);
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
          <Avatar
            image={`http://127.0.0.1:8000${user.image}`}
            classnaming="recipepost-img"
          />
          <div className="username-wrapper">
            <span className="username">{user.username}</span>
            <span className="name">{user.name}</span>
          </div>
        </div>
        <div className="recipe-details">
          <hr style={{ marginRight: "10px" }}></hr>
          <h3 className="recipe-name">Name: {name}</h3>
          <h4 className="cuisine">Cuisine: {cuisine}</h4>

          <div className="recipe-images">
            <div className="recipe-images-container">
              {images.length > 0 ? (
                <img
                  src={`http://127.0.0.1:8000${images[currentImageIndex].image_url}`}
                  alt={`Recipe ${currentImageIndex}`}
                />
              ) : (
                <label style={{ marginLeft: "120px" }}>No Images</label>
              )}
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
            <div className="interaction-info">
              <span className="interactions-label"> {likes_count} Likes</span>
              <span className="interactions-label">
                {" "}
                {comments_count} Comments
              </span>
            </div>
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
              <li key={index}>
                {ingredient.name}: {ingredient.amount}
              </li>
            ))}
          </ul>

          {console.log("ingredients", ingredients)}
        </div>

        <div className="interactions">
          <button
            className="like-button"
            style={{ marginLeft: "10px" }}
            onClick={is_user_liked ? handleUnlike : handleLike}
          >
            <svg
              className="interaction-svg"
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill={is_user_liked ? "orange" : "none"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
                stroke={is_user_liked ? "orange" : "#fff"}
                strokeWidth="2"
              />
            </svg>
          </button>
          <button className="comment-button" onClick={toggleComments}>
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
          <button
            className="share-button"
            onClick={openShareMenu ? openShareMenu : closeShareMenu}
          >
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
        {showComments && (
          <div className="Comments">
            <h4>Comments</h4>

            <ul style={{ width: "80%", listStyleType: "none" }}>
              <li className="add-comment">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={addComment}>Send</button>
              </li>
              {comments.map((comment, index) => (
                <li className="comment" key={index}>
                  <img
                    src={`http://127.0.0.1:8000${comment.user.image}`}
                    style={{
                      width: "35px",
                      height: "35px",
                      marginBottom: "-5px",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ fontWeight: "bolder", fontSize: "20px" }}>
                    {comment.user.username}
                  </span>
                  :&nbsp;{comment.body}
                </li>
              ))}
            </ul>
          </div>
        )}
        {showShareMenu && (
          <div className="share-menu">
            <div className="share-menu-container">
              <div>
                <button className="burger-close-btn" onClick={closeShareMenu}>
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
                <div style={{ textAlign: "center", fontSize: "24px" }}>
                  Share
                </div>
              </div>
              <div className="buttons-share">
                <FacebookShareButton url={recipeUrl} onClick={closeShareMenu}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#039be5"
                      d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                    ></path>
                  </svg>
                </FacebookShareButton>
                <TwitterShareButton url={recipeUrl} onClick={closeShareMenu}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#03A9F4"
                      d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"
                    ></path>
                  </svg>
                </TwitterShareButton>
                <WhatsappShareButton url={recipeUrl} onClick={closeShareMenu}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#fff"
                      d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
                    ></path>
                    <path
                      fill="#cfd8dc"
                      d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
                    ></path>
                    <path
                      fill="#40c351"
                      d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                    ></path>
                    <path
                      fill="#fff"
                      fillRule="evenodd"
                      d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </WhatsappShareButton>
              </div>
            </div>
          </div>
        )}
        {viewer && viewer.id === recipe.user_id && (
          <button className="remove-button" onClick={removeRecipe}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-minus"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}
        {viewer && viewer.id === recipe.user_id && (
          <button className="edit-button" onClick={editRecipe}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              fill="#fff"
            >
              <path d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"></path>
            </svg>
          </button>
        )}
      </div>
      {!is_shoppingList && (
        <button
          className="shoppinglist-button"
          title="Add To ShoppingList"
          onClick={shoppingList}
        >
          <span style={{ color: "white" }}>{displaylabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-shopping-bag"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>
      )}
      {is_shoppingList && (
        <button
          className="removeshoppinglist-button"
          title="Remove From ShoppingList"
          onClick={RemoveshoppingList}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-minus"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default RecipeCard;
