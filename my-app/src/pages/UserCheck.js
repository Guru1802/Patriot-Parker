import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import banner from "../images/logo.png";
import UserContext from "../components/UserContext";
import "./UserCheck.css";
import axios from "axios";

function UserCheck() {
  const { user, setUser } = useContext(UserContext);
  const [status, setStatus] = useState("Not checked in");
  const [userID, setUserID] = useState("");
  const [loginStatus, setLoginStatus] = useState("Logged in");
  const navigate = useNavigate();
  const [loginAuth, setLoginAuth] = useState(true);
  const [userPass, setUserPass] = useState("");
  const [userLot, setUserLot] = useState("");
  const [lots, setLots] = useState([
    //TEMP DATA, TODO: get lot info from backend
    // { name: "Lot P", pass: "g", size: 500, capacity: 1000 },
    // { name: "Lot O", pass: "g", size: 500, capacity: 1000 },
    // { name: "Lot M", pass: "g", size: 500, capacity: 1000 },
    // { name: "Lot I", pass: "r", size: 500, capacity: 1000 },
    // { name: "Lot PV", pass: "g", size: 500, capacity: 1000 },
    // { name: "Mason Pond", pass: "rv", size: 500, capacity: 1000 },
    // { name: "Lot J", pass: "r", size: 500, capacity: 1000 },
    // { name: "Lot K", pass: "g", size: 500, capacity: 1000 },
    // { name: "Lot L", pass: "g", size: 500, capacity: 1000 },
    // { name: "Lot A", pass: "g", size: 500, capacity: 1000 },
    // { name: "Lot C", pass: "g", size: 500, capacity: 1000 },
    // { name: "Lot R", pass: "r", size: 500, capacity: 1000 },
    // { name: "Shenandoah", pass: "rv", size: 500, capacity: 1000 },
    // { name: "Lot D", pass: "s", size: 500, capacity: 1000 },
    // { name: "Rappahannock", pass: "rgvs", size: 500, capacity: 1000 }
  ]);

  const handleGetLots = async () => {
    try {
      const response = await axios.post("/api/get-lots");
      setLots(response.data);
    } catch (error) {
      console.error("lots error:", error);
    }
  };

  const handleGetUserLot = async () => {
    try {
      const response = await axios.post("/api/get-user-pass", { userID });
      setUserPass(response.data);
    } catch (error) {
      console.error("lots error:", error);
    }
  };

  const handleCheckIn = () => {
    if (userLot !== "") {
      // setStatus("Checked in to " + userLot);

      axios
        .post("/api/check-in", { user, userLot })
        .then((response) => {
          console.log("pls check in..", response.data);
          setStatus("Checked in to " + userLot);
        })
        .catch((error) => {
          console.error("error with checkin", error);
        });
    }
  };

  const handleCheckOut = () => {
    // setStatus("Not checked in");
    // setUserLot("")

    axios
      .post("/api/check-out", { user, userLot })
      .then((response) => {
        console.log("pls check out..", response.data);
        setStatus("Not checked in");
        setUserLot("");
      })
      .catch((error) => {
        console.error("error with checkout", error);
      });
  };

  const handleLogout = () => {
    setUser(null);
    setLoginStatus("Logged out");
    setLoginAuth(false);
    navigate("/");
  };

  return (
    <div className="user-check">
      <img src={banner} alt="PatriotParkingBanner"></img>
      <h1>Patriot Parker</h1>
      <p>Hello, {user}!</p>
      <p>Please select your parking operation.</p>
      {status === "Not checked in" && (
        <div className="parking-options">
          {handleGetLots}
          {lots.map(
            (lot) =>
              lot.size < lot.capacity &&
              lot.pass.includes(userPass) && (
                <ul key={lot.key}>
                  <input type="radio" onChange={() => setUserLot(lot.name)} />
                  {lot.name + " : " + lot.size + " out of " + lot.capacity}
                </ul>
              )
          )}
        </div>
      )}
      <div className="user-choice">
        <p>Parking Status: {status}</p>
        <div className="button-container">
          {status === "Not checked in" && (
            <button onClick={handleCheckIn} className="check-button">
              Check-In
            </button>
          )}
          {status !== "Not checked in" && (
            <button onClick={handleCheckOut} className="check-button">
              Check-Out
            </button>
          )}

          <button onClick={handleLogout} className="check-button">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCheck;
