import React, { useEffect, useState } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";


function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [userFilters, setUserFilters] = useState({ name: "", email: "", role: "" });
  const [storeFilters, setStoreFilters] = useState({ name: "", address: "" });
  const [sort, setSort] = useState({ sortBy: "id", order: "asc" });

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch {
      setError("Failed to fetch stats");
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ ...userFilters, ...sort });
      const res = await API.get(`/admin/users?${params.toString()}`);
      setUsers(res.data);
    } catch {
      setError("Failed to fetch users");
    }
  };

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams({ ...storeFilters, ...sort });
      const res = await API.get(`/admin/stores?${params.toString()}`);
      setStores(res.data);
    } catch {
      setError("Failed to fetch stores");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchStats();
      await fetchUsers();
      await fetchStores();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddUser = async () => {
    const name = prompt("Enter name:");
    const email = prompt("Enter email:");
    const password = prompt("Enter password:");
    const address = prompt("Enter address:");
    const role = prompt("Enter role (admin/user/owner):");

    if (!name || !email || !password || !address || !role) return;

    try {
      await API.post("/admin/users", { name, email, password, address, role });
      alert("User added");
      fetchUsers();
    } catch {
      alert("Failed to add user");
    }
  };

  const handleAddStore = async () => {
    const name = prompt("Enter store name:");
    const address = prompt("Enter store address:");

    if (!name || !address) return;

    try {
      await API.post("/admin/stores", { name, address });
      alert("Store added");
      fetchStores();
    } catch {
      alert("Failed to add store");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "20px auto" }}>
        <h2>Admin Dashboard</h2>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1, padding: "10px", border: "1px solid #ccc" }}>
          <h3>Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div style={{ flex: 1, padding: "10px", border: "1px solid #ccc" }}>
          <h3>Stores</h3>
          <p>{stats.totalStores}</p>
        </div>
        <div style={{ flex: 1, padding: "10px", border: "1px solid #ccc" }}>
          <h3>Ratings</h3>
          <p>{stats.totalRatings}</p>
        </div>
      </div>

      {/* Users Section */}
      <h3>
        Users <button onClick={handleAddUser}>+ Add User</button>
      </h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Filter by name"
          value={userFilters.name}
          onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
        />
        <input
          placeholder="Filter by email"
          value={userFilters.email}
          onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
        />
        <select
          value={userFilters.role}
          onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={fetchUsers}>Apply Filters</button>
      </div>
      <table border="1" cellPadding="8" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th onClick={() => setSort({ sortBy: "name", order: sort.order === "asc" ? "desc" : "asc" })}>
              Name ⬍
            </th>
            <th>Email</th>
            <th>Address</th>
            <th onClick={() => setSort({ sortBy: "role", order: sort.order === "asc" ? "desc" : "asc" })}>
              Role ⬍
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stores Section */}
      <h3>
        Stores <button onClick={handleAddStore}>+ Add Store</button>
      </h3>
      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Filter by name"
          value={storeFilters.name}
          onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
        />
        <input
          placeholder="Filter by address"
          value={storeFilters.address}
          onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
        />
        <button onClick={fetchStores}>Apply Filters</button>
      </div>
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th onClick={() => setSort({ sortBy: "name", order: sort.order === "asc" ? "desc" : "asc" })}>
              Name ⬍
            </th>
            <th>Address</th>
            <th onClick={() => setSort({ sortBy: "avg_rating", order: sort.order === "asc" ? "desc" : "asc" })}>
              Avg Rating ⬍
            </th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>⭐ {s.avg_rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
