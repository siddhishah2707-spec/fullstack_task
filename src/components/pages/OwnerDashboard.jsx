import React, { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";

function OwnerDashboard() {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch store
        const storeRes = await API.get("/owner/my-store");
        setStore(storeRes.data);

        // fetch ratings for store
        const ratingsRes = await API.get("/owner/my-store/ratings");
        setRatings(ratingsRes.data);
      } catch (err) {
        console.error("Owner dashboard error:", err);
        if (err.response?.status === 401) {
          setError("Please log in again");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/login";
        } else if (err.response?.status === 404) {
          setError("No store found for this owner");
        } else {
          setError("Failed to fetch store data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "700px", margin: "20px auto" }}>
        <h2>Owner Dashboard</h2>

      {store ? (
        <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
          <h3>{store.name}</h3>
          <p>Address: {store.address}</p>
          <p>Average Rating: ⭐ {store.avg_rating}</p>
        </div>
      ) : (
        <p>No store assigned</p>
      )}

      <h3>User Ratings</h3>
      {ratings.length === 0 ? (
        <p>No ratings yet</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map(r => (
              <tr key={r.id}>
                <td>{r.user_name}</td>
                <td>{r.user_email}</td>
                <td>⭐ {r.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
