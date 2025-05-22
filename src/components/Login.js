import React, { useState } from "react";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const user = await response.json();
      alert("Login successful!");
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        marginTop: "100px",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "5px",
        backgroundColor: "#f4f4f4",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h1>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "5px",
              textAlign: "left",
            }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "calc(100% - 20px)", // Ensure it has space from the edges
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px", width: "100%" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "5px",
              textAlign: "left",
            }}
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "calc(100% - 20px)", // Ensure it has space from the edges
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "50%",
            padding: "10px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "20px"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
