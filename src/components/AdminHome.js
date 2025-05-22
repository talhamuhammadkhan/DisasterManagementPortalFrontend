import React from "react";

const AdminHome = ({ user, onLogout }) => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Welcome, {user.name}. This is your admin homepage.</h2>
      <button onClick={onLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Logout
      </button>
    </div>
  );
};

export default AdminHome;
