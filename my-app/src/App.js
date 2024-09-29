import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import Home from "./pages/Home";
import UserCheck from "./pages/UserCheck";
import Register from "./pages/Registration";
import axios from "axios";
import "./App.css";


function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api")
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <UserProvider>
      <div className="App">
        <nav>
          <div className="Banner">
            <ul>
              <p>
                <Link to="/">Home</Link>
              </p>
              <li>&nbsp;</li>
              <p>
                <Link to="/user-check">UserCheck</Link>
              </p>
              <li>&nbsp;</li>
              <p>
                <Link to="/Registration">Register</Link>
              </p>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/user-check" element={<UserCheck />} />
          <Route path="/Registration" element={<Register />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
