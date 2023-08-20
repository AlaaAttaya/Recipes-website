import React, { useState } from "react";
import "../styles/styles.css";
import axios from "axios";

const LoginPage = () => {
  if (localStorage.getItem("token")) {
    window.location.replace("/Home");
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    const formData = new FormData();
    formData.append("identifier", username);
    formData.append("password", password);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post("http://127.0.0.1:8000/api/guest/login", formData, config)
      .then((response) => {
        console.log("Registration successful:", response.data);
        const token = response.data.data.token;

        localStorage.setItem("token", token);
        window.location.replace("/Home");
      })
      .catch((error) => {
        console.error("Login failed:", error);
        if (
          (error.response && error.response.status === 500) ||
          (error.response && error.response.status === 401)
        ) {
          setErrorMessage("Invalid username or password");
        } else {
          setErrorMessage("Invalid fields");
        }
      });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img
          src={require("../assets/images/RECIPEREALM.svg").default}
          alt="REACTREALM"
        />
        <label className="login-label">Username</label>
        <input
          type="text"
          placeholder="Username or email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="login-label">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </label>
        <button onClick={handleLogin}>Log in</button>
      </div>
      <div className="signup-link">
        Don't have an account? <a href="/register">Sign up</a>
      </div>
    </div>
  );
};

export default LoginPage;
