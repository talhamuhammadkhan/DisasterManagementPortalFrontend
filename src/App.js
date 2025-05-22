import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import AdminHome from "./components/AdminHome";
import VolunteerHome from "./volunteer/VolunteerHome";
import OrgHome from "./org/OrgHome";
import Title from "./components/Title";
import SignUp from "./components/SignUp";

const App = () => {
  const [user, setUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false); // State for toggle between login and signup

  // Load user data from localStorage when the app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Set user from localStorage if found
    }
  }, []);
  
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div>
      <Title />
      {!user ? (
        isSigningUp ? (
          <>
            <SignUp setUser={setUser} setIsSigningUp={setIsSigningUp}/>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSigningUp(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Login
                </button>
              </p>
            </div>

          </>
        ) : (
          <>
            <Login setUser={setUser} />
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSigningUp(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    textDecoration: "underline",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </>
        )
      ) : user.role === "ADMIN" ? (
        <AdminHome user={user} onLogout={handleLogout} />
      ) : user.role === "VOLUNTEER" ? (
        <VolunteerHome user={user} setUser={setUser} onLogout={handleLogout} />
      ) : user.role === "ORG" ? (
        <OrgHome user={user} setUser={setUser} onLogout={handleLogout} />
      ) : null}
    </div>
  );
};

export default App;
