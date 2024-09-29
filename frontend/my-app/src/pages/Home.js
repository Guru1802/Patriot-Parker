import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../components/UserContext";
import banner from "../images/logo.png";
import Modal from "../components/Modal";
import "./Home.css";
import axios from "axios";

function Home() {
  const { setUser } = useContext(UserContext);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [error, errorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loginAuth, setLoginAuth] = useState(false);
  const navigate = useNavigate();

  const handleUserIDChange = (e) => {
    setUserID(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit1 = () => {
    console.log("UserID Submitted:", userID);
  };

  const handleSubmit2 = () => {
    console.log("Password Submitted:", password);
  };

  const handleLogin = async () => {
    if (userID.trim() === "" || password.trim() === "") {
      errorMessage("Username and/or password found empty...");
      setShowModal(true);
      return;
    }

    //comment this out when we have try-catch working with backend...
    // errorMessage("");
    // handleSubmit1();
    // handleSubmit2();
    // setUser(userID);
    // setLoginAuth(true);
    try {
      const response = await axios.post('/api/login', {userID, password});
      if (response.data.success) {
        errorMessage('');
        handleSubmit1();
        handleSubmit2();
        setLoginAuth(true);
      } else {
        errorMessage('Invalid username or password.');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage('Something went wrong. Please try again.');
      setShowModal(true);
    }
  };

  const handleRegister = () => {
    navigate("/Registration");
  };

  const handleClearBoxes = () => {
    setUserID("");
    setPassword("");
  };

  const closeModal = () => {
    setShowModal(false);
    handleClearBoxes();
  };

  if (loginAuth) {
    return <Navigate to="/user-check" />;
  }

  return (
    <div className="home">
      <img src={banner} alt="PatriotParkingBanner"></img>
      <h1>Patriot Parker</h1>
      <p>Welcome to the Patriot Parker site!</p>
      <p>Please login using your credentials</p>
      <div className="user-input">
        <input
          type="text"
          value={userID}
          onChange={handleUserIDChange}
          placeholder="Enter username"
          className="input-field"
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password"
          className="input-field"
        />
        <button onClick={handleLogin} className="submit-button">
          Login
        </button>
        <button onClick={handleRegister} className="submit-button">
          Register
        </button>
      </div>
      <Modal show={showModal} message={error} onClose={closeModal} />
    </div>
  );
}

export default Home;
