import React, { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await API.get("/user/stores");
        setStores(res.data);
      } catch (err) {
        console.error("User dashboard error:", err);
        if (err.response?.status === 401) {
          setError("Please log in again");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/login";
        } else {
          setError("Failed to fetch stores");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleRate = async (storeId, rating) => {
    try {
      const res = await API.post("/user/rate", { store_id: storeId, rating });
      alert(`Rated store ${storeId} with ${rating} ⭐`);
      // update UI
      setStores(stores.map(s => 
        s.id === storeId ? { ...s, user_rating: rating } : s
      ));
    } catch (err) {
      console.error("Rating error:", err);
      if (err.response?.status === 401) {
        alert("Please log in again");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      } else {
        alert("Failed to submit rating");
      }
    }
  };

  if (loading) return <p>Loading stores...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "600px", margin: "20px auto" }}>
        <h2>Store List</h2>
      {stores.map(store => (
        <div key={store.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{store.name}</h3>
          <p>Address: {store.address}</p>
          <p>Average Rating: ⭐ {store.avg_rating}</p>
          <p>Your Rating: {store.user_rating || "Not rated yet"}</p>

          <div>
            {[1, 2, 3, 4, 5].map(r => (
              <button
                key={r}
                onClick={() => handleRate(store.id, r)}
                style={{
                  margin: "2px",
                  backgroundColor: store.user_rating === r ? "gold" : "#eee"
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}

export default UserDashboard;
