import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../components/UserContext";
import banner from "../images/logo.png";
import Modal from "../components/Modal";
import "./Registration.css";
import axios from "axios";

const Registration = () => {
  const { setUser } = useContext(UserContext);
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [parkingPass, setParkingPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginAuth, setLoginAuth] = useState(false);
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const validateLicensePlate = (plateNumber) => {
    const plateCheck = /^[A-Za-z0-9]{1,8}$/;
    return plateCheck.test(plateNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userID || !password || !plateNumber || !parkingPass) {
      setErrorMessage("All fields are required");
      setSuccess("");
      return;
    }

    if (!validateLicensePlate(plateNumber)) {
      setErrorMessage("Invalid Plate Number");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post('/api/register', {userID, password, plateNumber, parkingPass});
      if (response.data.success) {
        errorMessage('');
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

    // Clear the form
    setUserID("");
    setPassword("");
    setPlateNumber("");
    setParkingPass("");
    setErrorMessage("");
    setSuccess("You have successfully registered!");
    navigate("/user-check");
  };

  const handleClearBoxes = () => {
    setUserID("");
    setPassword("");
  };

  const closeModal = () => {
    setShowModal(false);
    handleClearBoxes();
  };

  return (
    <div className="registration-container">
      <img src={banner} alt="PatriotParkingBanner" />
      <h2>Register</h2>
      <div className="border"></div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="plateNumber">Plate Number</label>
          <input
            type="text"
            id="plateNumber"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="parkingPass">Select Parking Pass</label>
          <select
            id="parkingPass"
            value={parkingPass}
            onChange={(e) => setParkingPass(e.target.value)}
            required
          >
            <option value="">Select an option</option>
            <option value="g">General</option>
            <option value="s">Staff</option>
            <option value="v">Visitor</option>
            <option value="r">Reserved</option>
          </select>
        </div>
        <Modal show={showModal} message={errorMessage} onClose={closeModal} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;
