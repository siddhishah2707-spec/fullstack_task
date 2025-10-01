import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee", marginBottom: "20px" }}>
      <span style={{ marginRight: "20px" }}>Role: {role}</span>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
