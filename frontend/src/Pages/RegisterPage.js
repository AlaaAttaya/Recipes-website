import React, { useState } from "react";
import "../styles/styles.css";
import axios from "axios";

const RegisterPage = () => {
  if (localStorage.getItem("token")) {
    window.location.replace("/Home");
  }
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", fullName);
    formData.append("username", username);
    formData.append("password", password);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post("http://127.0.0.1:8000/api/guest/register", formData, config)
      .then((response) => {
        console.log("Registration successful:", response.data);
        const token = response.data.data.token;
        localStorage.setItem("token", token);
        window.location.replace("/Home");
      })
      .catch(() => {
        setErrorMessage("Invalid fields");
      });
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <img
          src={require("../assets/images/RECIPEREALM.svg").default}
          alt="REACTREALM"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </label>
        <button onClick={handleRegister}>Sign up</button>
      </div>
      <div className="login-link">
        Have an account? <a href="/">Log in</a>
      </div>
    </div>
  );
};

export default RegisterPage;
