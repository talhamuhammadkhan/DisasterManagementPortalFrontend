import React, { useState } from "react";

const SignUp = ({ setUser, setIsSigningUp }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [city, setCity] = useState(""); // New State
    const [country, setCountry] = useState(""); // New State
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/users/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, confirmPassword, name, city, country }), // Added city & country
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                setError(errorMessage);
                throw new Error(errorMessage);
            } else {
                const user = await response.json();
                alert("Account created successfully!");
                setUser(user);
                localStorage.setItem("user", JSON.stringify(user));
                setIsSigningUp(false);
            }

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
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h1>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ marginBottom: "15px", width: "100%" }}>
                    <label htmlFor="email" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "calc(100% - 20px)",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px", width: "100%" }}>
                    <label htmlFor="name" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>
                        Full Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                            width: "calc(100% - 20px)",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    />
                </div>

                {/* City Input */}
                <div style={{ marginBottom: "15px", width: "100%" }}>
                    <label htmlFor="city" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>
                        City:
                    </label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        style={{
                            width: "calc(100% - 20px)",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    />
                </div>

                {/* Country Input */}
                <div style={{ marginBottom: "15px", width: "100%" }}>
                    <label htmlFor="country" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>
                        Country:
                    </label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        style={{
                            width: "calc(100% - 20px)",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px", width: "100%" }}>
                    <label htmlFor="password" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "calc(100% - 20px)",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "15px", width: "100%" }}>
                    <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "5px", textAlign: "left" }}>
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                            width: "calc(100% - 20px)",
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
                    {loading ? "Creating account..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default SignUp;
