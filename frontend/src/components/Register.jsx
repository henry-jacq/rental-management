import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error occurred");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(to right, #667eea, #764ba2)",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        width: "350px",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "30px", color: "#333" }}>Register</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required
            style={{ padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}/>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}/>
          <select value={role} onChange={e => setRole(e.target.value)}
            style={{ padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}>
            <option value="tenant">Tenant</option>
            <option value="landlord">Landlord</option>
          </select>
          <button type="submit" style={{
            padding: "12px",
            marginTop: "15px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#667eea",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer"
          }}>Register</button>
        </form>
        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Already have an account? <Link to="/" style={{ color: "#667eea" }}>Login here</Link>
        </p>
        {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
