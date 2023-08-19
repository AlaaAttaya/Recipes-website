import React, { useState, useEffect } from "react";
import axios from "axios";
import Avatar from "./Avatar";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/like-post/${postId}`,
        {},
        config
      );
      const newLikesCount = response.data.likes_count;
      const updatedPostsWithLike = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: newLikesCount,
          };
        } else {
          return post;
        }
      });

      setPosts(updatedPostsWithLike);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleUnlike = async (postId) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/user/unlike-post/${postId}`,
        {},
        config
      );
      const newLikesCount = response.data.likes_count;
      const updatedPostsWithLike = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes_count: newLikesCount,
          };
        } else {
          return post;
        }
      });
      setPosts(updatedPostsWithLike);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  useEffect(() => {
    const fetchPostsAndUserData = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/posts-for-following",
          config
        );
        const postsData = response.data.data;

        const updatedPosts = await Promise.all(
          postsData.map(async (post) => {
            try {
              const userResponse = await axios.get(
                `http://127.0.0.1:8000/api/user/search/${post.user_id}`,
                config
              );
              const user_data = userResponse.data.data;

              return {
                ...post,
                user_data,
              };
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
          })
        );

        fetchAllUserPosts(token, updatedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostsAndUserData();

    const fetchAllUserPosts = async (token, updatedPosts) => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/user/posts",
          config
        );
        const userPosts = response.data.data;

        const allPosts = [...updatedPosts, ...userPosts];
        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };
  }, []);

  return (
    <div>
      {posts.map((post, index) => (
        <div className="post-wrapper" key={index}>
          <div className="poster">
            <Avatar
              image={"http://127.0.0.1:8000" + post.user_data.image}
              namito="post-Profilepic"
            />
            <div className="userfullname-div">
              {post.user_data && (
                <>
                  <label className="username-label">
                    {post.user_data.username}
                  </label>
                  <label className="fullname-label">
                    {post.user_data.fullname}
                  </label>
                </>
              )}
            </div>
          </div>
          <div className="post-image">
            <img
              className=""
              src={"http://127.0.0.1:8000" + post.image_url}
              alt="post_img"
              style={{ width: "300px", height: "300px" }}
            />
          </div>
          <div className="likes">
            <a>
              <svg
                aria-label="Like"
                color="rgb(38, 38, 38)"
                fill="rgb(38, 38, 38)"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Like</title>
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
              </svg>
            </a>
            <label
              className="likecount"
              onClick={
                post.liked
                  ? () => handleUnlike(post.id)
                  : () => handleLike(post.id)
              }
            >
              {post.likes_count}
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
